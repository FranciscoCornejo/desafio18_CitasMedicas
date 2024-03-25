const express = require("express");
const app = express();
const port = 3000;

//se requiere axios para hacer llamadas
const axios = require("axios");
const moment = require("moment/moment");
const { v4: uuidv4 } = require("uuid");
const _ = require("lodash");
const chalk = require("chalk");

//se crea una constante para la url de la api
const API = "https://randomuser.me/api/";

//se crea el array vacio donde se guardaran los usuarios
const usuarios = [];

//se define el formato de fecha con momment
const formato = "MMMM Do YYYY: hh:mm:ss a";

app.get("/usuarios", async (req, res) => {
  //llamada a la API con axios, el desarrollo es en el interior de la ruta. De esta API obtenemos los usuarios
  try {
    const UsuariosAPI = await axios.get(API);
    const datos = UsuariosAPI.data.results[0];
    const nombre = UsuariosAPI.data.results[0].name.first;
    const apellido = UsuariosAPI.data.results[0].name.last;
    const genero = UsuariosAPI.data.results[0].gender;
    const id = uuidv4().slice(0, 6);
    const tiempo = moment().format(formato);

    usuarios.push({ nombre, apellido, genero, id, tiempo });

    //separar el array con lodash
    const GeneroUsuarios = _.partition(usuarios, (iterador) => {
      return iterador.genero === "female";
    });

    //console.log(usuarios);
    //res.json({ usuarios });

    const template = `
<h5>Mujeres</h5>
<ol>
${GeneroUsuarios[0].map((iterador) => {
  return `<li>Nombre: ${iterador.nombre} - Apellido: ${iterador.apellido} - Id: ${iterador.id} - Hora: ${iterador.tiempo}</li>`;
})}
</ol>
<h5>Hombres</h5>
<ol>
${GeneroUsuarios[1].map((iterador) => {
  return `<li>Nombre: ${iterador.nombre} - Apellido: ${iterador.apellido} - Id: ${iterador.id} - Hora: ${iterador.tiempo}</li>`;
})}
</ol>
`;
    console.log(
      chalk.blue.bgWhite(
        `Nombre: ${nombre} - Apellido: ${apellido} - Id: ${id} - Hora: ${tiempo}\n Nombre: ${nombre} - Apellido: ${apellido} - Id: ${id} - Hora: ${tiempo}`
      )
    );
    res.send(template);
  } catch (error) {
    console.log(error);
  }
});

//ya tenemos la llamada a la api y guardamos cada unos de los usuarios en un array
//ahora debemos separar el array con lodash

app.listen(port, () =>
  console.log(
    `Servidor iniciado en el puerto http://localhost:${port}/usuarios`
  )
);

//la llamada a la API siempre va a ser asincrona
