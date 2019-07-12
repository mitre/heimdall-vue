import Vue from "vue";
import Vuex, { StoreOptions } from "vuex";
import { Control, Profile, InspecOutput } from "inspecjs";
import { module as severity_count_module } from "./severity_counts";
import { module as theme_module } from "./theme/module";

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

export default new Vuex.Store({});

