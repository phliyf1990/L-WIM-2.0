
import { GoogleGenAI, Type } from "@google/genai";
import { StyleVector, WoodTensor } from "../types";

export class GeminiService {
  private readonly STYLE_GUIDE = `
    5-Dimensional Imagery Space (V-Space) Definitions:
    1. Variety (单一性 - 多样性): Low=Straight, uniform. High=Holographic water-ripple patterns.
    2. Gorgeousness (简约 - 华丽): Low=Subtle amber. High=High-gold chatoyancy.
    3. Dynamism (静态 - 动感): Low=Depth/stable. High=Liquid-gold movement.
    4. Intensity (柔和 - 强烈): Low=Diffused warmth. High=Sharp specular highlights.
    5. Interest (乏味 - 有趣): Low=Traditional grain. High=Unique burl-like features.
  `;

  async encodeTargetStyle(base64Image: string): Promise<StyleVector> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: [
        {
          parts: [
            { inlineData: { data: base64Image.split(',')[1], mimeType: 'image/jpeg' } },
            { text: `[SKILL: PHOEBE_ZHENNAN_PERCEPTION_V2.5]
            Execute geometric constraint analysis on morphology F'.
            Align results with the following professional Style Guide:
            ${this.STYLE_GUIDE}
            
            Task: Map image content to the 5D manifold vector V_target (0.0 - 1.0).
            Return JSON only.` }
          ]
        }
      ],
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.OBJECT,
          properties: {
            variety: { type: Type.NUMBER },
            gorgeousness: { type: Type.NUMBER },
            dynamism: { type: Type.NUMBER },
            intensity: { type: Type.NUMBER },
            interest: { type: Type.NUMBER }
          },
          required: ["variety", "gorgeousness", "dynamism", "intensity", "interest"]
        }
      }
    });

    try {
      const text = response.text;
      return JSON.parse(text || "{}");
    } catch (e) {
      throw new Error("Target encoding failed.");
    }
  }

  async generateSemanticPrompt(style: StyleVector, wood: WoodTensor): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const prompt = `[Knowledge Encoding Task: PMPM Protocol v3.0]
    You are an expert design scientist specializing in Phoebe Zhennan (Golden Silk Nanmu).
    
    THEORETICAL INPUT:
    - Target Imagery (V_target): ${JSON.stringify(style)}
    - Optimal Physical Angle (θ_opt): ${wood.angle}°
    - Semantic Loss (ΔV): Minimal resonance achieved.

    TASK:
    Generate a high-fidelity AIGC protocol based on the following Tripartite Matching Mechanism:
    
    1. [Lighting Conditions]: Map θ_opt to physical lighting parameters. (Consider light incidence, specular sharpness, and chatoyancy activation).
    2. [Wood Grain Description]: Translate V_target (Variety & Gorgeousness) into specific micro-textural features of Nanmu (e.g., Shuibo ripples, golden threads, holographic depth).
    3. [Furniture Style]: Synthesize Dynamism & Interest into a cohesive design statement (e.g., Ming-style restraint, Rococo extravagance, or organic modernism).

    Output must be strictly structured in these 3 categories. English only. Technical and precise tone.`;

    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: prompt,
      config: {
        systemInstruction: "You are the core inference engine of the Phoebe.Lab Design System, specializing in mapping physical goniometric data to artistic intent."
      }
    });
    return response.text || "";
  }

  async generateFurniture(prompt: string, referenceImageBase64?: string): Promise<string> {
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const parts: any[] = [{ text: `Masterpiece visualization of Golden Silk Nanmu furniture. 
    Design Protocol: ${prompt}. 
    Rendering Style: Unreal Engine 5 high-fidelity render, 8K resolution, micro-surface accuracy, preserved reference geometry, cinematic wood-grain studio photography.` }];
    
    if (referenceImageBase64) {
      parts.push({
        inlineData: {
          data: referenceImageBase64.split(',')[1],
          mimeType: 'image/jpeg'
        }
      });
    }

    const response = await ai.models.generateContent({
      model: 'gemini-3-pro-image-preview',
      contents: { parts },
      config: { imageConfig: { aspectRatio: "1:1" } }
    });

    let imageUrl = '';
    const candidate = response.candidates?.[0];
    if (candidate) {
      for (const part of candidate.content.parts) {
        if (part.inlineData) {
          imageUrl = `data:image/png;base64,${part.inlineData.data}`;
          break;
        }
      }
    }
    return imageUrl;
  }
}
