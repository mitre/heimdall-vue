/**
 * Counts the statuses of controls.
 */

import { Module, VuexModule, Mutation, Action, getModule } from "vuex-module-decorators";
import DataModule from "./data_store";

// Helper function for counting a severity in a list of controls
function countStatus( state: DataModule, status: string): number {
  return state.allControls.filter(c => c.status === status).length;
}

@Module({
  namespaced: true,
})
class StatusCountModule extends VuexModule {
  get passed(): number {
    return countStatus(getModule(DataModule), "Passed");
  }

  get failed(): number {
    return countStatus(getModule(DataModule), "Failed");
  }

  get notApplicable(): number {
    return countStatus(getModule(DataModule), "Not Applicable");
  }

   get notReviewed(): number {
    return countStatus(getModule(DataModule), "Not Reviewed");
  }

   get profileError(): number {
    return countStatus(getModule(DataModule), "Profile Error");
  }
}

export default StatusCountModule;