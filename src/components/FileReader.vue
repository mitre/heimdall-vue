<template>
  <label class="file-select">
    <feather-icon
    icon="FilePlusIcon"
    class="cursor-pointer mt-1 sm:mr-6 mr-2">
    </feather-icon>
    <input type="file" @change="loadTextFromFile"/>
    <slot></slot>
  </label>
</template>


<style scoped>

.file-select > .select-button {
  padding: 0.75rem;

  color: white;
  background-color: #0000FF;

  border-radius: 0.5rem;

  text-align: center;
  font-weight: bold;
}

.file-select > input[type="file"] {
  display: none;
}

</style>


<script>
// import { store } from "../store.js";
import Items from '../layouts/components/vx-sidebar/sidebarItems'
import router from '../../src/router.js'

export default {
  mounted () {
    document.getElementsByTagName('input')[0].setAttribute('class','btn btn-secondary btn-sm');
  },
  methods: {
    loadTextFromFile(ev) {
      const file = ev.target.files[0];
      const reader = new FileReader();
      const store = this.$store;
      const routes = router.routes

      reader.onload = function(){
        var text = reader.result;
        store.commit("reset"); 
        // store.setTitle(file.name);
        store.dispatch("intake/loadReportFile", text);
        // store.parseFile(text, file.name);
      };
      reader.readAsText(file);

      //ADDS SIDE BAR ITEM
      Items[1].submenu.push({
        url: "/results/" + Items[1].submenu.length, 
        name: "results " + Items[1].submenu.length,
        slug: "result" + Items[1].submenu.length,
        icon: "FileIcon",
      })
    },
    getTitle() {
      return "TODO!";
    },
  }
};

</script>
<style>
/*
input[type="file" i] {
    -webkit-appearance: initial;
    background-color: #FF00FF !important;
    color: white;
    cursor: default;
    padding: initial;
    border: initial;
}
.text-reader {
    font-size: 1.25em;
    font-weight: 700;
    color: white;
    background-color: #6c757d;
    display: inline-block;
}

.text-reader:focus,
.text-reader:hover {
    background-color: red;
}*/
</style>
