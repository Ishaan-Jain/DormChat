const express = require('express');
const router = express.Router()
const bodyParser = require('body-parser');
const cors = require('cors');
const formatMessage = require('../messages')
const Message = require('../Database/models/message')

router.use(bodyParser.json())

router.use(cors())

router.get("/", async (req,res) =>{
    const messages = await Message.find();
    res.json(messages);
})

router.post("/", async(req,res) =>{
    Obj = formatMessage(req.body.username,req.body.text);

    const newMsg = new Message(Obj);

    await newMsg.save()

    res.json(newMsg);

})

module.exports = router;