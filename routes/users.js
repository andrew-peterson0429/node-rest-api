const User = require("../models/User");
const router = require("express").Router();
const bcrypt = require("bcrypt");
const { response } = require("express");

// User routes here


// Update User using any id number in database i.e. localhost:8080/api/user/626cc9b2b24c523c98a9ea9d
router.put("/:id", async(req, res) => {
    // check if user id doesn't match with this id, return error
    if (req.body.userId === req.params.id || req.user.body.isAdmin) {
        //If user tires to update password, generate password
        if (req.body.password) {
            try {
                // Generate new secure password and update the request body password
                const salt = await bcrypt.genSalt(10);
                req.body.password = await bcrypt.hash(req.body.password, salt);
            } catch(err) {
                // Returns internal server error
                return res.status(500).json(err)
            }
        }
        try {
            // Finds user by their id and sets all inputs inside this body (can be params or body)
            const user = await User.findByIdAndUpdate(req.params.id, {
                $set:req.body,
            });
            res.status(200).json("Account has been updated");
        } catch (err) {
            // Returns internal server error
            return res.status(500).json(err);
        }
    } else {
        // Return forbidden response code
        return res.status(403).json("You can only update your own account");
    }
});

// Delete User
router.delete("/:id", async(req, res) => {
    // check if user id doesn't match with this id, return error
    if (req.body.userId === req.params.id || req.user.body.isAdmin) {
        
        try {
            // Finds user by their id and sets all inputs inside this body (can be params or body)
            await User.findByIdAndDelete(req.params.id)
            res.status(200).json("Account has been deleted");
        } catch (err) {
            // Returns internal server error
            return res.status(500).json(err);
        }
    } else {
        // Return forbidden response code
        return res.status(403).json("You can only delete your own account");
    }
});


// Get a User
router.get("/:id", async(req,res) => {
    // Find user by id
    try {
        const user = await User.findById(req.params.id);
        // Unecessary user properties with the _doc which carries the document
        const {password, updatedAt, ...other} = user._doc;

        // Return success message and other user data
        response.status(200).json(other);
    } catch {
        // Returns internal server error
        res.status(500).json(err);
    }
});


// Follow a User


// Unfollow a user



module.exports = router;


