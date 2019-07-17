/**
 * VueSax template store module, converted to typescript + vuex decorator syntax
 */

import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";
import navbarSearchAndPinList from "@/layouts/components/navbarSearchAndPinList";
import themeConfig from "@/../themeConfig.js";
import { colors } from "@/../themeConfig.js";

@Module({
  namespaced: true,
  // name: "theme",  // Note: Commented because otherwise we get hella errors
})
class InspecThemeModule extends VuexModule {
  // ////////////////////////////////////////////
  // STATE
  // ////////////////////////////////////////////
  isSidebarActive: boolean = true;
  breakpoint: string | null = null;
  sidebarWidth: string = "default";
  reduceButton: boolean = themeConfig.sidebarCollapsed;
  bodyOverlay: boolean = false;
  sidebarItemsMin: boolean = false;
  theme: string = themeConfig.theme || "light";
  navbarSearchAndPinList = navbarSearchAndPinList;
  AppActiveUser = {
    id: 0,
    name: "Aaron Lippold",
    about: "He's just this guy, you know.",
    img: "avatar-s-11.png",
    status: "online",
  };

  themePrimaryColor: string = colors.primary;

  starredPages = navbarSearchAndPinList.data.filter(
    page => page.highlightAction
  );

  // Can be used to get current window with
  // Note: Above breakpoint state is for internal use of sidebar component
  windowWidth: number | null = null;

  // ////////////////////////////////////////////
  // MUTATIONS
  // ////////////////////////////////////////////

  // SIDEBAR & UI UX

  @Mutation
  UPDATE_SIDEBAR_WIDTH(width: string) {
    this.sidebarWidth = width;
  }
  @Mutation
  UPDATE_SIDEBAR_ITEMS_MIN(val: boolean) {
    this.sidebarItemsMin = val;
  }
  @Mutation
  TOGGLE_REDUCE_BUTTON(val: boolean) {
    this.reduceButton = val;
  }
  @Mutation
  TOGGLE_CONTENT_OVERLAY() {
    this.bodyOverlay = false; //!this.bodyOverlay;
  }
  @Mutation
  TOGGLE_IS_SIDEBAR_ACTIVE(value: boolean) {
    this.isSidebarActive = value;
  }
  @Mutation
  UPDATE_THEME(val: string) {
    this.theme = val;
  }
  @Mutation
  UPDATE_WINDOW_BREAKPOINT(val: string) {
    this.breakpoint = val;
  }
  @Mutation
  UPDATE_PRIMARY_COLOR(val: string) {
    this.themePrimaryColor = val;
  }

  @Mutation
  UPDATE_WINDOW_WIDTH(width: number) {
    this.windowWidth = width;
  }

  // ////////////////////////////////////////////
  // MUTATIONS
  // ////////////////////////////////////////////

  @Action
  updateSidebarWidth(width: string) {
    this.context.commit("UPDATE_WINDOW_WIDTH", width);
  }

  @Action
  toggleContentOverlay() {
    this.context.commit("TOGGLE_CONTENT_OVERLAY");
  }

  @Action
  updateTheme(val: string) {
    this.context.commit("UPDATE_THEME", val);
  }

  @Action
  updateWindowWidth(width: number) {
    this.context.commit("UPDATE_WINDOW_WIDTH", width);
  }
}

export default InspecThemeModule;
