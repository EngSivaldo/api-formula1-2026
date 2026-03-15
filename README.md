# API Formula 1 - Drivers

API REST simples para consulta de pilotos da Fórmula 1, desenvolvida com Node.js e Express.

Este projeto foi criado para praticar conceitos de desenvolvimento de APIs, rotas HTTP, parâmetros de rota e manipulação de dados em JavaScript.

---

## Tecnologias utilizadas

- Node.js
- Express
- JavaScript (ES Modules)

---

## Estrutura do projeto

API-FORMULA1
│
├── app.js
├── data.js
├── package.json
├── package-lock.json
├── .gitignore
└── README.md

---

## Instalação

Clone o repositório:
git clone https://github.com/EngSivaldo/api-formula1-2026.git


Instale as dependências:
npm install



---

## Executar a aplicação

Para iniciar o servidor em modo de desenvolvimento:


A API será iniciada em:
http://localhost:3000


---

## Rotas da API

### Listar todos os pilotos
GET /api/v1/drivers


---

### Buscar piloto por posição no ranking
GET /api/v1/drivers/standings/1



---

### Buscar piloto por ID
GET /api/v1/drivers/:id

Exemplo:
GET /api/v1/drivers/8e20e33f-b840-453b-b841-d49ae331d2f7

## Exemplo de resposta


{
"name": "Max Verstappen",
"team": "Red Bull Racing",
"points": 575,
"id": "8e20e33f-b840-453b-b841-d49ae331d2f7"
}



---

## Objetivo do projeto

Este projeto foi desenvolvido para praticar:

- criação de APIs REST
- uso de rotas e parâmetros
- organização de projetos Node.js
- manipulação de arrays e objetos em JavaScript

---

## Autor

Desenvolvido por **Sivaldo**