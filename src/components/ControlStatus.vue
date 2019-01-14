<template>
  <div class="panel panel-default">
    <div class="panel-heading res-chart">
      <i class="fa fa-chart-pie fa-fw"></i> Control Status
      <div v-bind:title="testBind"></div>
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
        handler: new Vue(),
        store
      }
    },

    computed: {
      testBind: function() {
        console.log(this.handler);
        return store.getTest();
      },
      activeStatus: function () {
        return store.getStatus();
      }
    },

    updated: function () {
      console.log("updated");
      var reload_data = {
        unload: true,
        columns: store.getStatus()
      };
      this.handler.$emit('dispatch', (chart) => chart.load(reload_data));
    },

    mounted: function mounted () {
      store.clearFilter();
      // to init the graph call:
      const options = {
        data: {
          columns: this.activeStatus,
          type : 'donut',
          onclick: function (d, i) {
            console.log("Clicked " + d.id);
            store.filterStatus(d.id);
            store.setTest(d.id);
          }
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
      this.handler.$emit('init', options);
    },
  }
</script>
