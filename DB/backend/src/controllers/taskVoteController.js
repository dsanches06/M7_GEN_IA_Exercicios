import * as taskVoteService from "../services/taskVoteService.js";

/* Função para obter todos os task votes */
export const getTaskVotes = async (req, res) => {
  try {
    const taskVotes = await taskVoteService.getAllTaskVotes();
    res.json(taskVotes);
  } catch (error) {
    res.status(500).json({ error: `Error fetching task votes` });
  }
};

/* Função para obter task vote por ID */
export const getTaskVoteById = async (req, res) => {
  try {
    const taskVote = await taskVoteService.getTaskVoteById(
      Number(req.params.id),
    );
    if (!taskVote) {
      return res.status(404).json({ error: "Task vote not found" });
    }
    res.json(taskVote);
  } catch (error) {
    res.status(500).json({ error: `Error fetching task vote` });
  }
};

/* Função para criar task vote */
export const createTaskVote = async (req, res) => {
  try {
    const { task_id, user_id, vote_type } = req.body;
    if (!task_id || !user_id || !vote_type) {
      return res
        .status(400)
        .json({ error: "task_id, user_id, and vote_type are required" });
    }
    const taskVote = await taskVoteService.createTaskVote(req.body);
    res.status(201).json(taskVote);
  } catch (error) {
    res.status(400).json({ error: `Error creating task vote` });
  }
};

/* Função para atualizar task vote */
export const updateTaskVote = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await taskVoteService.updateTaskVote(id, req.body);
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Task vote not found" });
    }
    res.json({ message: "Task vote updated successfully" });
  } catch (error) {
    res.status(400).json({ error: `Error updating task vote` });
  }
};

/* Função para deletar task vote */
export const deleteTaskVote = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await taskVoteService.deleteTaskVote(id);
    if (affectedRows === 0) {
      return res.status(404).json({ error: "Task vote not found" });
    }
    res.json({ message: "Task vote deleted successfully" });
  } catch (error) {
    res.status(400).json({ error: `Error deleting task vote` });
  }
};
