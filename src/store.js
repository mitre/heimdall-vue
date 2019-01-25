export const store = {
  state: {
    status: [
      ['Not A Finding',  0],
      ['Open',           0],
      ['Not Applicable', 0],
      ['Not Reviewed',   0],
      ['Profile Error',  0]
    ],
    impact: [
      ['low',       0],
      ['medium',    0],
      ['high',      0],
      ['critical',  0]
    ],
    compliance: 0,
    status_filter: "none",
    impact_filter: "none",
    title: "",
    profile_name: "",
    version: "",
    controls: {},
  },
  reset() {
    store.controls = {},
    store.compliance = 0;
    store.status = [
      ['Not A Finding',  0],
      ['Open',           0],
      ['Not Applicable', 0],
      ['Not Reviewed',   0],
      ['Profile Error',  0]
    ];
    store.impact = [
      ['low',       0],
      ['medium',    0],
      ['high',      0],
      ['critical',  0]
    ];
    store.getStatus();
    store.getImpact();
    store.getCompliance();
    store.setStatusFilter("none");
    store.setImpactFilter("none");
  },
  parseFile(content, file_name) {
    for (var member in this.state.controls) delete this.state.controls[member];
    console.log("parseFile Status: " + this.state.status);
    console.log("parseFile Controls: " + this.state.controls.length);
    var json = JSON.parse(content);
    var profile_name, i, j;
    if (json.profiles == undefined) {
      profile_name = 'profile;' + json.name + ': ' + json.version;
      for (i = 0; i < json.controls.length; i++) {
        this.setControl(json.controls[i], profile_name);
      }
    }
    else {
      profile_name = 'result;' + file_name + ': ' + this.grab_start_time(json);
      for (i = 0; i < json.profiles.length; i++) {
        console.log("Parse " + json.profiles[i].controls.length + " controls");
        for (j = 0; j < json.profiles[i].controls.length; j++) {
          console.log("Parse control " + json.profiles[i].controls[j].id)
          this.setControl(json.profiles[i].controls[j], profile_name);
        }
      }
    }
    console.log("Parsed Controls: " + Object.keys(this.state.controls));
    this.setStatusFilter("");
    this.setImpactFilter("");
  },
  grab_start_time(json) {
    for (var i = 0; i < json.profiles.length; i++) {
      for (var j = 0; j < json.profiles[i].controls.length; j++) {
        if (json.profiles[i].controls[j] != {} && json.profiles[i].controls[j].results) {
          if (json.profiles[i].controls[j].results.length != 0) {
            return json.profiles[i].controls[j].results[0].start_time;
          }
        }
      }
    }
    return ''; // If no time was found, return empty string
  },
  setControl(control, profile_name) {
    var DATA_NOT_FOUND_MESSAGE = 'N/A';
    var data = {};
    var c_id = control.id;
    data[c_id] = {};
    data[c_id] = {};
    data[c_id].profile         = profile_name                                           || DATA_NOT_FOUND_MESSAGE;
    data[c_id].vuln_num        = control.id                                             || DATA_NOT_FOUND_MESSAGE;
    if (data[c_id].vuln_num.match(/\d+\.\d+/)) {
      data[c_id].vuln_num      = data[c_id].vuln_num.match(/\d+(\.\d+)*/)[0];
    }
    data[c_id].rule_title      = control.title                                                 || DATA_NOT_FOUND_MESSAGE;
    if (control.desc) {
      data[c_id].vuln_discuss  = control.desc.replace(new RegExp("\n", 'g'), '<br>')           || DATA_NOT_FOUND_MESSAGE;
    } else { data[c_id].vuln_discuss = DATA_NOT_FOUND_MESSAGE; }

    data[c_id].gid             = control.tags.gid                                              || DATA_NOT_FOUND_MESSAGE;
    data[c_id].group_title     = control.tags.gtitle                                           || DATA_NOT_FOUND_MESSAGE;
    data[c_id].rule_id         = control.tags.rid                                              || DATA_NOT_FOUND_MESSAGE;
    data[c_id].rule_ver        = control.tags.stig_id                                          || DATA_NOT_FOUND_MESSAGE;
    data[c_id].cci_ref         = control.tags.cci                                              || DATA_NOT_FOUND_MESSAGE;
    data[c_id].nist            = control.tags.nist                                             || ['unmapped'];
    if (control.tags.check) {
      data[c_id].check_content = control.tags.check.replace(new RegExp("\n", 'g'), '<br>')     || DATA_NOT_FOUND_MESSAGE;
    } else { data[c_id].check_content = DATA_NOT_FOUND_MESSAGE; }

    if (control.tags.fix) {
      data[c_id].fix_text      = control.tags.fix.replace(new RegExp("\n", 'g'), '<br>')       || DATA_NOT_FOUND_MESSAGE;
    } else { data[c_id].fix_text = DATA_NOT_FOUND_MESSAGE; }

    if (control.tags.rationale) {
      data[c_id].rationale     = control.tags.rationale.replace(new RegExp("\n", 'g'), '<br>') || DATA_NOT_FOUND_MESSAGE;
    } else { data[c_id].rationale = DATA_NOT_FOUND_MESSAGE; }

    data[c_id].cis_family      = control.tags.cis_family                                       || DATA_NOT_FOUND_MESSAGE;
    data[c_id].cis_rid         = control.tags.cis_rid                                          || DATA_NOT_FOUND_MESSAGE;
    data[c_id].cis_level       = control.tags.cis_level                                        || DATA_NOT_FOUND_MESSAGE;

    data[c_id].impact          = String(control.impact)                                        || DATA_NOT_FOUND_MESSAGE;
    data[c_id].severity        = this.compute_severity(control.impact)
    data[c_id].code            = String(control.code)                                          || DATA_NOT_FOUND_MESSAGE;

    data[c_id].status_list = [];
    data[c_id].message = '';

    if (parseFloat(data[c_id].impact) == 0) {
      data[c_id].message = data[c_id].vuln_discuss + "\n\n";
    }

    if (control.results) {
      // Concatenate all of the results messages
      control.results.forEach(function(result) {
        data[c_id].status_list.push(result.status);
        if (result.status == 'skipped') { data[c_id].message += 'SKIP -- ' + result.skip_message + '\n'; }
        if (result.status == 'failed')  { data[c_id].message += 'FAILED -- Test: ' + result.code_desc + '\nMessage: ' + result.message + '\n'; }
        if (result.status == 'passed')  { data[c_id].message += 'PASS -- ' + result.code_desc + '\n'; }
      });
    }

    data[c_id].status           = this.compute_status(data[c_id]);
    //data[c_id].finding_details  = clk_finding_details(data[c_id]);
    this.state.controls[c_id] = data[c_id];
  },
  includes(string, myArray) {
    for (var i = 0; i < myArray.length; i++) {
      if (myArray[i] == string) {
        return true;
      }
    }
    return false;
  },
  compute_severity(impact) {
    if (impact < 0.1) {
      return'none';
    } else if (impact < 0.4) {
      return 'low';
    } else if (impact < 0.7) {
      return 'medium';
    } else if (impact < 0.9) {
      return 'high';
    } else if (impact >= 0.9) {
      return 'critical';
    }
  },
  compute_status(control) {
    var status_list = control.status_list;
    if (parseFloat(control.impact) == 0) {
      return 'Not Applicable';
    } else if (this.includes('failed', status_list)) {
      return 'Open';
    } else if (this.includes('passed', status_list)) {
      return 'Not A Finding';
    } else if (this.includes('skipped', status_list)) {
      return 'Not Reviewed';
    } else {
      return 'Profile Error';
    }
  },
  getControl(control_id) {
    return this.state.controls[control_id];
  },
  getControls() {
    return this.state.controls;
  },
  setProfileName(name) {
    this.state.profile_name = name;
  },
  getProfileName() {
    return this.state.profile_name
  },
  getStatus() {
    var status_filter = this.getStatusFilter();
    var impact_filter = this.getImpactFilter();
    console.log("filters: " + status_filter + ", " + impact_filter);
    var statusHash = { 'Not A Finding':  0,
      'Open':           0,
      'Not Applicable': 0,
      'Not Reviewed':   0,
      'Profile Error':  0
    };
    var controls = this.getControls();
    for (var index in controls) {
      console.log("getStatus: " + index + ": " + controls[index].status + ", add to " + statusHash[controls[index].status]);
      if (status_filter == "" || status_filter == controls[index].status) {
        if (impact_filter == "" || impact_filter == controls[index].severity) {
          statusHash[controls[index].status] += 1;
          console.log("added " + statusHash[controls[index].status]);
        }
      }
    }
    for (var i = 0; i < this.state.status.length; i++) {
      console.log("Set " + this.state.status[i][0] + " to " + statusHash[this.state.status[i][0]]);
      this.state.status[i][1] = statusHash[this.state.status[i][0]];
    }
    console.log("status: " + this.state.status);
    this.setCompliance(statusHash['Not A Finding']/(statusHash['Not A Finding'] +
      statusHash['Open'] + statusHash['Not Reviewed'] + statusHash['Profile Error']) * 100)
    return this.state.status;
  },
  setStatus(val) {
    console.log("setStatus to : " + val);
    this.state.status = val;
    console.log("setStatus is: " + this.state.status);
  },
  getImpact() {
    var impact_filter = this.getImpactFilter();
    var status_filter = this.getStatusFilter();
    console.log("filters: " + status_filter + ", " + impact_filter);
    var impactHash = {
      'low':      0,
      'medium':   0,
      'high':     0,
      'critical': 0
    };
    var controls = this.getControls();
    for (var ind in controls) {
      console.log("getImpact: " + ind + ": " + controls[ind].severity + ", add to " + impactHash[controls[ind].severity]);
      if (status_filter == "" || status_filter == controls[ind].status) {
        if (impact_filter == "" || impact_filter == controls[ind].severity) {
          impactHash[controls[ind].severity] += 1;
          console.log("added " + impactHash[controls[ind].severity]);
        }
      }
    }
    for (var i = 0; i < this.state.impact.length; i++) {
      console.log("Set " + this.state.impact[i][0] + " to " + impactHash[this.state.impact[i][0]]);
      this.state.impact[i][1] = impactHash[this.state.impact[i][0]];
    }
    console.log("impact: " + this.state.impact);
    return this.state.impact;
  },
  getCompliance() {
    return [['Data', this.state.compliance]];
  },
  setCompliance(val) {
    console.log("setCompliance to : " + val);
    this.state.compliance = val;
  },
  getTitle() {
    return this.state.title;
  },
  setTitle(val) {
    console.log("setTitle to : " + val);
    this.state.title = val;
  },
  getStatusFilter() {
    return this.state.status_filter;
  },
  setStatusFilter(val) {
    console.log("setStatusFilter: " + val);
    this.state.status_filter = val;
  },
  getImpactFilter() {
    return this.state.impact_filter;
  },
  setImpactFilter(val) {
    console.log("setImpactFilter: " + val);
    this.state.impact_filter = val;
  },
};
