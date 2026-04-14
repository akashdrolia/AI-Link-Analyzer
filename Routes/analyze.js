const express = require('express');
const pool = require('../Database/database');
const client = require('../Redis/client');

const router = express.Router();

router.post("/analyze",async (req,res) =>{
    const link =  req.body.url;
    const reqId =  req.body.reqid;
    let saved;
    let fetchedURL;
    let result;
    try{
        if(!link)
        {
            result = "Fail";
            return res.status(400).json({message : "Enter a correct URL:"});
        }

        const cachedValue = await client.get('urls');
        if(cachedValue)
        {
            return res.status(200).json({message : "URL response generated", data : JSON.parse(cachedValue)});
        }

        //if not cahced then check in DB and cache it as well
        fetchedURL = await pool.query(
            `SELECT (url,status, checked, reqid) from urls where url = $1`,
            [link]
        );

        result = "success";
        //database entry
        if(!fetchedURL){
                saved = await pool.query(
                `INSERT INTO urls (url, status, checked, reqid) VALUES ($1, $2, $3, $4)
                RETURNING id, url, status, checked, reqid `,
                [link, result, "Yes", reqId ]
            );
            
            await client.set('urls', JSON.stringify(saved));
            return res.status(200).json({message : "URL response generated", data: saved});
        }

        else{
            await client.set('urls', JSON.stringify(fetchedURL));
            return res.status(200).json({message : "URL response generated", data: fetchedURL});
        }
    }

    catch (err) {
        console.log("DB ERROR:", err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;