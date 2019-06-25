<template>
  <b-navbar toggleable="md" type="dark" variant="info">
    <b-navbar-toggle target="nav_collapse"></b-navbar-toggle>
    <b-navbar-brand href="#">Heimdall-lite</b-navbar-brand>
    <b-nav-form>
      <label class="text-reader">
        <text-reader @load="text = $event"></text-reader>
      </label>
    </b-nav-form>
    <b-navbar-nav>
      <b-nav-form v-if="showCaat">
        <div>
          <b-dropdown id="dropdown-1" text="Actions" class="m-2">
            <b-dropdown-item-button v-on:click="exportCaat">Export CAAT</b-dropdown-item-button>
            <b-dropdown-divider></b-dropdown-divider>
            <b-dropdown-item-button v-on:click="showSSP">Show SSP</b-dropdown-item-button>
            <b-dropdown-item-button v-on:click="showAbout">Show About</b-dropdown-item-button>
            <b-dropdown-item-button v-on:click="showResults">Show Results</b-dropdown-item-button>
            <b-dropdown-item-button disabled>Clear Results</b-dropdown-item-button>
          </b-dropdown>
        </div>
        <!--b-button v-on:click="exportCaat" size="sm" class="my-2 my-sm-0" type="button">CAAT</b-button-->
      </b-nav-form>
    </b-navbar-nav>
  </b-navbar>
</template>

<script>
import TextReader from "./FileReader";
import { store } from "../store.js";
import { saveAs } from 'file-saver';
import XLSX from 'xlsx';

export default {
  name: "app",
  data () {
    return {
      text: "",
      store
    }
  },
  components: {
    TextReader
  },
  computed: {
    showCaat() {
      return store.getTitle() != ""
    }
  },
  methods: {
    Comparator: function (a, b) {
      if (a[0] < b[0]) return -1;
      if (a[0] > b[0]) return 1;
      return 0;
    },
    showAbout: function() {
      store.setShowing('About');
    },
    showResults: function() {
      store.setShowing('Results');
    },
    showSSP: function() {
      store.setShowing('SSP');
    },
    exportCaat: function (event) {
      event.preventDefault();

      var caat = [];
      var vulnList = [];
      var controls = store.getControls()
      for (var ind in controls) {
        var control = controls[ind];
        var field = [];
        var family = 'UM-1'
        if (control.nist) {
          var fam_str = control.nist[0].split(' ')[0];
          var parts = fam_str.split('-');
          family = parts[0] + '-';
          if (parts[1].length == 1)
            family += '0'
          family += parts[1];
        }
        if (control.impact != 'none' && !vulnList.includes(control.gid)) {
          vulnList.push(control.gid)
          field.push(family);              // Control Number
          field.push(this.br2nl(control.rule_title));        // Finding Title
          field.push(this.convertDate(new Date(control.start_time),'/')); // Date Identified
          field.push('');                          // Finding ID
          field.push('');                          // Information System or Program Name
          field.push('');                          // Repeat Findings
          field.push('');                          // Repeat Finding CFACTS Weakness ID
          field.push(this.br2nl(control.rule_title));        // Finding Description
          field.push(this.br2nl(control.description));  // Weakness Description
          field.push('Security');                  // Control Weakness Type
          field.push('Self-Assessment ');          // Source
          field.push('InSpec');                    // Assessment/Audit Company
          field.push('Test');                      // Test Method
          field.push(this.br2nl(control.check_content)) ;       // Test Objective
          field.push(this.br2nl(control.message)); // Test Result Description
          var result = control.status == "Passed" ? 'Satisfied' : 'Other Than Satisfied';
          field.push(result);                      // Test Result
          field.push(this.br2nl(control.fix_text));          // Recommended Corrective Action(s)
          field.push('');                          // Effect on Business
          field.push('');                          // Likelihood
          field.push(control.severity)                       // Impact
          caat.push(field);
        }
      }
      caat = caat.sort(this.Comparator);
      caat.unshift(['Control Number','Finding Title','Date Identified','Finding ID','Information System or Program Name','Repeat Findings','Repeat Finding Weakness ID','Finding Description','Weakness Description','Control Weakness Type','Source','Assessment/Audit Company','Test Method','Test Objective','Test Result Description','Test Result','Recommended Corrective Action(s)','Effect on Business','Likelihood','Impact']);

      var wb = XLSX.utils.book_new();

      wb.Props = {
                Title: "Compliance Assessment/Audit Tracking (CAAT) Spreadsheet",
                Subject: "Assessment Data",
                Author: "Heimdall",
                CreatedDate: new Date()
      };

      wb.SheetNames.push("Assessment Data");

      var ws = XLSX.utils.aoa_to_sheet(caat);
      wb.Sheets["Assessment Data"] = ws;

      var wbout = XLSX.write(wb, {bookType:'xlsx',  type: 'binary'});
      saveAs(new Blob([this.s2ab(wbout)],{type:"application/octet-stream"}), 'CAAT-'+ this.convertDate(new Date(),'-')+ '.xlsx');
    },
    pad: function (s) {
      return (s < 10) ? '0' + s : s;
    },
    convertDate: function (inputFormat,delimiter) {
      var d = new Date(inputFormat);
      return [this.pad(d.getMonth()+1), this.pad(d.getDate()), d.getFullYear()].join(delimiter);
    },
    br2nl: function (str) {
      if (str == null)
        return 'Not Available';
      return str.replace(/<br ?\/?>/g, "\r\n").substring(0,32767);
    },
    s2ab: function (s) {
      var buf = new ArrayBuffer(s.length); //convert s to arrayBuffer
      var view = new Uint8Array(buf);  //create uint8array as viewer
      for (var i=0; i<s.length; i++) view[i] = s.charCodeAt(i) & 0xFF; //convert to octet
      return buf;
    }
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
