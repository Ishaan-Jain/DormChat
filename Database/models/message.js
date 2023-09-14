const mongoose = require("mongoose");
const Schema = mongoose.Schema;


const MessageSchema = new Schema({
    text: String,
    time: String,
    username: String,
  })


MessageSchema.methods.setMsg = async function(Obj){
    let msg = this;

    msg.text = Obj.text;
    msg.time = Obj.time;
    msg.username = Obj.username;

    await msg.save();

    return msg;
}

module.exports = mongoose.model("Message",MessageSchema);