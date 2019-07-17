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
  allControls: Control[] = [];
  allProfiles: Profile[] = [];
  allReports: InspecOutput[] = [];

  /**
   * Add a profile and all of its controls to our state.
   * @param profile Profile to read from
   */
  private recursiveAddProfile(profile: Profile) {
    this.allProfiles.push(profile);
    this.allControls.push(...profile.controls);
  }

  @Mutation
  addControl(newControl: Control) {
    this.allControls.push(newControl);
  }

  @Mutation
  addProfile(newProfile: Profile) {
    this.recursiveAddProfile(newProfile);
  }

  @Mutation
  addReport(newReport: InspecOutput) {
    this.allReports.push(newReport);
    newReport.profiles.forEach(p => this.recursiveAddProfile(p));
  }

  @Mutation
  reset() {
    this.allControls = [];
    this.allProfiles = [];
    this.allReports = [];
  }
}

export default InspecDataModule;
