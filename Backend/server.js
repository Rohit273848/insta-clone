require('dotenv').config();
// const exprees = require('express')
const app = require('./src/app');
const connectedDB = require('./config/database')


connectedDB();

app.listen(3000,()=>{
    console.log("Server is running on PORT:3000");
})

