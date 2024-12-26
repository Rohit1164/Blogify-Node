const {Router}=require('express')
const User = require('../models/user')
const router= Router()


router.get('/signin',(req,res)=>{
  return res.render("signin")
})
router.get("/signup",(req,res)=>{
  return res.render("signup")
})

router.post('/signin', async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  if (!email || !password) {
    return res.render("signin", {
      error: "Email and password are required."
    });
  }

  try {
    // Attempt to match credentials and generate a token
    const token = await User.matchPasswordAndGeneratetoken(email, password);
    console.log(token)
    // Set the token as a cookie and redirect to the home page
    return res.cookie("token",token).redirect("/");
  } catch (error) {
    console.error("Error during sign-in:", error.message);

    // Render the sign-in page with an error message
    return res.render("signin", {
      error: "Incorrect email or password."
    });
  }
});

router.get("/logout",(req,res)=>{
  res.clearCookie("token").redirect("/")
})

router.post("/signup", async (req, res) => {
  try {
    const { fullName, email, password } = req.body;
    console.log(fullName,email,password)
    await User.create({ fullName, email, password});
    return res.redirect("/");
  } 
  catch (error) {
    console.error("Error during signup:", error);
    return res.status(500).send("An error occurred during signup. Please try again.");
  }
});

module.exports=router