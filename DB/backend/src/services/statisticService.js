import { db } from "../db.js";

/* Função para obter o ranking dos 3 usuários com mais horas reais registradas */
export const getRankingMoreHours = async () => {
  const query = `SELECT 
        u.name AS utilizador,
        SUM(rt.hours) AS total_horas_reais
    FROM time_logs rt
    JOIN users u ON rt.user_id = u.id
    GROUP BY rt.user_id, u.name
    ORDER BY total_horas_reais DESC
    LIMIT 3;`;
  const [ranking] = await db.query(query);
  return ranking.map((row) => ({
    projeto: "Todos Projetos",
    utilizador: row.utilizador,
    total_horas_reais: row.total_horas_reais,
    ranking: 0,
  }));
};

/* Função para obter o ranking dos 3 usuários com mais horas reais registradas em um projeto específico */
export const getRankingIncreasedHours = async () => {
  const query = `SELECT 
        utilizador,
        data_dia,
        horas_dia,
        horas_dia_anterior,
        DENSE_RANK() OVER (ORDER BY horas_dia DESC) AS ranking_do_dia
    FROM (
        SELECT 
            utilizador,
            data_dia,
            horas_dia,
            LAG(horas_dia) OVER (PARTITION BY user_id ORDER BY data_dia) AS horas_dia_anterior
        FROM (
            SELECT 
                rt.user_id,
                u.name AS utilizador,
                DATE(rt.logged_at) AS data_dia,
                SUM(rt.hours) AS horas_dia
            FROM time_logs rt
            JOIN users u ON rt.user_id = u.id
            GROUP BY rt.user_id, u.name, DATE(rt.logged_at)
        ) AS base
    ) AS x
    WHERE horas_dia > horas_dia_anterior;`;
  const [ranking] = await db.query(query);
  return ranking;
};

/* Função para obter o ranking dos projetos com mais horas reais registradas */
export const getRankingAboveAverage = async () => {
  const query = `SELECT *
    FROM (
        SELECT 
            projeto,
            total_horas_projeto,
            AVG(total_horas_projeto) OVER () AS media_geral_sistema
        FROM (
            SELECT 
                p.name AS projeto,
                SUM(rt.hours) AS total_horas_projeto
            FROM time_logs rt
            JOIN task t ON rt.task_id = t.id
            JOIN project p ON t.project_id = p.id
            GROUP BY p.id, p.name
        ) AS base
    ) AS analise_media
    WHERE total_horas_projeto > media_geral_sistema;`;
  const [average] = await db.query(query);
  return average;
};
