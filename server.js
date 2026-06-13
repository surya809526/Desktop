const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static("public"));



const client = new OpenAI({

    apiKey: process.env.GROQ_API_KEY,

    baseURL:
    "https://api.groq.com/openai/v1"

});



app.post("/ai", async(req,res)=>{


try{


const message =
req.body.message;



const response =
await client.chat.completions.create({

model:
"llama-3.1-8b-instant",


messages:[

{
role:"system",

content:
"You are a coding assistant. Generate clean code and explain briefly."
},


{
role:"user",

content:message
}

]

});



res.json({

reply:
response.choices[0].message.content

});


}

catch(error){


res.json({

reply:
"AI Error: "+error.message

});


}



});





const PORT =
process.env.PORT || 3000;



app.listen(PORT,()=>{

console.log(
"Groq AI Desktop Running"
);

});
