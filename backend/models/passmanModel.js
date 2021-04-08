const mongoose = require("mongoose")

const passmanSchema = mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    password: { type: String, required: true },
    pin: { type: String },
    userId: { type: String, required: true }
})

module.exports = mongoose.model("passman", passmanSchema)