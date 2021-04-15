const router = require("express").Router()
const User = require("../models/userModel")
const bycrpt = require("bcryptjs")
const jwt = require("jsonwebtoken")
const nodemailer = require("nodemailer")

router.post("/registration", async (req, res) => {

    try {
        let { email, password, passwordCheck, displayName } = req.body

        if (!email || !password || !passwordCheck) return res.status(400).json({ msg: "All required fields cannot be empty" })

        if (password.length < 5) return res.status(400).json({ msg: "Password at least 5 characters" })

        if (password != passwordCheck) return res.status(400).json({ msg: "Enter the same password twice for verification" })

        const existingUser = await User.findOne({ email: email })

        if (existingUser) {
            return res.status(400).json({ msg: "An account with this email has been registerd" })
        }

        if (!displayName) displayName = email

        const salt = await bycrpt.genSalt()
        const passwordHash = await bycrpt.hash(password, salt)

        const newUser = new User({
            email: email,
            password: passwordHash,
            displayName: displayName
        })

        const savedUser = await newUser.save()
        res.json(savedUser)

    }
    catch (err) {
        return res.status(500).json({ msg: err.message });
    }
})


router.post("/login", async (req, res) => {

    try {

        const { email, password } = req.body

        if (!email || !password) return res.status(400).json({ msg: "All required fields cannot be empty" })

        const user = await User.findOne({ email: email })

        if (!user) return res.status(400).json({ msg: "No account with this email has been registered" })

        const isMatch = await bycrpt.compare(password, user.password)
        if (!isMatch) return res.status(400).json({ msg: "Password not match" })

        const token = await jwt.sign({ id: user._id }, process.env.JWT_SECRET_TOKEN)

        res.json(token)
    }
    catch (err) {
        return res.status(500).json({ msg: err.message });
    }
})

router.post("/checkToken", async (req, res) => {

    try {
        // const token = req.cookies.loginToken
        const token = req.header("loginToken")

        if (!token) return res.json(false)

        const verified = jwt.verify(token, process.env.JWT_SECRET_TOKEN)
        if (!verified) return res.json(false)

        const user = await User.findOne({ _id: verified.id })
        if (!user) return res.json(false)

        return res.json(true)
    }
    catch (err) {

        // return res.status(500).json({ msg: err.message });
        return res.json(false)
    }
})

router.get("/users/:id", async (req, res) => {

    try {
        const user = await User.findById(req.params.id)

        res.json({
            id: user._id,
            displayName: user.displayName,
        })
    }
    catch (err) {

        return res.status(500).json({ msg: err.message });
    }
})

router.get("/logout", async (req, res) => {

    res.cookie("loginToken", "", {
        httpOnly: true,
        expires: new Date(0),
        secure: true,
        sameSite: "none"
    }).send()
})

router.get("/email/:email", async (req, res) => {

    const email = req.params.email

    const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
            user: "tester.derian@gmail.com",
            pass: "derian0906"
        }
    })

    const mailOptions = {
        from: "tester.derian@gmail.com",
        to: email,
        subject: "Tes nodemailer",
        html: "<h2>Hallo ini email notification</h2>"
    }

    transporter.sendMail(mailOptions, (error, info) => {
        if (error) console.log(error)
        else console.log("Email Sent  :" + info.response)
    })

    return res.json("hahaha")
})

module.exports = router