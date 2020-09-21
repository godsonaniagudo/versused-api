const mongoose = require("mongoose")

const schema = mongoose.Schema({
    title : {
        type : "String",
        min : 6,
        max : 1034,
        required : true
    },
    description : {
        type : "String",
        min : 6,
        max : 1034,
        required : true
    }, 
    category : {
        type : "String",
        min : 6,
        max : 1034,
        required : true
    },
    rounds : {
        type : "Number",
        min : 1,
        max : 1034,
        required : true
    },
    duration : {
        type : "String",
        min : 1,
        max : 1034,
        required : true
    },
    winner : {
        type : "Object",
        default: {}
    },
    opponent : {
        type : "Object",
        default : {}
    },
    creator : {
        type :"Object",
        default: {}
    },
    date : {
        type : "Date",
        default : Date.now()
    },
    creatorPoints : {
        type : "Number",
        default : 0
    },
    opponentPoints : {
        type : "Number",
        default : 0
    },
    video : {
        type : "String",
        min : 6,
        required : true
    },
    coverPicture : {
        type : "String",
        min : 6,
        required : true
    }
})

module.exports = mongoose.model("Duel", schema)