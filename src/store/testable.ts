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

/**
 * Takes a list of nist tags, and reduces them to only the "proper" tags.
 * EG:
 * ["AC-5", "SP-6 b", "SP-6 c", "Rev-5"] -> ["AC-5", "SP-6"]
 */
export function simplifyNistTags(rawNistTags: string[]): string[] {
  if (rawNistTags === []) {
    return ["UM-1"];
  } else {
    let nist: string[] = [];
    let pattern = /^[A-Z]{2}-[0-9]+/;
    rawNistTags.forEach(tag => {
      let match = tag.match(pattern);
      if (match && !nist.includes(match[0])) {
        nist.push(match[0]);
      }
    });
    return nist;
  }
}

//    USAGE: console.log(this.$store.getters["treemap/nistControls"]);
@Module({
  namespaced: true,
  name: "treemap",
})
class Treemap extends VuexModule {
  get nist(): ControlNistHash {
    return generateNewControlHash();
  }
  get nistControls(): (filter: Filter) => Control[] {
    return (filter: Filter = {}) => {
      // Begin with an empty list
      let nistControls: Control[] = [];

      // The following 2 lines had to be added
      let data = getModule(DataModule, Store);

      // Now iterate over controls, adding only if they pass inspection
      // Originally data was 'this' 
      data.allControls(filter).forEach(control => {
        // Check that it matches our current filters. if so, add it
        if (filter.accepts && filter.accepts(control)) {
          nistControls.push(control);
        }
      });

      return nistControls;
    }
  }
  get controlNistHash(): (filter: Filter) => ControlNistHash {
    return (filter: Filter = {}) => {
      // Make an empty hash
      let controlNistHash: ControlNistHash = generateNewControlHash();
      
      // Get data store
      let data = getModule(DataModule, Store);

      // Get all of our controls as well, based on the status/severity/search BUT NOT selected family filters
      var controls = this.nistControls(filter);

      // For each control, go through its nist tags and put a reference to the control in the corresponding array of our controls hash
      controls.forEach(control => {
        let rawTags: any = control.tags["nist"];
        let controlTags: string[];

        // Ensure its a list of strings
        if (typeof rawTags === "string") {
          controlTags = [rawTags];
        } else if (
          rawTags instanceof Array &&
          rawTags
            .map(s => typeof s === "string")
            .reduce((a: boolean, b: boolean) => a && b)
        ) {
          // It's an array of strings
          controlTags = rawTags;
        } else {
          // Just give up -  we don't know how to handle this type
          controlTags = [];
        }

        // Now, we simplify
        controlTags = simplifyNistTags(controlTags);

        // Add them to the hash
        controlTags.forEach(tag => {
          if (tag in controlNistHash) {
            controlNistHash[tag].push(control);
          } else {
            controlNistHash[tag] = [control];
          }
        });
      });
      return controlNistHash;
    }
  }
}

export default Treemap;
