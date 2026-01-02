import { EvaluateEmailParams } from "../types/types";
import { GoogleGenAI } from "@google/genai";


const GEMINI_API_KEY = process.env.GEMINI_API_KEY!;
const ai = new GoogleGenAI({ apiKey: GEMINI_API_KEY });



export async function evaluateEmailWithGemini(param: EvaluateEmailParams) {

    //destructure the param object 
    const { problemStatement, email, keywords, category, difficulty, expectedWordCount } = param;
    // there is some contextual problem in 
    // enum category of email 
    // just check that correctly
    // resume here 
    const prompt = `
    You are a strict email evaluation engine.

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
    4. Evaluate clarity and structure.
    5. Evaluate tone appropriateness.
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
    "clarityStructureComment": string,
    "toneAppropriateness": "professional" | "casual" | "formal" | "very_poor",
    "aiFeedback": string
    }

    Email Problem Statement:
    """
    ${problemStatement}
    """

    User Email:
    """
    ${email}
    """
    `;

    const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
    });

    console.log("Response from Gemini:", response);

    const rawText = response.text ?? "";
    // Gemini may wrap JSON in markdown
    const cleaned = rawText.replace(/```json|```/g, "").trim();
    console.log("Cleaned Gemini Output:", cleaned);

    try {
        return JSON.parse(cleaned);
    } catch (error) {
        console.error("Gemini JSON parse failed:", cleaned);
        throw new Error("Invalid AI response format");
    }
}