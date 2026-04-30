export const validateTaskData = (req, res, next) => {
  const {
    title,
    description,
    types_id,
    status_id,
    priority_id,
    category_id,
    project_id,
    estimated_hours,
  } = req.body;

  const isUpdate = Boolean(req.params.id);

  if (isUpdate) {
    // Verificar se pelo menos um campo válido foi fornecido
    const fieldsToUpdate = [];
    
    if (title !== undefined) fieldsToUpdate.push("title");
    if (description !== undefined) fieldsToUpdate.push("description");
    if (status_id !== undefined) fieldsToUpdate.push("status_id");
    if (priority_id !== undefined) fieldsToUpdate.push("priority_id");
    if (category_id !== undefined) fieldsToUpdate.push("category_id");
    if (types_id !== undefined) fieldsToUpdate.push("types_id");
    if (project_id !== undefined) fieldsToUpdate.push("project_id");
    if (estimated_hours !== undefined) fieldsToUpdate.push("estimated_hours");

    if (fieldsToUpdate.length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    // Validar campos fornecidos
    if (title !== undefined && title.toString().trim().length === 0) {
      return res.status(400).json({ error: "Title cannot be empty" });
    }

    if (description !== undefined && description.toString().trim().length === 0) {
      return res.status(400).json({ error: "Description cannot be empty" });
    }

    if (
      status_id !== undefined &&
      (status_id === null || status_id.toString().trim().length === 0)
    ) {
      return res.status(400).json({ error: "Task status ID must be valid" });
    }

    if (
      priority_id !== undefined &&
      (priority_id === null || priority_id.toString().trim().length === 0)
    ) {
      return res.status(400).json({ error: "Priority ID must be valid" });
    }

    if (
      category_id !== undefined &&
      (category_id === null || category_id.toString().trim().length === 0)
    ) {
      return res.status(400).json({ error: "Category ID must be valid" });
    }
    if (
      types_id !== undefined &&
      (types_id === null || types_id.toString().trim().length === 0)
    ) {
      return res.status(400).json({ error: "Task type ID must be valid" });
    }
    if (
      project_id !== undefined &&
      (project_id === null || project_id.toString().trim().length === 0)
    ) {
      return res.status(400).json({ error: "Project ID must be valid" });
    }

    if (
      estimated_hours !== undefined &&
      (estimated_hours === null || estimated_hours.toString().trim().length === 0)
    ) {
      return res.status(400).json({ error: "Estimated hours must be valid" });
    }
  } else {
    // Criar: todos os campos são obrigatórios
    if (!title || title.toString().trim().length === 0) {
      return res.status(400).json({ error: "Title is required" });
    }

    if (!description || description.toString().trim().length === 0) {
      return res.status(400).json({ error: "Description is required" });
    }

    if (
      status_id === undefined ||
      status_id === null ||
      status_id.toString().trim().length === 0
    ) {
      return res.status(400).json({ error: "Task status ID is required" });
    }

    if (
      priority_id === undefined ||
      priority_id === null ||
      priority_id.toString().trim().length === 0
    ) {
      return res.status(400).json({ error: "Priority ID is required" });
    }

    if (
      category_id === undefined ||
      category_id === null ||
      category_id.toString().trim().length === 0
    ) {
      return res.status(400).json({ error: "Category ID is required" });
    }

    if (
      types_id === undefined ||
      types_id === null ||
      types_id.toString().trim().length === 0
    ) {
      return res.status(400).json({ error: "Task type ID is required" });
    }

    if (
      project_id === undefined ||
      project_id === null ||
      project_id.toString().trim().length === 0
    ) {
      return res.status(400).json({ error: "Project ID is required" });
    }

    if (
      estimated_hours === undefined ||
      estimated_hours === null ||
      estimated_hours.toString().trim().length === 0
    ) {
      return res.status(400).json({ error: "Estimated hours is required" });
    }
  }

  next();
};
