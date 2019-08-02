/**
 * Tracks uploaded files, and their parsed contents
 */

import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";
import { hdfWrapControl as hdf, AnyExec as Execution, AnyProfile as Profile, AnyFullControl as Control, HDFControl } from "inspecjs";
import Store from "./store";
import { ControlStatus, Severity } from 'inspecjs';
import { ExecJSONProfile } from 'inspecjs/dist/generated-parsers/exec-json';


/** Each FileID corresponds to a unique File in this store */
export type FileID = number;

/** Represents the minimum data to represent an uploaded file handle. */
export type InspecFile = {
  /** 
   * Unique identifier for this file. Used to encode which file is currently selected, etc. 
   * 
   * Note that in general one can assume that if a file A is loaded AFTER a file B, then
   * A.unique_id > B.unique_id.
   * Using this property, one might order files by order in which they were added.
   */
  unique_id: FileID,
  /** The filename that this file was uploaded under. */
  filename: string
}
export function isInspecFile(f: any): f is InspecFile {
  const t = f as InspecFile;
  return t.filename !== undefined && t.unique_id !== undefined;
}

/** Represents a file containing an Inspec Execution output */
export type ExecutionFile = InspecFile & { execution: Execution };
/** Represents a file containing an Inspec Profile (not run) */
export type ProfileFile = InspecFile & { profile: Profile };

/** Contains common filters on data from the store. */
export interface Filter {
  // General
  /** Which file these objects came from. Undefined => any */
  fromFile?: FileID;
 
  // Control specific
  /** What status the controls can have. Undefined => any */
  status?: ControlStatus;

  /** What severity the controls can have. Undefined => any */
  severity?: Severity;

  /** Whether or not to allow/include overlayed controls */
  omit_overlayed_controls?: boolean;

  // Add more as necessary
}

/**
 * 
 */
interface ContextualizedItem<D, P, C> {
  /** This particular item's data. */
  data: D;

  /** 
   * What data is this node extending? 
   * E.g. is this overlaying a profile? Another control?
   * Can be empty.
  */
  extends_from: ContextualizedItem<D, P, C>[];


  /** 
   * What is this data extended by? 
   * E.g. a profile that overlays this profile.
   * Can be empty.
   */
  extended_by: ContextualizedItem<D, P, C>[];

  /**
   * What object/resource did this item come from?
   */
  sourced_from: P;

  /**
   * What objects/resources does this item contain?
   */
  contains: C[];
}

// And its instantiations
export interface ContextualizedExecution extends ContextualizedItem<Execution, InspecFile, ContextualizedProfile> { }
export interface ContextualizedProfile extends ContextualizedItem<Profile, ContextualizedExecution | InspecFile, ContextualizedControl> { }
export interface ContextualizedControl extends ContextualizedItem<Control, ContextualizedProfile, void> { }

@Module({
  namespaced: true,
  name: "data",
})
class InspecDataModule extends VuexModule {
  /** State var containing all execution files that have been added */
  executionFiles: ExecutionFile[] = [];

  /** State var containing all profile files that have been added */
  profileFiles: ProfileFile[] = [];

  /** Return all of the files that we currently have. */
  get allFiles(): (ExecutionFile | ProfileFile)[] {
    let result: (ExecutionFile | ProfileFile)[] = [];
    result.push(...this.executionFiles);
    result.push(...this.profileFiles);
    return result;
  }

  /**
   * Recompute all contextual data
   */
  private get contextStore(): [ContextualizedExecution[], ContextualizedProfile[], ContextualizedControl[]] {
    // Initialize all our arrays
    let executions: ContextualizedExecution[] = [];
    let profiles: ContextualizedProfile[] = [];
    let controls: ContextualizedControl[] = [];

    // First thing: initialize all of our data
    this.executionFiles.forEach(exec_file => {
      // Save the execution, initially empty and unrelated
      let exec_file_context: ContextualizedExecution = {
        data: exec_file.execution,
        sourced_from: exec_file,
        extended_by: [],
        extends_from: [],
        contains: [],
      };
      executions.push(exec_file_context);

      // Save its profiles, again initially empty BUT related mutually to their containing execution
      exec_file.execution.profiles.forEach(exec_files_profile => {
        let exec_files_profile_context: ContextualizedProfile = {
          data: exec_files_profile,
          sourced_from: exec_file_context,
          extended_by: [],
          extends_from: [],
          contains: []
        };
        profiles.push(exec_files_profile_context);

        // Add it to our parent
        exec_file_context.contains.push(exec_files_profile_context);
      });

      // After our initial save of profiles, we go over them _again_ to establish parentage/dependency
      exec_file_context.contains.forEach(exec_files_profile => {
        // We know these are from a report; label as such
        let as_exec = exec_files_profile.data as ExecJSONProfile;
        // If it has a parent profile then we link them by extendedby/extendsfrom
        if(as_exec.parent_profile !== undefined) {
          // Look it up
          let parent = exec_file_context.contains.find(p => p.data.name === as_exec.parent_profile);
          // Link it up
          parent.extended_by.push(exec_files_profile);
          exec_files_profile.extends_from.push(parent);
        }
      });
    });

    // Now we handle the independent profile (IE those in their own files, generated by inspec json). 
    // These are slightly simpler because they do not actually include their overlays (even if they depend on them)
    // as a separate data structure. 
    this.profileFiles.forEach(profile_file => {
      let profile_file_context: ContextualizedProfile = {
        data: profile_file.profile,
        sourced_from: profile_file,
        extended_by: [],
        extends_from: [],
        contains: [],
      };
      profiles.push(profile_file_context);
    });

    // At this point all executions/profiles are in, but none of their controls are. 
    // Add them first, establishing the parent/child relationship while we do so
    profiles.forEach(profile_context => {
      profile_context.data.controls.forEach(profile_control => {
        let profile_control_context: ContextualizedControl = {
          data: profile_control,
          sourced_from: profile_context,
          extended_by: [],
          extends_from: [],
          contains: void[]  // Flag as empty
        };
        profile_context.contains.push(profile_control_context);
        controls.push(profile_control_context);
      });
    });

    // Now one final step: pair up controls by their overlays.
    controls.forEach(control_context => {
      // We only care about controls who's profiles extend another profile.
      // What about if it is extended? Doesn't matter; handled elsewhere.
      let this_id = control_context.data.id;
      let parent_profile = control_context.sourced_from;
      parent_profile.extends_from.forEach(overlayed_profile => {
        // We want to find a control in overlayed_profile with the same id as 
        let matching_control = overlayed_profile.contains.find(cc => cc.data.id === this_id);
        if(matching_control !== undefined) {
          // We've found one; interlink
          matching_control.extended_by.push(control_context);
          control_context.extends_from.push(matching_control);
        }
      });
    });

    return [executions, profiles, controls];
  }

