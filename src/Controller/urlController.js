const mongoose = require ("mongoose")
const urlModel =require('../Model/urlModel')
const shortid = require ('shortid')
const validUrl =require('valid-url')
const redirect = require('redirect-uri')


const isvalid = function(data){
    if(typeof(data)==undefined || typeof (data)==null) return false
    if(typeof(data) == String && data.trim()=="") return false
    return true
}

const check =function checkCase(ch) {
       if (ch == ch.toUpperCase()) {
          return false;
       }
       if (ch == ch.toLowerCase()){
          return true;
       }
 }

const urlShorten =  async function(req,res){
    try{
        let {longUrl} =req.body 
        if(!Object.keys(req.body)) return res.status(400).send({status:false , data: "empty body "})

        if(!isvalid(longUrl)) return res.status(400).send({status:false , data: "provide longUrl"})
        if(!validUrl.isUri(longUrl))  return res.status(400).send({status:false , data: "invalid longUrl"})
        if(!check(longUrl)) return res.status(400).send({status:false , msg : "link should be in lowercase "})

        let findUrl = await urlModel.findOne({longUrl: longUrl})
        if(findUrl) {
            return res.status(200).send({status:true , msg : "Url is already present in DB",data: findUrl})
        }
        


        let code=  shortid.generate()
        let short = `http://localhost:3000/${code}`

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

const getUrl = async function(req,res){
        try {
            
            if(!shortid.isValid(req.params.urlCode)) return res.status(400).send({ status: false, message: 'Wrong UrlCode' })

            const url = await urlModel.findOne({
                urlCode: req.params.urlCode
            })
            if (url) {
                return res.status(302).redirect(url.longUrl)
            } else {
                return res.status(404).send({ status: false, message: 'No URL Found' })
            }
        
        }
        catch (err) {
            console.error(err)
            res.status(500).send({ status: false, message: err.message })
    }
    }



module.exports={
    urlShorten,
     getUrl
}