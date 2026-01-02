import { EvaluateEmailParams } from "../types/types";



export async function evaluateEmailWithGemini(param: EvaluateEmailParams) {

    //destructure the param object 
    const { problemStatement, email, keywords, category, difficulty, expectedWordCount } = param;
    // there is some contextual problem in 
    // enum category of email 
    // just check that correctly
    // resume here 

}