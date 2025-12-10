import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

interface ReceiptData {
  merchant: string;
  date: string;
  total: number;
  category: string;
  items: { name: string; price: number }[];
}

export const scanReceipt = async (base64Image: string): Promise<ReceiptData> => {
  try {
    // We use gemini-2.5-flash for speed and cost-effectiveness with vision tasks.
    const modelId = "gemini-2.5-flash";

    const response = await ai.models.generateContent({
      model: modelId,
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: "image/jpeg", // Assuming JPEG for simplicity in this demo
              data: base64Image,
            },
          },
          {
            text: "이 영수증 이미지를 분석해서 데이터를 추출해주세요. 상호명(merchant), 날짜(date, YYYY-MM-DD 형식), 총 금액(total, 숫자만), 그리고 다음 중 가장 적절한 카테고리(category: Meals, Travel, Equipment, Software, Office, Other)를 선택하세요. 구매 품목 목록(items)도 함께 추출해주세요."
          },
        ],
      },
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            merchant: { type: Type.STRING },
            date: { type: Type.STRING },
            total: { type: Type.NUMBER },
            category: { type: Type.STRING },
            items: {
              type: Type.ARRAY,
              items: {
                type: Type.OBJECT,
                properties: {
                  name: { type: Type.STRING },
                  price: { type: Type.NUMBER },
                }
              }
            }
          },
          required: ["merchant", "total", "category"]
        }
      }
    });

    const text = response.text;
    if (!text) throw new Error("No response from Gemini");

    return JSON.parse(text) as ReceiptData;

  } catch (error) {
    console.error("OCR Scan Failed:", error);
    throw error;
  }
};