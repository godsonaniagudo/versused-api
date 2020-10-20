const mongoose = require("mongoose")

const schema = mongoose.Schema({
    commenterAlias : {
        type : "String",
        min : 1,
        required : true
    },
    commenterID : {
        type : "String",
        min : 6,
        required : true
    },
    duelID : {
        type : "String",
        min : 6,
        required : true
    },
    date : {
        type : Date,
        default : Date.now()
    }
})

module.exports = mongoose.model("Commenter" , schema)