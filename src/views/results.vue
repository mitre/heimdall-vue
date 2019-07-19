<template>
  <div>
    <!-- ROW 1 -->
    <div class="vx-row">
      <div :class="getClass()">
        <count-card
          index="0"
          :statistic="$store.getters['statusCounts/passed'](filter)"
          statisticTitle="Passed"
          statisticSub="All tests passed."
          background="success"
        ></count-card>
      </div>
      <div :class="getClass()">
        <count-card
          index="1"
          :statistic="$store.getters['statusCounts/failed'](filter)"
          statisticTitle="Errors"
          statisticSub="Has tests that failed."
          background="danger"
        ></count-card>
      </div>
      <div :class="getClass()">
        <count-card
          index="2"
          :statistic="$store.getters['statusCounts/notApplicable'](filter)"
          statisticTitle="Not Applicable"
          statisticSub="System exception/absent component."
          background="primary"
        ></count-card>
      </div>
      <div :class="getClass()">
        <count-card
          index="3"
          :statistic="$store.getters['statusCounts/notReviewed'](filter)"
          statisticTitle="Not Reviewed"
          statisticSub="Manual testing required/disabled test."
          background="warning"
        ></count-card>
      </div>
      <div v-if="isProfileError" :class="getClass()">
        <count-card
          index="4"
          :statistic="$store.getters['statusCounts/profileError'](filter)"
          statisticTitle="Profile Error"
          statisticSub="Check profile run privileges."
          background="dark"
        ></count-card>
      </div>
    </div>

    <!-- ROW 2 -->
    <div class="vx-row">
      <!--CONTROL STATUS-->
      <div class="vx-col w-full md:w-1/3 lg:w-1/3 xl:w-1/3">
        <control-card title="Control Status" :controls="analyticsData.sessionsByDeviceDonut"></control-card>
      </div>
      <!--CONTROL SEVERITY-->
      <div class="vx-col w-full md:w-1/3 lg:w-1/3 xl:w-1/3">
        <control-card title="Control Severity" :controls="analyticsData.sessionsByDeviceDonut"></control-card>
      </div>
      <!--COMPLIANCE LEVEL-->
      <div class="vx-col w-full md:w-1/3 lg:w-1/3 xl:w-1/3 mb-base">
        <!--class "card" can be found in ControlCard.vue-->
        <vx-card title="Compliance Level" class="card">
          <div slot="no-body">
            <div class="p-4">
              <span>[Passed/(Passed + Failed + Not Reviewed + Profile Error) * 100]</span>
            </div>
            <div class="vx-row text-center">
              <div class="vx-col sm:w-4/5 justify-center mx-auto">
                <vue-apex-charts
                  type="radialBar"
                  height="400"
                  :options="analyticsData.supportTrackerRadialBar.chartOptions"
                  :series="analyticsData.supportTrackerRadialBar.series"
                />
              </div>
            </div>
          </div>
        </vx-card>
      </div>
    </div>
  </div>
</template>

<script>
//import { store } from "../store.js";
import VueApexCharts from "vue-apexcharts";
import CountCard from "../components/CountCard.vue";
import ControlCard from "../components/ControlCard.vue";
import analyticsData from "./ui-elements/card/analyticsData.js";

export default {
  data() {
    return {
      analyticsData: analyticsData,
      isProfileError: true //boolean for now
    };
  },
  computed: {
    filter: (state) => {
      // Init our filter
      let finalFilter = {};

      // Add file filter
      let fileID = parseInt(state.$route.params.id);
      if(fileID !== NaN) { finalFilter.fromFile = fileID; }
      return finalFilter;
    }
  },
  components: {
    VueApexCharts,
    CountCard,
    ControlCard
  },
  methods: {
    getClass() {
      return {
        "vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 mb-base": !this.$data
          .isProfileError,
        "vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/5 xl:w-1/5 mb-base": this.$data
          .isProfileError
      };
    }
  }
};
</script>