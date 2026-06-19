const express = require('express')
const router = express.Router()
const user = require('../Models/user')
const bycrypt = require('bcryptjs')

router.post('/register' , async (req,res) =>{
    try{
        const {username , email, password} = req.body
        const existingUser = await user.findOne({email})
        if(existingUser)
        {
            return res.status(400).json({message:'user already exists'})
        }
        const salt = await bycrypt.genSalt(10)
        const hashedPassword = await bycrypt.hash(password,salt)
        const newUser = new user({
            username,
            email,
            password: hashedPassword
        })
        await newUser.save()
        res.status(201).json({message:'register success'})
    }
    catch(err){
        console.log(err)
        res.status(500).json({message:err.message})
    }
    
})

router.post('/login' , async (req,res) =>{
    try{
        const {email, password} = req.body
        const existingUser = await user.findOne({email})
        if(!existingUser)
        {
            return res.status(400).json({message:'user not found'})
        }
        const ismatch = await bycrypt.compare(password, existingUser.password)
        if(!ismatch)
        {
            return res.status(400).json({message:'password wrong'})
        }
        const jwt = require('jsonwebtoken')
        const token = jwt.sign(
            {id:existingUser._id},
            process.env.JWT_secert,{expiresIn:'1d'}
        )
        res.cookie('token',token,{
            httpOnly:true,
            secure:true,
            sameSite:'none',
            maxAge: 24 * 60 * 60 * 1000
        })
        res.status(200).json({message: 'Login success'})
    }
    catch(err){
        console.log(err)
        res.status(500).json({message:err.message})
    }
})

const auth = require('../Middleware/auth')
router.get('/verify', auth , (req,res) =>{
    res.status(200).json({message:"Token Valid"})
})

router.post('/logout',(req,res) => {
    res.clearCookie('token')
    res.status(200).json({message:"logout success"})
})

module.exports = router