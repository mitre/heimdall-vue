<template>
  <b-container fluid>
    <router-view />
  </b-container>
</template>

<script>
// @ is an alias to /src
import themeConfig from "@/../themeConfig.js";

export default {
  name: "app",
  components: {
  },
  watch: {
    "$store.state.theme"(val) {
      this.toggleClassInBody(val);
    }
  },
  async created() {
    try {
      await this.$auth.renewTokens();
    } catch (e) {
      console.log(e);
    }
  },
  methods: {
    toggleClassInBody(className) {
      if (className == "dark") {
        if (document.body.className.match("theme-semi-dark"))
          document.body.classList.remove("theme-semi-dark");
        document.body.classList.add("theme-dark");
      } else if (className == "semi-dark") {
        if (document.body.className.match("theme-dark"))
          document.body.classList.remove("theme-dark");
        document.body.classList.add("theme-semi-dark");
      } else {
        if (document.body.className.match("theme-dark"))
          document.body.classList.remove("theme-dark");
        if (document.body.className.match("theme-semi-dark"))
          document.body.classList.remove("theme-semi-dark");
      }
    },
    handleWindowResize(event) {
      this.$store.dispatch("updateWindowWidth", event.currentTarget.innerWidth);
    }
  },
  mounted() {
    this.toggleClassInBody(themeConfig.theme);
    this.$nextTick(() => {
      window.addEventListener("resize", this.handleWindowResize);
    });
    this.$store.dispatch("updateWindowWidth", window.innerWidth);
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.handleWindowResize);
  }
};
</script>
<style lang="scss" scoped>
.container-fluid {
  width: 100%;
  font-size: 14px;
  padding-right: 0px;
  padding-left: 0px;
  margin-right: auto;
  margin-left: auto;
}

#nist_treemap_profile rect {
  stroke: black;
  stroke-width: 0.25;
}
#nist_treemap_results rect {
  stroke: black;
  stroke-width: 0.25;
}

.chart {
  width: 100%;
  min-height: 300px;
}
.hidden_column {
  display: none;
}
.c3-event-rects {
  display: none;
}

footer {
  margin: 50px 0;
}

#tree-container {
  position: absolute;
  left: 0px;
  width: 100%;
}

.svgContainer {
  display: block;
  margin: auto;
}

.node {
  cursor: pointer;
}

.node-rect {
}

.node-rect-closed {
  stroke-width: 2px;
  stroke: rgb(0, 0, 0);
}

.link {
  fill: none;
  stroke: lightsteelblue;
  stroke-width: 2px;
}

.linkselected {
  fill: none;
  stroke: tomato;
  stroke-width: 2px;
}

.arrow {
  fill: lightsteelblue;
  stroke-width: 1px;
}

.arrowselected {
  fill: tomato;
  stroke-width: 2px;
}

.link text {
  font: 7px sans-serif;
  fill: #cc0000;
}

.wordwrap {
  white-space: pre-wrap; /* CSS3 */
  white-space: -moz-pre-wrap; /* Firefox */
  white-space: -pre-wrap; /* Opera <7 */
  white-space: -o-pre-wrap; /* Opera 7 */
  word-wrap: break-word; /* IE */
}

.node-text {
  font: 7px sans-serif;
  color: white;
}

.tooltip-text-container {
  height: 100%;
  width: 100%;
}

.tooltip-text {
  visibility: hidden;
  font: 7px sans-serif;
  color: white;
  display: block;
  padding: 5px;
}

.tooltip-box {
  background: rgba(0, 0, 0, 0.7);
  visibility: hidden;
  position: absolute;
  border-style: solid;
  border-width: 1px;
  border-color: black;
  border-top-right-radius: 0.5em;
}

p {
  display: inline;
}

.textcolored {
  color: orange;
}

a.exchangeName {
  color: orange;
}

rect.partitionRect {
  stroke: #eee;
  fill: #aaa;
  fill-opacity: 0.8;
}

rect.parent {
  cursor: pointer;
  fill: steelblue;
}

