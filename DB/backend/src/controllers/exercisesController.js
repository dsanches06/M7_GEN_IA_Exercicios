import * as commentService from "../services/commentService.js";
import * as aiService from "../services/aiExercisesService.js";

export const getSentimentDashboardFromDB = async (req, res) => {
  try {
    // Busca TODOS os comentários do banco
    const comments = await commentService.getAllComments();
    
    if (comments.length === 0) {
      return res.status(400).json({ 
        error: "Nenhum comentário encontrado no banco de dados" 
      });
    }

    // Formata como string (igual ao exercicio6.js fazia)
    const commentsList = comments
      .map((c, i) => `${i + 1}. "${c}"`)
      .join("\n");

    // Chama a análise de IA
    const dashboard = await aiService.analyzeTeamSentiment(commentsList);

    res.json({ 
      success: true, 
      totalComments: comments.length,
      dashboard 
    });
  } catch (error) {
    res.status(500).json({ 
      error: `Erro ao gerar dashboard: ${error.message}` 
    });
  }
};