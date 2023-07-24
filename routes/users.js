const router = require('express').Router();
const User = require('../models/User');
const {registerValidation, loginValidation} = require('../validation');
const bcrypt = require('bcryptjs');


router.get('/home', (request, response)=>{
    response.render('home');
})

router.get('/register', (request, response)=>{
    response.render('register');
})

router.get('/login', (request, response)=>{
    response.render('login');
})


// To register a user
router.post('/register', async(req, res)=> {

    //validation of data
      const {error} = registerValidation(req.body);
      if(error) return res.status(400).send(error);

    // checking if email exists
    const emailExist   = await User.findOne({email : req.body.email});
    if(emailExist) return res.status(400).send("This Email Id already exists");

    // hash the password
        const salt  =  await bcrypt.genSalt(10);
        const hashedPassword  = await bcrypt.hash(req.body.password, salt);

    // create a user
    const newUser = new User({
        username : req.body.username,
        email : req.body.email,
        password : hashedPassword
    })

    // save to the db
    try {
       
       const userData   = await newUser.save();
       res.status(201).render('login');
    }
    catch(err) {
        res.status(500).send(err);
    }
})

// login logic
router.post('/login', async(req, res)=> {
     //validation of data
     const {error} = loginValidation(req.body);
     if(error) return res.status(400).send(error);

    //  checking if email exists or not
    const user = await User.findOne({email : req.body.email });
    if(!user) return res.status(400).render('register');

    // password matching
    const validPassword = await bcrypt.compare(req.body.password, user.password);
    if(!validPassword) return res.status(500).send("Invalid credentials");


    res.status(200).send("Profile Page");
})


module.exports = router;