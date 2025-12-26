import { Request, Response } from "express";
import { prisma } from '../../lib/prisma'
import { createTopicSchema } from "../Validators/topic.validator";


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
    try {
        // validate request using zod 
        const parsedResult = createTopicSchema.safeParse(req.body);

        if (!parsedResult.success) {
            console.log("parsedResult : ", parsedResult.error?.issues.map(err => err.message));
            return res.status(400).json({
                message: "Invalid input data",
            })
        }
        console.log("parsedResult : ", parsedResult);

        const { name, category, description } = parsedResult.data;

        // check the existence of topic
        const existingTopic = await prisma.topic.findFirst({
            where: {
                name: {
                    equals: name,
                    mode: "insensitive",
                }
            }
        });

        if (existingTopic) {
            return res.status(409).json({ message: "Topic with this name already exists" });
        }

        // create new topic
        const newTopic = await prisma.topic.create({
            data: {
                name,
                category,
                description: description || null,
                icon: "No icon available",
                difficultyDistribution: {
                    easy: 0,
                    medium: 0,
                    hard: 0
                },
                totalQuestion: 0,
            },
        })

        console.log("newTopic : ", newTopic);

        return res.status(200).json({ message: "Topic created successfully", data: newTopic });

    } catch (error) {
        console.error("Create topic error :", error);
        return res.status(500).json({ message: "Internal server error" });
    }
}

export async function createWritingChallenge(req: Request, res: Response) {

} 