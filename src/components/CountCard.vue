<template>
  <vx-card class="card" content-color="#fff" :card-background="background">
    <div slot="no-body">
      <div class="p-6 pb-0 flex justify-between flex-row-reverse items-center">
        <!--possible icons-->
        <check-circle-icon v-if="index==0" class="feathericon"></check-circle-icon>
        <x-circle-icon v-else-if="index==1" class="feathericon"></x-circle-icon>
        <slash-icon v-else-if="index==2" class="feathericon"></slash-icon>
        <alert-triangle-icon v-else-if="index==3" class="feathericon"></alert-triangle-icon>
        <alert-circle-icon v-else class="feathericon"></alert-circle-icon>

        <h1>{{statistic}}</h1>
      </div>

      <div class="p-6 pb-4">
        <h2>{{statisticTitle}}</h2>
        <span>{{statisticSub}}</span>
      </div>
    </div>
  </vx-card>
</template>

<script>
import {
  CheckCircleIcon,
  XCircleIcon,
  SlashIcon,
  AlertTriangleIcon,
  AlertCircleIcon
} from "vue-feather-icons";
import { ResponsiveDirective } from "vue-responsive-components";

export default {
  props: {
    index: [Number, String],
    statistic: {
      type: [Number, String],
      required: true
    },
    statisticTitle: {
      type: String
    },
    statisticSub: {
      type: String
    },
    background: {
      type: String
    }
  },
  components: {
    CheckCircleIcon,
    XCircleIcon,
    SlashIcon,
    AlertTriangleIcon,
    AlertCircleIcon
  },
  directives: {
    responsive: ResponsiveDirective
  }
};
</script>

<style scoped>
.card {
  display: flex;
  flex-direction: column;
  height: 100%;
  overflow: hidden;
  flex-grow: 1;
}
.card h1 {
  color: white;
  font-size: 40px;
  margin-bottom: 1;
  font-weight: bold;
}
.card h2 {
  color: white;
}
.card .feathericon {
  height: 5em;
  margin-top: -4px;
  pointer-events: none;
  vertical-align: middle;
  width: 5em;
  padding: 3px;
  flex: inline;
  border-radius: 9999px; /*rounded full*/
}

/*using v-responsive*/
/*
.card.small h1 {
  font-size: 3em;
}
.card.small h2 {
  font-size: 2em;
}
.card.small span {
  font-size: 1em;
}
*/
</style>
