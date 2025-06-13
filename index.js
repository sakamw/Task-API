import express from "express";
import { PrismaClient } from "@prisma/client";
import "dotenv/config";

const app = express();
const client = new PrismaClient();
app.use(express.json());

app.get("/", (_req, res) => {
  res.send("<h1> Welcome to Saka's Task API </h1>");
});

// Creating a new task
app.post("/tasks", async (req, res) => {
  try {
    const { title, description } = req.body;
    const newTask = await client.tasks.create({
      data: { title, description },
    });
    res.status(201).json(newTask);
  } catch (e) {
    console.error(e);
  }
});

// Getting all tasks
app.get("/tasks", async (_req, res) => {
  try {
    const tasks = await client.tasks.findMany({
      where: { isCompleted: false },
      select: {
        id: true,
        title: true,
        description: true,
        isCompleted: true,
      },
    });
    res.status(200).json(tasks);
  } catch (e) {
    next(e);
  }
});

// Getting a specific task by ID
app.get("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const task = await client.tasks.findFirst({
      where: { id },
    });
    if (!task) {
      return res.status(404).json({ message: "Task not found" });
    }
    res.status(200).json(task);
  } catch (e) {
    console.error(e);
  }
});

// Updating a task
app.put("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, isCompleted } = req.body;
    const updatedTask = await client.tasks.update({
      where: { id },
      data: { title, description, isCompleted },
    });
    res.status(200).json(updatedTask);
  } catch (e) {
    console.log(e);
  }
});

// Deleting a task
app.delete("/tasks/:id", async (req, res) => {
  try {
    const { id } = req.params;
    await client.tasks.delete({ where: { id } });
    res.status(200).json({ message: "Task deleted" });
  } catch (e) {
    console.error(e);
  }
});

app.use((err, _req, res, _next) => {
  console.error("Unhandled Error:", err);
  res.status(500).json({
    message: "Something went wrong!",
    error: err.message || "Internal server error",
  });
});

const port = process.env.PORT || 3500;
app.listen(port, () => {
  console.log(`App listening at port ${port}`);
});
