import * as userService from "../services/userService.js";

/* Função para verificar se o usuário existe */
export const checkUserExists = async (req, res, next) => {
  // Se não houver ID nos parâmetros, continua sem validar
  if (!req.params.id) {
    return next();
  }

  try {
    const userId = Number(req.params.id);
    const user = await userService.getUserById(userId);

    if (!user) {
      return res.status(404).json({ error: "Utilizador não encontrado" });
    }

    req.user = user;
    next();
  } catch (error) {
    console.error(`Erro ao verificar usuário com ID ${req.params.id}:`, error);
    return res.status(500).json({ error: "Erro ao verificar utilizador" });
  }
};
