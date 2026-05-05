DROP DATABASE IF EXISTS clickup_db;
CREATE DATABASE clickup_db;
USE clickup_db;

-- Tabela de Referência de Roles
CREATE TABLE roles (
	id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(20) NOT NULL,
    flow_order INT
);

/* Users */
CREATE TABLE users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(200) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20) NOT NULL,
    active BOOLEAN DEFAULT TRUE,
    gender VARCHAR(20) NOT NULL,
    role_id INT DEFAULT 2,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (role_id)
        REFERENCES roles (id)
        ON DELETE CASCADE
);
/* Project Status */
CREATE TABLE project_status (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    flow_order INT
);

/* Project */
CREATE TABLE project (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    description TEXT NOT NULL,
    project_status_id INT,
    start_date DATETIME,
    end_date_expected DATETIME,
    FOREIGN KEY (project_status_id)
        REFERENCES project_status (id)
        ON DELETE CASCADE
);

/* Meeting Summaries */
CREATE TABLE meeting_summaries (
    id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT,
    original_text VARCHAR(300) NOT NULL,
    summary VARCHAR(200),
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id)
        REFERENCES project (id)
        ON DELETE CASCADE
);

-- Tabela Principal de Sessões de Chat
CREATE TABLE conversations (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Tabela de Mensagens (Histórico)
CREATE TABLE chat_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    conversation_id INT NOT NULL,
    role_id INT NOT NULL,
    content TEXT NOT NULL,
    sent_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (conversation_id)
        REFERENCES conversations (id)
        ON DELETE CASCADE,
     FOREIGN KEY (role_id)
        REFERENCES roles (id)
);

