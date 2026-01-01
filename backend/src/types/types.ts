export type EvaluateEssayParams = {
    problemStatement: string;
    essay: string;
    keywords: string[];
    category: string;
    difficulty: string;
    expectedWordCount: number;
};