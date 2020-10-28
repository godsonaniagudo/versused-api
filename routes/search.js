const authenticateUser = require("../authenticate/authenticateUser");
const Duel = require("../models/duel")
const User = require("../models/user")

const router = require("express").Router()

router.post("/", authenticateUser, async(req,res) => {
    console.log(req.body);

    const queryStrings = String(req.body.query).split(" ")

    var duelQueries = []
    var userQueries = []

    queryStrings.forEach(item => {
        duelQueries.push({title : {$regex : item, $options : "i"}})
        userQueries.push({$or : [{name : {$regex : item, $options : "i"}} , {alias : {$regex : item, $options : "i"}}]})
    })

    const duels = await Duel.find({$or : duelQueries})
    const users = await User.find({$or : userQueries})

    res.status(200).send({response : "OK", duels, users})

})

module.exports = router