/* Ticket */
CREATE TABLE tickets (
	id INT PRIMARY KEY AUTO_INCREMENT,
    user_report TEXT NOT NULL,
    error_type VARCHAR(20),            
    severity INT CHECK (severity BETWEEN 1 AND 10), 
    fix_suggestion TEXT,                
    status VARCHAR(20) DEFAULT 'open',  
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

/* Task Meta-data */
CREATE TABLE task_status (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    flow_order INT
);
CREATE TABLE task_types (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    flow_order INT
);
CREATE TABLE categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    flow_order INT
);
CREATE TABLE priorities (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    flow_order INT
);
/* Task */
CREATE TABLE task (
    id INT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(200) NOT NULL,
    description TEXT NOT NULL,
    types_id INT NOT NULL,
    status_id INT NOT NULL,
    priority_id INT NOT NULL,
    category_id INT NOT NULL,
    project_id INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    due_date DATETIME,
    completed_at DATETIME,
    estimated_hours DECIMAL(5 , 2 ) NOT NULL,
    FOREIGN KEY (project_id)
        REFERENCES project (id)
        ON DELETE CASCADE,
    FOREIGN KEY (status_id)
        REFERENCES task_status (id)
        ON DELETE CASCADE,
    FOREIGN KEY (priority_id)
        REFERENCES priorities (id)
        ON DELETE CASCADE,
    FOREIGN KEY (category_id)
        REFERENCES categories (id)
        ON DELETE CASCADE,
    FOREIGN KEY (types_id)
        REFERENCES task_types (id)
        ON DELETE CASCADE
);
/* Task Assignees (1:N com Unique Key para simular regra de 1 dev por task) */
CREATE TABLE task_assignees (
    task_id INT NOT NULL,
    user_id INT NOT NULL,
    assigned_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (task_id , user_id),
    UNIQUE KEY uniq_task_assignment (task_id),
    FOREIGN KEY (task_id)
        REFERENCES task (id)
        ON DELETE CASCADE,
    FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE CASCADE
);
/* Tags & NM */
CREATE TABLE tags (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL UNIQUE,
    color VARCHAR(20)
);
CREATE TABLE tags_task (
    task_id INT NOT NULL,
    tag_id INT NOT NULL,
    PRIMARY KEY (task_id , tag_id),
    FOREIGN KEY (task_id)
        REFERENCES task (id)
        ON DELETE CASCADE,
    FOREIGN KEY (tag_id)
        REFERENCES tags (id)
        ON DELETE CASCADE
);
/* Favorite Tasks */
CREATE TABLE favorite_task (
    id INT PRIMARY KEY AUTO_INCREMENT,
    task_id INT NOT NULL,
    user_id INT NOT NULL,
    marked_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    UNIQUE KEY uniq_favorite_task (task_id , user_id),
    FOREIGN KEY (task_id)
        REFERENCES task (id)
        ON DELETE CASCADE,
    FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE CASCADE
);
/* Comments & Mentions */
CREATE TABLE comment (
    id INT PRIMARY KEY AUTO_INCREMENT,
    content TEXT NOT NULL,
    task_id INT NOT NULL,
    user_id INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    edited_at DATETIME,
    resolved BOOLEAN DEFAULT FALSE,
    FOREIGN KEY (task_id)
        REFERENCES task (id)
        ON DELETE CASCADE,
    FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE CASCADE
);
CREATE TABLE mentions (
    id INT PRIMARY KEY AUTO_INCREMENT,
    comment_id INT,
    mentioned_user_id INT,
    FOREIGN KEY (comment_id)
        REFERENCES comment (id)
        ON DELETE CASCADE,
    FOREIGN KEY (mentioned_user_id)
        REFERENCES users (id)
        ON DELETE CASCADE
);
/* Notifications */
CREATE TABLE notification (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id INT NOT NULL,
    title VARCHAR(200) NOT NULL,
    message TEXT NOT NULL,
    is_read BOOLEAN DEFAULT FALSE,
    sent_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE CASCADE
);
/* Teams & Roles */
CREATE TABLE teams (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(50) NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE team_members_roles (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    flow_order INT
);
CREATE TABLE team_members (
    team_id INT NOT NULL,
    user_id INT NOT NULL,
    role_id INT,
    joined_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (team_id , user_id),
    FOREIGN KEY (team_id)
        REFERENCES teams (id)
        ON DELETE CASCADE,
    FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE CASCADE,
    FOREIGN KEY (role_id)
        REFERENCES team_members_roles (id)
        ON DELETE CASCADE
);
/* Time Logs */
CREATE TABLE time_logs (
    id INT PRIMARY KEY AUTO_INCREMENT,
    task_id INT,
    user_id INT,
    hours DECIMAL(5 , 2 ) NOT NULL,
    description TEXT NOT NULL,
    logged_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE CASCADE,
    FOREIGN KEY (task_id)
        REFERENCES task (id)
        ON DELETE CASCADE
);
/* Reminders */
CREATE TABLE reminder (
    id INT PRIMARY KEY AUTO_INCREMENT,
    task_id INT NOT NULL,
    user_id INT,
    remind_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id)
        REFERENCES task (id)
        ON DELETE CASCADE,
    FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE CASCADE
);
/* Project Permissions */
CREATE TABLE project_permission (
    id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT NOT NULL,
    user_id INT NOT NULL,
    permission VARCHAR(50) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (project_id)
        REFERENCES project (id)
        ON DELETE CASCADE,
    FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE CASCADE
);
/* Task Votes */
CREATE TABLE task_vote (
    id INT PRIMARY KEY AUTO_INCREMENT,
    task_id INT NOT NULL,
    user_id INT NOT NULL,
    vote_type VARCHAR(50) NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id)
        REFERENCES task (id)
        ON DELETE CASCADE,
    FOREIGN KEY (user_id)
        REFERENCES users (id)
        ON DELETE CASCADE
);
/* Task Dependencies */
CREATE TABLE task_dependency (
    id INT PRIMARY KEY AUTO_INCREMENT,
    task_id INT NOT NULL,
    depends_on_task_id INT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id)
        REFERENCES task (id)
        ON DELETE CASCADE,
    FOREIGN KEY (depends_on_task_id)
        REFERENCES task (id)
        ON DELETE CASCADE
);
/* Task Attachments */
CREATE TABLE task_attachment (
    id INT PRIMARY KEY AUTO_INCREMENT,
    task_id INT NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    uploaded_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (task_id)
        REFERENCES task (id)
        ON DELETE CASCADE
);
/* Task Status History */
CREATE TABLE task_status_history (
    id INT PRIMARY KEY AUTO_INCREMENT,
    task_id INT NOT NULL,
    status_id INT NOT NULL,
    changed_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    changed_by INT,
    FOREIGN KEY (task_id)
        REFERENCES task (id)
        ON DELETE CASCADE,
    FOREIGN KEY (status_id)
        REFERENCES task_status (id)
        ON DELETE CASCADE,
    FOREIGN KEY (changed_by)
        REFERENCES users (id)
        ON DELETE SET NULL
);
/* Sprints */
CREATE TABLE sprints (
    id INT PRIMARY KEY AUTO_INCREMENT,
    project_id INT NOT NULL,
    name VARCHAR(100),
    description TEXT,
    status_id INT NOT NULL,
    start_date DATETIME,
    end_date DATETIME,
    FOREIGN KEY (project_id)
        REFERENCES project (id)
        ON DELETE CASCADE,
    FOREIGN KEY (status_id)
        REFERENCES project_status (id)
        ON DELETE CASCADE
);
CREATE TABLE sprint_tasks (
    sprint_id INT,
    task_id INT,
    PRIMARY KEY (sprint_id , task_id),
    FOREIGN KEY (sprint_id)
        REFERENCES sprints (id)
        ON DELETE CASCADE,
    FOREIGN KEY (task_id)
        REFERENCES task (id)
        ON DELETE CASCADE
);
-- =====================================================
-- 2. INSERÇÃO DE DADOS SINCRONIZADOS
-- =====================================================

