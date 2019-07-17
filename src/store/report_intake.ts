/**
 * Counts the severities of controls.
 */

import { InspecOutput, Profile, Control } from "inspecjs";
import { Module, VuexModule, getModule, Action } from "vuex-module-decorators";
import DataModule from "./data_store";
import Store from "./store";

@Module({
  namespaced: true,
  // name: "intake",
})
class InspecIntakeModule extends VuexModule {
  @Action
  loadReportFile(reportText: string) {
    // Parse the given text. TODO: Error checking

    // Parse from json
    let content = JSON.parse(reportText);

    // Construct a report
    let report = new InspecOutput(content);
    console.log(report);

    // Deliver
    let data = getModule(DataModule, Store);
    data.addReport(report);
  }

  @Action
  loadProfileFile(profileText: string) {
    // Parse the given text as a profile, and deliver it to the store. TODO: Error checking
    // Parse from json
    var content = JSON.parse(profileText);

    // Construct a profile
    var profile = new Profile(null, content);

    // Deliver
    let data = getModule(DataModule, Store);
    data.addProfile(profile);
  }
}

export default InspecIntakeModule;
