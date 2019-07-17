/**
 * Counts the severities of controls.
 */

import { Module, VuexModule, getModule } from "vuex-module-decorators";
import DataModule from "./data_store";
import Store from "./store";

// Helper function for counting a severity in a list of controls
function countSeverity(state: DataModule, severity: string): number {
  return state.allControls.filter(c => c.severity === severity).length;
}

@Module({
  namespaced: true,
  name: "severityCounts",
})
class SeverityCountModule extends VuexModule {
  get low(): number {
    return countSeverity(getModule(DataModule, Store), "low");
  }

  get medium(): number {
    return countSeverity(getModule(DataModule, Store), "medium");
  }

  get high(): number {
    return countSeverity(getModule(DataModule, Store), "high");
  }

  get critical(): number {
    return countSeverity(getModule(DataModule, Store), "critical");
  }
}

export default SeverityCountModule;
