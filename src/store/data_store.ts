/**
 * Holds the actual data
 */

import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";
import { Control, Profile, InspecOutput } from "inspecjs";
import Store from "./store";

@Module({
  namespaced: true,
  name: "data",
})
class InspecDataModule extends VuexModule {
  /** All controls that have been added */
  allControls: Control[] = [];
  /** All profiles that have been added */
  allProfiles: Profile[] = [];
  /** All reports that have been added */
  allReports: InspecOutput[] = [];

  /**
   * Adds a control to the store.
   * @param newControl The control to add
   */
  private recursiveAddProfile(profile: Profile) {
    this.allProfiles.push(profile);
    this.allControls.push(...profile.controls);
  }

  @Mutation
  addControl(newControl: Control) {
    this.allControls.push(newControl);
  }

  /**
   * Adds a profile and all of it's controls to the store.
   * @param newProfile The profile to add
   */
  @Mutation
  addProfile(newProfile: Profile) {
    this.recursiveAddProfile(newProfile);
  }

  /**
   * Adds a report, all of its profiles, and all of those profiles
   * controls to the store.
   * @param newReport The report to add
   */
  @Mutation
  addReport(newReport: InspecOutput) {
    this.allReports.push(newReport);
    newReport.profiles.forEach(p => this.recursiveAddProfile(p));
  }

  /**
   * Clear all stored data.
   */
  @Mutation
  reset() {
    this.allControls = [];
    this.allProfiles = [];
    this.allReports = [];
  }
}

export default InspecDataModule;
