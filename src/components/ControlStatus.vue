<template>
  <div class="panel panel-default">
    <div class="panel-heading res-chart">
      <i class="fa fa-chart-pie fa-fw"></i> Control Status
    </div>
    <div class="panel-body">
      <vue-c3 :handler="handler"></vue-c3>
    </div>
  </div>
</template>

<script>
  import Vue from 'vue'
  import VueC3 from 'vue-c3'
  import { store } from "../store.js";

  export default {
    name: '',
    components: {
      VueC3
    },

    data () {
      return {
        handler: new Vue()
      }
    },

    mounted () {
      // to init the graph call:
      const options = {
        data: {
          columns: store.state.status,
          type : 'donut',
        },
        color: {
          pattern: ['rgb(137, 204, 81)', 'rgb(255, 0, 41)', '#4579B2', 'rgb(255, 200, 87)', '#DDEDF6']
        },
        size: {
          height: 300
        },
        donut: {
          title: "Control Status"
        }
      }
      this.handler.$emit('init', options)
    }
  }
</script>
