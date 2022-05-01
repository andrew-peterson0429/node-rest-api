const router = require("express").Router();
const User = require("../models/User");
const bcrypt = require("bcrypt");


// Register
router.post("/register", async (req, res) => {
    
    try {
        // Generate secure password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(req.body.password, salt);

        // Create new user
        const newUser = new User({
            username:req.body.username,
            email:req.body.email,
            password:hashedPassword,
        });

        //  Save user and return response
        const user = await newUser.save();
        res.status(200).json(user);

    } catch(err){
        // Responds internal server error and error message
        res.status(500).json(err);
    }
});


//Login
router.post("/login", async (req, res) => {

    try {

        //Find one user inside the document using the User module by passing in email
        const user = await User.findOne({ email: req.body.email });
        //If there is no user status not found
        !user && res.status(404).json("user not found");

        // Compares secure generated bcrypt password with user's actual password
        const validPassword = await bcrypt.compare(req.body.password, user.password);

        // If password is not valid, send bad request response
        !validPassword && res.status(400).json("Incorrect Password");

        // If user inputs correctly, sends status 200 and user data
        res.status(200).json(user);

    } catch(err) {
        // Responds internal server error and error message
        res.status(500).json(err);
    }
})


module.exports = router;

