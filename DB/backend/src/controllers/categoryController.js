
import * as categoryService from "../services/categoryService.js";


/* Função para obter todas as categorias */
export const getCategories = async (req, res) => {
  try {
    const categories = await categoryService.getAllCategories();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: "Erro ao buscar categorias" });
  }
};


/* Função para obter categoria por ID */
export const getCategoryById = async (req, res) => {
  try {
    const category = await categoryService.getCategoryById(Number(req.params.id));
    if (!category) {
      return res.status(404).json({ error: "Categoria não encontrada" });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ error: "Erro ao buscar categoria" });
  }
};


/* Função para criar categoria */
export const createCategory = async (req, res) => {
  try {
    const { name } = req.body;
    if (!name || name.trim().length === 0) {
      return res.status(400).json({ message: "O nome da categoria não pode ser vazio" });
    }
    const category = await categoryService.createCategory(req.body);
    res.status(201).json(category);
  } catch (error) {
    res.status(400).json({ message: "Erro ao criar categoria" });
  }
};


/* Função para atualizar categoria */
export const updateCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await categoryService.updateCategory(id, req.body);
    if (affectedRows === 0) {
      return res.status(404).json({ message: "Categoria não encontrada" });
    }
    res.json({ message: "Categoria atualizada com sucesso" });
  } catch (error) {
    res.status(400).json({ message: "Erro ao atualizar categoria" });
  }
};


/* Função para deletar categoria */
export const deleteCategory = async (req, res) => {
  try {
    const { id } = req.params;
    const affectedRows = await categoryService.deleteCategory(id);
    if (affectedRows === 0) {
      return res.status(404).json({ message: "Categoria não encontrada" });
    }
    res.json({ message: "Categoria deletada com sucesso" });
  } catch (error) {
    res.status(400).json({ message: "Erro ao deletar categoria" });
  }
};
