<template>
  <div class="row" id="results_charts_row" style='display:block;'>
    <div class="col-lg-4">
      <ControlStatus/>
    </div>
  </div>
</template>

<script>
import ControlStatus from '@/components/ControlStatus.vue'
import { store } from "../store.js";

export default {
  name: '',
  components: {
    ControlStatus
  }
}
</script>
