const assertDataTypeInt = value => {
  if (typeof value !== "number" && typeof value !== "bigint") {
    throw new Error("Invalid data type");
  }
  return true;
};

const intToU64 = num => {
  assertDataTypeInt(num);
  const u64 = typeof num === "number" ? parseInt(num, 16) : num.toString(16);
  return `${"0".repeat(64 - u64.length)}${u64}`;
};

const intToU256 = num => {
  assertDataTypeInt(num);
  const u256 = typeof num === "number" ? parseInt(num, 16) : num.toString(16);
  return `${"0".repeat(256 - u256.length)}${u256}`;
};

const uintToInt = hex => {
  if (typeof hex !== "string" || !hex.startsWith("0x") || Number.isNaN(+hex)) {
    throw new Error("Invalid data type");
  }
  return BigInt(hex).toString();
};

module.exports = {assertDataTypeInt, intToU64, intToU256, uintToInt};
