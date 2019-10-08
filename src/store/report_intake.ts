/**
 * Counts the severities of controls.
 */

import { InspecOutput, Profile, Control } from "inspecjs";
import { Module, VuexModule, getModule, Action } from "vuex-module-decorators";
import DataModule, { FileID } from "./data_store";
import Store from "./store";

export type LoadOptions = {
  /** The file to load */
  file: File;

  /** The unique id to grant it */
  unique_id: FileID;

  /** Callback function in case parsing fails. 
    * New callbacks could be added for other errors. **/
  parse_error_callback?(err: Error): void;
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
      let text = reader.result as string;
      
      // Parse JSON, allowing caller to handle JSON parse errors
      let json; 
      try {
        json = JSON.parse(text);
      } 
      catch(err) 
      {
        if(options.parse_error_callback) options.parse_error_callback(err);
        throw err;
      }

      // TODO: Verify that no errors occurred

      // Fetch our data store
      let data = getModule(DataModule, Store);

      // Retrieve common elements for either case (profile or report)
      let filename = options.file.name;

      // Determine what sort of file we (hopefully) have, then add it
      if("profiles" in json) {
        // It must be a report
        let report = Object.freeze(new InspecOutput(json));
        let reportFile = {
          unique_id: options.unique_id,
          filename,
          report,
        }
        data.addReport(reportFile);
      } else {
        // It must be a profile
        let profile = Object.freeze(new Profile(null, json));
        let profileFile = {
          unique_id: options.unique_id,
          filename,
          profile
        }
        data.addProfile(profileFile);
      }

    }

    // Dispatch the read
    reader.readAsText(options.file);
  }
}

export default InspecIntakeModule;
