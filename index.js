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


let counter = 0
//`From Dostonbek: Siz ${text} deb yozdingiz!`
let arr = []
app.post(URI, async (req , res)=>{
    console.log("me",req.body);
    
    const chatId = req.body.message.chat.id
    const text = req.body.message.text
    arr.push(chatId)
    let email = 'abdumuxtorov.dostonbek.main@gmail.com'
    let taklif = ''
    let obj = {name:''}
    obj.name = text

    let mine1 = 'Salom Online Botga Hush Kelipsiz . Ismingiz nima ?'
    let mine2 = 'Sizning taklifingiz'
    let mine3 = 'Gmail manzilingizni kiriting'

    counter=counter+1

    let DATA = {
        chat_id:chatId,
        text:counter === 1 ? mine1 : counter ===2 ? mine2 : counter === 3 ? mine3 : `Sorovingiz muvaffaqiyatli junatildi iltimos elektron pochtangizni tekshiring`
    }
    
    
    text.includes('@gmail.com') ?   transporter.sendMail({
            from: 'maingmaildasdsdasda@gmail.com', // sender address
            to: text.includes('@gmail.com') ? text : email, // list of receivers
            subject: "Hi! This is Dostonbek High Corporation",
            text: "Hi!",
            html: `<b>Salom hurmatli mijoz sizning  sorovingizni qabul qildik , Siz bilan tez orada bog'lanamiz iltimos javobimizni kuting  !</b>`, 
        }).then(info => {
            console.log({info})
        }).catch(console.error) : console.log('it is good');;
    
    await axios.post(`${TELEGRAM_API}/sendMessage`,DATA)
    

    return  res.send()
})



app.listen(process.env.PORT || 5000, async () => {
    console.log('app running on port', process.env.PORT || 5000);
    await init()
})