const express = require('express');
const { validationResult, check } = require('express-validator');
const router = express.Router();
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const config = require('config')
const User = require('../models/User')

router.post(
    '/', 
    [
        check('name', 'Please include your name').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Please enter a password of six or more characters.').isLength({min: 6})
    ],
    async (req, res) => {
        const errors = validationResult(req);
        if(!errors.isEmpty()){
            return res.status(400).json({errors: errors.array()})
        }
        const {name, email, password} = req.body; // destructuring, otherwise we'd have to use req.body as prefix (eg req.body.name)
        // check user existence
        try {
            let user = await User.findOne({email: email}) // we'll identfy user by email

            if(user){
                return res.status(400).json({msg: 'User already exists'})
            }

            //if user doesn't exist
            user = new User({name, email, password})

            //encrypting password, using bcrypt
            const salt = await bcrypt.genSalt(10);
            user.password = await bcrypt.hash(password, salt)

            user.save();

            const payload = {user: {id: user.id} } //payload is the obj we want in the token; we want the user id to access data specific to that user
            jwt.sign(payload, config.get('jwtSecret'), {
                expiresIn: 360000
            }, (err, token) => {
                if(err) throw err;
                res.json({token});
            });


        } catch (err) {
            console.error(err.message);
            res.status(500).send("server error")
        }
    })

module.exports = router