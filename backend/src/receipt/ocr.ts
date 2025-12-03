import fs from "fs";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function parseReceipt(filePath: string) {
  try {
    const imageFile = fs.createReadStream(filePath);

    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [{
          role: "user",
          content: [
            { type: "input_text", text: "Extract structured data from this receipt: items, price, total, date, vendor" },
            { type: "input_image", image_url: filePath, detail: "auto" } // or base64 buffer
          ],
        },
      ],
    });

    // The structured data should be in response.output_text or response.output[0].content
    const structuredData = response.output_text;
    return structuredData;
  } catch (err) {
    console.error("OCR error:", err);
    throw err;
  }
}
