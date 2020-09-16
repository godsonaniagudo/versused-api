async function authenticateUser (req, res, next){
    const token = req.headers.authtoken
    const jwt = require("jsonwebtoken")

    if (token && token !== ""){
        const validToken = await jwt.verify(token , process.env.JWT_STRING)


        if(validToken.id){
            req.user = {id : validToken.id}
            next()
        } else {
            return res.status(400).send({error : "User not logged in."})
        }
    } else {
        return res.status(400).send({error : "User not logged in."})
    }

}

module.exports = authenticateUser