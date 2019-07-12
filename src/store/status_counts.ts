/**
 * Counts the statuses of controls.
 */

import { Module, VuexModule, getModule } from "vuex-module-decorators";
import DataModule from "./data_store";
import Store from "./store";

// Helper function for counting a severity in a list of controls
function countStatus(state: DataModule, status: string): number {
  return state.allControls.filter(c => c.status === status).length;
}

@Module({
  namespaced: true,
  name: "statusCounts",
})
class StatusCountModule extends VuexModule {
  get passed(): number {
    return countStatus(getModule(DataModule, Store), "Passed");
  }

  get failed(): number {
    return countStatus(getModule(DataModule, Store), "Failed");
  }

  get notApplicable(): number {
    return countStatus(getModule(DataModule, Store), "Not Applicable");
  }

  get notReviewed(): number {
    return countStatus(getModule(DataModule, Store), "Not Reviewed");
  }

  get profileError(): number {
    return countStatus(getModule(DataModule, Store), "Profile Error");
  }
}

export default StatusCountModule;
