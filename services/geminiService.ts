
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY || "";

/**
 * Extracts MIME type and base64 data from a Data URL
 */
function parseDataUrl(dataUrl: string): { mimeType: string; data: string } {
  const match = dataUrl.match(/^data:(image\/[a-zA-Z+]+);base64,(.+)$/);
  if (match) {
    return { mimeType: match[1], data: match[2] };
  }
  // Fallback for raw base64 strings (defaulting to PNG)
  return { mimeType: 'image/png', data: dataUrl };
}

/**
 * Generates a mockup image using a logo and a product description
 */
export async function generateMockup(logoDataUrl: string, productType: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const { mimeType, data } = parseDataUrl(logoDataUrl);
  
  const prompt = `Create a high-resolution, professional commercial product photograph of a ${productType}. 
  The provided logo should be placed naturally and prominently on the ${productType}. 
  Use clean, minimalist studio lighting with a neutral background. 
  Ensure the logo looks realistic, following the fabric or surface texture. 
  Professional 8k resolution, commercial photography style.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: data,
            },
          },
          { text: prompt },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    const parts = response.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  } catch (error: any) {
    console.error("Gemini API Error (Generate):", error);
    throw error;
  }

  throw new Error("Failed to generate image from Gemini response");
}

/**
 * Edits an existing mockup image with a text prompt
 */
export async function editMockup(currentImageDataUrl: string, editPrompt: string): Promise<string> {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const { mimeType, data } = parseDataUrl(currentImageDataUrl);
  
  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [
          {
            inlineData: {
              mimeType: mimeType,
              data: data,
            },
          },
          { text: `Modify this product mockup according to this request: ${editPrompt}. Keep the core product and logo intact, but change the specified elements. Maintain high quality and realistic lighting.` },
        ],
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    const parts = response.candidates?.[0]?.content?.parts || [];
    for (const part of parts) {
      if (part.inlineData) {
        return `data:image/png;base64,${part.inlineData.data}`;
      }
    }
  } catch (error: any) {
    console.error("Gemini API Error (Edit):", error);
    throw error;
  }

  throw new Error("Failed to edit image from Gemini response");
}
