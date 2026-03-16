// ===============================
// IMPORTAÇÕES
// ===============================

// Framework para criar APIs e servidores HTTP
import express from "express";

// Biblioteca de validação de dados
import Joi from "joi";

// Função do Node para gerar IDs únicos
import { randomUUID } from "node:crypto";

// Importando nosso "banco de dados fake"
import { drivers } from "./data.js";


// ===============================
// CONFIGURAÇÃO INICIAL DA API
// ===============================

// Cria a aplicação Express
const app = express();

// Prefixo da API (boa prática usar versionamento)
const baseAPIRoute = "/api/v1";

// Middleware que permite receber JSON no body das requisições
app.use(express.json());

// Middleware para servir arquivos estáticos (HTML, CSS, JS)
app.use(express.static("public"));


// ===============================
// SCHEMA DE VALIDAÇÃO COM JOI
// ===============================

// Schema usado para validar dados ao criar um driver
const driverSchema = Joi.object({

  // Nome deve ser string com pelo menos 2 caracteres
  name: Joi.string().min(2).required(),

  // Time deve ser string obrigatória
  team: Joi.string().required(),

  // Pontos devem ser número inteiro >= 0
  points: Joi.number().integer().min(0).required()

});


// ===============================
// GET - LISTAR TODOS OS PILOTOS
// ===============================

app.get(baseAPIRoute + "/drivers", (req, res) => {

  try {

    // Retorna lista completa de drivers
    return res.status(200).json(drivers);

  } catch (error) {

    // Caso aconteça erro inesperado
    return res.status(500).json({
      error: "Erro interno no servidor"
    });

  }

});

// ===============================
// GET - RANKING DOS PILOTOS
// ===============================

app.get(baseAPIRoute + "/drivers/ranking", (req, res) => {

  try {

    // Ordena por pontos
    const ranking = [...drivers]
      .sort((a, b) => b.points - a.points)
      .map((driver, index) => ({
        position: index + 1,
        ...driver
      }));

    return res.status(200).json(ranking);

  } catch (error) {

    return res.status(500).json({
      error: "Erro ao gerar ranking"
    });

  }

});


// ===============================
// GET - BUSCAR DRIVER POR ID
// ===============================

app.get(baseAPIRoute + "/drivers/:id", (req, res) => {

  try {

    // Captura o ID vindo da URL
    const { id } = req.params;

    // Verifica se o ID foi enviado
    if (!id) {
      return res.status(400).json({
        error: "ID é obrigatório"
      });
    }

    // Procura o driver no array
    const driver = drivers.find(d => d.id === id);

    // Se não encontrar
    if (!driver) {
      return res.status(404).json({
        error: "Driver não encontrado"
      });
    }

    // Retorna o driver encontrado
    return res.status(200).json(driver);

  } catch (error) {

    return res.status(500).json({
      error: "Erro interno no servidor"
    });

  }

});


// ===============================
// POST - CRIAR NOVO DRIVER
// ===============================

app.post(baseAPIRoute + "/drivers", (req, res) => {

  try {

    // Valida os dados recebidos usando Joi
    const { error, value } = driverSchema.validate(req.body);

    // Caso haja erro de validação
    if (error) {
      return res.status(400).json({
        error: error.details[0].message
      });
    }

    // Cria objeto do novo driver
    const newDriver = {

      // Gera ID único
      id: randomUUID(),

      // Spread pega os valores validados
      ...value

    };

    // Adiciona no array
    drivers.push(newDriver);

    // Ordena ranking por pontos
    drivers.sort((a, b) => b.points - a.points);

    // Retorna driver criado
    return res.status(201).json(newDriver);

  } catch (error) {

    return res.status(500).json({
      error: "Erro ao criar driver"
    });

  }

});


// ===============================
// PUT - ATUALIZAR DRIVER
// ===============================

app.put(baseAPIRoute + "/drivers/:id", (req, res) => {

  try {

    // Captura ID da URL
    const { id } = req.params;

    // Captura dados enviados
    const { name, team, points } = req.body;

    // Procura driver
    const driver = drivers.find(d => d.id === id);

    // Caso não exista
    if (!driver) {
      return res.status(404).json({
        error: "Driver não encontrado"
      });
    }

    // Atualiza somente campos enviados
    if (name) driver.name = name;
    if (team) driver.team = team;

    if (points !== undefined) {
      driver.points = Number(points);
    }

    // Reordena ranking
    drivers.sort((a, b) => b.points - a.points);

    // Retorna driver atualizado
    return res.status(200).json(driver);

  } catch (error) {

    return res.status(500).json({
      error: "Erro ao atualizar driver"
    });

  }

});


// ===============================
// DELETE - REMOVER DRIVER
// ===============================

app.delete(baseAPIRoute + "/drivers/:id", (req, res) => {

  try {

    // Captura ID
    const { id } = req.params;

    // Procura índice do driver
    const index = drivers.findIndex(d => d.id === id);

    // Caso não exista
    if (index === -1) {
      return res.status(404).json({
        error: "Driver não encontrado"
      });
    }

    // Remove do array
    drivers.splice(index, 1);

    // 204 = sucesso sem conteúdo
    return res.status(204).send();

  } catch (error) {

    return res.status(500).json({
      error: "Erro ao deletar driver"
    });

  }

});


// ===============================
// INICIALIZAÇÃO DO SERVIDOR
// ===============================

// Porta onde a API irá rodar
const port = 3000;

// Inicia o servidor
app.listen(port, () => {

  console.log(`API rodando em http://localhost:${port}`);

});