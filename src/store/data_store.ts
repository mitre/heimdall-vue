/**
 * Holds the actual data
 */

import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";
import { Control, Profile, InspecOutput } from "inspecjs";

@Module({
  name: "data",
  namespaced: true,
})
class InspecDataModule extends VuexModule {
  public allControls: Control[] = [];
  public allProfiles: Profile[] = [];
  public allReports: InspecOutput[] = [];

  @Mutation 
  public addControl(newControl: Control) {
    this.allControls.push(newControl);
  }

  @Mutation 
  public addProfile(newProfile: Profile) {
    this.allProfiles.push(newProfile);
  }

  @Mutation 
  public addReport(newReport: InspecOutput) {
    this.allReports.push(newReport);
  }

  @Mutation
  public reset() {
      this.allControls = [];
      this.allProfiles = [];
      this.allReports = [];
  }
}

export default InspecDataModule;