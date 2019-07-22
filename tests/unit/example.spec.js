import Vue from 'vue'
import { store } from '../../src/store'
const expect = require('chai').expect

describe('store', () => {
  it ('Should parse JSON examples for flat profiles', () => {
    var fs = require('fs');
    let json = fs.readFileSync("tests/examples/profile/profile.json","utf-8");
    store.parseFile(json);
    let x = store.get_finding_details("tmp-1.0");
    expect(store.state.controls).to.exist;
  });
  
  it ('JSON parser should count statuses correctly for flat profiles', () => {
    var fs = require('fs');
    let json = fs.readFileSync("tests/examples/iis-site-baseline.json","utf-8");
    store.parseFile(json);
    expect(store.getStatus()).to.eql([
      ['Passed',         17],
      ['Failed',         28],
      ['Not Applicable', 2],
      ['Not Reviewed',   8],
      ['Profile Error',  0]
    ]);
  });
  
  it ('JSON parser should generate the relevant NIST hash for flat profiles', () => {
    var fs = require('fs');
    let json = fs.readFileSync("tests/examples/iis-site-baseline.json","utf-8");
    store.parseFile(json);
    const cntrl_cnt = {
      'UM' : 0,
      'AC' : 8,
      'AU' : 10,
      'AT' : 0,
      'CM' : 21,
      'CP' : 0,
      'IA' : 1,
      'IR' : 0,
      'MA' : 0,
      'MP' : 0,
      'PS' : 0,
      'PE' : 0,
      'PL' : 0,
      'PM' : 0,
      'RA' : 0,
      'CA' : 0,
      'SC' : 17,
      'SI' : 4,
      'SA' : 0
    };
    let hsh = store.getNistHash();
    expect(hsh.name, "NIST hash name incorrect or missing for flat profiles").to.eql("NIST SP 800-53");
    expect(hsh.children,"Not all NIST control groups are present for flat profiles").to.be.lengthOf(19);
    for(var cluster of hsh.children) {
      // This test validates we are iterating the children list correctly
      expect(cluster,"Test flawed, hash map children should be iterated for flat profiles").to.not.be.undefined;
  
      // Validate we have categorized all control results correctly.
      expect(cluster.count).to.eql(cntrl_cnt[cluster.name]);
    }  
  });
  
  it ('JSON parser should count impacts correctly for flat profiles', () => {
    var fs = require('fs');
    let json = fs.readFileSync("tests/examples/iis-site-baseline.json","utf-8");
    store.parseFile(json);
    expect(store.getImpact()).to.eql(
    [
      ['low',      0 ],
      ['medium',   52 ],
      ['high',     1 ],
      ['critical', 0 ]
    ]);
  });
});


