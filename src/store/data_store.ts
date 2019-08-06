/**
 * Tracks uploaded files, and their parsed contents
 */

import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";
import { Control, Profile, InspecOutput } from "inspecjs";
import Store from "./store";
import { ControlStatus, ControlResult, Severity } from 'inspecjs/dist/types';


/** Each FileID corresponds to a unique File in this store */
export type FileID = number

export type SearchTerm = string

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
/** Represents a file containing an Inspec Report output */
export type ReportFile = InspecFile & { report: InspecOutput };
/** Represents a file containing an Inspec Profile (not run) */
export type ProfileFile = InspecFile & { profile: Profile };

/** Represents the set of potential filters a  */
export interface Filter {
  // General
  /** Which file these objects came from. Undefined => any */
  fromFile?: FileID;
 
  // Control specific
  /** What status the controls can have. Undefined => any */
  status?: ControlStatus;

  /** What severity the controls can have. Undefined => any */
  severity?: Severity;

  searchTerm?: String;

  accepts?(control: Control): boolean;
  // Add more as necessary
}

@Module({
  namespaced: true,
  name: "data",
})
class InspecDataModule extends VuexModule {
  /** State var containing all report files that have been added */
  reportFiles: ReportFile[] = [];

  /** State var containing all profile files that have been added */
  profileFiles: ProfileFile[] = [];

  /** Return all of the files that we currently have. */
  get allFiles(): (ReportFile | ProfileFile)[] {
    let result: (ReportFile | ProfileFile)[] = [];
    result.push(...this.reportFiles);
    result.push(...this.profileFiles);
    return result;
  }

  /** 
   * Parameterized getter.
   * Get all profiles from the specified file id.
   */
  get allProfiles(): (filter: Filter) => Profile[] {
    return (filter: Filter = {}) => {
      // Initialize our lists
      let profiles: Profile[] = [];

      // First find the relevant profile files
      let profileFiles = this.profileFiles;
      // Filter unmatching files
      if(filter.fromFile !== undefined) {
        let profileFiles = this.profileFiles.filter(file => file.unique_id === filter.fromFile);
      }
      // Add them all to the list
      profiles.push(...profileFiles.map(f => f.profile));

      // Next go to the report files
      let reportFiles = this.reportFiles;
      // Filter unmatching files
      if(filter.fromFile !== undefined) {
        reportFiles = reportFiles.filter(file => file.unique_id === filter.fromFile);
      }
      // Add each of their profiles to the list
      profiles.push(...reportFiles.flatMap(f => f.report.profiles));

      // Return the result
      return profiles;
    }
  }

  /** 
   * Parameterized getter.
   * Get all controls from all profiles from the specified file id.
   */
  get allControls(): (filter: Filter) => Control[] {
    const localCache: {[key: string]: Control[]} = {};
    let _depends: (ReportFile[] | ProfileFile[])[] = [this.profileFiles, this.reportFiles];
    return (filter: Filter = {}) => {
      // Generate a hash. TODO: Make more efficient
      let id = JSON.stringify(filter);

      // Check if we have this cached:
      if(id in localCache) {
        return [...localCache[id]];
      }

      // First get all of the profiles using the same filter
      let controls = this.allProfiles(filter).flatMap(profile => profile.controls);

      // Filter by status, if necessary
      if(filter.status !== undefined) {
        controls = controls.filter(control => control.status === filter.status);
      }

      // Filter by severity, if necessary
      if(filter.severity !== undefined) {
        controls = controls.filter(control => control.severity === filter.severity);
      }

      // Save to cache
      // localCache[id] = controls;

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
   * Adds a report file to the store   
   * @param newReport The report to add
   */
  @Mutation
  addReport(newReport: ReportFile) {
    this.reportFiles.push(newReport);
  }

  /**
   * Clear all stored data.
   */
  @Mutation
  reset() {
    this.profileFiles = [];
    this.reportFiles = [];
  }
}

export default InspecDataModule;
