import express from "express";
import { drivers } from "./data.js";
import { randomUUID } from "node:crypto";

import { request } from 'node:http';



const baseAPIRoute = '/api/v1'

const app = express();

//middleware
app.use(express.json());

app.get(baseAPIRoute + '/drivers', (request, response) => {
    response.status(200).send(drivers);

});


//parametro de rota
app.get(baseAPIRoute + '/drivers/standings/:position', (request, response) => {
    const { position } = request.params;
    const selectedDriver = drivers[position-1];
    response.status(200).send(selectedDriver);
});


app.get(baseAPIRoute + '/drivers/:id', (request, response) => {
    const {id} = request.params;
    const selectedDriver = drivers.find(driver => driver.id === id);
    response.status(200).send(selectedDriver);
})

//registrar novo piloto(endpoint)


// registrar novo piloto
app.post(baseAPIRoute + "/drivers", (request, response) => {

  try {

    const { name, team, points } = request.body;

    // validação básica
    if (!name || !team || points === undefined) {
      return response.status(400).json({
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

    // ordenar por pontos (maior primeiro)
    drivers.sort((a, b) => b.points - a.points);

    return response.status(201).json(newDriver);

  } catch (error) {

    return response.status(500).json({
      error: "Erro interno ao registrar piloto"
    });

  }

});


app.put(baseAPIRoute + "/drivers/:id", (request, response) => {

  const { id } = request.params;
  const { name, team, points } = request.body;

  const driver = drivers.find(driver => driver.id === id);

  if (!driver) {
    return response.status(404).json({
      error: "Driver não encontrado"
    });
  }

  // atualizar dados
  if (name) driver.name = name;
  if (team) driver.team = team;
  if (points !== undefined) driver.points = Number(points);

  // ordenar novamente
  drivers.sort((a, b) => b.points - a.points);

  return response.status(200).json(driver);

});

//deltar um piloto
app.delete(baseAPIRoute + "/drivers/:id", (request, response) => {

  const { id } = request.params;

  const index = drivers.findIndex(driver => driver.id === id);

  if (index === -1) {
    return response.status(404).json({
      error: "Driver não encontrado"
    });
  }

  drivers.splice(index, 1);

  return response.status(204).send();

});


const port = 3000;
app.listen(port, () => console.log("API rodando com sucesso"));