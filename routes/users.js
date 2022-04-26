const router = require("express").Router();

// User routes here
router.get("/", (req, res) => {
    res.send("this is the users routes")
});


module.exports = router;


