import Tesseract from "tesseract.js";

export async function runOCR(image: string): Promise<string> {
  const { data } = await Tesseract.recognize(image, "eng");
  return data.text;
}