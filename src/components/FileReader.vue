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
      file = ev.target.files[0];
      store.commit("intake/loadFile", file);
    },
  }
};

</script>