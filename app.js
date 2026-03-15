import express from "express";
import { drivers } from "./data.js";
import { randomUUID } from 'node:crypto';
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
app.post(baseAPIRoute + '/drivers' , (request, response) => {
    const newDriver = {...request.body, id: randomUUID()};//criar novo obj com id gerado auto por random
    drivers.push(newDriver);
    drivers.sort((b, a) => {
    if(a.points > b.points) {
      return 1;
    }

    if (b.points > a.points) {
      return -1;
    }

    return 0;
  })
    response.status(200).send(newDriver);

});


const port = 3000;
app.listen(port, () => console.log("API rodando com sucesso"));