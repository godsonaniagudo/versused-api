const { async } = require("crypto-random-string")
const authenticateUser = require("../authenticate/authenticateUser")
const { route } = require("./auth")
const Duel = require("../models/duel")
const Response = require("../models/response")
const { send } = require("@sendgrid/mail")

const router = require("express").Router()

router.post("/new", authenticateUser, async (req,res) => {

    const duel = await Duel.findOne({_id : req.body.duelID})

    var role = ""

    if(req.body.responderID === duel.creator.id){
        role = "creator"
    } else {
        role = "opponent"
    }
    

    const response = new Response({
        responderID : req.body.responderID,
        responderRole : role,
        video : req.body.video,
        duelID : req.body.duelID
    })

    

    try {
        const saveResponse = await response.save()

        await Duel.findOneAndUpdate({_id : req.body.duelID} , {lastPoster : req.body.responderID})
        
        res.status(200).send({response : "OK", responseVideo : saveResponse})
    } catch (error) {
        res.status(200),send({error : "Could not post response."})
    }
})

module.exports = router