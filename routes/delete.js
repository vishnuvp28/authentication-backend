const router = require("express").Router();
const { User } = require("../models/user");
// const CLIENT_URL = "http://localhost:3000/";

router.post("/user", async (req, res) => {
  try {
    const user = req.body;
    console.log("user data in delete", user);
    // console.log(req.user);
    if (req) {
      const id = user._id;
      // await User.findByIdAndDelete(email);
      const result = await User.findByIdAndDelete({ _id: id });
      console.log("Deleted");
      // if (result.deletedCount === 0) {
      //   return res.status(404).json({ error: "emp id not found" });
      // }
      return res.status(200).json({ message: "deleted" });
      // res.redirect(CLIENT_URL);
    }
    // req.logout();
  } catch (error) {
    console.error("Error deleting user data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
