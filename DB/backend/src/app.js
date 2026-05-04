import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import projectRoutes from "./routes/projectRoutes.js";
import userRoutes from "./routes/userRoutes.js";
import taskRoutes from "./routes/taskRoutes.js";
import tagRoutes from "./routes/tagRoutes.js";
import notificationRoutes from "./routes/notificationRoutes.js";
import sprintRoutes from "./routes/sprintRoutes.js";
import projectStatusRoutes from "./routes/projectStatusRoutes.js";
import taskStatusRoutes from "./routes/taskStatusRoutes.js";
import categoryRoutes from "./routes/categoryRoutes.js";
import taskTypesRoutes from "./routes/taskTypesRoutes.js";
import priorityRoutes from "./routes/priorityRoutes.js";
import tagTaskRoutes from "./routes/tagTaskRoutes.js";
import taskAssigneesRoutes from "./routes/taskAssigneesRoutes.js";
import teamRoutes from "./routes/teamRoutes.js";
import teamMembersRoleRoutes from "./routes/teamMembersRoleRoutes.js";
import taskAttachmentRoutes from "./routes/taskAttachmentRoutes.js";
import taskVoteRoutes from "./routes/taskVoteRoutes.js";
import taskStatusHistoryRoutes from "./routes/taskStatusHistoryRoutes.js";
import projectPermissionRoutes from "./routes/projectPermissionRoutes.js";
import taskDependencyRoutes from "./routes/taskDependencyRoutes.js";
import favoriteTaskRoutes from "./routes/favoriteTaskRoutes.js";
import reminderRoutes from "./routes/reminderRoutes.js";
import mentionRoutes from "./routes/mentionRoutes.js";
import timeLogRoutes from "./routes/timeLogRoutes.js";
import statisticsRoutes from "./routes/statisticsRoutes.js";
import chatHistoryRoutes from "./routes/chatHistoryRoutes.js";
import conversationRoutes from "./routes/conversationRoutes.js";
import meetingSummarieRoutes from "./routes/meetingSummarieRoutes.js";
import ticketRoutes from "./routes/ticketRoutes.js";
import exercisesRoutes from "./routes/exercisesRoutes.js";
import logger from "./middlewares/loggerMiddleware.js";

const app = express();

dotenv.config();

app.use(express.json());
app.use(
  cors({
    origin: "http://localhost:5173",
    credentials: true,
  }),
);
app.use(express.urlencoded({ extended: true }));
app.use(logger);

/* Health Check Endpoint */
app.get("/health", (req, res) => {
  res.json({
    status: "OK",
    message: "ClickUp API is running",
    timestamp: new Date().toISOString(),
    port: process.env.PORT || 3000,
  });
});

app.use("/projects", projectRoutes);
app.use("/users", userRoutes);
app.use("/tasks", taskRoutes);
app.use("/tags", tagRoutes);
app.use("/notifications", notificationRoutes);
app.use("/sprints", sprintRoutes);
app.use("/project_status", projectStatusRoutes);
app.use("/task_status", taskStatusRoutes);
app.use("/categories", categoryRoutes);
app.use("/task_types", taskTypesRoutes);
app.use("/priorities", priorityRoutes);
app.use("/tags_task", tagTaskRoutes);
app.use("/task_assignees", taskAssigneesRoutes);
app.use("/teams", teamRoutes);
app.use("/team_members_roles", teamMembersRoleRoutes);
app.use("/task_attachments", taskAttachmentRoutes);
app.use("/task_votes", taskVoteRoutes);
app.use("/task_status_history", taskStatusHistoryRoutes);
app.use("/project_permissions", projectPermissionRoutes);
app.use("/task_dependencies", taskDependencyRoutes);
app.use("/favorite_tasks", favoriteTaskRoutes);
app.use("/reminders", reminderRoutes);
app.use("/mentions", mentionRoutes);
app.use("/time_logs", timeLogRoutes);
app.use("/statistics/ranking", statisticsRoutes);

// =====================================================
// 🚀 EXERCÍCIOS GUIADOS 03 - IA (GenAI Workshop)
// =====================================================
app.use("/exercises", exercisesRoutes);

// CRUD - Histórico de Chats e Conversas
app.use("/chat_history", chatHistoryRoutes);
app.use("/conversations", conversationRoutes);
app.use("/meeting_summaries", meetingSummarieRoutes);
app.use("/tickets", ticketRoutes);

/* Iniciar o servidor */
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`🚀 ClickBot v3 (@google/genai) em http://localhost:${PORT}`);
});
