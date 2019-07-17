/**
 * Counts the severities of controls.
 */

import { InspecOutput, Profile, Control } from "inspecjs";
import { Module, VuexModule, getModule, Action } from "vuex-module-decorators";
import DataModule from "./data_store";
import Store from "./store";

// To give files unique id's with
let file_index : number = 0;
function genFileIndex(): number {
  file_index++;
  return file_index;
}

@Module({
  namespaced: true,
  // name: "intake",
})
class InspecIntakeModule extends VuexModule {

  @Action
  async loadFile(file: File) {
    // Make the reader
    let reader = new FileReader();

    // Setup the callback
    reader.onload = (event: ProgressEvent) => {
      // Get our text
      let text = reader.result as string;

      // Parse as json
      let json = JSON.parse(text);

      // TODO: Verify that no errors occurred

      // Fetch our data store
      let data = getModule(DataModule, Store);

      // Retrieve common elements for either case (profile or report)
      let unique_id = genFileIndex();
      let filename = file.name;

      // Determine what sort of file we (hopefully) have, then add it
      if("profiles" in json) {
        // It must be a report
        let report = new InspecOutput(json);
        let reportFile = {
          unique_id,
          filename,
          report,
        }
        data.addReport(reportFile);
      } else {
        // It must be a profile
        let profile = new Profile(null, json);
        let profileFile = {
          unique_id,
          filename,
          profile
        }
        data.addProfile(profileFile);
      }

    }

    // Dispatch the read
    reader.readAsText(file);
  }
}

export default InspecIntakeModule;
