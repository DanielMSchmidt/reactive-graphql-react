import getData from "../";

describe("Hook", () => {
  it("exposes a function as a hook", () => {
    expect(getData).toBeInstanceOf(Function);
  });
});
