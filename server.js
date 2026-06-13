const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");

const app = express();

app.use(cors());
app.use(express.json());

app.use(express.static("public"));


const client = new OpenAI({

apiKey: process.env.OPENAI_API_KEY

});



app.post("/ai", async(req,res)=>{


try{


const prompt=req.body.message;



const response =
await client.chat.completions.create({

model:"gpt-4.1-mini",

messages:[

{
role:"system",
content:
"You are a coding assistant. Give useful code and explanations."
},

{
role:"user",
content:prompt
}

]

});



res.json({

reply:
response.choices[0].message.content

});


}

catch(e){

res.json({

reply:"Error: "+e.message

});


}


});




const PORT =
process.env.PORT || 3000;


app.listen(PORT,()=>{

console.log("Server running");

});
