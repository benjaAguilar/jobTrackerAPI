import { normalizeTechs } from "../../src/utils/normalizeTech";

describe("NormalizeTechs util", () => {
  it("should convert a string into a capitalized one", () => {
    const string = normalizeTechs("rEaCT");

    expect(string).toEqual("React");
  });

  it("can treat spaces", () => {
    const string = normalizeTechs("REACT NATIVE");

    expect(string).toEqual("React native");
  });

  it("barra n", () => {
    const string = normalizeTechs("rick\n LOCALE");

    expect(string).toEqual("Rick locale");
  });
});
