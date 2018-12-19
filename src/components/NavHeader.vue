<template>
  <nav class="navbar navbar-default navbar-static-top" role="navigation" style="margin-bottom: 0">
    <div class="navbar-header">
        <div>
          <a class="navbar-brand" style="font-size:250%; float: left">Heimdall-lite</a>
        </div>
    </div>

    <ul class="nav navbar-top-links navbar-left">
      <li class="dropdown">
        <a href="#" class="dropdown-toggle" data-toggle="dropdown" aria-expanded="false">
          <i class="fa fa-sitemap fa-fw"></i> Load Json
          <span class="fa arrow"></span>
        </a>
        <ul class="dropdown-menu">
            <li>
              <a href="#">
                <label class="btn btn-primary btn-file">
                    Browse<input id="file" type="file" accept=".json" name="file" style="width: 100%; height: 100%; display: none;" onchange="upload()">
                </label>
              </a>
            </li>
        </ul>
      </li>
    </ul>

   <button id="export-caat" type="button" class="btn btn-primary floating2" style="display:none;">Compliance Assessment/Audit Tracking (CAAT) Spreadsheet Download</button>

  </nav>
</template>

<script>
export default {
  name: 'NavHeader',
  props: {
  }
}
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
