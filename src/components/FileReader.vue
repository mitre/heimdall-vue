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

export default {
  mounted () {
    document.getElementsByTagName('input')[0].setAttribute('class','btn btn-secondary btn-sm');
  },
  methods: {
    loadTextFromFile(ev) {
      // Get the file from the event
      let file = ev.target.files[0];
      // Submit it to be loaded
      let unique_id = this.$store.getters["data/nextFreeFileID"];
      this.$store.dispatch("intake/loadFile", {file, unique_id});
      // Go to that directory
      this.$router.push("/results/" + unique_id)
    },
  }
};

</script>