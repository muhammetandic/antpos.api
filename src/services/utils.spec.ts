import { describe, it, expect } from "vitest";
import { createSixCharCode } from "./utils.service";

describe("code generator", () => {
  it("should generate six digit code in string form", () => {
    const code = createSixCharCode();
    expect(code.length).toBe(6);
  });

  it("should'nt generate null value", () => {
    const code = createSixCharCode();
    expect(code).not.toBeNull();
  });

  it("should generate only numbers", () => {
    const code = createSixCharCode();
    expect(code).toMatch(/^\d+$/);
  });
});