/* roles */
INSERT INTO roles (id, name, flow_order) VALUES (1,'ADMIN',1), (2,'USER',2), (3,'MODEL',3);

/* 10 Users */
INSERT INTO users (id, name, email, phone, gender) VALUES
(1, 'Ana Silva', 'ana@dev.com', '555-0101', 'Female'), 
(2, 'Bruno Costa', 'bruno@dev.com', '555-0102', 'Male'),
(3, 'Carla Dias', 'carla@dev.com', '555-0103', 'Female'),
 (4, 'David Reas', 'david@dev.com', '555-0104', 'Male'),
(5, 'Elena Vaz', 'elena@dev.com', '555-0105', 'Female'), 
(6, 'Filipe Gil', 'filipe@dev.com', '555-0106', 'Male'),
(7, 'Gina Rosa', 'gina@dev.com', '555-0107', 'Female'),
 (8, 'Hugo Neto', 'hugo@dev.com', '555-0108', 'Male'),
(9, 'Igor Lima', 'igor@dev.com', '555-0109', 'Male'),
 (10, 'Joana Luz', 'joana@dev.com', '555-0110', 'Female');

/* Status e Metadados */
INSERT INTO project_status (id, name, flow_order) VALUES (1, 'Ativo', 1), (2, 'Em Desenvolvimento', 2), (3, 'Concluido', 3);
INSERT INTO task_status (id, name, flow_order) VALUES (1,'CREATED',1), (2,'ASSIGNED',2), (3,'IN_PROGRESS',3), (4,'BLOCKED',4), (5,'COMPLETED',5), (6,'ARCHIVED',6);
INSERT INTO task_types (id, name,flow_order) VALUES (1,'Feature',1), (2,'Bug',2), (3,'Task',3);
INSERT INTO priorities (id, name, flow_order) VALUES (1,'Baixa',1), (2,'Média',2), (3,'Alta',3);
INSERT INTO categories (id, name, flow_order) VALUES (1,'WORKED',1), (2,'PERSONAL',2), (3,'STUDY',3);

