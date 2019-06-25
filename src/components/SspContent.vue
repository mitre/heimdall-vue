<template>
  <b-card no-body class="mb-3">
    <b-card-header>
      <font-awesome-icon icon="stream"/> SSP Ready Control Implementation Details and Status
      <b-button class='btn btn-primary' v-on:click="expandAll" v-if="showExpand" id='expandButton'>Expand All</b-button>
      <b-button class='btn btn-primary' v-on:click="collapseAll" v-if="showCollapse" id='collapseButton'>Collapse All</b-button>
      <div v-bind:title="testBind"></div>
    </b-card-header>
    <b-card-body>
      <b-container>
        <h2>Compliance Level: {{compliance_level}}%</h2>
        <b-row>
          <b-col cols="4">
            <h4>Passed: {{passed}}</h4>
            <h4>Failed: {{failed}}</h4>
          </b-col>
          <b-col cols="4">
            <h4>Not Reviewed: {{not_reviewed}}</h4>
            <h4>Not Tested: {{profile_error}}</h4>
          </b-col>
          <b-col cols="4">
            <h4>Not Applicable: {{not_applicable}}</h4>
          </b-col>
        </b-row>
      </b-container>

      <b-container v-for="item in families" v-bind:data="item" v-bind:key="item.name">
        <a data-toggle="collapse" class="sspItem" aria-expanded="false" :href="'#' + item.name + '_div'"><h3>{{ item.name }}: {{ item.desc }}</h3></a>
        <div class="panel-collapse collapse" :id="item.name + '_div'" style="">
          <b-container v-for="subitem in item.items" v-bind:data="subitem" v-bind:key="subitem.name">
            <a data-toggle="collapse" class="sspItem" aria-expanded="false" :href="'#' + subitem.name + '_div'"><h4>{{ subitem.name }}</h4></a>
            <div class="panel-collapse collapse" :id="subitem.name + '_div'" style="">
              <b-container v-for="control in subitem.items" v-bind:data="control" v-bind:key="control.gid">
                <a data-toggle="collapse" class="sspItem" aria-expanded="false" :href="'#' + control.gid + '_div'"><h5><b-button :variant="control.status | variant">{{control.status}}</b-button> {{ control.rule_title }}</h5></a>
                <div class="panel-collapse collapse" :id="control.gid + '_div'" style="">
                  {{control.vuln_discuss}}
                  <h4>Check Text</h4> <pre>{{control.check_content}}</pre>
                  <h4>Fix Text</h4> <pre>{{control.fix_text}}</pre>
                </div>
              </b-container>
            </div>
          </b-container>
        </div>
      </b-container>
      <!--div id="sspList"></div-->
    </b-card-body>
  </b-card>
</template>

<script>
  import Vue from 'vue'
  import { store } from "../store.js";

  Vue.filter('variant', function (status) {
    var span = '';
    switch(status) {
      case 'Passed':
          span = 'success';
          break;
      case 'Failed':
          span = 'danger';
          break;
      case 'Not Reviewed':
          span = 'warning';
          break;
      case 'Not Applicable':
          span = 'primary';
          break;
      case 'Profile Error':
          span = 'info';
          break;
    }
    return span;
  });

  export default {
    name: '',
    data () {
      return {
        expand: true,
        status: store.getStatusHash(),
        families: store.getFilteredFamilies(),
        store,
      }
    },

    computed: {
      testBind: function() {
        return store.getBindValue();
      },
      showExpand: function() {
        return this.expand == true;
      },
      showCollapse: function() {
        return this.expand == false;
      },
      compliance_level: function () {
        return Math.round(store.getCompliance(), 1);
      },
      passed: function () {
        return this.count('Passed');
      },
      failed: function () {
        return this.count('Failed');
      },
      not_applicable: function () {
        return this.count('Not Applicable');
      },
      not_reviewed: function () {
        return this.count('Not Reviewed');
      },
      profile_error: function () {
        return this.count('Profile Error');
      }
    },

    updated: function () {
    },

    mounted: function mounted () {
    },

    methods: {
      count: function (name) {
        return this.status[name] || 0;
      },
      expandAll: function() {
        this.expand = false;
        var sspItems = document.getElementsByClassName('sspItem');
        for(var i = 0; i <  sspItems.length; i++) {
          if (sspItems[i].getAttribute('aria-expanded') == 'false') {
            sspItems[i].click();
          }
        }
      },
      collapseAll: function() {
        this.expand = true;
        var sspItems = document.getElementsByClassName('sspItem');
        for(var i = 0; i <  sspItems.length; i++) {
          if (sspItems[i].getAttribute('aria-expanded') == 'true') {
            sspItems[i].click();
          }
        }
      }
    }
  }
</script>
<style>
.list-group-item:first-child {
  margin-top: 5px;
  border-top-left-radius: .25rem;
  border-top-right-radius: .25rem;
}
pre {
    display: block;
    padding: 9.5px;
    margin: 0 0 10px;
    font-size: 13px;
    line-height: 1.42857143;
    color: #333;
    word-break: break-all;
    word-wrap: break-word;
    background-color: #f5f5f5;
    border: 1px solid #ccc;
    border-radius: 4px;
}
a:link {
  color: black;
  text-decoration: none;
}

a:visited {
  color: black;
  text-decoration: none;
}

a:hover {
  color: black;
  text-decoration: underline;
}

a:active {
  color: black;
  text-decoration: underline;
}
</style>
