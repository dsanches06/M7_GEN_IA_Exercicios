import { db } from "../db.js";
import { mapNotificationDTOResponse } from "../dto/mapDTO.js";

/* Função para buscar todas as notificações */
export const getAllNotifications = async () => {
  const [notifications] = await db.query("SELECT * FROM notification");
  return notifications.map(mapNotificationDTOResponse);
};

/* Função para buscar notificação por ID */
export const getNotificationById = async (notificationId) => {
  const [notifications] = await db.query(
    "SELECT * FROM notification WHERE id = ?",
    [notificationId],
  );
  return notifications[0] ? map(notifications[0]) : null;
};

/* Função para buscar notificações por ID do usuário */
export const getNotificationsByUser = async (userId) => {
  const [notifications] = await db.query(
    "SELECT * FROM notification WHERE user_id = ? ORDER BY sent_at DESC",
    [userId],
  );
  return notifications.map(mapNotificationDTOResponse);
};

/* Função para buscar notificações não lidas de um usuário */
export const getUnreadNotifications = async (userId) => {
  const [notifications] = await db.query(
    "SELECT * FROM notification WHERE user_id = ? AND is_read = FALSE ORDER BY sent_at DESC",
    [userId],
  );
  return notifications.map(mapNotificationDTOResponse);
};

/* Função para criar notificação */
export const createNotification = async (data) => {
  const now = new Date();
  const mysqlDateTime = now.toISOString().slice(0, 19).replace("T", " ");

  const [result] = await db.query(
    "INSERT INTO notification (user_id, title, message, sent_at) VALUES (?, ?, ?, ?)",
    [
      data.user_id,
      data.title || "Notificação",
      data.message,
      mysqlDateTime,
    ],
  );
  return mapNotificationDTOResponse({ id: result.insertId, ...data });
};

/* Função para atualizar notificação */
export const updateNotification = async (notificationId, data) => {
  const { message, is_read } = data;
  const [result] = await db.query(
    "UPDATE notification SET message = ?, is_read = ? WHERE id = ?",
    [message, is_read, notificationId],
  );

  return result.affectedRows;
};

export const toggleReadStatus = async (notificationId, is_read) => {
  const [result] = await db.query(
    "UPDATE notification SET is_read = ? WHERE id = ?",
    [is_read, notificationId],
  );
  return result.affectedRows;
};

/* Função para deletar notificação */
export const deleteNotification = async (notificationId) => {
  const [result] = await db.query("DELETE FROM notification WHERE id = ?", [
    notificationId,
  ]);
  return result.affectedRows;
};

/* Função para marcar notificação como lida */
export const markAsRead = async (notificationId) => {
  return await toggleReadStatus(notificationId, true);
};


