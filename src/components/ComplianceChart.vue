<template>
  <b-card no-body class="mb-3">
    <b-card-header>
      <font-awesome-icon icon="tachometer-alt"/> Compliance
      <div v-bind:title="testBind"></div>
    </b-card-header>
    <b-card-body>
      [Passed/(Passed + Failed + Not Reviewed + Profile Error) * 100]
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
      activeCompliance: function () {
        return store.getCompliance();
      }
    },

    updated: function () {
      var reload_data = {
        unload: true,
        columns: store.getCompliance()
      };
      this.handler.$emit('dispatch', (chart) => chart.load(reload_data));
    },

    mounted: function mounted () {
      // to init the graph call:
      const options = {
        data: {
          columns: this.activeCompliance,
          type : 'gauge',
        },
        color: {
          pattern: ['#FF0000', '#F97600', '#F6C600', '#60B044'],
          threshold: {
              values: [30, 60, 90, 100]
          }
        },
        size: {
          height: 270
        }
      }
      this.handler.$emit('init', options);
    },
  }
</script>
<style>
  .c3-chart-arcs-background{fill:#e0e0e0;stroke:none}
</style>
