<template>
  <b-card no-body class="mb-3">
    <b-card-header>
      <font-awesome-icon icon="chart-pie"/> Control Status
      <div v-bind:title="testBind"></div>
    </b-card-header>
    <b-card-body>
      <vue-c3 :handler="handler"></vue-c3>
    </b-card-body>
  </b-card>
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
        return store.getBindValue();
      },
      activeStatus: function () {
        return store.getStatusCount();
      }
    },

    updated: function () {
      var reload_data = {
        unload: true,
        columns: store.getStatusCount()
      };
      this.handler.$emit('dispatch', (chart) => chart.load(reload_data));
    },

    mounted: function mounted () {
      // to init the graph call:
      const options = {
        data: {
          columns: this.activeStatus,
          type : 'donut',
          onclick: function (d, i) {
            store.setStatusFilter(d.id);
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
