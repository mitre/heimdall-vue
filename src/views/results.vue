<template>
  <div>
    <vs-button
      v-show="clearButtonVisible"
      color="primary"
      type="filled"
      class="button"
      @click="clearFilters"
    >Clear Filters</vs-button>
    <div v-if="isProfileError">
      <vs-alert color="danger" icon-pack="feather" icon="icon-info">
        <span>
          You have
          <!--May need to switch the below with statusCounts[4]-->
          <b>{{ this.$store.getters["statusCounts/profileError"] }} profile errors</b> you need to resolve.
        </span>
      </vs-alert>
      <br />
    </div>
    <!-- ROW 1 -->
    <div class="vx-row">
      <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 mb-base">
        <count-card
          index="0"
          :statistic="statusCounts[0]"
          statisticTitle="Passed"
          statisticSub="All tests passed."
          background="success"
        ></count-card>
      </div>
      <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 mb-base">
        <count-card
          index="1"
          :statistic="statusCounts[1]"
          statisticTitle="Failed"
          statisticSub="Has tests that failed."
          background="danger"
        ></count-card>
      </div>
      <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 mb-base">
        <count-card
          index="2"
          :statistic="statusCounts[2]"
          statisticTitle="Not Applicable"
          statisticSub="System exception/absent component."
          background="primary"
        ></count-card>
      </div>
      <div class="vx-col w-full sm:w-1/2 md:w-1/2 lg:w-1/4 xl:w-1/4 mb-base">
        <count-card
          index="3"
          :statistic="statusCounts[3]"
          statisticTitle="Not Reviewed"
          statisticSub="Manual testing required/disabled test."
          background="warning"
        ></count-card>
      </div>
    </div>

    <!-- ROW 2 -->
    <div class="vx-row">
      <!--CONTROL STATUS-->
      <div class="vx-col w-full md:w-1/1 lg:w-1/3 xl:w-1/3">
        <control-status-card
          :series="statusCounts"
          :subtitle="isProfileError ? 'There are still profile errors.' : ''"
          @apply-filter="applyFromStatus"
        ></control-status-card>
      </div>
      <!--CONTROL SEVERITY-->
      <div class="vx-col w-full md:w-1/1 lg:w-1/3 xl:w-1/3">
        <control-severity-card
          :series="severityCounts"
          :subtitle="isProfileError ? 'There are still profile errors.' : ''"
          @apply-filter="applyFromSeverity"
        ></control-severity-card>
      </div>
      <!--COMPLIANCE LEVEL-->
      <div class="vx-col w-full md:w-1/1 lg:w-1/3 xl:w-1/3 mb-base">
        <compliance-level-card
          :series="statusCounts"
          :subtitle="isProfileError ? 'There are still profile errors.' : ''"
        ></compliance-level-card>
      </div>
    </div>
  </div>
</template>

<script>
//import { store } from "../store.js";
import CountCard from "../components/CountCard.vue";
import ControlStatusCard from "../components/ControlStatusCard.vue";
import ControlSeverityCard from "../components/ControlSeverityCard.vue";
import ComplianceLevelCard from "../components/ComplianceLevelCard.vue";

export default {
  data() {
    return {
      status: null, //needed to prevent from clicking Control Status twice
      severity: null //needed to prevent from clicking Control Severity twice
    };
  },
  created() {
    this.clearFilters();
  },
  computed: {
    isProfileError() {
      return this.$store.getters["statusCounts/profileError"] > 0;
    },
    clearButtonVisible() {
      if (this.status || this.severity) return true;
      return false;
    },
    filteredControls() {
      var filtered = this.$store.state.data.allControls;
      console.log(filtered);
      if (this.status) {
        filtered = filtered.filter(c => c.status === this.status);
      }
      if (this.severity) {
        filtered = filtered.filter(c => c.severity === this.severity);
      }
      return filtered;
    },
    statusCounts() {
      var countFiltered = status =>
        this.filteredControls.filter(c => c.status === status).length;
      return [
        countFiltered("Passed"),
        countFiltered("Failed"),
        countFiltered("Not Applicable"),
        countFiltered("Not Reviewed"),
        countFiltered("Profile Error")
      ];
    },
    severityCounts() {
      var countFiltered = severity =>
        this.filteredControls.filter(c => c.severity === severity).length;
      return [
        countFiltered("low"),
        countFiltered("medium"),
        countFiltered("high"),
        countFiltered("critical")
      ];
    }
  },
  methods: {
    applyFromStatus(status) {
      this.status = status;
    },
    applyFromSeverity(severity) {
      this.severity = severity;
    },
    clearFilters() {
      this.status = null;
      this.severity = null;
    }
  },
  components: {
    CountCard,
    ControlStatusCard,
    ControlSeverityCard,
    ComplianceLevelCard
  }
};
</script>

<style>
.button {
  position: fixed;
  top: 10;
  right: 1%;
  z-index: 1;
}
</style>