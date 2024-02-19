const router = require("express").Router();
const { User } = require("../models/user");
// const CLIENT_URL = "http://localhost:3000/";

router.post("/user", async (req, res) => {
  try {
    const {email}= req.body;
    // console.log("user data in delete", user);
    console.log("email",email);
    if (email) {
      const email = email;
      // await User.findByIdAndDelete(email);
      const result = await User.findByIdAndDelete({ email:email });
      console.log("Deleted");
      // if (result.deletedCount === 0) {
      //   return res.status(404).json({ error: "emp id not found" });
      // }
      return res.status(200).json({ message: "deleted", data :result});
      // res.redirect(CLIENT_URL);
    }
    // req.logout();
  } catch (error) {
    console.error("Error deleting user data:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

module.exports = router;
