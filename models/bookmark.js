const mongoose = require("mongoose")


const schema = mongoose.Schema({
    duelID : {
        type : "String",
        min : 6,
        required : true
    },
    duelTitle : {
        type : "String",
        min : 6,
        required : true
    },
    duelDescription : {
        type : "String",
        required : true
    },
    userID : {
        type : "String",
        min : 6,
        required : true
    },
    coverPicture : {
        type : "String",
        min : 6,
        required : true
    },
    video : {
        type : "String",
        min : 6,
        required : true
    },
    creator : {
        type : "Object",
        required : true
    },
    date : {
        type : Date,
        default : Date.now()
    }
})

module.exports = mongoose.model("Bookmark", schema)