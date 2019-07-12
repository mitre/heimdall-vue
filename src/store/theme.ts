/**
 * VueSax template store module, converted to typescript + vuex decorator syntax
 */

import { Module, VuexModule, Mutation, Action } from "vuex-module-decorators";
import { Control, Profile, InspecOutput } from "inspecjs";
import navbarSearchAndPinList from "@/layouts/components/navbarSearchAndPinList";
import themeConfig from "@/../themeConfig.js";
import colors from "@/../themeConfig.js";
import Store from "./store";

@Module({
  dynamic: true,
  store: Store,
  name: "theme",
  namespaced: true,
})
export default class InspecThemeModule extends VuexModule {
  // ////////////////////////////////////////////
  // STATE
  // ////////////////////////////////////////////
  public isSidebarActive: boolean = true;
  public breakpoint: string | null = null;
  public sidebarWidth: string = "default";
  public reduceButton: boolean = themeConfig.sidebarCollapsed;
  public bodyOverlay: boolean = false;
  public sidebarItemsMin: boolean = false;
  public theme: string = themeConfig.theme || "light";
  public navbarSearchAndPinList = navbarSearchAndPinList;
  public AppActiveUser = {
    id: 0,
    name: "Aaron Lippold",
    about: "He's just this guy, you know.",
    img: "avatar-s-11.png",
    status: "online",
  };

  public themePrimaryColor: string = colors.primary;

  public starredPages = navbarSearchAndPinList.data.filter(
    page => page.highlightAction
  );

  // Can be used to get current window with
  // Note: Above breakpoint state is for internal use of sidebar component
  public windowWidth: number | null = null;

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
  TOGGLE_CONTENT_OVERLAY(val: boolean) {
    this.bodyOverlay = val;
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

  UPDATE_WINDOW_WIDTH(width: number) {
    this.windowWidth = width;
  }

  // ////////////////////////////////////////////
  // MUTATIONS
  // ////////////////////////////////////////////

  @Action
  public updateSidebarWidth(width: number) {
    this.context.commit("UPDATE_WINDOW_WIDTH", width);
  }

  @Action
  updateI18nLocale(locale: string) {
    this.context.commit("UPDATE_I18N_LOCALE", locale);
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
  updateWindowWidth(width: string) {
    this.context.commit("UPDATE_WINDOW_WIDTH", width);
  }
}
