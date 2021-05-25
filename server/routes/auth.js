const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')

const User = require('../models/User');
const { validationResult, check } = require('express-validator');




router.post(
    '/', 
    [
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Password required!').exists()
    ],
    async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    const {email, password} = req.body;

    try {
        let user = await User.findOne({email}); //find user by email

        //if user doesn't exist
        if(!user){
            return res.status(400).json({msg: 'Invalid Credentials'})
        }

        //else
        const isMatch = await bcrypt.compare(password, user.password); // compares the entered password with the registered password

        if(!isMatch){
            return res.status(400).json({msg: 'Invalid Credentials'})
        }

        const payload = {user: {id: user.id} } //payload is the obj we want in the token; we want the user id to access data specific to that user
        jwt.sign(payload, config.get('jwtSecret'), {
            expiresIn: 360000
        }, (err, token) => {    
                if(err) throw err;
                res.json({token});
            });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error')
    }
})


module.exports = router