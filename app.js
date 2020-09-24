const express = require("express")
const app = express()
const http = require("http").createServer(app)
const mongoose = require("mongoose")
const multer = require("multer")
const bodyParser = require("body-parser")
const cors = require("cors")
require("dotenv").config()

//Declare routes
const authRoute = require("./routes/auth")
const userRoute =  require("./routes/user")
const duelRoute = require("./routes/duel")
const duelsRoute = require("./routes/duels")


app.use(bodyParser.urlencoded({ limit: '2mb', extended: true, parameterLimit: 50000 }))
app.use(bodyParser.json({ limit: '2mb' }))
app.use(cors())

const storage = multer.memoryStorage();
const multerUploads = multer({ storage }).single("video");
app.use(multerUploads)

mongoose.connect(process.env.MONGO_CONNECT_URL, { useUnifiedTopology: true , useNewUrlParser: true }, (response) => {
    console.log(response);
})

//set routes
app.use("/auth" , authRoute)
app.use("/user", userRoute)
app.use("/duel", duelRoute)
app.use("/duels", duelsRoute)


// http.listen(8085, () => {
//     console.log("Server started on port 8085");
// })

http.listen(process.env.PORT || 8085, () => {
    console.log("Server started on port 8085");
})