const express = require("express")
const app = express()
const http = require("http").createServer(app)
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const cors = require("cors")
require("dotenv").config()

//Declare routes
const authRoute = require("./routes/auth")
const userRoute =  require("./routes/user")


app.use(bodyParser.urlencoded({ limit: '2mb', extended: true, parameterLimit: 50000 }))
app.use(bodyParser.json({ limit: '2mb' }))
app.use(cors())

mongoose.connect(process.env.MONGO_CONNECT_URL, { useUnifiedTopology: true , useNewUrlParser: true }, (response) => {
    console.log(response);
})

//set routes
app.use("/auth" , authRoute)
app.use("/user", userRoute)


http.listen(8085, () => {
    console.log("Server started on port 8085");
})