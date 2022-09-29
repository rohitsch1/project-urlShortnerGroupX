const express = require("express")
const router = express.Router()

const urlCode = require('../Controller/urlController')

router.get("/test-me",function(req,res){
    res.status(200).send({msg:"All ok"})
})


router.post ('/url/shorten',urlCode.urlShorten)

module.exports = router;  
