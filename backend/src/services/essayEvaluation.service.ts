import { GoogleGenAI } from "@google/genai";
import { EvaluateEssayParams } from "../types/types";

const GEMINI_API_KEY = process.env.GEMINI_API_KEY;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });



export async function evaluateEssayWithGemini({
    problemStatement,
    essay,
    keywords,
    category,
    difficulty,
    expectedWordCount,
}: EvaluateEssayParams) {
    const prompts = `
    You are a strict essay evaluation engine.
    
        
    Use ONLY the given reference parameters.
    Do NOT hallucinate.

        Reference Parameters:
    - Category: ${category}
    - Difficulty Level: ${difficulty}
    - Expected Word Count: ${expectedWordCount}
    - Evaluation Keywords: ${keywords.join(", ")}
        Evaluation Rules:
    1. Identify matched keywords from the reference list.
    2. Calculate keyword match percentage (0–1).
    3. Evaluate grammar accuracy.
    4. Evaluate coherence.
    5. Evaluate tone.
    6. Provide an overall score (0–100).
    7. Provide concise feedback (≤120 words).


    Return ONLY valid JSON in this EXACT structure:

    {
    "overallScore": number,
    "keywordCoverage": {
        "matchedKeywords": string[],
        "percentage": number
    },
    "grammarAccuracy": "excellent" | "good" | "average" | "poor",
    "coherence": "basic" | "good" | "excellent",
    "tone": "professional" | "casual" | "formal" | "very_poor",
    "aiFeedback": string
    }


    Essay:
    """
    ${essay}
    """
    `;


    // try {
    const response = await ai.models.generateContent({
        // model: "gemini-1.5-flash",
        // model: "gemini-3-pro-preview",
        model: "gemini-2.5-flash",
        contents: prompts
    });

    // generated response 
    console.log("Response from AI = ", response);

    const rawText = response.text ?? "";

    // Gemini sometimes wraps JSON in markdown
    const cleaned = rawText.replace(/```json|```/g, "").trim();

    console.log("cleaned = ", cleaned);
    try {
        return JSON.parse(cleaned);
    } catch (error) {
        console.error("Gemini JSON parse failed:", cleaned);
        throw new Error("Invalid AI response format");
    }
}
