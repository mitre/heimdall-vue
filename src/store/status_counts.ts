/**
 * Counts the statuses of controls.
 */

import { Module, VuexModule, Mutation, Action, getModule } from "vuex-module-decorators";
import { Control } from "inspecjs";
import DataModule from "./data_store";
import Store from "./store";

// Helper function for counting a severity in a list of controls
function countStatus( state: DataModule, status: string): number {
  return state.allControls.filter(c => c.status === status).length;
}

@Module({
  dynamic: true,
  store: Store,
  name: "statusCounts",
  namespaced: true,
})
export default class StatusCountModule extends VuexModule {
  public get passed(): number {
    return countStatus(getModule(DataModule), "Passed");
  }

  public get failed(): number {
    return countStatus(getModule(DataModule), "Failed");
  }

  public get notApplicable(): number {
    return countStatus(getModule(DataModule), "Not Applicable");
  }

  public get notReviewed(): number {
    return countStatus(getModule(DataModule), "Not Reviewed");
  }

  public get profileError(): number {
    return countStatus(getModule(DataModule), "Profile Error");
  }
}
