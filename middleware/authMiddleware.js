const jwt = require('jsonwebtoken')
const User = require('../models/User')


const requireAuth = (req, res, next) => {

    const token = req.cookies.jwt
    //check jwt existence and verification
    if (token) {
        jwt.verify(token, process.env.SECRET, (err, decodedToken) => {
            if (err) {
                console.log('JWT Verification:', err.message)
                res.redirect('/login')
            }
            else {
                console.log('Decoded Token:', decodedToken)
                next()
            }
        })
    }
    else {
        res.redirect('/login')
    }
}


const checkUser = (req, res, next) => {
    const token = req.cookies.jwt

    if (token) {
        jwt.verify(token, process.env.SECRET, async (err, decodedToken) => {
            if (err) {
                console.log('JWT Verification:', err.message)
                res.locals.user = null
                next()
            }
            else {
                console.log('Decoded Token:', decodedToken)
                let user = await User.findById(decodedToken.id)
                res.locals.user = user
                next()
            }
        })
    }
    else {
        res.locals.user = null
        next()

    }
}


module.exports = { requireAuth, checkUser }