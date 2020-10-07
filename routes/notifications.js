const authenticateUser = require("../authenticate/authenticateUser")
const router = require("express").Router()
const Notification = require("../models/notification")

router.get("/all", authenticateUser, async (req,res) => {
    console.log(req.user);

    try {
        const notifications = await Notification.find({recipient : req.user.id})

        res.status(200).send({notifications})
    } catch (error) {
        
    }
})

module.exports = router