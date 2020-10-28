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
const connectionRoute = require("./routes/connection")
const notificationsRoute = require("./routes/notifications")
const pointsRoute = require("./routes/points")
const responseRoute = require("./routes/response")
const commentRoute = require("./routes/comment")
const bookmarksRoute = require("./routes/bookmark")
const searchRoute = require("./routes/search")

//Bodyparser rules
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
app.use("/connections", connectionRoute)
app.use("/notifications", notificationsRoute)
app.use("/points", pointsRoute)
app.use("/response", responseRoute)
app.use("/comment", commentRoute)
app.use("/bookmark", bookmarksRoute)
app.use("/search", searchRoute)


http.listen(process.env.PORT || 8085, () => {
    console.log("Server started on port 8085");
})