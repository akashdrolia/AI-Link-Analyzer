const express = require('express');
const pool = require('../Database/database');
const client = require('../Redis/client');
const getAiResponse = require('../Services/aiservice');

const router = express.Router();

router.post("/analyze",async (req,res) =>{
    const link =  req.body.url;
    const reqId =  req.body.reqid;
    let saved;
    let fetchedURL;
    let category;
    let result;
    let aiResult;
    let suspicious;
    let summary;
    let risk_score;
    if(!link)
    {
        result = "Fail";
        return res.status(400).json({message : "Enter a correct URL:",
            data: result
        });
    }
    try{
        const cachedValue = await client.get(`urls:${reqId}`);
        if(cachedValue)
        {
            return res.status(200).json({message : "URL response generated", data : JSON.parse(cachedValue)});
        }

        //if not cahced then check in DB and cache it as well
        fetchedURL = await pool.query(
            `SELECT (url, status, checked, reqid, risk_score, suspicious, summary) from urls where url = $1 and reqid = $2`,
            [link, reqId]
        );
        
        //get the response from the AI
        aiResult = await getAiResponse(link);
        
        result = "success";
        category = aiResult.category;
        suspicious = aiResult.suspicious;
        summary = aiResult.summary;
        risk_score = aiResult.risk_score;

        //database entry
        if(fetchedURL.rows.length === 0){
                saved = await pool.query(
                `INSERT INTO urls (url, status, checked, reqid, risk_score, suspicious, summary) 
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING id, url, status, checked, reqid, risk_score, suspicious, summary `,
                [link, result, category, reqId, risk_score, suspicious, summary]
            );
            
            await client.set(`urls:${reqId}`, JSON.stringify(saved));
            return res.status(200).json({message : "URL response generated", data: aiResult});
        }

        else{
            await client.set(
                `urls:${reqId}`, JSON.stringify(fetchedURL)
            );
            return res.status(200).json({message : "URL response generated", data: aiResult});
        }
    }
    catch (err) {
        console.log("DB ERROR:", err);
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;