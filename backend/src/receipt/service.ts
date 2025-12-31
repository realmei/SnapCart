import fs from "fs";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function parseReceipt(filePath: string) {
  try {
    const imageBuffer = await fs.readFileSync(filePath);
    const base64Image = imageBuffer.toString("base64");
    const fileDataUrl = `data:image/png;base64,${base64Image}`;
    console.log(fileDataUrl);
    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [{
          role: "user",
          content: [
            { type: "input_text", text: "Extract structured data from this receipt: items, price, total, date, vendor" },
            { type: "input_image", image_url: fileDataUrl, detail: "auto" } // or base64 buffer
          ],
        },
      ],
    });

    // The structured data should be in response.output_text or response.output[0].content
    const structuredData = response.output_text;
    console.log("OCR structured data:", structuredData);
    return structuredData;
  } catch (err) {
    console.error("OCR error:", err);
    throw err;
  }
}
