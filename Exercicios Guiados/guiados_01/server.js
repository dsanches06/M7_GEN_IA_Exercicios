import express from "express";
import cors from "cors";
import {
  createTaskFromText,
  refineTask,
  summarizeTask,
  suggestTagsForTask,
} from "./index.js";

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

app.post("/api/tasks/create", async (req, res) => {
  try {
    const { text } = req.body;

    const task = await createTaskFromText({ text });

    res.status(2001).json({ success: true, task });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/tasks/refine", async (req, res) => {
  try {
    const { task } = req.body;

    const refinedTask = await refineTask(task);
    res.status(2001).json({ success: true, task: refinedTask });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/tasks/summarize", async (req, res) => {
  try {
    const { task } = req.body;

    const summarizedTask = await summarizeTask(task);
    res.status(2001).json({ success: true, task: summarizedTask });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.post("/api/tasks/suggest-tags", async (req, res) => {
  try {
    const { task } = req.body;

    const tags = await suggestTagsForTask(task);
    res.status(2001).json({ success: true, tags });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, error: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
