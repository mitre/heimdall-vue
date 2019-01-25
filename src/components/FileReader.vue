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

      //reader.onload = e => this.$emit("load", e.target.result);
      //var reader = new FileReader();
      reader.onload = function(){
        var text = reader.result;
        console.log(reader.result.substring(0, 200));
        store.reset()
        store.setTitle(file.name);
        store.parseFile(text, file.name);
        console.log("Done parsing?");
        //this.$router.push('/result');
      };
      reader.readAsText(file);
      //reader.onloadend = this.$router.push('/result');
      //this.$router.push('/result')
    }
  }
};
</script>
