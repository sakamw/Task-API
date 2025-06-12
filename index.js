import express from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import "dotenv/config";

const app = express();
const client = new PrismaClient();
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("<h1> Welcome to the Task API </h1>");
});

app.post("/tasks", async (req, res) => {
  try {
    console.log(req.body);
    const { title, description } = req.body;
    const newTaskApp = await client.tasks.create({
      data: {
        title,
        description,
      },
    });
    res.status(201).json(newTaskApp);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Something went wrong" });
  }
});

app.get("/tasks", async (_req, res) => {
  try {
    const tasks = await client.tasks.findMany({
      where: {
        isCompleted: false,
      },
      select: {
        id: true,
        title: true,
        description: true,
      },
    });
    res.status(200).json(tasks);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Something went wrong!!" });
  }
});

const port = process.env.PORT || 3500;
app.listen(port, () => {
  console.log(`App listening at port ${port}`);
});
