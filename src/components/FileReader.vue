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
      const routes = router.routes;
      const id = Items[1].submenu.length;
      let fileName = file.name;

      let fileCount = 2;

      for (let results in Items[1].submenu) {
        if (Items[1].submenu[results].name == fileName) {
          if (fileCount < 3) {
            fileName = fileName + ' ' + fileCount;
            fileCount++;
          }
          else {
            fileName = fileName.substr(0, fileName.length - 2) + ' ' + fileCount;
            fileCount++;
          }
        }
      }

      reader.onload = function(){
        var text = reader.result;
        store.commit("data/reset"); 
        // store.setTitle(file.name);
        store.dispatch("intake/loadReportFile", text);
        // store.parseFile(text, file.name);
      };
      reader.readAsText(file);

      //ADDS SIDE BAR ITEM
      Items[1].submenu.push({
        url: "/results/" + id, 
        name: fileName,
        slug: "result" + id,
        icon: "FileIcon",
      })

      router.push("/results/" + id)
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
