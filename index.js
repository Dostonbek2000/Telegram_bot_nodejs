require('dotenv').config();
const express = require('express');
const BP = require('body-parser');
const axios = require('axios');
const nodemailer = require('nodemailer');


const {TOKEN,SERVER_URL,PASSWORD_GMAIL} = process.env
const TELEGRAM_API=`https://api.telegram.org/bot${TOKEN}`
const URI = `/webhook/${TOKEN}`
const WEBHOOK_URL = SERVER_URL+URI

const app = express()
app.use(BP.json())

const init = async () => {
    try {
        const res = await axios.get(`${TELEGRAM_API}/setWebhook?url=${WEBHOOK_URL}`)
        console.log(res.data); 
    } catch (error) {
        console.log(error);
    }   
}



const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: 'abdumuxtorov.dostonbek.main@gmail.com',
    pass: PASSWORD_GMAIL,
  },
});

app.get('/',(req,res)=>{
    res.send('<h1 style="text-align:center;color:orange;">Your telegram bot is working</h1>')
})

app.post(URI, async (req , res)=>{
    console.log("me",req.body);
    
    const chatId = req.body.message.chat.id  ? req.body.message.chat.id : req.body.my_chat_member.chat.id ? req.body.my_chat_member.chat.id : ''
    const text = req.body.message.text ? req.body.message.text : req.body.my_chat_member.text ? req.body.my_chat_member.text : ''
    const Person = req.body.message.from.username  ? req.body.message.from.username : req.body.my_chat_member.from.username ? req.body.my_chat_member.from.username : ''
    

    let DATA = {
        chat_id:chatId,
        text:`From Dostonbek: Siz ${text} deb yozdingiz!`
    }
    let DATA1 = {
        chat_id:chatId,
        text:`Salom ${Person} ,Sizni tashrifingizdan mamnunmiz`
    }
    if(text==='/start'){
        await axios.post(`${TELEGRAM_API}/sendMessage`,DATA1)
    }else{
        await axios.post(`${TELEGRAM_API}/sendMessage`,DATA)
    }
    return  res.send()
})



app.listen(process.env.PORT || 5000, async () => {
    console.log('app running on port', process.env.PORT || 5000);
    await init()
})