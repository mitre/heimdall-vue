<template>
  <b-card no-body class="mb-3">
    <b-card-header>
      <font-awesome-icon icon="chart-pie"/> Control Impact
      <div v-bind:title="testBind"></div>
    </b-card-header>
    <b-card-body>
      <vue-c3 :handler="handler"></vue-c3>
    </b-card-body>
  </b-card>
</template>

<script>
  import Vue from 'vue'
  import { store } from "../store.js";
</script>
