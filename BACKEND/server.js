//-----------IMPORTACIONES-----------//
const express = require('express');
const router = require('./routes/api.js');
const path = require('path');
const app = express();
const port = 3000;
//-----------MIDDLEWARE-----------//
app.use(express.static(path.join(__dirname, '../FRONTEND')));
app.use(express.json());
app.use(router);
//-----------ENTRADA AL SERVER-----------//
app.listen(port, () => {
    console.log(`Práctica 3 corriendo en el puerto ${port}!`);
});