  /**
   * Get executions as contextual items
   */
  get contextualExecutions(): ContextualizedExecution[] {
    return this.contextStore[0];
  }

  /**
   * Get overlay profiles, etc.
   */
  get contextualProfiles(): ContextualizedProfile[] {
    return this.contextStore[1];
  }

  /**
   * Get overlayed controls, etc.
   */
  get contextualControls(): ContextualizedControl[] {
    return this.contextStore[2];
  }

  /** 
   * Parameterized getter.
   * Get all profiles from the specified file id.
   */
  get filteredProfiles(): (filter: Filter) => ContextualizedProfile[] {
    // const localCache: {[key: string]: Control[]} = {};
    // Establish to vue that we depend on this.contextStore
    // let _depends: any = this.contextStore;
    return (filter: Filter = {}) => {
      // If there is no filter, just return all
      if(filter.fromFile === undefined) {
        return this.contextualProfiles;
      }

      // Initialize our list to add valid profiles to
      let profiles: ContextualizedProfile[] = [];

      // Filter to those that match our filter. In this case that just means come from the right file id
      this.contextualProfiles.forEach(prof => {
        if(isInspecFile(prof.sourced_from)) {
          if(prof.sourced_from.unique_id === filter.fromFile) {
            profiles.push(prof);
          }
        } else {
          // Its a report; go two levels up to get its file
          if(prof.sourced_from.sourced_from.unique_id === filter.fromFile) {
            profiles.push(prof);
          }
        }
      });

      return profiles;
    }
  }

  /** 
   * Parameterized getter.
   * Get all controls from all profiles from the specified file id.
   */
  get filteredControls(): (filter: Filter) => ContextualizedControl[] {
    const localCache: {[key: string]: ContextualizedControl[]} = {};
    // Establish to vue that we depend on this.contextStore
    let _depends: any = this.contextStore;
    return (filter: Filter = {}) => {
      // Generate a hash. TODO: Make more efficient
      let id = JSON.stringify(filter);

      // Check if we have this cached:
      if(id in localCache) {
        return [...localCache[id]];
      }

      // First get all of the profiles using the same filter
      let controls = this.filteredProfiles(filter).flatMap(profile => profile.contains);

      // Filter by status, if necessary
      if(filter.status !== undefined) {
        controls = controls.filter(control => hdf(control.data).status === filter.status);
      }

      // Filter by severity, if necessary
      if(filter.severity !== undefined) {
        controls = controls.filter(control => hdf(control.data).severity === filter.severity);
      }

      // Filter by overlay
      if(filter.omit_overlayed_controls) {
        controls = controls.filter(control => control.extended_by.length === 0);
      }

      // Save to cache
      localCache[id] = controls;
      return [...controls]; // Return a shallow copy
    }
  }

  /**
   * Yields a guaranteed currently free file ID
   * TODO: Verify stability under async
   */
  get nextFreeFileID(): FileID {
    let currentMax = 0;
    // If we have any files find the max among them
    if(this.allFiles.length) {
      currentMax = Math.max(...this.allFiles.map(f => f.unique_id)); 
    }
    return currentMax + 1;
  }

  /**
   * Adds a profile file to the store.
   * @param newProfile The profile to add
   */
  @Mutation
  addProfile(newProfile: ProfileFile) {
    this.profileFiles.push(newProfile);
  }

  /**
   * Adds a execution file to the store   
   * @param newExecution The execution to add
   */
  @Mutation
  addExecution(newExecution: ExecutionFile) {
    this.executionFiles.push(newExecution);
  }

  /**
   * Clear all stored data.
   */
  @Mutation
  reset() {
    this.profileFiles = [];
    this.executionFiles = [];
  }
}

export default InspecDataModule;