pre {
  white-space: pre-wrap; /* Since CSS 2.1 */
  white-space: -moz-pre-wrap; /* Mozilla, since 1999 */
  white-space: -pre-wrap; /* Opera 4-6 */
  white-space: -o-pre-wrap; /* Opera 7 */
  word-wrap: break-word; /* Internet Explorer 5.5+ */
}
.chat {
  list-style: none;
}
body {
  background-color: #f8f8f8;
}
#wrapper {
  width: 100%;
}
#page-wrapper {
  padding: 0 15px;
  min-height: 568px;
  background-color: #fff;
}
@media (min-width: 768px) {
  #page-wrapper {
    position: inherit;
    margin: 0 0 0 250px;
    padding: 0 30px;
    border-left: 1px solid #e7e7e7;
  }
}
.btn-outline {
  color: inherit;
  background-color: transparent;
  transition: all 0.5s;
}
.btn-primary.btn-outline {
  color: #428bca;
}
.btn-success.btn-outline {
  color: #5cb85c;
}
.btn-info.btn-outline {
  color: #5bc0de;
}
.btn-warning.btn-outline {
  color: #f0ad4e;
}
.btn-danger.btn-outline {
  color: #d9534f;
}
.btn-danger.btn-outline:hover,
.btn-info.btn-outline:hover,
.btn-primary.btn-outline:hover,
.btn-success.btn-outline:hover,
.btn-warning.btn-outline:hover {
  color: #fff;
}
.chat {
  margin: 0;
  padding: 0;
}
.chat li {
  margin-bottom: 10px;
  padding-bottom: 5px;
  border-bottom: 1px dotted #999;
}
.chat li.left .chat-body {
  margin-left: 60px;
}
.chat li.right .chat-body {
  margin-right: 60px;
}
.chat li .chat-body p {
  margin: 0;
}
.chat .glyphicon,
.panel .slidedown .glyphicon {
  margin-right: 5px;
}
.chat-panel .panel-body {
  height: 350px;
  overflow-y: scroll;
}
.login-panel {
  margin-top: 25%;
}
.flot-chart {
  height: 400px;
}
.flot-chart-content {
  width: 100%;
  height: 100%;
}
table.dataTable thead .sorting,
table.dataTable thead .sorting_asc,
table.dataTable thead .sorting_asc_disabled,
table.dataTable thead .sorting_desc,
table.dataTable thead .sorting_desc_disabled {
  background: 0 0;
}
table.dataTable thead .sorting_asc:after {
  content: "\f0de";
  float: right;
  font-family: fontawesome;
}
table.dataTable thead .sorting_desc:after {
  content: "\f0dd";
  float: right;
  font-family: fontawesome;
}
table.dataTable thead .sorting:after {
  content: "\f0dc";
  float: right;
  font-family: fontawesome;
  color: rgba(50, 50, 50, 0.5);
}
.btn-circle {
  width: 30px;
  height: 30px;
  padding: 6px 0;
  border-radius: 15px;
  text-align: center;
  font-size: 12px;
  line-height: 1.428571429;
}
.btn-circle.btn-lg {
  width: 50px;
  height: 50px;
  padding: 10px 16px;
  border-radius: 25px;
  font-size: 18px;
  line-height: 1.33;
}
.btn-circle.btn-xl {
  width: 70px;
  height: 70px;
  padding: 10px 16px;
  border-radius: 35px;
  font-size: 24px;
  line-height: 1.33;
}
.show-grid [class^="col-"] {
  padding-top: 10px;
  padding-bottom: 10px;
  border: 1px solid #ddd;
  background-color: #eee !important;
}
.show-grid {
  margin: 15px 0;
}
.huge {
  font-size: 40px;
}
.panel-green {
  border-color: #5cb85c;
}
.panel-green > .panel-heading {
  border-color: #5cb85c;
  color: #fff;
  background-color: #5cb85c;
}
.panel-green > a {
  color: #5cb85c;
}
.panel-green > a:hover {
  color: #3d8b3d;
}
.panel-red {
  border-color: #d9534f;
}
.panel-red > .panel-heading {
  border-color: #d9534f;
  color: #fff;
  background-color: #d9534f;
}
.panel-red > a {
  color: #d9534f;
}
.panel-red > a:hover {
  color: #b52b27;
}
.panel-yellow {
  border-color: #f0ad4e;
}
.panel-yellow > .panel-heading {
  border-color: #f0ad4e;
  color: #fff;
  background-color: #f0ad4e;
}
.panel-yellow > a {
  color: #f0ad4e;
}
.panel-yellow > a:hover {
  color: #df8a13;
}
</style>
