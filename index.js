const express = require('express');
const port = 5000;

const mongoose = require('mongoose');

const app = express();

// to set up the view engine as ejs
app.set("view engine", "ejs");
app.set('views', "./views");


//connecting to mongodb
mongoose.connect("mongodb://127.0.0.1:27017/signupDB", {useNewUrlParser : true, useUnifiedTopology : true})
.then(()=> {
    console.log("App is now connected to DB")
}).catch((err)=> {
    console.log(`${err}`);
})



// middlewares
app.use(express.json());
app.use(express.urlencoded({   
    extended: false
}))   

// import routes
const userRoute = require('./routes/users');
app.use('/public', userRoute);
            


// listen to the app
app.listen(port, (err)=>{
    if(err) {
      console.log(`${err}`)
    }

    console.log(`Server is running on port : ${port}`)
})