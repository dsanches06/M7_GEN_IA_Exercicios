/* Função para mapear resposta de usuário */
export function mapUserDTOResponse(data) {
  return {
    id: data.id,
    name: data.name,
    email: data.email,
    phone: data.phone,
    gender: data.gender,
    active: data.active,
    created_at: data.created_at,
  };
}

/* Função para mapear resposta de status do projeto */
export function mapProjectStatusDTOResponse(data) {
  return {
    id: data.id,
    name: data.name,
    flow_order: data.flow_order,
  };
}

/* Função para mapear resposta de comentário */
export function mapProjectDTOResponse(data) {
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    project_status_id: data.project_status_id,
    start_date: data.start_date,
    end_date_expected: data.end_date_expected,
  };
}

/* Função para mapear resposta de status de tarefa */
export function mapTaskStatusDTOResponse(data) {
  return {
    id: data.id,
    name: data.name,
    flow_order: data.flow_order,
  };
}

/* Função para mapear resposta de tipos de tarefa */
export function mapTaskTypesDTOResponse(data) {
  return {
    id: data.id,
    name: data.name,
    flow_order: data.flow_order,
  };
}

/* Função para mapear resposta de categoria */
export function mapCategoryDTOResponse(data) {
  return {
    id: data.id,
    name: data.name,
    flow_order: data.flow_order,
  };
}

/* Função para mapear resposta de prioridade */
export function mapPriorityDTOResponse(data) {
  return {
    id: data.id,
    name: data.name,
    flow_order: data.flow_order,
  };
}

/* Função para mapear resposta de comentário */
export function mapTaskDTOResponse(data) {
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    types_id: data.types_id,
    status_id: data.status_id,
    priority_id: data.priority_id,
    category_id: data.category_id,
    created_at: data.created_at,
    project_id: data.project_id,
    due_date: data.due_date,
    completed_at: data.completed_at,
    estimated_hours: data.estimated_hours,
    assigned_to: data.assigned_to,
  };
}

/* Função para mapear resposta de comentário */
export function mapTaskAssigneeDTOResponse(data) {
  return {
    task_id: data.task_id,
    user_id: data.user_id,
    assigned_at: data.assigned_at,
  };
}

/* Função para mapear resposta de comentário */
export function mapTagDTOResponse(data) {
  return {
    id: data.id,
    name: data.name,
    color: data.color,
  };
}

/* Função para mapear resposta de comentário */
export function mapTagTaskDTOResponse(data) {
  return {
    task_id: data.task_id,
    tag_id: data.tag_id,
  };
}

/* Função para mapear resposta de anexo de tarefa */
export function mapTaskAttachmentDTOResponse(data) {
  return {
    id: data.id,
    task_id: data.task_id,
    file_name: data.file_name,
    file_path: data.file_path,
    uploaded_at: data.uploaded_at,
  };
}

/* Função para mapear resposta de comentário */
export function mapTaskCommentDTOResponse(data) {
  return {
    id: data.id,
    content: data.content,
    task_id: data.task_id,
    userId: data.user_id,
    created_at: data.created_at,
    edited_at: data.edited_at,
    resolved: data.resolved,
  };
}

/* Função para mapear resposta de comentário */
export function mapNotificationDTOResponse(data) {
  return {
    id: data.id,
    user_id: data.user_id,
    title: data.title,
    message: data.message,
    is_read: data.is_read,
    sent_at: data.sent_at,
  };
}

/* Função para mapear resposta de comentário */
export function mapTeamDTOResponse(data) {
  return {
    id: data.id,
    name: data.name,
    description: data.description,
    created_at: data.created_at,
  };
}

/* Função para mapear resposta de cargo de membro de equipe */
export function mapTeamMemberRolesDTOResponse(data) {
  return {
    id: data.id,
    name: data.name,
    flow_order: data.flow_order,
  };
}

/* Função para mapear resposta de comentário */
export function mapTeamMemberDTOResponse(data) {
  return {
    team_id: data.team_id,
    user_id: data.user_id,
    role_id: data.role_id,
    joined_at: data.joined_at,
  };
}

/* Função para mapear resposta de votação de tarefa */
export function mapTaskVoteDTOResponse(data) {
  return {
    id: data.id,
    task_id: data.task_id,
    user_id: data.user_id,
    vote_type: data.vote_type,
    created_at: data.created_at,
  };
}

