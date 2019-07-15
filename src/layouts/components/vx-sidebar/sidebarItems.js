/*=========================================================================================
  File Name: sidebarItems.js
  Description: Sidebar Items list. Add / Remove menu items from here.
  Strucutre:
          url     => router path
          name    => name to display in sidebar
          slug    => router path name
          icon    => Feather Icon component/icon name
          tag     => text to display on badge
          tagColor  => class to apply on badge element
          i18n    => Internationalization
          submenu   => submenu of current item (current item will become dropdown )
                NOTE: Submenu don't have any icon(you can add icon if u want to display)
          isDisabled  => disable sidebar item/group
  ----------------------------------------------------------------------------------------
  Item Name: Vuesax Admin - VueJS Dashboard Admin Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/



export default [
  {
    url: "/",
    name: "Home",
    slug: "home",
    icon: "HomeIcon"
  },
  {
    name: "File Select",
    icon: "FilePlusIcon",
  },
  {
    url: "/results",
    name: "Results",
    slug: "results",
    icon: "FileIcon"
  },
  {
    url: null,
    name: "Tools",
    slug: "tools",
    icon: "ToolIcon",
    i18n: "Tools",
    submenu: [
      {
        url: "/results/catt", // example only
        name: "CATT File",
        slug: "toolsCatt",
        icon: "ToolIcon",
        i18n: "CATT"
      },
      {
        url: "/results/print",
        name: "print",
        slug: "print",
        icon: "PrinterIcon",
        i18n: "print"
      }
    ]
  },
  {
    url: "/ssp",
    name: "SSP",
    slug: "ssp",
    icon: "FileIcon"
  },
  {
    url: "/about",
    name: "About",
    slug: "about",
    icon: "FileIcon"
  }
];
