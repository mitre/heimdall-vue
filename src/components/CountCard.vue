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

        <h1 style="color:white;font-size:40px;" class="mb-1 fold-bold">{{statistic}}</h1>
      </div>

      <div class="p-6 pb-4">
        <h2 style="color:white;">{{statisticTitle}}</h2>
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
.feathericon {
  height: 5em;
  margin-top: -4px;
  pointer-events: none;
  vertical-align: middle;
  width: 5em;
  padding: 3px;
  flex: inline;
  border-radius: 9999px; /*rounded full*/
}
</style>