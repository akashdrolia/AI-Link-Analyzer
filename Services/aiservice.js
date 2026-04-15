const openAI = require('openai');

const ai = new openAI({
    apiKey: process.env.OPEN_AI_KEY
});

async function getAiResponse(content)
{
    try{
        const response = await ai.chat.completions.create({
            model: "gpt-4o-mini",
            messages:[
                {
                    role: 'system',
                    content: `Analyze this URL and return JSON with: {  "summary": "",  "category": "",  "risk_score": "",  "suspicious": true/false } `
                },
                {
                    user: 'user',
                    content: content
                }
            ]
        });

        return response.choices[0].message.content;
    }catch(error){
        console.error("AI error:", error);
        throw error;
    }
}

module.exports = getAiResponse;

