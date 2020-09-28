const { async } = require("crypto-random-string")
const authenticateUser = require("../authenticate/authenticateUser")
const Connection = require("../models/connection")
const User = require("../models/user")


const router = require("express").Router()

router.post("/check", authenticateUser, async(req,res) => {
    const connected = await Connection.findOne({$or : [{id1 : req.user.id , id2 : req.body.profileID} , {id1 : req.body.profileID , id2 : req.user.id}]})


    if(connected){
        if(connected.connectionStatus === "pending"){
            

            if(connected.id2 === req.user.id){
                res.status(200).send({status : "pending", receive : true})
            } else {
                res.status(200).send({status : "pending"})
            }
        } else {
            res.status(200).send({status : "connected"})
        }
    } else {
        res.status(200).send({notConnected : true})
    }
})

router.post("/add", authenticateUser, async(req,res) => {
    const connected = await Connection.findOne({$or : [{id1 : req.body.connectionDetails.initiator.id , id2 : req.body.connectionDetails.receiver.id} , {id1 : req.body.connectionDetails.receiver.id , id2 : req.body.connectionDetails.initiator.id}]})
    
    if(connected) return res.status(200).send({error : "Already connected."})
    
    const connection = new Connection({
        id1 : req.body.connectionDetails.initiator.id,
        id2 : req.body.connectionDetails.receiver.id,
        id1Details : {
            alias : req.body.connectionDetails.initiator.alias,
            profilePic : req.body.connectionDetails.initiator.profilePic,
            id : req.body.connectionDetails.initiator.id
        },
        id2Details : {
            alias : req.body.connectionDetails.receiver.alias,
            profilePic : req.body.connectionDetails.receiver.profilePic,
            id : req.body.connectionDetails.receiver.id
        }
    })

    try {
        const add = await connection.save()
        
        if(add){
            res.status(200).send({response : "OK"})
        } else {
            res.status(200).send({error : "Could not connect. Please try again."})
        }
    } catch (error) {
        res.status(200).send({error : "Could not connect. Please try again."})
    }

    
})


router.post("/accept", authenticateUser, async (req,res) => {
    try {
        const accept = await Connection.findOneAndUpdate({$or : [{id1 : req.user.id , id2 : req.body.profileID} , {id1 : req.body.profileID , id2 : req.user.id}]} , {connectionStatus : "connected"})

        if(accept){
            await User.findOneAndUpdate({_id : req.user.id}, {$inc : {connections : 1}})
            await User.findOneAndUpdate({_id : req.body.profileID}, {$inc : {connections : 1}})
            res.status(200).send({response : "OK"})

        } else {
            res.status(200).send({error : "Could not accept connection request. Please try again."})
        }
    } catch (error) {
        res.status(200).send({error : "Could not accept connection request. Please try again."})
    }
})


router.post("/remove", authenticateUser, async (req,res) => {
    try {
        const remove = await Connection.findOneAndDelete({$or : [{id1 : req.user.id , id2 : req.body.profileID} , {id1 : req.body.profileID , id2 : req.user.id}]} , {connectionStatus : "connected"})

        if(remove){
            

            await User.findOneAndUpdate({_id : req.user.id}, {$inc : {connections : -1}})
            await User.findOneAndUpdate({_id : req.body.profileID}, {$inc : {connections : -1}})
            res.status(200).send({response : "OK"})

        } else {
            res.status(200).send({error : "Could not remove connection. Please try again."})
        }
    } catch (error) {
        res.status(200).send({error : "Could not remove connection. Please try again."})
    }
})

router.post("/reject", authenticateUser, async (req,res) => {
    try {
        const reject = await Connection.findOneAndDelete({$or : [{id1 : req.user.id , id2 : req.body.profileID} , {id1 : req.body.profileID , id2 : req.user.id}]} , {connectionStatus : "connected"})

        res.status(200).send({response : "OK"})
    } catch (error) {
        res.status(200).send({error : "Could not remove connection. Please try again."})
    }
})

router.get("/pending", authenticateUser, async (req,res) => {
    try {
        const pending = await Connection.find({id2 : req.user.id , connectionStatus : "pending"}).select("-_id id1 id2 id1Details id2Details")

        if(pending){
            res.status(200).send({pending})
        } else {
            res.status(200)
        }
    } catch (error) {
        
    }
})




module.exports = router