/* 3 Teams e Roles */
INSERT INTO teams (id, name, description) VALUES 
(1,'Squad Frontend', 'UI/UX'), 
(2,'Squad Backend', 'API'), (3,'Squad DevOps', 'Infra');

INSERT INTO team_members_roles (id, name) VALUES (1,'Lead'), (2,'Dev');

INSERT INTO team_members (team_id, user_id, role_id) VALUES
(1,1,1), (1,2,2), (1,3,2), (2,4,1), (2,5,2), (2,6,2), (3,7,1), (3,8,2), (3,9,2), (3,10,2);
/* 3 Projetos */

INSERT INTO project (id, name, description, project_status_id, start_date) VALUES
(1, 'Portal E-learning', 'Escola online', 1, '2026-01-01'),
(2, 'App Logística', 'Frotas e GPS', 1, '2026-01-15'),
(3, 'Data Lake Cloud', 'Infraestrutura AWS', 1, '2026-02-01');

/* 20 Tarefas Sincronizadas */
INSERT INTO task (id, title, description, types_id, status_id, priority_id, category_id, project_id, estimated_hours, due_date) VALUES
(1,'Login UI','Ecrã login',1,3,3,1,1,8,'2026-02-01'),
(2,'API Auth','JWT Auth',1,3,3,2,1,12,'2026-02-01'),
(3,'Sidebar','Menu',1,2,2,1,1,5,'2026-02-15'), 
(4,'DB Schema','Tabelas SQL',1,3,2,3,1,6,'2026-01-20'),
(5,'Bug Botão','Fix click',2,1,1,1,1,2,'2026-03-01'),
(6,'Profile Page','Dados user',1,1,2,1,1,10,'2026-03-05'),
(7,'Notificações','Push',1,1,2,2,1,15,'2026-03-10'),
(8,'GPS Maps','Integração',1,2,3,1,2,20,'2026-02-28'),
(9,'Driver API','Endpoints',1,3,3,2,2,10,'2026-02-10'), 
(10,'Query Optm','Frotas',1,2,2,3,2,8,'2026-03-01'),
(11,'Icons Pack','Design',1,3,1,1,2,4,'2026-01-30'), 
(12,'Fuel Log','Combustível',1,1,2,2,2,12,'2026-03-15'),
(13,'Reports','PDF mensal',1,1,2,2,2,10,'2026-03-20'),
(14,'Fix Crash','Boot fix',3,3,3,2,2,4,'2026-02-01'),
(15,'S3 Config','AWS Storage',1,3,3,3,3,10,'2026-02-10'),
(16,'ETL Job','Data sync',1,2,3,3,3,20,'2026-03-15'),
(17,'Backup DB','Crontab',1,3,2,3,3,5,'2026-02-15'), 
(18,'Dashboard','Charts',1,1,2,1,3,15,'2026-04-01'),
(19,'IAM Roles','Permissões',1,2,3,3,3,6,'2026-03-20'), 
(20,'Index Fix','Slow query',2,2,3,3,3,4,'2026-03-25');

/* Atribuições (Respeitando Squads) */
INSERT INTO task_assignees (task_id, user_id) VALUES
(1,1), (2,4), (3,2), (4,7), (5,3), (6,1), (7,5), (8,1), 
(9,5), (10,8), (11,2), (12,4), (13,6), (14,5), (15,7), 
(16,8), (17,9), (18,2), (19,10), (20,8);

/* Sprints */
INSERT INTO sprints (id, project_id, name, status_id, start_date, end_date) VALUES
(1, 1, 'Sprint Jan - MVP', 1, '2026-01-01', '2026-01-31'),
(2, 2, 'Sprint Fev - Logística', 1, '2026-02-01', '2026-02-28');

INSERT INTO sprint_tasks (sprint_id, task_id) VALUES (1,1), (1,2), (1,4), (2,8), (2,9), (2,14);

