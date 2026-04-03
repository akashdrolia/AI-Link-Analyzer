const express = require('express');
const app = express();
const PORT = 8000;

app.use(express.json());

app.get('/',(req,res) =>{
    res.send('Hello Server Started');
});

app.use((req,res,next) => {
    let path = req.body.url;
    if(path){
        res.json({
        "status": "success",
        "message": "URL received successfully"});
        next();
    } 
    else{
        res.json({
        "status": "Fail",
        "message": "No URL is received"});
    }
});

app.post('/analyze',(req,res) =>{
    res.send();
});

app.listen(PORT,() =>{
    console.log(`Server Started running on port = ${PORT}`);   
});