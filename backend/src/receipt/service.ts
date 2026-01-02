import fs from "fs";
import OpenAI from "openai";

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

export async function parseReceipt(filePath: string) {
  try {
    const imageBuffer = await fs.readFileSync(filePath);
    const base64Image = imageBuffer.toString("base64");
    const fileDataUrl = `data:image/png;base64,${base64Image}`;
    const response = await openai.responses.create({
      model: "gpt-4.1-mini",
      input: [
        {
          role: "user",
          content: [
            {
              type: "input_text",
              text: `
            You are an OCR system.

            Extract the receipt into the following JSON format ONLY.
            Return valid JSON. Do not include explanations, comments, or markdown.

            Rules:
            - category MUST be one of the allowed values below
            - If an item does not clearly match, use "Other"
            - If a field is missing, use null

            Allowed categories:
            - Fresh Produce
            - Dairy
            - Meat
            - Seafood
            - Pantry
            - Beverages
            - Snacks
            - Household Items
            - Personal Care
            - Other

            Schema:
            {
              "vendor": string,
              "date": string | null,
              "items": [
                {
                  "name": string,
                  "quantity": number | null,
                  "unit_price": number | null,
                  "total_price": number,
                  "category": "Fresh Produce" | "Dairy" | "Meat" | "Seafood" | "Pantry" | "Beverages" | "Snacks" | "Household Items" | "Personal Care" | "Other"
                }
              ],
              "total": number
            }
            `
            },
            {
              type: "input_image",
              image_url: fileDataUrl,
              detail: "auto"
            }
          ]
        }
      ]
    });

    // The structured data should be in response.output_text or response.output[0].content
    const structuredData = JSON.parse(response.output_text);
    const result = {
      vendor: structuredData.vendor,
      total: structuredData.total,
      date: structuredData.date || new Date().toISOString().split('T')[0],
      items: structuredData.items.map((item: any, id: number) => ({
        id: id.toString(),
        name: item.name,
        quantity: item.quantity || 1,
        unit_price: item.unit_price || item.total_price,
        total_price: item.total_price,
        category: item.category
      }))
    };
    return result;
  } catch (err) {
    console.error("OCR error:", err);
    throw err;
  }
}
