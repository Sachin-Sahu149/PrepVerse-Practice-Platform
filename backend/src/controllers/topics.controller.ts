import { Request, Response } from "express";
import {prisma} from '../../lib/prisma'


export async function allTopics(req: Request, res: Response) {

}

export async function oneTopic(req: Request, res: Response) {

}

export async function findQuestions(req: Request, res: Response) {

}

export async function fetchOneQuestion(req: Request, res: Response) {

}

export async function addQuestions(req: Request, res: Response) {

}

export async function modifyQuestions(req: Request, res: Response) {

}

export async function destroyQuestions(req: Request, res: Response) {

}

export async function createNewTopics(req: Request, res: Response) {
    // create the new topics 
    const body = req.body;
    console.log("payload : ", body);

    if (body == null) {
        return res.status(400).json({message : "Information is not provided"});
    }


    return res.status(200).json({ message: "Working fine" });

}

export async function createWritingChallenge(req: Request, res: Response) {

} 