const router = require("express").Router();
const Post = require("../models/Post")

// Create post

router.post("/", async (req, res) => {
    const newPost = new Post(req.body);

    try {
        const savedPost = await newPost.save();
        res.status(200).json(savedPost);

    } catch(err) {
        // Respond with internal server error
        res.status(500).json(err)
    }
});

// Update post
router.put("/:id", async (req, res) => {
    try {
        // find id within the requests paramater
        const post = await Post.findById(req.params.id);
        // check if owner of post is the same. If it is the same, update, if not return error
        if (post.userId === req.body.userId) {
            // Updates post by setting the requests body
            await post.updateOne({$set:req.body});
            res.status(200).json("Post has been updated");
        } else {
            // Returns response with forbidden error
            res.status(403).json("You can only update your own posts");
        }
    } catch(err) {
        res.status(500).json(err);
    }
});

// Delete post

// Like post

// Get post

// Get timeline posts

module.exports = router;