-- 3. COMENTÁRIOS, MENÇÕES E NOTIFICAÇÕES (Conforme solicitado)
INSERT INTO comment (content, task_id, user_id, created_at, edited_at, resolved) VALUES

('Não consigo concluir esta tarefa', 1, 1, NOW(), NULL, FALSE),
('Já finalizei esta parte', 1, 2, NOW(), NOW(), TRUE),

('Existe um bug nesta funcionalidade', 2, 3, NOW(), NULL, FALSE),
('Corrigido, podem validar', 2, 4, NOW(), NOW(), TRUE),

('Preciso de mais detalhes sobre este requisito', 3, 2, NOW(), NULL, FALSE),
('Documentação atualizada', 3, 1, NOW(), NOW(), TRUE),

('A API está a falhar neste ponto', 4, 3, NOW(), NULL, FALSE),
('Erro identificado e corrigido', 4, 5, NOW(), NOW(), TRUE),

('Interface não está responsiva', 5, 4, NOW(), NULL, FALSE),
('Ajustei o CSS, verificar novamente', 5, 2, NOW(), NOW(), TRUE),

('Problema ao guardar dados', 6, 1, NOW(), NULL, FALSE),
('Resolvido após ajuste no backend', 6, 3, NOW(), NOW(), TRUE),

('Erro ao fazer upload de ficheiros', 7, 2, NOW(), NULL, FALSE),
('Limite de tamanho aumentado', 7, 4, NOW(), NOW(), TRUE),

('Sistema muito lento nesta tarefa', 8, 5, NOW(), NULL, FALSE),
('Implementado cache', 8, 1, NOW(), NOW(), TRUE),

('Não tenho permissões para editar', 9, 3, NOW(), NULL, FALSE),
('Permissões corrigidas', 9, 2, NOW(), NOW(), TRUE),

('Erro na geração de relatório', 10, 4, NOW(), NULL, FALSE),
('Query otimizada e corrigida', 10, 5, NOW(), NOW(), TRUE);

INSERT INTO mentions (comment_id, mentioned_user_id) VALUES 
(1, 1), -- David menciona Ana
(3, 7); -- Alguém menciona Gina

INSERT INTO notification (user_id, title, message) VALUES 
(1, 'Menção', 'Foste mencionada pelo David na tarefa Login UI'),
(7, 'Menção', 'Configuração S3 concluída');

-- 4. TIME LOGS (Registo de horas reais)
INSERT INTO time_logs (task_id, user_id, hours, description) VALUES 
(1, 1, 4.5, 'Coding UI'), 
(2, 4, 8.0, 'Setup JWT'), 
(11, 7, 5.0, 'Config S3'),
(7, 5, 10.0, 'Desenvolvimento Endpoints'),
(12, 8, 7.5, 'Processamento de dados');

-- 2. Criação de Tags (Categorização visual)
INSERT INTO tags (id, name, color) VALUES 
(1, 'Urgente', 'Red'), 
(2, 'Backend', 'Green'), 
(3, 'Frontend', 'Blue'), 
(4, 'Bug', 'Orange'), 
(5, 'Revisão', 'Purple'),
(6, 'Infra', 'Grey');

-- 3. Associação Tags -> Task (N:M)
-- Sincronizado com as 15 tarefas anteriores
INSERT INTO tags_task (task_id, tag_id) VALUES 
(1, 1), (1, 3), -- Task 1: Urgente + Frontend
(2, 2),         -- Task 2: Backend
(3, 3),         -- Task 3: Frontend
(4, 2), (4, 6), -- Task 4: Backend + Infra
(5, 4), (5, 1), -- Task 5: Bug + Urgente
(6, 3), (6, 1), -- Task 6: Frontend + Urgente
(7, 2),         -- Task 7: Backend
(8, 3),         -- Task 8: Frontend
(9, 2), (9, 5), -- Task 9: Backend + Revisão
(10, 4),        -- Task 10: Bug
(11, 6),        -- Task 11: Infra
(12, 6), (12, 5),-- Task 12: Infra + Revisão
(13, 6),        -- Task 13: Infra
(14, 6),        -- Task 14: Infra
(15, 2);        -- Task 15: Backend


