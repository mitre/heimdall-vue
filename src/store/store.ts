import Vue from "vue";
import Vuex from "vuex";
import Data from "./data_store";
import Theme from "./theme";
import StatusCounts from "./status_counts";
import SeverityCounts from "./severity_counts";

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

const store = new Vuex.Store({
  modules: {
    Data,
    Theme,
    StatusCounts,
    SeverityCounts
  }
});

export default store;
