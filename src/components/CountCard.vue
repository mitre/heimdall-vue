<template>
  <b-card no-body :bg-variant="variant" text-variant="white">
    <b-card-body>
      <b-row>
        <b-col cols="3">
          <font-awesome-icon :icon="icon" size="5x" />
        </b-col>
        <b-col cols="9" style="text-align: right">
          <h1>{{count}}</h1>
          <br />
          {{title}}
        </b-col>
      </b-row>
    </b-card-body>
    <b-card-footer>
      <small>{{explanation}}</small>
    </b-card-footer>
  </b-card>
</template>

<script>
import Vue from "vue";
import { store } from "../store.js";

export default {
  name: "",
  props: ["title", "explanation", "fas_icon", "color_variant"],
  data() {
    return {
      store
    };
  },

  computed: {
    icon() {
      return ["fas", this.fas_icon];
    },
    variant() {
      return this.color_variant;
    },
    testBind: function() {
      return store.getBindValue();
    },
    count: function() {
      var status = store.getStatus();
      var val = 0;
      for (var i = 0; i < status.length; i++) {
        if (status[i][0] == this.title) {
          val = status[i][1];
        }
      }
      return val;
    }
  },

  updated: function() {},

  mounted: function mounted() {}
};
</script>

<style lang="scss" scoped>
.card-footer {
  padding-top: 0.05rem;
  height: 70px;
}
</style>
