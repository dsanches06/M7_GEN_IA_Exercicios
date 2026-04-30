import { db } from "../db.js";
import { mapCategoryDTOResponse } from "../dto/mapDTO.js";

export const getAllCategories = async () => {
  const [categories] = await db.query("SELECT * FROM categories");
  return categories.map(mapCategoryDTOResponse);
};

export const getCategoryById = async (categoryId) => {
  const [categories] = await db.query("SELECT * FROM categories WHERE id = ?", [categoryId]);
  return categories.length > 0 ? mapCategoryDTOResponse(categories[0]) : null;
};

export const createCategory = async (data) => {
  const [result] = await db.query(
    "INSERT INTO categories (name, flow_order) VALUES (?, ?)",
    [data.name, data.flow_order ?? 0]
  );
  return mapCategoryDTOResponse({ id: result.insertId, ...data });
};

export const updateCategory = async (id, data) => {
  const [result] = await db.query("UPDATE categories SET ? WHERE id = ?", [data, id]);
  return result.affectedRows;
};

export const deleteCategory = async (id) => {
  const [result] = await db.query("DELETE FROM categories WHERE id = ?", [id]);
  return result.affectedRows;
};
