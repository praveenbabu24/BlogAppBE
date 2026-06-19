const express = require('express')
const router = express.Router()
const post = require('../models/post')
const auth = require('../middleware/auth')

router.post('/createPost' , auth, async (req,res) =>{
    try{
        const {title , content} = req.body
        const newPost = new post({
            title,
            content,
            author: req.user.id
        })
        await newPost.save()
        res.status(201).json({message:'created success', post:newPost})
    }
    catch(err){
        console.log(err)
        res.status(500).json({message:err.message})
    }
    
})

router.get('/' , async (req,res) =>{
    try{
        const posts = await post.find().populate('author','username')
        res.status(200).json(posts)
    }
    catch(err){
        console.log(err)
        res.status(500).json({message:err.message})
    }
    
})

router.get('/:id' , async (req,res) =>{
    try{
        const postsID = await post.findById(req.params.id).populate('author','username')
        if(!postsID){
            return res.status(404).json({message:'post not found'})
        }
        res.status(200).json(postsID)
    }
    catch(err){
        console.log(err)
        res.status(500).json({message:err.message})
    }
    
})

router.delete('/:id' , auth, async (req,res) =>{
    try{
        const dpost = await post.findById(req.params.id)
        if(!dpost){
            return res.status(404).json({message:'post not found'})
        }
        if(dpost.author.toString() !== req.user.id){
            return res.status(404).json({message:' not auth'})
        }
        await post.findByIdAndDelete(req.params.id)
        res.status(200).json({message:'deleted'})
    }
    catch(err){
        console.log(err)
        res.status(500).json({message:err.message})
    }
    
})
module.exports = router