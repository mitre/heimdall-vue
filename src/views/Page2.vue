<template>
	<div>
        <!-- ROW 1 -->
        <div class="vx-row">
            <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 mb-base">
              <statistics-card-line icon="MonitorIcon" icon-right statistic="78.9k" statisticTitle="Site Traffic" :chartData="analyticsData.siteTraffic"></statistics-card-line>
            </div>
            <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 mb-base">
              test 2
            </div>
            <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 mb-base">
              test 3
            </div>
            <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 mb-base">
              test 4
            </div>
        </div>

        <!-- ROW 2 -->
        <div class="vx-row">

            <div class="vx-col w-full md:w-1/3 lg:w-1/3 xl:w-1/3">
            </div>

            <div class="vx-col w-full md:w-1/3 lg:w-1/3 xl:w-1/3">
            </div>

            <div class="vx-col w-full md:w-1/3 lg:w-1/3 xl:w-1/3">
            </div>
        </div>
    </div>
</template>
<script>
import StatisticsCardLine from './../components/statistics-cards/StatisticsCardLine.vue'
import analyticsData from './ui-elements/card/analyticsData'

export default{
    data() {
        return {
            analyticsData: analyticsData,
        }
    },
    components: {
        StatisticsCardLine
    }
}
</script>
