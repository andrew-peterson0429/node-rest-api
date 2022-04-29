const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");


// Register
router.post("/register", async (req, res) => {
    
    try{
        // Generate secure password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // Create new user
        const newUser = new User({
            username:req.body.username,
            email:req.body.email,
            password:hashedPassword
        });

        //  Save user and return response
        const user = await newUser.save();
        res.status(200).json(user);

    } catch(err){
        console.log(err);
    }
});


module.exports = router;