INSERT INTO conversations (id, title, created_at) VALUES
(1, 'Suporte Login', NOW()),
(2, 'Erro API Pagamentos', NOW()),
(3, 'Problema UI Dashboard', NOW()),
(4, 'Bug Notificações', NOW()),
(5, 'Ajuda Integração', NOW()),
(6, 'Erro Base de Dados', NOW()),
(7, 'Lentidão Sistema', NOW()),
(8, 'Configuração Projeto', NOW()),
(9, 'Erro Deploy', NOW()),
(10, 'Suporte Mobile', NOW()),
(11, 'Bug Filtros', NOW()),
(12, 'Problema Upload', NOW()),
(13, 'Erro Autenticação', NOW()),
(14, 'UI Quebrada', NOW()),
(15, 'Falha Email', NOW()),
(16, 'Erro Permissões', NOW()),
(17, 'Bug Relatórios', NOW()),
(18, 'Problema Cache', NOW()),
(19, 'Erro Integração API', NOW()),
(20, 'Suporte Geral', NOW());

INSERT INTO chat_history (conversation_id, role_id, content, sent_at) VALUES

-- Conversa 1
(1, 2, 'Não consigo fazer login', NOW()),
(1, 3, 'Pode verificar se a senha está correta?', NOW()),
(1, 2, 'Sim mas continua a falhar', NOW()),

-- Conversa 2
(2, 2, 'API de pagamentos está a dar erro 500', NOW()),
(2, 3, 'Verifique os logs do servidor', NOW()),
(2, 2, 'Já verifiquei, parece timeout', NOW()),

-- Conversa 3
(3, 2, 'O dashboard não carrega', NOW()),
(3, 3, 'Pode limpar o cache?', NOW()),
(3, 2, 'Já tentei, sem sucesso', NOW()),

-- Conversa 4
(4, 2, 'Não recebo notificações', NOW()),
(4, 3, 'Verifique as configurações', NOW()),
(4, 2, 'Está tudo ativo', NOW()),

-- Conversa 5
(5, 2, 'Preciso integrar com API externa', NOW()),
(5, 3, 'Use token de autenticação', NOW()),
(5, 2, 'Onde configuro isso?', NOW()),

-- Conversa 6
(6, 2, 'Erro ao conectar à base de dados', NOW()),
(6, 3, 'Verifique a string de conexão', NOW()),
(6, 2, 'Está correta', NOW()),

-- Conversa 7
(7, 2, 'Sistema está lento', NOW()),
(7, 3, 'Pode ser carga alta', NOW()),
(7, 2, 'Sim muitos utilizadores', NOW()),

-- Conversa 8
(8, 2, 'Como configuro projeto?', NOW()),
(8, 3, 'Aceda às settings', NOW()),
(8, 2, 'Ok obrigado', NOW()),

-- Conversa 9
(9, 2, 'Erro no deploy', NOW()),
(9, 3, 'Verifique logs CI/CD', NOW()),
(9, 2, 'Erro de build', NOW()),

-- Conversa 10
(10, 2, 'App mobile crasha', NOW()),
(10, 3, 'Qual dispositivo?', NOW()),
(10, 2, 'Android', NOW()),

-- Conversas 11–20 (mesmo padrão)
(11, 2, 'Filtro não funciona', NOW()),
(11, 3, 'Atualize página', NOW()),
(11, 2, 'Sem efeito', NOW()),

(12, 2, 'Upload falha', NOW()),
(12, 3, 'Formato do ficheiro?', NOW()),
(12, 2, 'PDF', NOW()),

(13, 2, 'Erro autenticação', NOW()),
(13, 3, 'Token expirado?', NOW()),
(13, 2, 'Sim', NOW()),

