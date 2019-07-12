/**
 * Holds the actual data
 */

import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";
import { Control, Profile, InspecOutput } from "inspecjs";
import Store from "./store";

@Module({
  namespaced: true,
  name: "data",
  store: Store,
})
class InspecDataModule extends VuexModule {
  allControls: Control[] = [];
  allProfiles: Profile[] = [];
  allReports: InspecOutput[] = [];

  @Mutation
  addControl(newControl: Control) {
    this.allControls.push(newControl);
  }

  @Mutation
  addProfile(newProfile: Profile) {
    this.allProfiles.push(newProfile);
  }

  @Mutation
  addReport(newReport: InspecOutput) {
    this.allReports.push(newReport);
  }

  @Mutation
  reset() {
    this.allControls = [];
    this.allProfiles = [];
    this.allReports = [];
  }
}

export default InspecDataModule;
