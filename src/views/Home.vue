<template>
  <AboutContent v-if="shouldShowAbout" />
  <b-container v-else>
    <b-row>
      <b-card-group deck>
        <CountCard title="Passed" explanation="(all tests passed)" fas_icon="check" color_variant="success"></CountCard>
        <CountCard title="Failed" explanation="(has tests that failed)" fas_icon="times" color_variant="danger"></CountCard>
        <CountCard title="Not Applicable" explanation="(zero impact: exception for this system and/or absent component)" fas_icon="ban" color_variant="primary"></CountCard>
        <CountCard title="Not Reviewed" explanation="(can only be tested manually or disabled test)" fas_icon="exclamation-triangle" color_variant="warning"></CountCard>
        <CountCard title="Profile Error" explanation="errors running test - check profile run privileges or check with the author of profile)" fas_icon="exclamation-circle" color_variant="info"></CountCard>
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
        <Treemap/>
      </b-card-group>
    </b-row>
    <b-row>
      <b-col align-self="start"><button v-on:click="clear">Clear Filter</button></b-col>
      <b-col align-self="end" style='text-align: right'>Search: <input v-model="search"></b-col>
    </b-row>
    <DataTable :controls="filteredControls"></DataTable>
  </b-container>
</template>

<script>
import CountCard from '@/components/CountCard.vue'
import AboutContent from '@/components/AboutContent.vue'
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
      search: ''
    }
  },
  computed: {
    shouldShowAbout() {
      return store.state.title == ""
    },
    filteredControls: function() {
      let self = this;
      store.setSearchTerm(self.search.toLowerCase());
      var ctls = store.getControls();
      return ctls;
    }
  },
  mounted() {
    let vm = this;
    vm.controls = [];
    vm.controls = store.getControls();
  },
  methods: {
    clear: function (event) {
      store.setSearchTerm("");
      store.setStatusFilter("");
      store.setImpactFilter("");
    }
  }
}
</script>
<style lang="scss" scoped>
.row {
  margin-top: 15px;
}
.card-deck {
  width: 100%;
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
