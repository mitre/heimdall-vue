export const store = {
  state: {
    status: [
      ['Not A Finding',  12],
      ['Open',           4],
      ['Not Applicable', 3],
      ['Not Reviewed',   2],
      ['Profile Error',  1]
    ]
  },
  addNumber(newNumber) {
    this.state.numbers.push(newNumber);
  }
};
