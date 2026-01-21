import express, { Request, Response } from "express";
import { prisma } from "../lib/prisma"; // your prisma client
import dotenv from "dotenv";
import cors from "cors";
import topicRouter from './routes/topics.route';
import essayChallengeRoute from "./routes/writing/essay.router"
import emailChallengeRoute from "./routes/writing/email.router"
// import writingChallengeRoute from "./routes/writing.route";
// import practiceSessionRoute from "./routes/practice_session.route"


// next step is to create REST API end points to access the data and serve the requirements




const app = express();

dotenv.config();
// Middleware to parse JSON
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors())

const PORT = process.env.PORT || 3000;

// middleware 
// app.use("/",(req,res)=>{
//   return res.json({message : "server is listing"});
// })
app.use("/api/v1", topicRouter);
// app.use("api/v1", practiceSessionRoute);
app.use("api/v1/writing", essayChallengeRoute);
app.use("api/v1/writing", emailChallengeRoute);


// Start server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});