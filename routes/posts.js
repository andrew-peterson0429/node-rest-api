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
        // Respond with internal server error
        res.status(500).json(err);
    }
});

// Delete post
router.delete("/:id", async (req, res) => {
    try {
        // find id within the requests paramater
        const post = await Post.findById(req.params.id);
        // check if owner of post is the same. If it is the same, update, if not return error
        if (post.userId === req.body.userId) {
            // Updates post by setting the requests body
            await post.deleteOne({$set:req.body});
            res.status(200).json("Post has been deleted");
        } else {
            // Returns response with forbidden error
            res.status(403).json("You can only delete your own posts");
        }
    } catch(err) {
        res.status(500).json(err);
    }
});

// Like or dislike post
router.put("/:id/like", async (req, res) => {
    try {
        // find post by parameter id
        const post = await Post.findById(req.params.id);
        //Checks if post's like array includes this user or not, if it does it likes, if not dislike
        if (!post.likes.includes(req.body.userId)) {
            // Push userId to like array and respond with success code
            await post.updateOne({ $push:{ likes: req.body.userId } });
            res.status(200).json("post has been liked");
        } else {
            // pull likes array 
            await post.updateOne({ $pull: { likes: req.body.userId } });
            res.status(200).json("post has been disliked");
        }
    } catch(err) {
        // Respond with internal server error
        res.status(500).json(err)
    }
});

// Get post
router.get("/:id", async (req, res) => {
    try {
        //find post by requests paramater id and returns successful response with post
        const post = await Post.findById(req.params.id);
        res.status(200).json(post);
    } catch(err) {
        // Respond with internal server error
        res.status(500).json(err)
    }
});

// Get timeline posts
router.get("/timeline/all", async (req,res) => {
    try {
        const currentUser = await User.findById(req.body.userId);
        // Adds all posts from currentUser to array by their id
        const userPosts = await Post.find({ userId: currentUser._id });
        // Using promise because using map() to fetch all posts
        const friendPosts = await Promise.all(
            // map all of currentUsers post into friendId
            currentUser.following.map((friendId) => {
                // Returns each post to friendsPosts array
                return Post.find({ userId: friendId });
            })
        );
        // Takes all friendsPosts and concats with userPosts
        res.json(userPosts.concat(...friendPosts));
    } catch {
        // Respond with internal server error
        res.status(500).json(err);
    }
});

module.exports = router;