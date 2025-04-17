//-----------IMPORTACIONES-----------//
const express = require('express');
const routerApi = require('./routes/api.js');
const path = require('path');
//-----------CONFIGURACIONES----------//
const app = express();
const port = 3000;
//-----------MIDDLEWARE-----------//
app.use(express.static(path.join(__dirname, '../FRONTEND')));
app.use(express.json());
app.use(routerApi);
//-----------ENTRADA AL SERVER-----------//
app.listen(port, () => {
    console.log(`Práctica 3 corriendo en el puerto ${port}!`);
});
