export const validateProjectData = (req, res, next) => {
  const {
    name,
    description,
    project_status_id,
    start_date,
    end_date_expected,
  } = req.body;

  const isUpdate = Boolean(req.params.id);

  if (isUpdate) {
    // Verificar se pelo menos um campo válido foi fornecido
    const fieldsToUpdate = [];
    
    if (name !== undefined) fieldsToUpdate.push("name");
    if (description !== undefined) fieldsToUpdate.push("description");
    if (project_status_id !== undefined) fieldsToUpdate.push("project_status_id");
    if (start_date !== undefined) fieldsToUpdate.push("start_date");
    if (end_date_expected !== undefined) fieldsToUpdate.push("end_date_expected");

    if (fieldsToUpdate.length === 0) {
      return res.status(400).json({ error: "No fields to update" });
    }

    // Validar campos fornecidos
    if (name !== undefined && name.toString().trim().length === 0) {
      return res.status(400).json({ error: "Project name cannot be empty" });
    }

    if (description !== undefined && description.toString().trim().length === 0) {
      return res.status(400).json({ error: "Project description cannot be empty" });
    }

    if (
      project_status_id !== undefined &&
      (project_status_id === null || project_status_id.toString().trim().length === 0)
    ) {
      return res.status(400).json({ error: "Project status ID must be valid" });
    }

    if (start_date !== undefined && start_date === null) {
      return res.status(400).json({ error: "Start date must be valid" });
    }

    if (end_date_expected !== undefined && end_date_expected === null) {
      return res.status(400).json({ error: "End date must be valid" });
    }
  } else {
    // Criar: name, description e project_status_id são obrigatórios
    if (!name || name.toString().trim().length === 0) {
      return res.status(400).json({ error: "Project name is required" });
    }

    if (!description || description.toString().trim().length === 0) {
      return res.status(400).json({ error: "Project description is required" });
    }

    if (
      project_status_id === undefined ||
      project_status_id === null ||
      project_status_id.toString().trim().length === 0
    ) {
      return res.status(400).json({ error: "Project status ID is required" });
    }
  }

  next();
};
