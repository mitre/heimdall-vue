import Vue from "vue";
import Vuex from "vuex";
import { module as status_count_module } from "./status_counts";
import { module as severity_count_module } from "./severity_counts";
import { module as theme_module } from "./theme/module";
import { module as report_intake_module } from "./report_intake";

Vue.use(Vuex);

/**
 * The core store for all of our components.
 * 
 * The store itself is kept as small as possible to minimize
 * the impacts of breaking changes. If you want to add new getters, 
 * do so as a module. Recall that mapState and mapGetter are your friends
 * if your code is getting too long.
 * 
 * Furthermore, remember that if a piece of data is used ONLY in your 
 * component, it does not need to be here. 
 * EG: Filtered controls are useful almost everywhere, whereas
 * the current page of a datatable probably isn't. Be sensible
 */

export default new Vuex.Store({
  state: {
    allControls: [],
    allProfiles: [], // Unused for now
    allReports: [], // Unused for now
  },


  mutations: {
    addControl(state, control) {
      // Add the control to the store.
      state.allControls.push(control);

      // TODO: Potentially add hashes by item id
    },

    addProfile(state, profile) {
      // Add the profile to the store
      state.allProfiles.push(profile);

      // And add their controls in turn
      state.allControls.push(...profile.controls);

      // TODO: Potentially add hashes by item id
    },

    addReport(state, report) {
        // Add an entire inspec output to the store.
        state.allReports.push(report);
        
        // And its profiles
        state.allProfiles.push(...report.profiles);

        // And finally, each profiles controls
        report.profiles.forEach(profile => {
          state.allControls.push(...profile.controls);
        });

      // TODO: Potentially add hashes by item id
    },

    reset(state) {
        state.allControls = [];
        state.allProfiles = [];
        state.allReports = [];
    },
  },

  modules: {
    theme: theme_module,
    statusCounts: status_count_module,
    severityCounts: severity_count_module,
    intake: report_intake_module,
  }
});