const mongoose = require ("mongoose")
const urlModel =require('../Model/urlModel')
const shortid = require ('shortid')
const validUrl =require('valid-url')


const isvalid = function(data){
    if(typeof(data)==undefined || typeof (data)==null) return false
    if(typeof(data) == String && data.trim()=="") return false
    return true
}

const urlShorten =  async function(req,res){
    try{
        let {longUrl} =req.body 
        if(!Object.keys(req.body)) return res.status(400).send({status:false , data: "empty body "})

        if(!isvalid(longUrl)) return res.status(400).send({status:false , data: "provide longUrl"})
        if(!validUrl.isUri(longUrl))  return res.status(400).send({status:false , data: "invalid longUrl"})

        let findUrl = await urlModel.findOne({longUrl: longUrl})
        if(findUrl) {
            return res.status(200).send({status:true , msg : "Url is already present in DB",data: findUrl})
        }


        let code=  shortid.generate(longUrl)
        let short = `https://localhost:3000/${code}`

        let document ={
            longUrl: longUrl,
            shortUrl: short,
            urlCode:code
        }

        let saveData = await urlModel.create(document)

        return res.status(201).send({status:true , data: saveData})




    }catch(err){
        return res.status(500).send({status: false , msg :err.message})
    }
}


module.exports={
    urlShorten
}