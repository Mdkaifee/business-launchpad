import { describe, expect, it } from "vitest";

import { getTimeLeft, pad } from "@/lib/countdown";

describe("getTimeLeft", () => {
  it("breaks the gap down into whole days, hours, minutes and seconds", () => {
    const target = new Date("2027-01-01T00:00:00Z");
    const now = new Date("2026-12-27T05:17:51Z");

    expect(getTimeLeft(target, now)).toEqual({
      days: 4,
      hours: 18,
      minutes: 42,
      seconds: 9,
      open: false,
    });
  });

  it("reads as open with nothing left once the target has passed", () => {
    const target = new Date("2027-01-01T00:00:00Z");
    const now = new Date("2027-01-01T00:00:30Z");

    expect(getTimeLeft(target, now)).toEqual({
      days: 0,
      hours: 0,
      minutes: 0,
      seconds: 0,
      open: true,
    });
  });

  it("pads single digits for the tiles and leaves double digits alone", () => {
    expect(pad(4)).toBe("04");
    expect(pad(42)).toBe("42");
  });
});
