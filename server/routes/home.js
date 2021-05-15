const express = require('express')
const router = express.Router();


router.get('/', (req, res) => {
    res.send("The Glorious Gallery")
})

router.get('/', (req, res) => {
    res.send("Post image")
})

router.put('/:id', (req, res) => {
    res.send("Update image info")
})

router.delete('/:id', (req, res) => {
    res.send("delete image")
})

module.exports = router