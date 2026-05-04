#!/usr/bin/env node

/**
 * 🎯 CLI para Testar Exercícios do ClickBot GenAI
 */

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

async function getSentimentFromAPI() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'localhost',
      port: 3000,
      path: '/exercises/dashboard/sentiment/database',
      method: 'GET'
    };

    http.request(options, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.error) {
            reject(new Error(response.error));
          } else {
            resolve(response.dashboard);
          }
        } catch (e) {
          reject(new Error(`Erro ao parsear resposta: ${e.message}`));
        }
      });
    }).on('error', reject).end();
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
    const sentiment = await getSentimentFromAPI();  // ← MUDOU AQUI
    log('green', '✅ Dashboard extraído com sucesso\n');

  } catch (error) {
    log('red', '❌ Erro:', error.message);
    process.exit(1);
  }
}

async function main() {
  const cmd = process.argv[2] || 'demo';

  log('cyan', '\n🚀 ClickBot GenAI CLI\n');

  switch (cmd) {
    case 'demo':
      await runDemo();
      break;
    case 'parser':
      log('yellow', 'Task Parser');
      await runDemo();
      break;
    case 'sentiment':
      log('yellow', 'Sentiment Dashboard');
      const sentiment = await getSentimentFromAPI();  // ← MUDOU AQUI
      log('green', JSON.stringify(sentiment, null, 2));
      break;
    default:
      log('red', `Comando desconhecido: ${cmd}`);
      log('cyan', '\nComandos: demo, parser, sentiment');
      process.exit(1);
  }
}

main().catch(error => {
  log('red', 'Erro:', error.message);
  process.exit(1);
});
