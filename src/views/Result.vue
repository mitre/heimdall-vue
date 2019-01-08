<template>
  <div class="row" id="results_charts_row" style='display:block;'>
    <div class="col-lg-4" id='control_status_id'>
      <ControlStatus/>
    </div>
  </div>
</template>

<script>
import ControlStatus from '@/components/ControlStatus.vue'

export default {
  name: '',
  components: {
    ControlStatus
  }
}
</script>
