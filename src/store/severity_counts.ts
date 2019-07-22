/**
 * Counts the severities of controls.
 */

import { Module, VuexModule, getModule } from "vuex-module-decorators";
import DataModule, {Filter} from "./data_store";
import Store from "./store";
import { Severity } from 'inspecjs/dist/types';

// Helper function for counting a severity in a list of controls
function countSeverity(filter: Filter, severity: Severity): number {
  // Save time
  if(filter.severity && filter.severity !== severity) {
    return 0;    
  }

  // Get the controls
  let data = getModule(DataModule, Store);
  let controls = data.allControls(filter);

  // Refine our filter to the severity, and return length
  return controls.filter(c => c.severity === severity).length;
}

@Module({
  namespaced: true,
  name: "severityCounts",
})
class SeverityCountModule extends VuexModule {
  get none(): (filter: Filter) => number {
    return (filter) => countSeverity(filter, "none");
  }

  get low(): (filter: Filter) => number {
    return (filter) => countSeverity(filter, "low");
  }

  get medium(): (filter: Filter) => number {
    return (filter) => countSeverity(filter, "medium");
  }

  get high(): (filter: Filter) => number {
    return (filter) => countSeverity(filter, "high");
  }

  get critical(): (filter: Filter) => number {
    return (filter) => countSeverity(filter, "critical");
  }
}

export default SeverityCountModule;
