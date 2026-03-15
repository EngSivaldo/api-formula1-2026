import express, { response } from 'express';

import { drivers } from "./data.js";



const baseAPIRoute = '/api/v1'

const app = express();

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


const port = 3000;
app.listen(port, () => console.log("API rodando com sucesso"));