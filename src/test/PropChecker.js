import { expect } from "chai";

class PropChecker {
  constructor() {}

  check(property) {
    it("should have a type", () => {
      expect(property.type).to.exist;
    });
    it("should have a required", () => {
      expect(property.required).to.exist;
    });
  }
}

export default PropChecker;