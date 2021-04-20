const express = require("express")
const cors = require("cors")
const mongoose = require("mongoose")
const cookieParser = require("cookie-parser")
require("dotenv").config();

// Setup 
const app = express()
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: [
        "http://localhost:3000",
        "https://passman.vercel.app",
    ],
    credentials: true
}))

const port = process.env.PORT || 6000

app.listen(port, () => console.log("Server started on port : " + port))

mongoose.connect(
    process.env.MONGODB_CONNECTION_STRING,
    {
        useNewUrlParser: true,
        useUnifiedTopology: true,
        useCreateIndex: true
    },
    (err) => {
        if (err) throw (err)
        console.log("MongoDB connection established")
    }
)

// Setup Router
app.use("/test", (req, res) => {
    return res.json("Test berhasil")
})
app.use("/users", require("./routes/userRouter"))
app.use("/passman", require("./routes/passmanRouter"))