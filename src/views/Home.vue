<template>
  <AboutContent v-if="shouldShowAbout" />
  <b-container v-else>
    <b-row>
      <b-card-group deck>
        <CountCard title="Not A Finding" explanation="(all tests passed)" fas_icon="check" color_variant="success"></CountCard>
        <CountCard title="Open" explanation="(has tests that failed)" fas_icon="times" color_variant="danger"></CountCard>
        <CountCard title="Not Applicable" explanation="(zero impact: exception for this system and/or absent component)" fas_icon="ban" color_variant="primary"></CountCard>
        <CountCard title="Not Reviewed" explanation="(can only be tested manually or disabled test)" fas_icon="exclamation-triangle" color_variant="warning"></CountCard>
      </b-card-group>
    </b-row>
    <b-row>
      <b-card-group deck>
        <ControlStatus/>
        <ControlImpact/>
        <ComplianceChart/>
      </b-card-group>
    </b-row>
    <b-row>
      <button v-on:click="clear">Clear Filter</button>
    </b-row>
  </b-container>
</template>

<script>
import CountCard from '@/components/CountCard.vue'
import AboutContent from '@/components/AboutContent.vue'
import ControlStatus from '@/components/ControlStatus.vue'
import ControlImpact from '@/components/ControlImpact.vue'
import ComplianceChart from '@/components/ComplianceChart.vue'
import { store } from "../store.js";

export default {
  name: '',
  components: {
    CountCard,
    AboutContent,
    ControlStatus,
    ControlImpact,
    ComplianceChart
  },
  data () {
    return {
      title: store.getTitle(),
      store
    }
  },
  computed: {
    shouldShowAbout() {
      return store.state.title == ""
    }
  },
  methods: {
    clear: function (event) {
      // `this` inside methods point to the Vue instance
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
.container {
    width: 100%;
    padding-right: 15px;
    padding-left: 15px;
    margin-right: auto;
    margin-left: auto;
}
</style>
