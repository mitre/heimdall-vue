/**
 * Tracks uploaded files, and their parsed contents
 */

import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";
import { Control, Profile, InspecOutput } from "inspecjs";
import Store from "./store";


/** Each FileID corresponds to a unique File in this store */
export type FileID = number

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
   * Get all reports that have been added, regardless of originating file. 
   * TODO: Deprecate this? The only "all" we still need is for the All Report view (?)
   */
  get allReports(): InspecOutput[] {
    return this.reportFiles.map(f => f.report);
  }

  /** 
   * Get all profiles that have been added, regardless of originating file. 
   * TODO: Deprecate this? The only "all" we still need is for the All Report view (?)
   */
  get allProfiles(): Profile[] {
    let fileProfiles = this.profileFiles.map(f => f.profile);
    let nestedProfiles = this.allReports.flatMap(r => r.profiles);
    return fileProfiles.concat(nestedProfiles);
  }

  /** 
   * Get all controls that have been added, regardless of originating file/profile 
   * TODO: Deprecate this? The only "all" we still need is for the All Report view (?)
   */
  get allControls(): Control[] {
    return this.allProfiles.flatMap(profile => profile.controls);
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
