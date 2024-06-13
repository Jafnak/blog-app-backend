const express = require("express")
const mongoose = require("mongoose")
const cors = require("cors")
const bcrypt = require("bcryptjs")  //cyphertext is (pswd encrypt)
const jwt = require("jsonwebtoken")

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

app.post("/signin",(req,res)=>{
    let input = req.body
    blogmodel.find({"email":req.body.email}).then(
        (response)=>{
            if (response.length > 0) {
                let dbPassword = response[0].password  //entered email is compared with existing password(email)
                console.log(dbPassword)
                bcrypt.compare(input.password,dbPassword,(error,isMatch)=>{ //input pswd and hashed pswd is  compared
                    if (isMatch) {
                        //if login success generate token
                        jwt.sign({email:input.email},"blog-app",{expiresIn:"1d"},
                            (error,token)=>{
                                if (error) {
                                    res.json({"status":"unable to create token"})
                                } else {
                                    res.json({"status":"success","userId":response[0]._id,"token":token})
                                }
                            }
                        )
                    } else {
                        res.json({"status":"incorrect"})
                    }
                })
                
            } else {
                res.json({"status":"user not found"})
            }
        }
    ).catch()
})

app.listen(8080,()=>{
    console.log("server started")
})