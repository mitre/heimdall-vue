export const store = {
  state: {
    status: [
      ['Not A Finding',  12],
      ['Open',           4],
      ['Not Applicable', 3],
      ['Not Reviewed',   2],
      ['Profile Error',  1]
    ],
    orig_status: [
      ['Not A Finding',  12],
      ['Open',           4],
      ['Not Applicable', 3],
      ['Not Reviewed',   2],
      ['Profile Error',  1]
    ],
    test: "test"
  },
  getStatus() {
    return this.state.status;
  },
  getTest() {
    return this.state.test;
  },
  setTest(val) {
    this.state.test = val;
  },
  filterStatus(name) {
    console.log("Filter by " + name);
    for (var i = 0; i < this.state.status.length; i++) {
      if (this.state.status[i][0] != name) {
        console.log("Set " + this.state.status[i][0] + " to 0");
        this.state.status[i][1] = 0;
      }
    }
    console.log("Status: " + this.state.status);
  },
  clearFilter() {
    this.state.status = this.state.orig_status;
  }
};
