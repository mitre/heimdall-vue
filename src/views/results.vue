<template>
  <div>
    <vs-button
      v-show="filtersNeeded"
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
      statusCounts: [],
      severityCounts: [],
      filtersNeeded: false, //controls presence of 'Clear Filters' button
      array: null, //stores results of first filter
      status: null, //needed to prevent from clicking Control Status twice
      impact: null //needed to prevent from clicking Control Severity twice
    };
  },
  created() {
    this.clearFilters();
  },
  computed: {
    isProfileError() {
      return this.$store.getters["statusCounts/profileError"] > 0;
    }
  },
  methods: {
    applyFromStatus(status) {
      if (!this.status) {
        this.filtersNeeded = true;
        if (!this.array) {
          this.array = this.$store.state.allControls.filter(
            c => c.status === status
          );
        } else {
          this.array = this.array.filter(c => c.status === status);
        }
        if (status === "Passed") {
          this.statusCounts = [this.array.length, 0, 0, 0, 0];
        } else if (status === "Failed") {
          this.statusCounts = [0, this.array.length, 0, 0, 0];
        } else if (status === "Not Applicable") {
          this.statusCounts = [0, 0, this.array.length, 0, 0];
        } else if (status === "Not Reviewed") {
          this.statusCounts = [0, 0, 0, this.array.length, 0];
        } else {
          this.statusCounts = [0, 0, 0, 0, this.array.length];
        }

        this.severityCounts = [
          this.array.filter(c => c.impact === "low").length,
          this.array.filter(c => c.impact === "medium").length,
          this.array.filter(c => c.impact === "high").length,
          this.array.filter(c => c.impact === "critical").length
        ];
        this.status = status;
      }
    },
    applyFromSeverity(impact) {
      if (!this.impact) {
        this.filtersNeeded = true;
        if (!this.array) {
          this.array = this.$store.state.allControls.filter(
            c => c.impact === impact
          );
        } else {
          this.array = this.array.filter(c => c.impact === impact);
        }
        if (impact === "low") {
          this.severityCounts = [this.array.length, 0, 0, 0];
        } else if (impact === "medium") {
          this.severityCounts = [0, this.array.length, 0, 0];
        } else if (impact === "high") {
          this.severityCounts = [0, 0, this.array.length, 0];
        } else {
          this.severityCounts = [0, 0, 0, this.array.length];
        }

        this.statusCounts = [
          this.array.filter(c => c.status === "Passed").length,
          this.array.filter(c => c.status === "Failed").length,
          this.array.filter(c => c.status === "Not Applicable").length,
          this.array.filter(c => c.status === "Not Reviewed").length,
          this.array.filter(c => c.status === "Profile Error").length
        ];
        this.impact = impact;
      }
    },
    clearFilters() {
      this.statusCounts = [
        this.$store.getters["statusCounts/passed"],
        this.$store.getters["statusCounts/failed"],
        this.$store.getters["statusCounts/notApplicable"],
        this.$store.getters["statusCounts/notReviewed"],
        this.$store.getters["statusCounts/profileError"]
      ];
      this.severityCounts = [
        this.$store.getters["severityCounts/low"],
        this.$store.getters["severityCounts/medium"],
        this.$store.getters["severityCounts/high"],
        this.$store.getters["severityCounts/critical"]
      ];
      this.filtersNeeded = false;
      this.array = null;
      this.status = null;
      this.impact = null;
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