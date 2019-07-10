<template>
  <div>
    <!-- ROW 1 -->
    <div class="vx-row">
      <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 mb-base">
        <count-card
          icon="CheckCircleIcon"
          icon-right
          :statistic="$store.getters['statusCounts/passed']"
          statisticTitle="Passed"
          statisticSub="All tests passed."
          background="success"
        ></count-card>
      </div>
      <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 mb-base">
        <count-card
          icon="XCircleIcon"
          icon-right
          :statistic="$store.getters['statusCounts/failed']"
          statisticTitle="Errors"
          statisticSub="Has tests that failed."
          background="danger"
        ></count-card>
      </div>
      <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 mb-base">
        <count-card
          icon="SlashIcon"
          icon-right
          :statistic="$store.getters['statusCounts/notApplicable']"
          statisticTitle="Not Applicable"
          statisticSub="System exception/absent component."
          background="primary"
        ></count-card>
      </div>
      <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 mb-base">
        <count-card
          icon="AlertTriangleIcon"
          icon-right
          :statistic="$store.getters['statusCounts/notReviewed']"
          statisticTitle="Not Reviewed"
          statisticSub="Manual testing required/disabled test."
          background="warning"
        ></count-card>
      </div>
    </div>

    <!-- ROW 2 -->
    <div class="vx-row">
      <div class="vx-col w-full md:w-1/3 lg:w-1/3 xl:w-1/3">
        <vx-card title="Control Status">
          <!-- SLOT = ACTIONS -->
          <template slot="actions">
            <change-time-duration-dropdown />
          </template>

          <!-- CHART -->
          <div slot="no-body">
            <vue-apex-charts
              type="donut"
              height="330"
              class="mt-5"
              :options="analyticsData.sessionsByDeviceDonut.chartOptions"
              :series="analyticsData.sessionsByDeviceDonut.series"
            />
          </div>

          <!-- CHART DATA -->
          <!-- CHART DATA -->
          <ul>
            <li
              v-for="deviceData in analyticsData.sessionsByDeviceDonut.analyticsData"
              :key="deviceData.device"
              class="flex mb-3"
            >
              <feather-icon
                :icon="deviceData.icon"
                :svgClasses="[`h-5 w-5 stroke-current text-${deviceData.color}`]"
              ></feather-icon>
              <span class="ml-2 inline-block font-semibold">{{ deviceData.device }}</span>
              <span class="mx-2">-</span>
              <span class="mr-4">{{ deviceData.sessionsPercentgae }}%</span>
              <div class="ml-auto flex -mr-1">
                <span class="mr-1">{{ deviceData.comparedResultPercentage }}%</span>
                <feather-icon
                  :icon=" deviceData.comparedResultPercentage < 0 ? 'ArrowDownIcon' : 'ArrowUpIcon'"
                  :svgClasses="[deviceData.comparedResultPercentage < 0 ? 'text-danger' : 'text-success'  ,'stroke-current h-4 w-4 mb-1 mr-1']"
                ></feather-icon>
              </div>
            </li>
          </ul>
        </vx-card>
      </div>
    </div>

    <div class="vx-col w-full md:w-1/3 lg:w-1/3 xl:w-1/3">
      <!-- <statistics-card-line icon="UserCheckIcon" icon-right statistic="659.8k" statisticTitle="Active Users" :chartData="analyticsData.activeUsers" color="success"></statistics-card-line> -->
    </div>

    <div class="vx-col w-full md:w-1/3 lg:w-1/3 xl:w-1/3">
      <!-- <statistics-card-line icon="MailIcon" icon-right statistic="28.7k" statisticTitle="Newsletter" :chartData="analyticsData.newsletter" color="warning"></statistics-card-line> -->
    </div>
  </div>
</template>

<script>
//import { store } from "../store.js";
import VueApexCharts from "vue-apexcharts";
import CountCard from "../components/CountCard.vue";
// import StatisticsCardLine from '@/components/statistics-cards/StatisticsCardLine.vue'
import analyticsData from "./ui-elements/card/analyticsData.js";
import ChangeTimeDurationDropdown from "@/components/ChangeTimeDurationDropdown.vue";

export default {
  data() {
    return {
      analyticsData: analyticsData
    };
  },
  components: {
    VueApexCharts,
    CountCard
  }
};
</script>