(14, 2, 'UI está quebrada', NOW()),
(14, 3, 'Qual browser?', NOW()),
(14, 2, 'Chrome', NOW()),

(15, 2, 'Emails não chegam', NOW()),
(15, 3, 'Verifique SMTP', NOW()),
(15, 2, 'Está ok', NOW()),

(16, 2, 'Sem permissões', NOW()),
(16, 3, 'Role correta?', NOW()),
(16, 2, 'Não', NOW()),

(17, 2, 'Relatórios falham', NOW()),
(17, 3, 'Erro SQL?', NOW()),
(17, 2, 'Sim', NOW()),

(18, 2, 'Cache não limpa', NOW()),
(18, 3, 'Reinicie serviço', NOW()),
(18, 2, 'Funcionou', NOW()),

(19, 2, 'API externa falha', NOW()),
(19, 3, 'Timeout?', NOW()),
(19, 2, 'Sim', NOW()),

(20, 2, 'Preciso de ajuda geral', NOW()),
(20, 3, 'Como posso ajudar?', NOW()),
(20, 2, 'Configuração inicial', NOW());


INSERT INTO meeting_summaries (project_id, original_text, summary, created_at) VALUES

-- PROJECT 1: Portal E-learning
(1, 'Discussão sobre login de alunos', 
'Decisões: Melhorar autenticação.
Tarefas: Backend rever login.
Próximos passos: Testes.
Riscos: Acesso bloqueado.', NOW()),

(1, 'Problemas no carregamento de cursos',
'Decisões: Otimizar queries.
Tarefas: Backend melhorar performance.
Próximos passos: Monitorização.
Riscos: Má experiência.', NOW()),

(1, 'Feedback de alunos sobre UI',
'Decisões: Melhorar interface.
Tarefas: Design ajustar layout.
Próximos passos: Testes UX.
Riscos: Baixa retenção.', NOW()),

(1, 'Erro ao submeter exercícios',
'Decisões: Corrigir backend.
Tarefas: Dev ajustar API.
Próximos passos: Deploy.
Riscos: Perda de submissões.', NOW()),

(1, 'Sistema de avaliações lento',
'Decisões: Implementar cache.
Tarefas: Backend usar Redis.
Próximos passos: Testes.
Riscos: Lentidão contínua.', NOW()),

(1, 'Integração com vídeo falha',
'Decisões: Rever integração.
Tarefas: Corrigir player.
Próximos passos: Testes.
Riscos: Aulas indisponíveis.', NOW()),

-- PROJECT 2: App Logística
(2, 'Erro no tracking GPS',
'Decisões: Melhorar precisão.
Tarefas: Backend ajustar API GPS.
Próximos passos: Testes campo.
Riscos: Dados incorretos.', NOW()),

(2, 'Falhas na sincronização de rotas',
'Decisões: Implementar retry.
Tarefas: Backend corrigir sync.
Próximos passos: Monitorização.
Riscos: Rotas perdidas.', NOW()),

(2, 'App crasha em Android',
'Decisões: Corrigir bug crítico.
Tarefas: Mobile debug.
Próximos passos: Update app.
Riscos: Perda de utilizadores.', NOW()),

(2, 'Performance baixa em mapas',
'Decisões: Otimizar render.
Tarefas: Mobile melhorar mapas.
Próximos passos: Testes.
Riscos: UX negativa.', NOW()),

(2, 'Erro ao registar entregas',
'Decisões: Rever backend.
Tarefas: Corrigir API.
Próximos passos: Deploy.
Riscos: Dados inconsistentes.', NOW()),

(2, 'Problema notificações motoristas',
'Decisões: Rever push system.
Tarefas: Corrigir notificações.
Próximos passos: Testes.
Riscos: Falha comunicação.', NOW()),

(2, 'Tempo de resposta alto',
'Decisões: Melhorar infra.
Tarefas: Escalar servidores.
Próximos passos: Monitorização.
Riscos: Lentidão.', NOW()),

-- PROJECT 3: Data Lake Cloud
(3, 'Erro ingestão de dados',
'Decisões: Rever pipeline.
Tarefas: Data team corrigir ETL.
Próximos passos: Testes.
Riscos: Perda de dados.', NOW()),

(3, 'Problemas no armazenamento S3',
'Decisões: Ajustar permissões.
Tarefas: DevOps corrigir IAM.
Próximos passos: Auditoria.
Riscos: Acesso indevido.', NOW()),

(3, 'Custos AWS elevados',
'Decisões: Otimizar recursos.
Tarefas: Reduzir instâncias.
Próximos passos: Monitorização.
Riscos: Orçamento excedido.', NOW()),

(3, 'Pipeline lento',
'Decisões: Paralelizar jobs.
Tarefas: Melhorar processamento.
Próximos passos: Testes.
Riscos: Atrasos.', NOW()),

(3, 'Falha em jobs agendados',
'Decisões: Rever scheduler.
Tarefas: Corrigir cron jobs.
Próximos passos: Monitorização.
Riscos: Dados desatualizados.', NOW()),

(3, 'Erro na validação de dados',
'Decisões: Melhorar validação.
Tarefas: Ajustar regras.
Próximos passos: Testes.
Riscos: Dados inválidos.', NOW()),

(3, 'Dashboard não atualiza',
'Decisões: Rever queries.
Tarefas: Corrigir backend.
Próximos passos: Deploy.
Riscos: Informação incorreta.', NOW());

INSERT INTO tickets (user_report, error_type, severity, fix_suggestion, status, created_at) VALUES

-- 🔴 CRITICAL (auto-escalados)
('Sistema crasha ao fazer login', 'API', 9, 'Rever autenticação e logs', 'open', NOW()),
('Base de dados não responde', 'Database', 10, 'Verificar conexão e índices', 'open', NOW()),
('API pagamentos retorna erro 500', 'API', 9, 'Implementar retries e logs', 'in_progress', NOW()),
('Perda de dados ao guardar', 'Database', 10, 'Corrigir transações', 'open', NOW()),
('Aplicação crasha no mobile', 'UI', 8, 'Debug crash logs Android', 'in_progress', NOW()),

-- 🟠 HIGH
('Dashboard demora muito a carregar', 'API', 7, 'Otimizar queries', 'in_progress', NOW()),
('Erro ao gerar relatórios', 'Database', 6, 'Rever SQL', 'open', NOW()),
('Upload de ficheiros falha', 'API', 7, 'Validar limites e tipos', 'closed', NOW()),
('Filtros não funcionam corretamente', 'UI', 6, 'Corrigir lógica frontend', 'in_progress', NOW()),
('Notificações não chegam', 'API', 7, 'Rever sistema push', 'open', NOW()),

-- 🟡 NORMAL
('Layout desalinhado em alguns ecrãs', 'UI', 4, 'Ajustar CSS', 'closed', NOW()),
('Mensagem de erro pouco clara', 'UI', 3, 'Melhorar UX', 'closed', NOW()),
('Tempo de resposta ligeiramente alto', 'API', 5, 'Otimizar endpoints', 'in_progress', NOW()),
('Cache não está a funcionar corretamente', 'API', 5, 'Configurar Redis', 'open', NOW()),
('Erro ao exportar dados', 'API', 5, 'Corrigir endpoint export', 'open', NOW()),

-- 🟢 LOW
('Texto com erro ortográfico', 'UI', 1, 'Corrigir texto', 'closed', NOW()),
('Ícone desalinhado', 'UI', 2, 'Ajustar CSS', 'closed', NOW()),
('Tooltip não aparece', 'UI', 2, 'Corrigir JS', 'closed', NOW()),
('Cor incorreta em botão', 'UI', 1, 'Ajustar tema', 'closed', NOW()),
('Espaçamento inconsistente', 'UI', 2, 'Refinar layout', 'closed', NOW());