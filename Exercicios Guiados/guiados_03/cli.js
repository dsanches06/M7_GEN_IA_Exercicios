#!/usr/bin/env node

/**
 * 🎯 CLI para Testar Exercícios do ClickBot GenAI
 */

// Garante que o ficheiro exercicio2.js existe na mesma pasta e usa as correções anteriores
import { parseTaskFromNaturalLanguage } from './exercicio2.js'; 
import http from 'http';

const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
};

function log(color, ...args) {
  console.log(colors[color], ...args, colors.reset);
}

/**
 * Função para chamar a API local.
 * Certifica-te que o teu servidor Express (app.js) está a correr na porta 3000.
 */
async function getSentimentFromAPI() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/exercises/dashboard/sentiment', // Rota ajustada conforme os exercícios
      method: 'GET',
      headers: { 'Content-Type': 'application/json' }
    };

    const req = http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          if (res.statusCode !== 200) {
             return reject(new Error(`Servidor respondeu com status ${res.statusCode}: ${data}`));
          }
          const response = JSON.parse(data);
          resolve(response);
        } catch (e) {
          reject(new Error(`Erro ao parsear resposta: ${e.message}`));
        }
      });
    });

    req.on('error', (e) => reject(new Error(`Servidor Offline? ${e.message}`)));
    req.end();
  });
}

async function runDemo() {
  log('cyan', '\n🎬 DEMO COMPLETO - ClickBot GenAI\n');

  try {
    log('yellow', '📝 Exercício 2: Smart Task Parser');
    const task = await parseTaskFromNaturalLanguage(
      'Preciso de um design para a home page até sexta com prioridade alta'
    );
    log('green', '✅ Task extraída:', JSON.stringify(task, null, 2));

    log('yellow', '\n📊 Exercício 6: Sentiment Dashboard');
    log('cyan', '⏳ A chamar API local (Porta 3000)...');
    const sentiment = await getSentimentFromAPI();
    log('green', '✅ Dashboard extraído com sucesso:');
    log('green', JSON.stringify(sentiment, null, 2));

  } catch (error) {
    log('red', '❌ Erro:', error.message);
    process.exit(1);
  }
}

async function main() {
  const cmd = process.argv[2] || 'demo';

  switch (cmd) {
    case 'demo':
      await runDemo();
      break;
    case 'parser':
      log('yellow', '🚀 Testando apenas Task Parser...');
      const task = await parseTaskFromNaturalLanguage('Criar API em Node para marketing até amanhã');
      log('green', JSON.stringify(task, null, 2));
      break;
    case 'sentiment':
      log('yellow', '🚀 Testando apenas Sentiment Dashboard...');
      const sentiment = await getSentimentFromAPI();
      log('green', JSON.stringify(sentiment, null, 2));
      break;
    default:
      log('red', `Comando desconhecido: ${cmd}`);
      log('cyan', '\nComandos: demo, parser, sentiment');
      process.exit(1);
  }
}

main().catch(error => {
  log('red', 'Erro Crítico:', error.message);
  process.exit(1);
});
