<template>
  <label class="file-select">
    <div class="select-button">
      <span v-if="getTitle()">Selected File: {{getTitle()}}</span>  
      <span v-else>Select File</span>
    </div>
    <input type="file" @change="loadTextFromFile"/>
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
import { store } from "../store.js";

export default {
  mounted () {
    document.getElementsByTagName('input')[0].setAttribute('class','btn btn-secondary btn-sm');
  },
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
    },
    getTitle() {
      return store.state.title;
    }
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
