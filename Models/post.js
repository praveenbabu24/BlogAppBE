const mongoose = require('mongoose')
const user = require('./user')

const blogPostSchema = new mongoose.Schema({
    title:{type: String, required:true},
    content:{type: String, required:true},
    author:{type: mongoose.Schema.Types.ObjectId, required:true , ref:user}},
    {timestamps:true})

    module.exports = mongoose.model('post',blogPostSchema)