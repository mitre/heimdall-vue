export const store = {
  state: {
    status: [
      ['Passed',         0],
      ['Failed',         0],
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
    families: [
      ['UM', 'Unmapped', 1],
      ['AC', 'Access Control', 25],
      ['AU', 'Audit and Accountability', 16],
      ['AT', 'Awareness and Training', 5],
      ['CM', 'Configuration Management', 11],
      ['CP', 'Contingency Planning', 13],
      ['IA', 'Identification and Authentication', 11],
      ['IR', 'Incident Response', 10],
      ['MA', 'Maintenance', 6],
      ['MP', 'Media Protection', 8],
      ['PS', 'Personnel Security', 8],
      ['PE', 'Physical and Environmental Protection', 20],
      ['PL', 'Planning', 9],
      ['PM', 'Program Management', 16],
      ['RA', 'Risk Assessment', 6],
      ['CA', 'Security Assessment and Authorization', 9],
      ['SC', 'System and Communications Protection', 44],
      ['SI', 'System and Information Integrity', 17],
      ['SA', 'System and Services Acquisition', 22]
    ],
    compliance: 0,
    status_filter: "none",
    impact_filter: "none",
    search_term: "",
    title: "",
    profile_name: "",
    version: "",
    controls: {},
    nist_hsh: {},
    controls_hsh: {}
  },
  reset() {
    store.controls = {},
    store.compliance = 0;
    store.status = [
      ['Passed',         0],
      ['Failed',         0],
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
        for (j = 0; j < json.profiles[i].controls.length; j++) {
          this.setControl(json.profiles[i].controls[j], profile_name);
        }
      }
    }
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
        //console.log(control.id + ' status: ' + result.status + ', exception: ' + result.exception);
        if (result.bactrace != undefined) {
          result.status = 'error';
          //console.log("set status = " + result.status);
        }
        data[c_id].status_list.push(result.status);
        //console.log("status_list = " + data[c_id].status_list);
        if (result.status == 'skipped') { data[c_id].message += 'SKIPPED -- ' + result.skip_message + '\n'; }
        if (result.status == 'failed')  { data[c_id].message += 'FAILED -- Test: ' + result.code_desc + '\nMessage: ' + result.message + '\n'; }
        if (result.status == 'passed')  { data[c_id].message += 'PASSED -- ' + result.code_desc + '\n'; }
        if (result.status == 'error')  { data[c_id].message += 'ERROR -- Test: ' + result.code_desc + '\nMessage: ' + result.message + '\n'; }
        if (result.exception != undefined) {
          data[c_id].message += 'Exception: ' + result.exception + '\n';
        }
      });
    }

    data[c_id].status = this.compute_status(data[c_id]);
    //console.log(c_id + " status: status_list = " + data[c_id].status);

    data[c_id].finding_details  = this.get_finding_details(data[c_id]);
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
    //console.log("compute_status: status_list = " + status_list);
    if (this.includes('error', status_list)) {
      return 'Profile Error';
    } else {
      if (parseFloat(control.impact) == 0) {
        return 'Not Applicable';
      } else if (this.includes('failed', status_list)) {
        return 'Failed';
      } else if (this.includes('passed', status_list)) {
        return 'Passed';
      } else if (this.includes('skipped', status_list)) {
        return 'Not Reviewed';
      } else {
        return 'Profile Error';
      }
    }
  },
  get_finding_details(control) {
    var result = '';
    if (control.status == 'Failed') { result = 'One or more of the automated tests failed or was inconclusive for the control \n\n ' + control.message; }
    if (control.status == 'Passed') { result = 'All Automated tests passed for the control \n\n ' + control.message; }
    if (control.status == 'Not Reviewed') { result = 'Automated test skipped due to known accepted condition in the control : \n\n' + control.message; }
    if (control.status == 'Not Applicable') { result = 'Justification: \n\n' + control.message + '\n'; }
    if (control.status == 'Profile Error') {
      if (control.message) {
        result = 'Exception: \n\n' + control.message + '\n';
      } else {
        result = 'No test available for this control';
      }
    }
    return result;
  },
  getControl(control_id) {
    return this.state.controls[control_id];
  },
  getControls() {
    var impact_filter = this.getImpactFilter();
    var status_filter = this.getStatusFilter();
    var controls = this.state.controls;
    var ctls = []
    for (var ind in controls) {
      if (status_filter == "" || status_filter == controls[ind].status) {
        if (impact_filter == "" || impact_filter == controls[ind].severity) {
          ctls.push(controls[ind]);
        }
      }
    }
    let search = this.getSearchTerm();
    if (search == "") {
      return ctls;
    } else {
      return ctls.filter(function (ctl) {
        return ctl.gid.toLowerCase().indexOf(search) !== -1 ||
          ctl.rule_title.toLowerCase().indexOf(search) !== -1 ||
          ctl.severity.toLowerCase().indexOf(search) !== -1 ||
          ctl.status.toLowerCase().indexOf(search) !== -1 ||
          ctl.finding_details.toLowerCase().indexOf(search) !== -1 ||
          ctl.code.toLowerCase().indexOf(search) !== -1
      })
    }
  },
  setProfileName(name) {
    this.state.profile_name = name;
  },
  getProfileName() {
    return this.state.profile_name
  },
  getStatus() {
    var statusHash = { 'Passed':  0,
      'Failed':           0,
      'Not Applicable': 0,
      'Not Reviewed':   0,
      'Profile Error':  0
    };
    var controls = this.getControls();
    for (var index in controls) {
      statusHash[controls[index].status] += 1;
    }
    for (var i = 0; i < this.state.status.length; i++) {
      this.state.status[i][1] = statusHash[this.state.status[i][0]];
    }
    this.setCompliance(statusHash['Passed']/(statusHash['Passed'] +
      statusHash['Failed'] + statusHash['Not Reviewed'] + statusHash['Profile Error']) * 100)
    return this.state.status;
  },
  setStatus(val) {
    this.state.status = val;
  },
  getImpact() {
    var impactHash = {
      'low':      0,
      'medium':   0,
      'high':     0,
      'critical': 0
    };
    var controls = this.getControls();
    for (var ind in controls) {
      impactHash[controls[ind].severity] += 1;
    }
    for (var i = 0; i < this.state.impact.length; i++) {
      this.state.impact[i][1] = impactHash[this.state.impact[i][0]];
    }
    return this.state.impact;
  },
  getCompliance() {
    return [['Data', this.state.compliance]];
  },
  setCompliance(val) {
    this.state.compliance = val;
  },
  getTitle() {
    return this.state.title;
  },
  setTitle(val) {
    this.state.title = val;
  },
  getStatusFilter() {
    return this.state.status_filter;
  },
  setStatusFilter(val) {
    this.state.status_filter = val;
  },
  getImpactFilter() {
    return this.state.impact_filter;
  },
  setImpactFilter(val) {
    this.state.impact_filter = val;
  },
  getSearchTerm() {
    return this.state.search_term;
  },
  setSearchTerm(val) {
    this.state.search_term = val;
  },
  setNistHash() {
    console.log("setNistHash");
    var hsh = {'name': 'NIST SP 800-53', 'children': []}
    for (var i = 0; i < this.state.families.length; i++) {
      var fam = this.state.families[i];
      var fam_hsh = {'name': fam[0], 'desc': fam[1], 'count': 0, 'children': []};
      for (var j = 0; j < fam[2]; j++) {
        var name = fam[0] + '-' + (j+1);
        var nist_hsh = {'name': name, 'count': 0, 'value': 1};
        fam_hsh['children'].push(nist_hsh);
        this.state.controls_hsh[name] = [];
      }
      hsh['children'].push(fam_hsh)
    }
    this.state.nist_hsh = hsh;
  },
  getNistHash() {
    if (this.state.nist_hsh.length == undefined) {
      this.setNistHash();
    }
    var hsh = this.state.nist_hsh;
    var ctls_hsh = this.state.controls_hsh;
    var controls = this.getControls()
    for (var index in controls) {
      if (controls[index].nist) {
        var nists = controls[index].nist;
        for (var i = 0; i < nists.length; i++) {
          var tag = nists[i].split(' ')[0];
          if (tag in ctls_hsh) {
            ctls_hsh[tag].push(controls[index]);
          }
        }
      } else {
        ctls_hsh['UM-1'].push(controls[index]);
      }
    }
    for (var j = 0; j < hsh['children'].length; j++) {
      var fam_count = 0;
      var fam_status = [];
      for (var k = 0; k < hsh['children'][j]['children'].length; k++) {
        var obj = hsh['children'][j]['children'][k];
        if (obj['name'] in ctls_hsh) {
          //console.log("For " + obj['name']);
          var children = [];
          var ctl_status = [];
          for (var l = 0; l < ctls_hsh[obj['name']].length; l++) {
            ctl_status.push(ctls_hsh[obj['name']][l].status);
            var fam_hsh = {'name': ctls_hsh[obj['name']][l].gid, status: ctls_hsh[obj['name']][l].status, 'value': 1};
            //console.log("Push " + ctls_hsh[obj['name']][l].gid);
            children.push(fam_hsh);
          }
          hsh['children'][j]['children'][k]['children'] = children;
          hsh['children'][j]['children'][k]['count'] = ctls_hsh[obj['name']].length;
          fam_count += ctls_hsh[obj['name']].length;
          hsh['children'][j]['children'][k]['status'] = this.getStatusValue(ctl_status);
          fam_status.push(hsh['children'][j]['children'][k]['status']);
        }
      }
      hsh['children'][j]['count'] = fam_count;
      hsh['children'][j]['status'] = this.getStatusValue(fam_status);
    }
    return hsh;
  },
  getStatusValue(status_Ary) {
    var fam_status = 'Empty';
    if (status_Ary.includes('Failed')) {
      fam_status = 'Failed'
    } else if (status_Ary.includes('Profile Error')) {
      fam_status = 'Profile Error'
    } else if (status_Ary.includes('Not Reviewed')) {
      fam_status = 'Not Reviewed'
    } else if (status_Ary.includes('Passed')) {
      fam_status = 'Passed'
    } else if (status_Ary.includes('Not Applicable')) {
      fam_status = 'Not Applicable'
    }
    return fam_status;
  },
  getNist80053() {
    var nist = {
      "name": "NIST SP 800-53",
      "children": [
        {
          "name": "UM",
          "desc": "Unmapped",
          "children": [
            {
              "name": "UM-1",
              "value": 1
            }
          ]
        },
        {
          "name": "AC",
          "desc": "Access Control",
          "children": [
            {
              "name": "AC-1",
              "value": 1
            },
            {
              "name": "AC-2",
              "value": 1
            },
            {
              "name": "AC-3",
              "value": 1
            },
            {
              "name": "AC-4",
              "value": 1
            },
            {
              "name": "AC-5",
              "value": 1
            },
            {
              "name": "AC-6",
              "value": 1
            },
            {
              "name": "AC-7",
              "value": 1
            },
            {
              "name": "AC-8",
              "value": 1
            },
            {
              "name": "AC-9",
              "value": 1
            },
            {
              "name": "AC-10",
              "value": 1
            },
            {
              "name": "AC-11",
              "value": 1
            },
            {
              "name": "AC-12",
              "value": 1
            },
            {
              "name": "AC-13",
              "value": 1
            },
            {
              "name": "AC-14",
              "value": 1
            },
            {
              "name": "AC-15",
              "value": 1
            },
            {
              "name": "AC-16",
              "value": 1
            },
            {
              "name": "AC-17",
              "value": 1
            },
            {
              "name": "AC-18",
              "value": 1
            },
            {
              "name": "AC-19",
              "value": 1
            },
            {
              "name": "AC-20",
              "value": 1
            },
            {
              "name": "AC-21",
              "value": 1
            },
            {
              "name": "AC-22",
              "value": 1
            },
            {
              "name": "AC-23",
              "value": 1
            },
            {
              "name": "AC-24",
              "value": 1
            },
            {
              "name": "AC-25",
              "value": 1
            }
          ]
        },
        {
          "name": "AU",
          "desc": "Audit and Accountability",
          "children": [
            {
              "name": "AU-1",
              "value": 1
            },
            {
              "name": "AU-2",
              "value": 1
            },
            {
              "name": "AU-3",
              "value": 1
            },
            {
              "name": "AU-4",
              "value": 1
            },
            {
              "name": "AU-5",
              "value": 1
            },
            {
              "name": "AU-6",
              "value": 1
            },
            {
              "name": "AU-7",
              "value": 1
            },
            {
              "name": "AU-8",
              "value": 1
            },
            {
              "name": "AU-9",
              "value": 1
            },
            {
              "name": "AU-10",
              "value": 1
            },
            {
              "name": "AU-11",
              "value": 1
            },
            {
              "name": "AU-12",
              "value": 1
            },
            {
              "name": "AU-13",
              "value": 1
            },
            {
              "name": "AU-14",
              "value": 1
            },
            {
              "name": "AU-15",
              "value": 1
            },
            {
              "name": "AU-16",
              "value": 1
            }
          ]
        },
        {
          "name": "AT",
          "desc": "Awareness and Training",
          "children": [
            {
              "name": "AT-1",
              "value": 1
            },
            {
              "name": "AT-2",
              "value": 1
            },
            {
              "name": "AT-3",
              "value": 1
            },
            {
              "name": "AT-4",
              "value": 1
            },
            {
              "name": "AT-5",
              "value": 1
            }
          ]
        },
        {
          "name": "CM",
          "desc": "Configuration Management",
          "children": [
            {
              "name": "CM-1",
              "value": 1
            },
            {
              "name": "CM-2",
              "value": 1
            },
            {
              "name": "CM-3",
              "value": 1
            },
            {
              "name": "CM-4",
              "value": 1
            },
            {
              "name": "CM-5",
              "value": 1
            },
            {
              "name": "CM-6",
              "value": 1
            },
            {
              "name": "CM-7",
              "value": 1
            },
            {
              "name": "CM-8",
              "value": 1
            },
            {
              "name": "CM-9",
              "value": 1
            },
            {
              "name": "CM-10",
              "value": 1
            },
            {
              "name": "CM-11",
              "value": 1
            }
          ]
        },
        {
          "name": "CP",
          "desc": "Contingency Planning",
          "children": [
            {
              "name": "CP-1",
              "value": 1
            },
            {
              "name": "CP-2",
              "value": 1
            },
            {
              "name": "CP-3",
              "value": 1
            },
            {
              "name": "CP-4",
              "value": 1
            },
            {
              "name": "CP-5",
              "value": 1
            },
            {
              "name": "CP-6",
              "value": 1
            },
            {
              "name": "CP-7",
              "value": 1
            },
            {
              "name": "CP-8",
              "value": 1
            },
            {
              "name": "CP-9",
              "value": 1
            },
            {
              "name": "CP-10",
              "value": 1
            },
            {
              "name": "CP-11",
              "value": 1
            },
            {
              "name": "CP-12",
              "value": 1
            },
            {
              "name": "CP-13",
              "value": 1
            }
          ]
        },
        {
          "name": "IA",
          "desc": "Identification and Authentication",
          "children": [
            {
              "name": "IA-1",
              "value": 1
            },
            {
              "name": "IA-2",
              "value": 1
            },
            {
              "name": "IA-3",
              "value": 1
            },
            {
              "name": "IA-4",
              "value": 1
            },
            {
              "name": "IA-5",
              "value": 1
            },
            {
              "name": "IA-6",
              "value": 1
            },
            {
              "name": "IA-7",
              "value": 1
            },
            {
              "name": "IA-8",
              "value": 1
            },
            {
              "name": "IA-9",
              "value": 1
            },
            {
              "name": "IA-10",
              "value": 1
            },
            {
              "name": "IA-11",
              "value": 1
            }
          ]
        },
        {
          "name": "IR",
          "desc": "Incident Response",
          "children": [
            {
              "name": "IR-1",
              "value": 1
            },
            {
              "name": "IR-2",
              "value": 1
            },
            {
              "name": "IR-3",
              "value": 1
            },
            {
              "name": "IR-4",
              "value": 1
            },
            {
              "name": "IR-5",
              "value": 1
            },
            {
              "name": "IR-6",
              "value": 1
            },
            {
              "name": "IR-7",
              "value": 1
            },
            {
              "name": "IR-8",
              "value": 1
            },
            {
              "name": "IR-9",
              "value": 1
            },
            {
              "name": "IR-10",
              "value": 1
            }
          ]
        },
        {
          "name": "MA",
          "desc": "Maintenance",
          "children": [
            {
              "name": "MA-1",
              "value": 1
            },
            {
              "name": "MA-2",
              "value": 1
            },
            {
              "name": "MA-3",
              "value": 1
            },
            {
              "name": "MA-4",
              "value": 1
            },
            {
              "name": "MA-5",
              "value": 1
            },
            {
              "name": "MA-6",
              "value": 1
            }
          ]
        },
        {
          "name": "MP",
          "desc": "Media Protection",
          "children": [
            {
              "name": "MP-1",
              "value": 1
            },
            {
              "name": "MP-2",
              "value": 1
            },
            {
              "name": "MP-3",
              "value": 1
            },
            {
              "name": "MP-4",
              "value": 1
            },
            {
              "name": "MP-5",
              "value": 1
            },
            {
              "name": "MP-6",
              "value": 1
            },
            {
              "name": "MP-7",
              "value": 1
            },
            {
              "name": "MP-8",
              "value": 1
            }
          ]
        },
        {
          "name": "PS",
          "desc": "Personnel Security",
          "children": [
            {
              "name": "PS-1",
              "value": 1
            },
            {
              "name": "PS-2",
              "value": 1
            },
            {
              "name": "PS-3",
              "value": 1
            },
            {
              "name": "PS-4",
              "value": 1
            },
            {
              "name": "PS-5",
              "value": 1
            },
            {
              "name": "PS-6",
              "value": 1
            },
            {
              "name": "PS-7",
              "value": 1
            },
            {
              "name": "PS-8",
              "value": 1
            }
          ]
        },
        {
          "name": "PE",
          "desc": "Physical and Environmental Protection",
          "children": [
            {
              "name": "PE-1",
              "value": 1
            },
            {
              "name": "PE-2",
              "value": 1
            },
            {
              "name": "PE-3",
              "value": 1
            },
            {
              "name": "PE-4",
              "value": 1
            },
            {
              "name": "PE-5",
              "value": 1
            },
            {
              "name": "PE-6",
              "value": 1
            },
            {
              "name": "PE-7",
              "value": 1
            },
            {
              "name": "PE-8",
              "value": 1
            },
            {
              "name": "PE-9",
              "value": 1
            },
            {
              "name": "PE-10",
              "value": 1
            },
            {
              "name": "PE-11",
              "value": 1
            },
            {
              "name": "PE-12",
              "value": 1
            },
            {
              "name": "PE-13",
              "value": 1
            },
            {
              "name": "PE-14",
              "value": 1
            },
            {
              "name": "PE-15",
              "value": 1
            },
            {
              "name": "PE-16",
              "value": 1
            },
            {
              "name": "PE-17",
              "value": 1
            },
            {
              "name": "PE-18",
              "value": 1
            },
            {
              "name": "PE-19",
              "value": 1
            },
            {
              "name": "PE-20",
              "value": 1
            }
          ]
        },
        {
          "name": "PL",
          "desc": "Planning",
          "children": [
            {
              "name": "PL-1",
              "value": 1
            },
            {
              "name": "PL-2",
              "value": 1
            },
            {
              "name": "PL-3",
              "value": 1
            },
            {
              "name": "PL-4",
              "value": 1
            },
            {
              "name": "PL-5",
              "value": 1
            },
            {
              "name": "PL-6",
              "value": 1
            },
            {
              "name": "PL-7",
              "value": 1
            },
            {
              "name": "PL-8",
              "value": 1
            },
            {
              "name": "PL-9",
              "value": 1
            }
          ]
        },
        {
          "name": "PM",
          "desc": "Program Management",
          "children": [
            {
              "name": "PM-1",
              "value": 1
            },
            {
              "name": "PM-2",
              "value": 1
            },
            {
              "name": "PM-3",
              "value": 1
            },
            {
              "name": "PM-4",
              "value": 1
            },
            {
              "name": "PM-5",
              "value": 1
            },
            {
              "name": "PM-6",
              "value": 1
            },
            {
              "name": "PM-7",
              "value": 1
            },
            {
              "name": "PM-8",
              "value": 1
            },
            {
              "name": "PM-9",
              "value": 1
            },
            {
              "name": "PM-10",
              "value": 1
            },
            {
              "name": "PM-11",
              "value": 1
            },
            {
              "name": "PM-12",
              "value": 1
            },
            {
              "name": "PM-13",
              "value": 1
            },
            {
              "name": "PM-14",
              "value": 1
            },
            {
              "name": "PM-15",
              "value": 1
            },
            {
              "name": "PM-16",
              "value": 1
            }
          ]
        },
        {
          "name": "RA",
          "desc": "Risk Assessment",
          "children": [
            {
              "name": "RA-1",
              "value": 1
            },
            {
              "name": "RA-2",
              "value": 1
            },
            {
              "name": "RA-3",
              "value": 1
            },
            {
              "name": "RA-4",
              "value": 1
            },
            {
              "name": "RA-5",
              "value": 1
            },
            {
              "name": "RA-6",
              "value": 1
            }
          ]
        },
        {
          "name": "CA",
          "desc": "Security Assessment and Authorization",
          "children": [
            {
              "name": "CA-1",
              "value": 1
            },
            {
              "name": "CA-2",
              "value": 1
            },
            {
              "name": "CA-3",
              "value": 1
            },
            {
              "name": "CA-4",
              "value": 1
            },
            {
              "name": "CA-5",
              "value": 1
            },
            {
              "name": "CA-6",
              "value": 1
            },
            {
              "name": "CA-7",
              "value": 1
            },
            {
              "name": "CA-8",
              "value": 1
            },
            {
              "name": "CA-9",
              "value": 1
            }
          ]
        },
        {
          "name": "SC",
          "desc": "System and Communications Protection",
          "children": [
            {
              "name": "SC-1",
              "value": 1
            },
            {
              "name": "SC-2",
              "value": 1
            },
            {
              "name": "SC-3",
              "value": 1
            },
            {
              "name": "SC-4",
              "value": 1
            },
            {
              "name": "SC-5",
              "value": 1
            },
            {
              "name": "SC-6",
              "value": 1
            },
            {
              "name": "SC-7",
              "value": 1
            },
            {
              "name": "SC-8",
              "value": 1
            },
            {
              "name": "SC-9",
              "value": 1
            },
            {
              "name": "SC-10",
              "value": 1
            },
            {
              "name": "SC-11",
              "value": 1
            },
            {
              "name": "SC-12",
              "value": 1
            },
            {
              "name": "SC-13",
              "value": 1
            },
            {
              "name": "SC-14",
              "value": 1
            },
            {
              "name": "SC-15",
              "value": 1
            },
            {
              "name": "SC-16",
              "value": 1
            },
            {
              "name": "SC-17",
              "value": 1
            },
            {
              "name": "SC-18",
              "value": 1
            },
            {
              "name": "SC-19",
              "value": 1
            },
            {
              "name": "SC-20",
              "value": 1
            },
            {
              "name": "SC-21",
              "value": 1
            },
            {
              "name": "SC-22",
              "value": 1
            },
            {
              "name": "SC-23",
              "value": 1
            },
            {
              "name": "SC-24",
              "value": 1
            },
            {
              "name": "SC-25",
              "value": 1
            },
            {
              "name": "SC-26",
              "value": 1
            },
            {
              "name": "SC-27",
              "value": 1
            },
            {
              "name": "SC-28",
              "value": 1
            },
            {
              "name": "SC-29",
              "value": 1
            },
            {
              "name": "SC-30",
              "value": 1
            },
            {
              "name": "SC-31",
              "value": 1
            },
            {
              "name": "SC-32",
              "value": 1
            },
            {
              "name": "SC-33",
              "value": 1
            },
            {
              "name": "SC-34",
              "value": 1
            },
            {
              "name": "SC-35",
              "value": 1
            },
            {
              "name": "SC-36",
              "value": 1
            },
            {
              "name": "SC-37",
              "value": 1
            },
            {
              "name": "SC-38",
              "value": 1
            },
            {
              "name": "SC-39",
              "value": 1
            },
            {
              "name": "SC-40",
              "value": 1
            },
            {
              "name": "SC-41",
              "value": 1
            },
            {
              "name": "SC-42",
              "value": 1
            },
            {
              "name": "SC-43",
              "value": 1
            },
            {
              "name": "SC-44",
              "value": 1
            }
          ]
        },
        {
          "name": "SI",
          "desc": "System and Information Integrity",
          "children": [
            {
              "name": "SI-1",
              "value": 1
            },
            {
              "name": "SI-2",
              "value": 1
            },
            {
              "name": "SI-3",
              "value": 1
            },
            {
              "name": "SI-4",
              "value": 1
            },
            {
              "name": "SI-5",
              "value": 1
            },
            {
              "name": "SI-6",
              "value": 1
            },
            {
              "name": "SI-7",
              "value": 1
            },
            {
              "name": "SI-8",
              "value": 1
            },
            {
              "name": "SI-9",
              "value": 1
            },
            {
              "name": "SI-10",
              "value": 1
            },
            {
              "name": "SI-11",
              "value": 1
            },
            {
              "name": "SI-12",
              "value": 1
            },
            {
              "name": "SI-13",
              "value": 1
            },
            {
              "name": "SI-14",
              "value": 1
            },
            {
              "name": "SI-15",
              "value": 1
            },
            {
              "name": "SI-16",
              "value": 1
            },
            {
              "name": "SI-17",
              "value": 1
            }
          ]
        },
        {
          "name": "SA",
          "desc": "System and Services Acquisition",
          "children": [
            {
              "name": "SA-1",
              "value": 1
            },
            {
              "name": "SA-2",
              "value": 1
            },
            {
              "name": "SA-3",
              "value": 1
            },
            {
              "name": "SA-4",
              "value": 1
            },
            {
              "name": "SA-5",
              "value": 1
            },
            {
              "name": "SA-6",
              "value": 1
            },
            {
              "name": "SA-7",
              "value": 1
            },
            {
              "name": "SA-8",
              "value": 1
            },
            {
              "name": "SA-9",
              "value": 1
            },
            {
              "name": "SA-10",
              "value": 1
            },
            {
              "name": "SA-11",
              "value": 1
            },
            {
              "name": "SA-12",
              "value": 1
            },
            {
              "name": "SA-13",
              "value": 1
            },
            {
              "name": "SA-14",
              "value": 1
            },
            {
              "name": "SA-15",
              "value": 1
            },
            {
              "name": "SA-16",
              "value": 1
            },
            {
              "name": "SA-17",
              "value": 1
            },
            {
              "name": "SA-18",
              "value": 1
            },
            {
              "name": "SA-19",
              "value": 1
            },
            {
              "name": "SA-20",
              "value": 1
            },
            {
              "name": "SA-21",
              "value": 1
            },
            {
              "name": "SA-22",
              "value": 1
            }
          ]
        }
      ]
    }
    return nist
  },
  getNist() {
    var nist = {
     "name": "flare",
     "children": [
      {
       "name": "analytics",
       "children": [
        {
         "name": "cluster",
         "children": [
          {"name": "AgglomerativeCluster", "value": 3938},
          {"name": "CommunityStructure", "value": 3812},
          {"name": "HierarchicalCluster", "value": 6714},
          {"name": "MergeEdge", "value": 743}
         ]
        },
        {
         "name": "graph",
         "children": [
          {"name": "BetweennessCentrality", "value": 3534},
          {"name": "LinkDistance", "value": 5731},
          {"name": "MaxFlowMinCut", "value": 7840},
          {"name": "ShortestPaths", "value": 5914},
          {"name": "SpanningTree", "value": 3416}
         ]
        },
        {
         "name": "optimization",
         "children": [
          {"name": "AspectRatioBanker", "value": 7074}
         ]
        }
       ]
      },
      {
       "name": "animate",
       "children": [
        {"name": "Easing", "value": 17010},
        {"name": "FunctionSequence", "value": 5842},
        {
         "name": "interpolate",
         "children": [
          {"name": "ArrayInterpolator", "value": 1983},
          {"name": "ColorInterpolator", "value": 2047},
          {"name": "DateInterpolator", "value": 1375},
          {"name": "Interpolator", "value": 8746},
          {"name": "MatrixInterpolator", "value": 2202},
          {"name": "NumberInterpolator", "value": 1382},
          {"name": "ObjectInterpolator", "value": 1629},
          {"name": "PointInterpolator", "value": 1675},
          {"name": "RectangleInterpolator", "value": 2042}
         ]
        },
        {"name": "ISchedulable", "value": 1041},
        {"name": "Parallel", "value": 5176},
        {"name": "Pause", "value": 449},
        {"name": "Scheduler", "value": 5593},
        {"name": "Sequence", "value": 5534},
        {"name": "Transition", "value": 9201},
        {"name": "Transitioner", "value": 19975},
        {"name": "TransitionEvent", "value": 1116},
        {"name": "Tween", "value": 6006}
       ]
      },
      {
       "name": "data",
       "children": [
        {
         "name": "converters",
         "children": [
          {"name": "Converters", "value": 721},
          {"name": "DelimitedTextConverter", "value": 4294},
          {"name": "GraphMLConverter", "value": 9800},
          {"name": "IDataConverter", "value": 1314},
          {"name": "JSONConverter", "value": 2220}
         ]
        },
        {"name": "DataField", "value": 1759},
        {"name": "DataSchema", "value": 2165},
        {"name": "DataSet", "value": 586},
        {"name": "DataSource", "value": 3331},
        {"name": "DataTable", "value": 772},
        {"name": "DataUtil", "value": 3322}
       ]
      },
      {
       "name": "display",
       "children": [
        {"name": "DirtySprite", "value": 8833},
        {"name": "LineSprite", "value": 1732},
        {"name": "RectSprite", "value": 3623},
        {"name": "TextSprite", "value": 10066}
       ]
      },
      {
       "name": "flex",
       "children": [
        {"name": "FlareVis", "value": 4116}
       ]
      },
      {
       "name": "physics",
       "children": [
        {"name": "DragForce", "value": 1082},
        {"name": "GravityForce", "value": 1336},
        {"name": "IForce", "value": 319},
        {"name": "NBodyForce", "value": 10498},
        {"name": "Particle", "value": 2822},
        {"name": "Simulation", "value": 9983},
        {"name": "Spring", "value": 2213},
        {"name": "SpringForce", "value": 1681}
       ]
      },
      {
       "name": "query",
       "children": [
        {"name": "AggregateExpression", "value": 1616},
        {"name": "And", "value": 1027},
        {"name": "Arithmetic", "value": 3891},
        {"name": "Average", "value": 891},
        {"name": "BinaryExpression", "value": 2893},
        {"name": "Comparison", "value": 5103},
        {"name": "CompositeExpression", "value": 3677},
        {"name": "Count", "value": 781},
        {"name": "DateUtil", "value": 4141},
        {"name": "Distinct", "value": 933},
        {"name": "Expression", "value": 5130},
        {"name": "ExpressionIterator", "value": 3617},
        {"name": "Fn", "value": 3240},
        {"name": "If", "value": 2732},
        {"name": "IsA", "value": 2039},
        {"name": "Literal", "value": 1214},
        {"name": "Match", "value": 3748},
        {"name": "Maximum", "value": 843},
        {
         "name": "methods",
         "children": [
          {"name": "add", "value": 593},
          {"name": "and", "value": 330},
          {"name": "average", "value": 287},
          {"name": "count", "value": 277},
          {"name": "distinct", "value": 292},
          {"name": "div", "value": 595},
          {"name": "eq", "value": 594},
          {"name": "fn", "value": 460},
          {"name": "gt", "value": 603},
          {"name": "gte", "value": 625},
          {"name": "iff", "value": 748},
          {"name": "isa", "value": 461},
          {"name": "lt", "value": 597},
          {"name": "lte", "value": 619},
          {"name": "max", "value": 283},
          {"name": "min", "value": 283},
          {"name": "mod", "value": 591},
          {"name": "mul", "value": 603},
          {"name": "neq", "value": 599},
          {"name": "not", "value": 386},
          {"name": "or", "value": 323},
          {"name": "orderby", "value": 307},
          {"name": "range", "value": 772},
          {"name": "select", "value": 296},
          {"name": "stddev", "value": 363},
          {"name": "sub", "value": 600},
          {"name": "sum", "value": 280},
          {"name": "update", "value": 307},
          {"name": "variance", "value": 335},
          {"name": "where", "value": 299},
          {"name": "xor", "value": 354},
          {"name": "_", "value": 264}
         ]
        },
        {"name": "Minimum", "value": 843},
        {"name": "Not", "value": 1554},
        {"name": "Or", "value": 970},
        {"name": "Query", "value": 13896},
        {"name": "Range", "value": 1594},
        {"name": "StringUtil", "value": 4130},
        {"name": "Sum", "value": 791},
        {"name": "Variable", "value": 1124},
        {"name": "Variance", "value": 1876},
        {"name": "Xor", "value": 1101}
       ]
      },
      {
       "name": "scale",
       "children": [
        {"name": "IScaleMap", "value": 2105},
        {"name": "LinearScale", "value": 1316},
        {"name": "LogScale", "value": 3151},
        {"name": "OrdinalScale", "value": 3770},
        {"name": "QuantileScale", "value": 2435},
        {"name": "QuantitativeScale", "value": 4839},
        {"name": "RootScale", "value": 1756},
        {"name": "Scale", "value": 4268},
        {"name": "ScaleType", "value": 1821},
        {"name": "TimeScale", "value": 5833}
       ]
      },
      {
       "name": "util",
       "children": [
        {"name": "Arrays", "value": 8258},
        {"name": "Colors", "value": 10001},
        {"name": "Dates", "value": 8217},
        {"name": "Displays", "value": 12555},
        {"name": "Filter", "value": 2324},
        {"name": "Geometry", "value": 10993},
        {
         "name": "heap",
         "children": [
          {"name": "FibonacciHeap", "value": 9354},
          {"name": "HeapNode", "value": 1233}
         ]
        },
        {"name": "IEvaluable", "value": 335},
        {"name": "IPredicate", "value": 383},
        {"name": "IValueProxy", "value": 874},
        {
         "name": "math",
         "children": [
          {"name": "DenseMatrix", "value": 3165},
          {"name": "IMatrix", "value": 2815},
          {"name": "SparseMatrix", "value": 3366}
         ]
        },
        {"name": "Maths", "value": 17705},
        {"name": "Orientation", "value": 1486},
        {
         "name": "palette",
         "children": [
          {"name": "ColorPalette", "value": 6367},
          {"name": "Palette", "value": 1229},
          {"name": "ShapePalette", "value": 2059},
          {"name": "SizePalette", "value": 2291}
         ]
        },
        {"name": "Property", "value": 5559},
        {"name": "Shapes", "value": 19118},
        {"name": "Sort", "value": 6887},
        {"name": "Stats", "value": 6557},
        {"name": "Strings", "value": 22026}
       ]
      },
      {
       "name": "vis",
       "children": [
        {
         "name": "axis",
         "children": [
          {"name": "Axes", "value": 1302},
          {"name": "Axis", "value": 24593},
          {"name": "AxisGridLine", "value": 652},
          {"name": "AxisLabel", "value": 636},
          {"name": "CartesianAxes", "value": 6703}
         ]
        },
        {
         "name": "controls",
         "children": [
          {"name": "AnchorControl", "value": 2138},
          {"name": "ClickControl", "value": 3824},
          {"name": "Control", "value": 1353},
          {"name": "ControlList", "value": 4665},
          {"name": "DragControl", "value": 2649},
          {"name": "ExpandControl", "value": 2832},
          {"name": "HoverControl", "value": 4896},
          {"name": "IControl", "value": 763},
          {"name": "PanZoomControl", "value": 5222},
          {"name": "SelectionControl", "value": 7862},
          {"name": "TooltipControl", "value": 8435}
         ]
        },
        {
         "name": "data",
         "children": [
          {"name": "Data", "value": 20544},
          {"name": "DataList", "value": 19788},
          {"name": "DataSprite", "value": 10349},
          {"name": "EdgeSprite", "value": 3301},
          {"name": "NodeSprite", "value": 19382},
          {
           "name": "render",
           "children": [
            {"name": "ArrowType", "value": 698},
            {"name": "EdgeRenderer", "value": 5569},
            {"name": "IRenderer", "value": 353},
            {"name": "ShapeRenderer", "value": 2247}
           ]
          },
          {"name": "ScaleBinding", "value": 11275},
          {"name": "Tree", "value": 7147},
          {"name": "TreeBuilder", "value": 9930}
         ]
        },
        {
         "name": "events",
         "children": [
          {"name": "DataEvent", "value": 2313},
          {"name": "SelectionEvent", "value": 1880},
          {"name": "TooltipEvent", "value": 1701},
          {"name": "VisualizationEvent", "value": 1117}
         ]
        },
        {
         "name": "legend",
         "children": [
          {"name": "Legend", "value": 20859},
          {"name": "LegendItem", "value": 4614},
          {"name": "LegendRange", "value": 10530}
         ]
        },
        {
         "name": "operator",
         "children": [
          {
           "name": "distortion",
           "children": [
            {"name": "BifocalDistortion", "value": 4461},
            {"name": "Distortion", "value": 6314},
            {"name": "FisheyeDistortion", "value": 3444}
           ]
          },
          {
           "name": "encoder",
           "children": [
            {"name": "ColorEncoder", "value": 3179},
            {"name": "Encoder", "value": 4060},
            {"name": "PropertyEncoder", "value": 4138},
            {"name": "ShapeEncoder", "value": 1690},
            {"name": "SizeEncoder", "value": 1830}
           ]
          },
          {
           "name": "filter",
           "children": [
            {"name": "FisheyeTreeFilter", "value": 5219},
            {"name": "GraphDistanceFilter", "value": 3165},
            {"name": "VisibilityFilter", "value": 3509}
           ]
          },
          {"name": "IOperator", "value": 1286},
          {
           "name": "label",
           "children": [
            {"name": "Labeler", "value": 9956},
            {"name": "RadialLabeler", "value": 3899},
            {"name": "StackedAreaLabeler", "value": 3202}
           ]
          },
          {
           "name": "layout",
           "children": [
            {"name": "AxisLayout", "value": 6725},
            {"name": "BundledEdgeRouter", "value": 3727},
            {"name": "CircleLayout", "value": 9317},
            {"name": "CirclePackingLayout", "value": 12003},
            {"name": "DendrogramLayout", "value": 4853},
            {"name": "ForceDirectedLayout", "value": 8411},
            {"name": "IcicleTreeLayout", "value": 4864},
            {"name": "IndentedTreeLayout", "value": 3174},
            {"name": "Layout", "value": 7881},
            {"name": "NodeLinkTreeLayout", "value": 12870},
            {"name": "PieLayout", "value": 2728},
            {"name": "RadialTreeLayout", "value": 12348},
            {"name": "RandomLayout", "value": 870},
            {"name": "StackedAreaLayout", "value": 9121},
            {"name": "TreeMapLayout", "value": 9191}
           ]
          },
          {"name": "Operator", "value": 2490},
          {"name": "OperatorList", "value": 5248},
          {"name": "OperatorSequence", "value": 4190},
          {"name": "OperatorSwitch", "value": 2581},
          {"name": "SortOperator", "value": 2023}
         ]
        },
        {"name": "Visualization", "value": 16540}
       ]
      }
     ]
    }
    return nist;
  }
};
