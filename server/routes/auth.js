const express = require('express');
const User = require('../models/User');
const { validationResult, check } = require('express-validator');

const router = express.Router();

router.get('/', (req, res) => {
    res.send("Get logged in user")
})


router.post(
    '/', 
    [
        check('name', 'Please include your name').not().isEmpty(),
        check('email', 'Please include a valid email').isEmail(),
        check('password', 'Please enter a password of six or more characters.').isLength({min: 6})
    ],
    async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()){
        return res.status(400).json({errors: errors.array()})
    }
    const {email, password} = req.body;

    try {
        let user = await User.findOne({email});

        if(!user){
            return res.status(400).json({msg: 'Invalid Credentials'})
        }

        const isMatch = await bcrypt.compare(password, user.password);

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
        
    }
})


module.exports = router