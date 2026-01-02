export type EvaluateEssayParams = {
    problemStatement: string;
    essay: string;
    keywords: string[];
    category: string;
    difficulty: string;
    expectedWordCount: number;
};

export type EvaluateEmailParams = {
    problemStatement: string;
    email: string;
    keywords: string[];
    category: string;
    difficulty: string;
    expectedWordCount: number;
    // referenceContent: {
    //     subject: string;
    //     body: string;
    // } | null;
};