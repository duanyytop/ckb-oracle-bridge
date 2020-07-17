const {assertDataTypeInt} = require("../src/utils");

describe("Utils tests", () => {
  it("assertDataTypeInt", async () => {
    expect(assertDataTypeInt(12)).toBe(true);
    expect(assertDataTypeInt(BigInt("0x1234"))).toBe(true);
    expect(() => assertDataTypeInt("0x123")).toThrow(new Error("Invalid data type"));
  });
});
