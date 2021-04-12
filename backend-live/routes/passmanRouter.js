const router = require("express").Router()
const Passman = require("../models/passmanModel")
const crypto = require("crypto")
const auth = require("../middlewares/auth")

const encryption = async (string) => {

    const algorithm = process.env.ENCRYPTION_METHOD
    const salt = process.env.ENCRYPTION_SALT
    const iv = process.env.ENCRYPTION_IV
    const key = crypto.scryptSync(salt, "salt", 32)

    const cipher = crypto.createCipheriv(algorithm, key, iv)
    const encrypted = cipher.update(string, "utf-8", "hex") + cipher.final("hex")

    return encrypted
}

const decryption = async (stringEncryption) => {

    const algorithm = process.env.ENCRYPTION_METHOD
    const salt = process.env.ENCRYPTION_SALT
    const iv = process.env.ENCRYPTION_IV
    const key = crypto.scryptSync(salt, "salt", 32)

    const decipher = crypto.createDecipheriv(algorithm, key, iv)
    const decrypted = decipher.update(stringEncryption, "hex", "utf-8") + decipher.final("utf-8")

    return decrypted
}

router.post("/create", auth, async (req, res) => {

    try {
        let { name, email, password, pin } = req.body

        if (!name || !email || !password) {
            return res.status(400).json({ msg: "All required fields cannot be empty" })
        }

        const encryptPassword = await encryption(password)
        const encryptPin = (!pin) ? "" : await encryption(pin)

        const newPassman = new Passman({
            name,
            email,
            password: encryptPassword,
            pin: encryptPin,
            userId: req.user
        })

        const saved = await newPassman.save()

        res.json(saved)
    }
    catch (err) {
        return res.status(500).json({ error: err.message })
    }
})

router.post("/update", auth, async (req, res) => {

    try {

        let { name, email, password, pin, id } = req.body

        const findPassman = await Passman.findOne({ _id: id, userId: req.user })

        if (!findPassman) return res.status(400).json({ msg: "Password Manager not found" })

        const encryptPassword = await encryption(password)
        const encryptPin = (!pin) ? "" : await encryption(pin)

        const passman = {
            name,
            email,
            password: encryptPassword,
            pin: encryptPin
        }

        const updated = await Passman.findOneAndUpdate({ _id: id }, passman, { new: true })

        res.json(updated)
    }
    catch (err) {
        return res.status(500).json({ error: err.message })
    }
})

router.delete("/delete/:id", auth, async (req, res) => {

    try {

        const { id } = req.params

        const findPassman = await Passman.findOne({ _id: id, userId: req.user })

        if (!findPassman) return res.status(400).json({ msg: "Password Manager not found" })

        const deleted = await Passman.findByIdAndDelete(id)

        res.json(deleted)
    }
    catch (err) {
        return res.status(500).json({ error: err.message })
    }
})

router.get("/decryptPassword/:encryptedPassword", async (req, res) => {

    try {

        const { encryptedPassword } = req.params

        const decryptPassword = await decryption(encryptedPassword)

        res.json(decryptPassword)
    }
    catch (err) {
        return res.status(500).json({ error: err.message })
    }
})

router.get("/decryptPin/:encryptedPin", async (req, res) => {

    try {

        const { encryptedPin } = req.params

        const decryptPin = await decryption(encryptedPin)

        res.json(decryptPin)
    }
    catch (err) {
        return res.status(500).json({ error: err.message })
    }
})

router.get("/", auth, async (req, res) => {

    try {

        const passman = await Passman.find({ userId: req.user })

        res.json(passman)
    }
    catch (err) {
        return res.status(500).json({ error: err.message })
    }
})

router.get("/:id", auth, async (req, res) => {

    try {

        const { id } = req.params
        const passman = await Passman.findOne({ _id: id, userId: req.user })

        if (!passman) return res.status(400).json({ msg: "Password Manager not found" })

        const decryptPassword = await decryption(passman.password)
        const decryptPin = (passman.pin) ? await decryption(passman.pin) : ""

        const newPassman = {
            _id: passman._id,
            name: passman.name,
            email: passman.email,
            password: decryptPassword,
            pin: decryptPin
        }

        res.json(newPassman)
    }
    catch (err) {
        return res.status(500).json({ error: err.message })
    }
})

module.exports = router