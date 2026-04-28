# M7_GEN_IA_Exercicios

Este repositório reúne os exercícios, exemplos e APIs desenvolvidas durante o Módulo 7 do curso GEN IA.

## Visão geral

O projeto mostra diferentes abordagens de integração com inteligência artificial usando JavaScript e Node.js. Inclui exemplos didáticos de slides, exercícios guiados com servidores Express e implementações de APIs que consomem o Google GenAI e o Groq SDK.

## Estrutura do repositório

- `Exemplos de Slides/`
  - `Aula_01/`: exemplos da primeira aula.
  - `Aula_02/`: exemplos da segunda aula.

- `Exercicios Guiados/`
  - `guiados_01/`: primeiros exercícios guiados com frontend e servidor básico.
  - `guiados_02/`: backend Express que expõe endpoints para recursos de IA como classificação, geração de nomes, envio de mensagens e resumo de histórico.

- `first-api/`
  - Implementa uma API que usa o cliente do Google Gemini para criar tarefas estruturadas a partir de texto.

- `first-api-groq-api/`
  - Exemplo de uso do Groq SDK para criar uma requisição de chat com um modelo compatible com OpenAI.

## Dependências principais

O projeto utiliza bibliotecas para servidor web e integração com IA:

- Express
- CORS
- dotenv
- @google/genai
- groq-sdk
- nodemon

## Configuração necessária

O repositório espera variáveis de ambiente em um arquivo `.env` na raiz. As chaves importantes são:

- `GEMINI_API_KEY`: usada pelos exemplos que consomem a API Google GenAI.
- `GROQ_API_KEY`: usada pelo exemplo de Groq SDK.

## Exercícios guiados

- `guiados_01` mostra a configuração inicial de uma aplicação guiada, com integração básica entre frontend, backend e ambiente.
- `guiados_02` contém um servidor Express com rotas para funcionalidades de IA, incluindo classificação de texto, geração de nomes, envio de mensagens e sumarização.

## APIs de IA

- `first-api` demonstra como chamar o Google Gemini para transformar texto em tarefas estruturadas.
- `first-api-groq-api` demonstra o fluxo de chat usando a biblioteca Groq para conectar-se a um modelo.

## Endpoints implementados

- `Exercicios Guiados/guiados_01`
  - `POST /api/tasks/create`
  - `POST /api/tasks/refine`
  - `POST /api/tasks/summarize`
  - `POST /api/tasks/suggest-tags`

- `Exercicios Guiados/guiados_02`
  - `POST /api/clickbot/chat`
  - `POST /api/clickbot/classify`
  - `POST /api/clickbot/generate-names`
  - `POST /api/clickbot/send-message`
  - `POST /api/clickbot/summarize`

- `first-api`
  - `POST /api/tasks/create`
  - `GET /` (root endpoint)

## Como usar

O projeto está organizado para facilitar a exploração dos exercícios e das APIs. O servidor principal de rotas de aprendizado está configurado no arquivo `package.json` e pode ser iniciado a partir da raiz do repositório.

## Notas

- Os exemplos de IA dependem de chaves válidas e de conexão com os serviços externos.
- O código está estruturado em módulos para separar lógica de servidor, integração com API e rotas de aplicação.

## Autor

Repositório de exercícios do módulo 7 do curso GEN IA.

