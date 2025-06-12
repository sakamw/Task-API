import express from "express";
import { Prisma, PrismaClient } from "@prisma/client";
import "dotenv/config";
import e from "express";

const app = express();
const client = new PrismaClient();
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("<h1> Welcome to the Task API </h1>");
});

// Creating a new tasks
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

// Getting all the tasks
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
        isCompleted: true,
      },
    });
    res.status(200).json(tasks);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Something went wrong!!" });
  }
});

//  Getting a specific task by ID
app.get("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const tasks = await client.tasks.findFirst({
      where: {
        id,
      },
    });
    if (!tasks) {
      return req.status(404).json({ message: "Task not found" });
    }
    res.status(200).json(tasks);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Something went wrong!!" });
  }
});

app.put("/tasks/:id", async (req, res) => {
  try {
    const { title, description, isCompleted } = req.body;
    const { id } = req.params;
    const tasks = await client.tasks.update({
      where: { id },
      data: {
        title,
        description,
        isCompleted,
      },
    });
    res.status(200).json(tasks);
  } catch (e) {
    console.error(e);
    res.status(500).json({ message: "Something went wrong!!" });
  }
});

// Update a Task
// app.patch("/tasks/:id", async (req, res) => {
//   try {
//     const { title, description } = req.body;
//     const { id } = req.params;
//     const tasks = await client.tasks.update({
//       where: {
//         id,
//       },
//       data: {
//         title: title && title,
//         description: description && description,
//       },
//     });
//     res.status(200).json(tasks);
//   } catch (e) {
//     res.status(500).json({ message: "Something went wrong!!" });
//   }
// });

// Deleting a task
app.delete(`/tasks/:id`, async (req, res) => {
  try {
    const { id } = req.params;
    await client.tasks.delete({
      where: { id },
    });
    return res.status(200).json({
      message: `Task deleted `,
    });
  } catch (error) {
    console.error(e);
    res.status(500).json({ message: `Something went wrong` });
  }
});

const port = process.env.PORT || 3500;
app.listen(port, () => {
  console.log(`App listening at port ${port}`);
});
