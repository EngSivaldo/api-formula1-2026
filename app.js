import express from "express";
import { randomUUID } from "node:crypto";
import { drivers } from "./data.js";

const app = express();
const baseAPIRoute = "/api/v1";

app.use(express.json());
app.use(express.static("public"));

/* =========================
   GET TODOS OS PILOTOS
========================= */

app.get(baseAPIRoute + "/drivers", (req, res) => {
  try {
    return res.status(200).json(drivers);
  } catch (error) {
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
});

/* =========================
   GET DRIVER POR ID
========================= */

app.get(baseAPIRoute + "/drivers/:id", (req, res) => {
  try {
    const { id } = req.params;

    if (!id) {
      return res.status(400).json({ error: "ID é obrigatório" });
    }

    const driver = drivers.find(d => d.id === id);

    if (!driver) {
      return res.status(404).json({ error: "Driver não encontrado" });
    }

    return res.status(200).json(driver);

  } catch (error) {
    return res.status(500).json({ error: "Erro interno no servidor" });
  }
});

/* =========================
   POST CRIAR DRIVER
========================= */

app.post(baseAPIRoute + "/drivers", (req, res) => {

  try {

    const { name, team, points } = req.body;

    if (!name || !team || points === undefined) {
      return res.status(400).json({
        error: "name, team e points são obrigatórios"
      });
    }

    const newDriver = {
      id: randomUUID(),
      name,
      team,
      points: Number(points)
    };

    drivers.push(newDriver);

    drivers.sort((a,b) => b.points - a.points);

    return res.status(201).json(newDriver);

  } catch (error) {
    return res.status(500).json({ error: "Erro ao criar driver" });
  }

});

/* =========================
   PUT ATUALIZAR DRIVER
========================= */

app.put(baseAPIRoute + "/drivers/:id", (req, res) => {

  try {

    const { id } = req.params;
    const { name, team, points } = req.body;

    const driver = drivers.find(d => d.id === id);

    if (!driver) {
      return res.status(404).json({
        error: "Driver não encontrado"
      });
    }

    if (name) driver.name = name;
    if (team) driver.team = team;
    if (points !== undefined) driver.points = Number(points);

    drivers.sort((a,b) => b.points - a.points);

    return res.status(200).json(driver);

  } catch (error) {
    return res.status(500).json({ error: "Erro ao atualizar driver" });
  }

});

/* =========================
   DELETE DRIVER
========================= */

app.delete(baseAPIRoute + "/drivers/:id", (req, res) => {

  try {

    const { id } = req.params;

    const index = drivers.findIndex(d => d.id === id);

    if (index === -1) {
      return res.status(404).json({
        error: "Driver não encontrado"
      });
    }

    drivers.splice(index, 1);

    return res.status(204).send();

  } catch (error) {
    return res.status(500).json({ error: "Erro ao deletar driver" });
  }

});

const port = 3000;

app.listen(port, () => {
  console.log(`API rodando em http://localhost:${port}`);
});