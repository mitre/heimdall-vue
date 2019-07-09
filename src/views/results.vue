<template>
  <div>
    <!-- ROW 1 -->
    <div class="vx-row">
      <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 mb-base">
        <vx-card
          title="Background Color"
          title-color="#fff"
          card-background="success"
          content-color="#fff"
        >
          <p class="mb-3">
            You can use
            <strong>card-background</strong> prop to change background color of card. This prop supports hex, rgba, rgb and theme colors.
          </p>
          <p
            class="mb-3"
          >Oat cake powder sesame snaps. Chocolate bar dessert bonbon chocolate bar pudding apple pie muffin chocolate ice cream. I love bear claw I love.</p>
        </vx-card>
      </div>
      <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 mb-base">
        <vx-card
          title="Background Color"
          title-color="#fff"
          card-background="danger"
          content-color="#fff"
        >
          <p class="mb-3">
            You can use
            <strong>card-background</strong> prop to change background color of card. This prop supports hex, rgba, rgb and theme colors.
          </p>
          <p
            class="mb-3"
          >Oat cake powder sesame snaps. Chocolate bar dessert bonbon chocolate bar pudding apple pie muffin chocolate ice cream. I love bear claw I love.</p>
        </vx-card>
      </div>
      <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 mb-base">
        <vx-card
          title="Background Color"
          title-color="#fff"
          card-background="warning"
          content-color="#fff"
        >
          <p class="mb-3">
            You can use
            <strong>card-background</strong> prop to change background color of card. This prop supports hex, rgba, rgb and theme colors.
          </p>
          <p
            class="mb-3"
          >Oat cake powder sesame snaps. Chocolate bar dessert bonbon chocolate bar pudding apple pie muffin chocolate ice cream. I love bear claw I love.</p>
        </vx-card>
      </div>
      <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 mb-base">
        <CountCard
          title="Passed"
          explanation="(all tests passed)"
          fas_icon="check"
          color_variant="success"
        ></CountCard>
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
              type="radialBar"
              height="350"
              :options="analyticsData.productOrdersRadialBar.chartOptions"
              :series="analyticsData.productOrdersRadialBar.series"
            />
          </div>

          <!-- CHART DATA -->
          <!-- <ul>
                        <li v-for="orderData in analyticsData.productOrdersRadialBar.analyticsData" :key="orderData.orderType" class="flex mb-3 justify-between">
                            <span class="flex items-center">
                                    <span class="inline-block h-4 w-4 rounded-full mr-2 bg-white border-3 border-solid" :class="`border-${orderData.color}`"></span>
                                    <span class="font-semibold">{{ orderData.orderType }}</span>
                            </span>
                            <span>{{ orderData.counts }}</span>
                        </li>
          </ul>-->
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
// import ChangeTimeDurationDropdown from '@/components/ChangeTimeDurationDropdown.vue'

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
