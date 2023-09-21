const telegramBot = require("node-telegram-bot-api")
const Tesseract = require("tesseract.js")
const express = require("express")
const app = express()
require("dotenv").config()

const token = process.env.TOKEN


const bot = new telegramBot(token, { polling: true })

bot.on("photo", (msg) => {


    const fileId = msg.photo[2].file_id;

    bot.getFileLink(fileId).then((fileLink) => {
        
        bot.sendMessage(msg.chat.id, "Your Text is Being Extracted Please Wait for a minute.")

        Tesseract.recognize(fileLink, "eng", { logger: (m) => console.log(m) })
        .then(({ data: {text} }) => {
        
        bot.sendMessage(msg.chat.id, text)

        })
    })
    
    // console.log("Photo Sent")
})

bot.on("message", (msg) => {
    
    bot.sendMessage(msg.chat.id, "Send me a Text Image and I would Extract the Text from the Image and Send Them Back as Plain texts")
})



const port = process.env.PORT || 3000

app.listen(port, () => {
    
    console.log("Server Started for the Telegram Bot")
})


app.get("/", (request, response) => {
    
    response.redirect("https://t.me/textsnapbot")
})