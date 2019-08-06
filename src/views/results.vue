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
          <b>{{ this.$store.getters["statusCounts/profileError"](fileFilter) }} profile errors</b> you need to resolve.
        </span>
      </vs-alert>
      <br />
    </div>
    <!-- ROW 1 -->
    <div class="vx-row">
      <div class="vx-col w-full sm:w-1/1 md:w-1/2 lg:w-1/2 xl:w-1/4 mb-base">
        <count-card
          index="0"
          :statistic="statusCounts[0]"
          statisticTitle="Passed"
          statisticSub="All tests passed."
          background="success"
        ></count-card>
      </div>
      <div class="vx-col w-full sm:w-1/1 md:w-1/2 lg:w-1/2 xl:w-1/4 mb-base">
        <count-card
          index="1"
          :statistic="statusCounts[1]"
          statisticTitle="Failed"
          statisticSub="Has tests that failed."
          background="danger"
        ></count-card>
      </div>
      <div class="vx-col w-full sm:w-1/1 md:w-1/2 lg:w-1/2 xl:w-1/4 mb-base">
        <count-card
          index="2"
          :statistic="statusCounts[2]"
          statisticTitle="Not Applicable"
          statisticSub="System exception/absent component."
          background="primary"
        ></count-card>
      </div>
      <div class="vx-col w-full sm:w-1/1 md:w-1/2 lg:w-1/2 xl:w-1/4 mb-base">
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
      <div class="vx-col w-full md:w-1/1 lg:w-1/2 xl:w-1/3">
        <control-status-card
          :series="statusCounts"
          :subtitle="isProfileError ? 'There are still profile errors.' : ''"
          @apply-filter="applyFilterStatus"
        ></control-status-card>
      </div>
      <!--CONTROL SEVERITY-->
      <div class="vx-col w-full md:w-1/1 lg:w-1/2 xl:w-1/3">
        <control-severity-card
          :series="severityCounts"
          :subtitle="isProfileError ? 'There are still profile errors.' : ''"
          @apply-filter="applyFilterSeverity"
        ></control-severity-card>
      </div>
      <!--COMPLIANCE LEVEL-->
      <div class="vx-col w-full md:w-1/1 lg:w-1/1 xl:w-1/3 mb-base">
        <compliance-level-card
          :series="statusCounts"
          :subtitle="isProfileError ? 'There are still profile errors.' : ''"
        ></compliance-level-card>
      </div>
    </div>
    <div class="vx-row h-48">
      <div class="vx-col w-full md:w-1/1 lg:w-1/1 xl:w-1/1 mb-base ">
        <Treemap></Treemap>
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
import Treemap from "../components/Treemap.vue";
import FindingDetails from "../components/";

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
      console.log(this.$store.getters["treemap/nistHash"]);
      return this.$store.getters["statusCounts/profileError"](this.fileFilter) > 0;
    },
    test() {
      return this.$store.getters["treemap/nistControls"];
    },
    clearButtonVisible() {
      if (this.status || this.severity) return true;
      return false;
    },
    /** Construct a filter object that matches the current file(s) */
    fileFilter() {
      if(this.$route.params.id !== undefined) {
        // If theres an id, set it as the filter
        return { fromFile: parseInt(this.$route.params.id) };
      } else {
        return {};
      }
    },
    /** Construct a filter dict based on current status/severity selections (on top of file filters) */
    filter(){
      // Init our filter
      let finalFilter = {};

      // Add file filter
      Object.assign(finalFilter, this.fileFilter);

      // Add status and severity filters
      if(this.status) { finalFilter.status = this.status; }
      if(this.severity) { finalFilter.severity = this.severity; }

      finalFilter.accepts = (control) => {
        if (this.status && this.status != control.status) {
          return false;
        }
        // Must stringify the impact, but otherwise just check equality
        else if (this.severity && this.severity != control.severity) {
          return false;
        }
        // Finally, if there's a search term, we return based on that
        if (this.searchTerm) {
          let term = this.searchTerm.toLowerCase();
          // Check if any of the following list contain it, in lower case
          return [
            control.id,
            control.rule_title,
            control.severity,
            control.status,
            control.finding_details,
            control.code,
          ]
            .map(s => s.toLowerCase())
            .map(s => s.includes(term))
            .reduce((a, b) => a || b);
        } else {
          // No search term; we're fine
          return true;
        }
      };

      return finalFilter;
    },
    statusCounts() {
      return [
        this.$store.getters["statusCounts/passed"](this.filter),
        this.$store.getters["statusCounts/failed"](this.filter),
        this.$store.getters["statusCounts/notApplicable"](this.filter),
        this.$store.getters["statusCounts/notReviewed"](this.filter),
        this.$store.getters["statusCounts/profileError"](this.filter),
      ];
    },
    severityCounts() {
      return [
        this.$store.getters["severityCounts/low"](this.filter),
        this.$store.getters["severityCounts/medium"](this.filter),
        this.$store.getters["severityCounts/high"](this.filter),
        this.$store.getters["severityCounts/critical"](this.filter),
      ];
    },
  },
  methods: {
    applyFilterStatus(status) {
      this.status = status;
    },
    applyFilterSeverity(severity) {
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
    ComplianceLevelCard,
    Treemap
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

