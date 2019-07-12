/**
 * Counts the severities of controls.
 */

import { Module, VuexModule, Mutation, Action, getModule } from "vuex-module-decorators";
import DataModule from "./data_store";

 // Helper function for counting a severity in a list of controls
function countSeverity( state: DataModule, severity: string): number {
     return state.allControls.filter(c => c.severity === severity).length;
 }

@Module({
  name: "statusCounts",
  namespaced: true,
})
class StatusCountModule extends VuexModule {
  public get low(): number {
    return countSeverity(getModule(DataModule), "low");
  }

  public get medium(): number {
    return countSeverity(getModule(DataModule), "medium");
  }

  public get high(): number {
    return countSeverity(getModule(DataModule), "high");
  }

  public get critical(): number {
    return countSeverity(getModule(DataModule), "critical");
  }
}

export default StatusCountModule;