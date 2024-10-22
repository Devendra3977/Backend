const express = require("express");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const exp = require("constants");
const { error } = require("console");
const { type } = require("os");
const e = require("express");

const app = express();

app.use(bodyParser.json());

const mongoURI = "mongodb://localhost:27017/CRM";

mongoose.connect(mongoURI).then(()=>{
    console.log("Successfully Connected");
}).catch(error =>{
    console.log(error);
})

const signupSchema = new mongoose.Schema({
    name:{
        type:String,
        require:true
    },
    email:{
        type:String,
        require:true,
        unique:true
    },
    password:{
        type:String,
        require:true
    }
});

const Signup = mongoose.model('Signup', signupSchema)

app.post('/api/signup', async(req, res)=>{
    try{
        const { name, email, password} =req.body;

    if(!name || !email || !password){
        return req.status(400).json({message:"All Fields are Required"});
    }
    const newSignup = new Signup({
        name,
        email,
        password
    });

    await newSignup.save();
    res.status(201).json({message:"SignUp Successfuly", signup:newSignup});
}catch(error){
    console.error(error);
    res.status(500).json({message:"Error In SignUp"});
}
});

//Login 
app.post('/api/login', async(req, res)=>{
    try{
        const {email, password} = req.body;
        if(!email || !password){
            return req.status(400).json({message:"Email and password are required"});
        }
        // Find the signup email
        const existinguser = await Signup.findOne({email});
        if(!existinguser){
            return res.status(400).json({message:"Invalid Email or Password"});
        }
        if(existinguser.password!=password){
            return res.status(400).json({message:"Invalid Password"});
        }
        res.status(200).json({message:"Login Successfull", signup:existinguser})
    }
    catch(error){
        console.error("Error During Login",error);
        res.status(500).json({message:"Error During Login"});

    }
})

const PORT = 3000;
app.listen(PORT, ()=>{
    console.log(`Server is running on port ${PORT}`);
})
