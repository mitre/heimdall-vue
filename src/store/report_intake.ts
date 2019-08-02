/**
 * Counts the severities of controls.
 */

import { convertFile, ConversionResult } from "inspecjs";
import { Module, VuexModule, getModule, Action } from "vuex-module-decorators";
import DataModule, { FileID } from "./data_store";
import Store from "./store";

export type LoadOptions = {
  /** The file to load */
  file: File;

  /** The unique id to grant it */
  unique_id: FileID;
}

@Module({
  namespaced: true,
  // name: "intake",
})
class InspecIntakeModule extends VuexModule {

  /** Load a file with the specified options */
  @Action
  async loadFile(options: LoadOptions) {
    // Make the reader
    let reader = new FileReader();

    // Setup the callback
    reader.onload = (event: ProgressEvent) => {
      // Get our text
      const text = reader.result as string;

      // Fetch our data store
      const data = getModule(DataModule, Store);

      // Retrieve common elements for either case (profile or report)
      const filename = options.file.name;

      // Convert it
      let result: ConversionResult;
      try {
        result = convertFile(text);
      } catch(e) {
        console.log(`Failed to convert file ${filename} due to error "${e}". We should display this as an error modal.`);
        return;
      }

      // Determine what sort of file we (hopefully) have, then add it
      if(result["1_0_ExecJson"]) {
        // Handle as exec
        let execution = result["1_0_ExecJson"];
        execution = Object.freeze(execution);
        let reportFile = {
          unique_id: options.unique_id,
          filename,
          execution,
        }
        data.addExecution(reportFile);
      } else if(result["1_0_ProfileJson"]) {
        // Handle as profile
        let profile = result["1_0_ProfileJson"];
        let profileFile = {
          unique_id: options.unique_id,
          filename,
          profile
        }
        data.addProfile(profileFile);
      } else {
        console.log(`Unhandled file type ${Object.keys(result)}`);
      }
    }

    // Dispatch the read
    reader.readAsText(options.file);
  }
}

export default InspecIntakeModule;
