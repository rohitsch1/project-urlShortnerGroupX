const mongoose = require ("mongoose")
const urlModel =require('../Model/urlModel')
const shortid = require ('shortid')
const validUrl =require('valid-url')


const isvalid = function(data){
    if(typeof(data)==undefined || typeof (data)==null) return false
    if(typeof(data)=="string" && data.trim().length== 0) return false
    if(typeof(data)=== "number" ) return false
    return true
}

const urlShorten =  async function(req,res){
    try{
        let data= req.body
        let longUrl=data.longUrl
        if(Object.keys(data).length<1) return res.status(400).send({status:false , data: "empty body "})
        console.log(Object.keys(data).length)

        console.log(isvalid(longUrl))
        if(!isvalid(longUrl)) return res.status(400).send({status:false , data: "provide longUrl in correct format"})
        if(Object.keys(data)!="longUrl") return res.status(400).send({status:false , msg : "please provide longUrl keys "})
        console.log(isvalid(longUrl))
        if(!validUrl.isUri(longUrl))  return res.status(400).send({status:false , data: "invalid longUrl"})

        let findUrl = await urlModel.findOne({longUrl: longUrl})
        if(findUrl) {
            return res.status(200).send({status:true , msg : "Url is already present in DB",data: findUrl})
        }
        
        let code=  shortid.generate().trim().toLowerCase()
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
                return res.status(404).send({ status: false, message: 'wrong URL Format' })
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