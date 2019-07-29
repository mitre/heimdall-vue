/**
 * Counts the severities of controls.
 */

import { Module, VuexModule, getModule } from "vuex-module-decorators";
import DataModule, {Filter} from "./data_store";
import Store from "./store";
import {
    ControlStatus,
    Severity,
    InspecOutput,
    Profile,
    Control,
    } from "inspecjs/dist/types";
import {
    ControlNistHash,
    NistHash,
    generateNewControlHash,
    generateNewNistHash,
    ControlGroupStatus,
    } from "inspecjs/dist/nist";


//    USAGE: console.log(this.$store.getters["treemap/nistControls"]);
@Module({
  namespaced: true,
  name: "treemap",
})
class Treemap extends VuexModule {
  get nist(): ControlNistHash {
    return generateNewControlHash();
  }
  get nistControls(): Control[] {
    // Begin with an empty list
    let nistControls: Control[] = [];

    // The following 2 lines had to be added
    let data = getModule(DataModule, Store);
    let filter: Filter = {} ;

    // Now iterate over controls, adding only if they pass inspection
    // Originally data was 'this' 
    data.allControls(filter).forEach(control => {
      // Check that it matches our current filters. if so, add it
      if (filter.accepts(control)) {
        nistControls.push(control);
      }
    });

    return nistControls;
  }
}

export default Treemap;
