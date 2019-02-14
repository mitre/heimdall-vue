<template>
  <label class="text-reader">
    <input type="file" @change="loadTextFromFile">
  </label>
</template>

<script>
import { store } from "../store.js";

export default {
  methods: {
    loadTextFromFile(ev) {
      const file = ev.target.files[0];
      const reader = new FileReader();

      reader.onload = function(){
        var text = reader.result;
        store.reset()
        store.setTitle(file.name);
        store.parseFile(text, file.name);
      };
      reader.readAsText(file);
    }
  }
};
</script>
