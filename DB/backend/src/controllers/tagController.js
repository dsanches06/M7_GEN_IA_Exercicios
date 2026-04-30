import * as tagService from "../services/tagService.js";
import * as taskService from "../services/taskService.js";

/* Função para buscar etiquetas */
export const getTags = async (req, res) => {
  try {
    const tags = await tagService.getAllTags();
    res.json(tags);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar etiquetas" });
  }
};

export const getTagById = async (req, res) => {
  try {
    const tag = await tagService.getTagById(Number(req.params.id));
    if (!tag) {
      return res.status(404).json({ message: "Etiqueta não encontrada" });
    }
    res.json(tag);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar etiqueta" });
  }
};

/* Função para criar etiqueta */
export const createTag = async (req, res) => {
  try {
    const { name } = req.body;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({ message: "O nome da etiqueta não pode ser vazio" });
    }

    if (name.trim().length < 2) {
      return res.status(400).json({ message: "O nome da etiqueta deve ter pelo menos 2 caracteres" });
    }

    const tagExists = await tagService.tagNameExists(name.trim());
    if (tagExists) {
      return res.status(400).json({ message: "Já existe uma etiqueta com este nome" });
    }

    const tag = await tagService.createTag(req.body);
    res.status(201).json(tag);
  } catch (error) {
    res.status(400).json({ message: "Erro ao criar etiqueta" });
  }
};

/* Função para deletar etiqueta */
export const deleteTag = async (req, res) => {
  try {
    const tag = await tagService.deleteTag(Number(req.params.id));
    await taskService.removeTagFromAllTasks(Number(req.params.id));
    res.status(200).json({ message: "Etiqueta deletada com sucesso", tag });
  } catch (error) {
    res.status(404).json({ message: "Erro ao deletar etiqueta" });
  }
};

/* Função para atualizar etiqueta */
export const updateTag = async (req, res) => {
  try {
    const tagId = Number(req.params.id);
    const { name } = req.body;

    if (!name || name.trim().length === 0) {
      return res.status(400).json({ message: "O nome da etiqueta não pode ser vazio" });
    }

    if (name.trim().length < 2) {
      return res.status(400).json({ message: "O nome da etiqueta deve ter pelo menos 2 caracteres" });
    }

    const tagExists = await tagService.tagNameExists(name.trim(), tagId);
    if (tagExists) {
      return res.status(400).json({ message: "Já existe uma etiqueta com este nome" });
    }

    const tag = await tagService.updateTag(tagId, req.body);
    if (!tag) {
      return res.status(404).json({ message: "Etiqueta não encontrada" });
    }

    res.status(200).json(tag);
  } catch (error) {
    res.status(400).json({ message: "Erro ao atualizar etiqueta" });
  }
};

/* Função para buscar tarefas da etiqueta */
export const getTagTasks = async (req, res) => {
  try {
    const tagId = Number(req.params.id);
    const tag = await tagService.getTagById(tagId);

    if (!tag) {
      return res.status(404).json({ error: "Etiqueta não encontrada" });
    }

    const tasks = await taskService.getTasksByTagId(tagId);
    res.json(tasks);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar tarefas da etiqueta" });
  }
};
