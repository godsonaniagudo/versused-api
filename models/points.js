const mongoose = require("mongoose")

const schema = mongoose.Schema({
    duelID : {
        type : "String",
        min : 6,
        required : true
    },
    gaveTo : {
        type : "String",
        min : 6,
        required : true
    },
    giverID : {
        type : "String",
        min : 6,
        required : true
    },
    giverDetails : {
        type : "Object",
        required: true
    },
    date : {
        type : Date,
        default : Date.now()
    }
})

module.exports = mongoose.model("Points", schema)