<template>
  <b-navbar toggleable="md" type="dark" variant="info">
    <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
    <b-navbar-brand href="#">Heimdall-lite</b-navbar-brand>
    <b-nav-form>
      <label class="text-reader">
        <text-reader @load="text = $event"></text-reader>
      </label>
    </b-nav-form>
    <b-navbar-nav class="ml-auto">
      <b-nav-form>
        <b-button id="export-caat" size="sm" class="my-2 my-sm-0" type="button">CAAT</b-button>
      </b-nav-form>
    </b-navbar-nav>
  </b-navbar>
</template>

<script>
import TextReader from "./FileReader";
export default {
  name: "app",
  data: () => ({ text: "" }),
  components: {
    TextReader
  }
};

</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style lang="scss" scoped>
.floating {
  position: fixed;
  top: 95px;
  right: 20px;
  visibility: hidden;
}
.floating2 {
  position: fixed;
  top: 8px;
  right: 20px;
}
.navbar-top-links {
  margin-right: 0;
}
.navbar-top-links li {
  display: inline-block;
}
.flot-chart, .navbar-top-links .dropdown-menu li {
  display: block;
}
.navbar-top-links li:last-child {
  margin-right: 15px;
}
.navbar-top-links li a {
  padding: 15px;
  min-height: 50px;
}
.navbar-top-links .dropdown-menu li:last-child {
  margin-right: 0;
}
.navbar-top-links .dropdown-menu li a {
  padding: 3px 20px;
  min-height: 0;
}
.navbar-top-links .dropdown-menu li a div {
  white-space: normal;
}
.navbar-top-links .dropdown-alerts, .navbar-top-links .dropdown-messages, .navbar-top-links .dropdown-tasks {
  width: 310px;
  min-width: 0;
}
.navbar-top-links .dropdown-messages {
  margin-left: 5px;
}
.navbar-top-links .dropdown-tasks {
  margin-left: -59px;
}
.navbar-top-links .dropdown-alerts {
  margin-left: -123px;
}
.navbar-top-links .dropdown-user {
  right: 0;
  left: auto;
}
@media (min-width:768px) {
  .navbar-top-links .dropdown-alerts, .navbar-top-links .dropdown-messages, .navbar-top-links .dropdown-tasks {
    margin-left: auto;
  }
}
</style>
