/**
 * Counts the statuses of controls.
 */

import { Module, VuexModule, getModule } from "vuex-module-decorators";
import DataModule, {Filter} from "./data_store";
import Store from "./store";
import { ControlStatus } from 'inspecjs/dist/types';

// Helper function for counting a status in a list of controls
function countStatus(filter: Filter, status: ControlStatus): number {
  // Save time
  if(filter.status && filter.status !== status) {
    return 0;    
  }

  // Get the controls
  let data = getModule(DataModule, Store);
  let controls = data.allControls(filter);

  // Refine our filter to the severity, and return length
  return controls.filter(c => c.status === status).length;
}

@Module({
  namespaced: true,
  name: "statusCounts",
})
class StatusCountModule extends VuexModule {
  get passed(): (filter: Filter) => number {
    return (filter) => countStatus(filter, "Passed");
  }

  get failed(): (filter: Filter) => number {
    return (filter) => countStatus(filter, "Failed");
  }

  get notApplicable(): (filter: Filter) => number {
    return (filter) => countStatus(filter, "Not Applicable");
  }

  get notReviewed(): (filter: Filter) => number {
    return (filter) => countStatus(filter, "Not Reviewed");
  }

  get profileError(): (filter: Filter) => number {
    return (filter) => countStatus(filter, "Profile Error");
  }
}

export default StatusCountModule;
