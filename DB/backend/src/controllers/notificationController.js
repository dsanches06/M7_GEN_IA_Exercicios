import * as notificationService from "../services/notificationService.js";

/* Função para obter todas as notificações */
export const getNotifications = async (req, res) => {
  try {
    const notifications = await notificationService.getAllNotifications();
    res.json(notifications);
  } catch (error) {
    res
      .status(500)
      .json({ error: "Erro ao buscar notificações" });
  }
};

/* Função para obter notificação por ID */
export const getNotificationById = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ error: "ID é obrigatório" });
    }
    
    const notification = await notificationService.getNotificationById(Number(id));
    if (!notification) {
      return res.status(404).json({ error: "Notificação não encontrada" });
    }
    res.json(notification);
  } catch (error) {
    res
      .status(400)
      .json({ error: "Erro ao buscar notificação" });
  }
};

/* Função para obter notificações de um utilizador */
export const getNotificationsByUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ error: "userId é obrigatório" });
    }
    
    const notifications = await notificationService.getNotificationsByUser(Number(userId));
    res.json(notifications);
  } catch (error) {
    res
      .status(400)
      .json({ error: "Erro ao buscar notificações" });
  }
};

/* Função para obter notificações não lidas de um utilizador */
export const getUnreadNotifications = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (!userId) {
      return res.status(400).json({ message: "userId é obrigatório" });
    }
    
    const notifications = await notificationService.getUnreadNotifications(Number(userId));
    res.json(notifications);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Erro ao buscar notificações não lidas" });
  }
};

/* Função para criar notificação */
export const createNotification = async (req, res) => {
  try {
    const { user_id, userId, title, message } = req.body;
    const userId_actual = user_id || userId;

    if (!message || message.trim().length === 0) {
      return res.status(400).json({ message: "A mensagem não pode ser vazia" });
    }

    if (!userId_actual) {
      return res.status(400).json({ message: "user_id é obrigatório" });
    }

    const notification = await notificationService.createNotification({
      user_id: userId_actual,
      title: title || "Notification",
      message
    });
    res.status(201).json(notification);
  } catch (error) {
    res
      .status(400)
      .json({ message: "Erro ao criar notificação" });
  }
};

/* Função para atualizar notificação */
export const updateNotification = async (req, res) => {
  try {
    const { message, is_read } = req.body;

    if (message !== undefined && message.trim().length === 0) {
      return res.status(400).json({ message: "A mensagem não pode ser vazia" });
    }

    const affectedRows = await notificationService.updateNotification(
      Number(req.params.id),
      req.body,
    );
    
    if (affectedRows === 0) {
      return res.status(404).json({ message: "Notificação não encontrada" });
    }
    
    res.json({ message: "Notificação atualizada com sucesso" });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Erro ao atualizar notificação" });
  }
};

/* Função para deletar notificação */
export const deleteNotification = async (req, res) => {
  try {
    const { id } = req.params;
    
    if (!id) {
      return res.status(400).json({ message: "ID é obrigatório" });
    }
    
    const affectedRows = await notificationService.deleteNotification(Number(id));
    
    if (affectedRows === 0) {
      return res.status(404).json({ message: "Notificação não encontrada" });
    }
    
    res.json({ message: "Notificação deletada com sucesso" });
  } catch (error) {
    res
      .status(400)
      .json({ message: "Erro ao deletar notificação" });
  }
};
