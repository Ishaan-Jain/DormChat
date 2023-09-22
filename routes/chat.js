const express = require('express');
const router = express.Router()
const bodyParser = require('body-parser');
const cors = require('cors');
const formatMessage = require('../messages')
const Message = require('../Database/models/message')
require("dotenv").config()

router.use(bodyParser.json())

router.use(cors())

router.get("/:room", async (req,res) =>{
    const room = req.params.room;
    if(room === "Important Info"){
        const messages = await Message.find();
        res.json(messages);
        return;
    }
    res.json("Navigate to main page")
})

router.get("/admin-key",(req,res) =>{
    res.json(process.env.ADMIN_KEY);
})

router.post("/", async(req,res) =>{
    Obj = formatMessage(req.body.username,req.body.text);

    const newMsg = new Message(Obj);

    await newMsg.save()

    res.json(newMsg);

})

module.exports = router;