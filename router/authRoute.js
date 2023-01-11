const { siginup, login } = require("../controller/authController")
const {uploadStorage} = require("../util/multer")
const router = require("express").Router()

router.post("/siginup",uploadStorage.single('resume'),siginup)

router.post("/login",login)

module.exports = router