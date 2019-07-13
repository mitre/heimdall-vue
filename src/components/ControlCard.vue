<template>
  <vx-card :title="title" class="card">
    <!-- CHART -->
    <div slot="no-body">
      <vue-apex-charts
        type="donut"
        height="330"
        class="mt-5"
        :options="controls.chartOptions"
        :series="controls.series"
      />
    </div>

    <!-- CHART DATA -->
    <ul>
      <li v-for="deviceData in controls.analyticsData" :key="deviceData.device" class="flex mb-3">
        <feather-icon
          :icon="deviceData.icon"
          :svgClasses="[`h-5 w-5 stroke-current text-${deviceData.color}`]"
        ></feather-icon>
        <span class="ml-2 inline-block font-semibold">{{ deviceData.device }}</span>
        <span class="mx-2">-</span>
        <span class="mr-4">{{ deviceData.sessionsAmount }}</span>
      </li>
    </ul>
  </vx-card>
</template>

<script>
import VueApexCharts from "vue-apexcharts";

export default {
  props: {
    title: String,
    controls: {
      type: Object,
      required: true
    }
  },
  components: {
    VueApexCharts
  }
};
</script>

<style>
.card {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  flex-grow: 1;
  height: 600px;
}
</style>