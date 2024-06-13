const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bcrypt = require("bcryptjs")  //cyphertext is (pswd encrypt)

const {blogmodel} = require("./models/blog")

const app=express()
app.use(cors())
app.use(express.json())

mongoose.connect("mongodb+srv://Jafna02:jafna9074@cluster0.icijy.mongodb.net/blogDb?retryWrites=true&w=majority&appName=Cluster0")

const generateHashedPassword = async(password) =>{
    const salt = await bcrypt.genSalt(10)  //salt=cost factor value
    return bcrypt.hash(password,salt)
}

app.post("/signUp",async(req,res)=>{

    let input = req.body
    let hashedPassword = await generateHashedPassword(input.password)
    console.log(hashedPassword)

    input.password = hashedPassword     //stored the hashed password to server
    let blog = new blogmodel(input)
    blog.save()
    console.log(blog)
    
    res.json({"status":"success"})
})

app.listen(8080,()=>{
    console.log("server started")
})