/* Função para mapear resposta de dependência de tarefa */
export function mapTaskDependencyDTOResponse(data) {
  return {
    id: data.id,
    task_id: data.task_id,
    depends_on_task_id: data.depends_on_task_id,
    created_at: data.created_at,
  };
}

/* Função para mapear resposta de histórico de status de tarefa */
export function mapTaskStatusHistoryDTOResponse(data) {
  return {
    id: data.id,
    task_id: data.task_id,
    status_id: data.status_id,
    changed_at: data.changed_at,
    changed_by: data.changed_by,
  };
}

/* Função para mapear resposta de permissão de projeto */
export function mapProjectPermissionDTOResponse(data) {
  return {
    id: data.id,
    project_id: data.project_id,
    user_id: data.user_id,
    permission: data.permission,
    created_at: data.created_at,
  };
}

/* Função para mapear resposta de comentário */
export function mapFavoriteTaskDTOResponse(data) {
  return {
    user_id: data.user_id,
    task_id: data.task_id,
    marked_at: data.marked_at,
  };
}

/* Função para mapear resposta de lembrete */
export function mapReminderDTOResponse(data) {
  return {
    id: data.id,
    task_id: data.task_id,
    user_id: data.user_id,
    remind_at: data.remind_at,
    created_at: data.created_at,
  };
}

/* Função para mapear resposta de comentário */
export function mapSprintDTOResponse(data) {
  return {
    id: data.id,
    project_id: data.project_id,
    name: data.name,
    description: data.description,
    status_id: data.status_id,
    start_date: data.start_date,
    end_date: data.end_date,
  };
}

/* Função para mapear resposta de comentário */
export function mapSprintTaskDTOResponse(data) {
  return {
    sprint_id: data.sprint_id,
    task_id: data.task_id,
  };
}

/* Função para mapear resposta de comentário */
export function mapMentionDTOResponse(data) {
  return {
    id: data.id,
    comment_id: data.comment_id,
    mentioned_user_id: data.mentioned_user_id,
  };
}

/* Função para mapear resposta de comentário */
export function mapTimeLogDTOResponse(data) {
  return {
    id: data.id,
    task_id: data.task_id,
    user_id: data.user_id,
    hours: data.hours,
    description: data.description,
    logged_at: data.logged_at,
  };
}

/* Função para mapear resposta de estatísticas de tarefa */
export function mapTaskStatsDTOResponse(data) {
  return {
    totalTasks: data.totalTasks,
    completedTasks: data.completedTasks,
    pendingTasks: data.pendingTasks,
    completedPercentage: data.completedPercentage,
  };
}
/* Função para mapear resposta de estatísticas de usuário */
export function mapUserStatsDTOResponse(data) {
  return {
    totalUsers: data.totalUsers,
    activeUsers: data.activeUsers,
    inactiveUsers: data.inactiveUsers,
    activePercentage: data.activePercentage + "%",
  };
}

/* Função para mapear resposta de estatísticas de projetos */
export function mapProjectStatsDTOResponse(data) {
  return {
    totalProjects: data.totalProjects,
    activeProjects: data.activeProjects,
    finishedProjects: data.finishedProjects,
    inDevelopmentProjects: data.inDevelopmentProjects,
    activePercentage: data.activePercentage,
    finishedPercentage: data.finishedPercentage,
  };
}

/* Função para mapear resposta de estatísticas de sprints */
export function mapSprintStatsDTOResponse(data) {
  return {
    totalSprints: data.totalSprints,
  };
}

/* Função para mapear resposta de estatísticas de teams */
export function mapTeamStatsDTOResponse(data) {
  return {
    totalTeams: data.totalTeams,
  };
}

// Função para mapear resposta de histórico de chat
export function mapChatHistoryDTOResponse(data) {
  return {
    id: data.id,
    content: data.content,
    created_at: data.created_at,
  };
}

// Função para mapear resposta de histórico de conversa
export function mapConversationDTOResponse(data) {
  return {
    id: data.id,
    title: data.title,
    created_at: data.created_at,
  };
} 

// Função para mapear resposta de resumo de reunião
export function mapMeetingSummaryDTOResponse(data) {
  return {
    id: data.id,
    content: data.content,
    created_at: data.created_at,
  };
}

// Função para mapear resposta de tiquete
export function mapTicketDTOResponse(data) {
  return {
    id: data.id,
    title: data.title,
    description: data.description,
    status_id: data.status_id,
    priority_id: data.priority_id,
    created_at: data.created_at,
    updated_at: data.updated_at,
  };
}

