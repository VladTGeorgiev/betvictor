import { expect } from "chai";
import { normalizeLanguages } from "../../../../src/router/v1/lib";

describe("src/router/v1/lib", function () {
  describe("normalizeLanguages", function () {
    it("should return en-gb if no language passed in", () => {
      const result = normalizeLanguages();
      expect(result).to.deep.eq(["en-gb"]);
    });
    it("should return array of all passed in languages", () => {
      const result = normalizeLanguages("en-gb,de");
      expect(result).to.deep.eq(["en-gb", "de"]);
    });

    it("should normalize all passed in languages", () => {
      const result = normalizeLanguages("en-GB,      de");
      expect(result).to.deep.eq(["en-gb", "de"]);
    });
  });
});
