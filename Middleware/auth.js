const jwt = require('jsonwebtoken')

module.exports = (req,res,next) =>{
    res.set('Cache-Control', 'no-store')
    const token = req.cookies.token
    if(!token){
        return res.status(401).json({message:'no token access denied'})
    }
    try{
        const verified = jwt.verify(token,process.env.JWT_secert)
        req.user = verified
        next()
    }
    catch(err){
        res.status(401).json({message:'invalid token'})
    }
}
