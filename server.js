require('dotenv').config();

const express = require('express');
const history = require('./Routes/history');
const analyze = require("./Routes/analyze");
const app = express();
const PORT = 8000;

app.use(express.json());

app.get('/',(req,res) =>{
    res.send('Hello Server Started');
});

app.use("/",history);
app.use("/",analyze);

app.listen(PORT,() =>{
    console.log(`Server Started running on port = ${PORT}`);   
});