<template>
  <AboutContent v-if="shouldShowAbout" />
  <SspContent v-else-if="shouldShowSSP" />
  <b-container v-else-if="shouldShowResults">
    <b-row>
      <b-card-group deck>
        <CountCard title="Passed" explanation="(all tests passed)" fas_icon="check" color_variant="success"></CountCard>
        <CountCard title="Failed" explanation="(has tests that failed)" fas_icon="times" color_variant="danger"></CountCard>
        <CountCard title="Not Applicable" explanation="(exception for this system and/or absent component)" fas_icon="ban" color_variant="primary"></CountCard>
        <CountCard title="Not Reviewed" explanation="(can only be tested manually or disabled test)" fas_icon="exclamation-triangle" color_variant="warning"></CountCard>
        <CountCard title="Profile Error" explanation="(check profile run privileges or check with profile author)" fas_icon="exclamation-circle" color_variant="info"></CountCard>
      </b-card-group>
    </b-row>
    <b-row>
      <b-card-group deck>
        <ControlStatus/>
        <ControlImpact/>
        <ComplianceChart/>
      </b-card-group>
    </b-row>
    <b-row id="chart">
      <b-card-group deck>
        <Treemap :key="resizeKey"/>
      </b-card-group>
    </b-row>
    <b-row>
      <b-col align-self="end" style='text-align: right'>Search: <input id="search_input" v-model="search"></b-col>
    </b-row>
    <DataTable :controls="filteredControls"></DataTable>
  </b-container>
</template>

<script>
import CountCard from '@/components/CountCard.vue'
import AboutContent from '@/components/AboutContent.vue'
import SspContent from '@/components/SspContent.vue'
import ControlStatus from '@/components/ControlStatus.vue'
import ControlImpact from '@/components/ControlImpact.vue'
import ComplianceChart from '@/components/ComplianceChart.vue'
import Treemap from '@/components/Treemap.vue'
import DataTable from '@/components/DataTable.vue'
import { store } from "../store.js";

export default {
  name: '',
  components: {
    CountCard,
    AboutContent,
    SspContent,
    ControlStatus,
    ControlImpact,
    ComplianceChart,
    Treemap,
    DataTable
  },
  data () {
    return {
      title: store.getTitle(),
      store,
      search: '',
      resizeKey: window.innerWidth
    }
  },
  computed: {
    shouldShowAbout() {
      return store.getShowing() == "About"
    },
    shouldShowResults() {
      return store.getShowing() == "Results"
    },
    shouldShowSSP() {
      return store.getShowing() == "SSP"
    },
    filteredControls: function() {
      let self = this;
      store.setSearchTerm(self.search.toLowerCase());
      var ctls = store.getFilteredNistControls();
      return ctls;
    }
  },
  mounted() {
    let vm = this;
    vm.controls = [];
    vm.controls = store.getFilteredNistControls();
  },
  created() {
    window.addEventListener("resize", this.winWidth);
  },
  destroyed() {
    window.removeEventListener("resize", this.winWidth);
  },
  methods: {
    winWidth: function () {
      var winw = window.innerWidth;
      console.log("winWidth: " + winw);
      this.resizeKey = winw;
    }
  }
}
</script>
<style lang="scss" scoped>
.drop_button {
  position: relative;
  bottom: -20px;
  z-index: -1;
}
.row {
  margin-top: 15px;
}
.card-deck {
  width: 100%;
}
.card-header {
  position: relative;
}
@media (min-width: 576px) {
  .card-deck {
      -ms-flex-flow: row wrap;
      -webkit-box-orient: horizontal;
      -webkit-box-direction: normal;
      flex-flow: row wrap;
      margin-right: 0px;
      margin-left: 0px;
  }
}
.container {
    width: 100%;
    padding-right: 15px;
    padding-left: 15px;
    margin-right: auto;
    margin-left: auto;
}
</style>
