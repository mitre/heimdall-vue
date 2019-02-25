<template>
  <b-card no-body class="mb-3">
    <b-card-header>
      <font-awesome-icon icon="chart-pie"/> Control Impact
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
      activeImpact: function () {
        return store.getImpact();
      }
    },

    updated: function () {
      var reload_data = {
        unload: true,
        columns: store.getImpact()
      };
      this.handler.$emit('dispatch', (chart) => chart.load(reload_data));
    },

    mounted: function mounted () {
      // to init the graph call:
      const options = {
        data: {
          columns: this.activeImpact,
          type : 'donut',
          onclick: function (d, i) {
            store.setImpactFilter(d.id);
          }
        },
        color: {
          pattern: ['#99CCFF', '#0080FF', '#003366', '#FF0029']
        },
        size: {
          height: 300
        },
        donut: {
          title: "Control Severity",
          label: {
            format: function (value, ratio, id) {
              return value;
            }
          }
        }
      }
      this.handler.$emit('init', options);
    },
  }
</script>
