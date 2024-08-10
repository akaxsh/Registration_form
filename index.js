
const express = require("express")
const mongoose = require('mongoose');
const bodyParser = require("body-parser");
const dotenv = require("dotenv");

const app = express();
dotenv.config();

const port = process.env.PORT || 3000

// const username=process.env.MONGODB_USERNAME;
// const password=process.env.MONGODB_PASSWORD;

//const uri = 'mongodb+srv://${username}:${password}@cluster0.urb7fhh.mongodb.net/<dbname>?retryWrites=true&w=majority';
mongoose.connect(`mongodb://localhost:27017/registration`)

//registrationSchema
const registrationSchema= new mongoose.Schema({
    name:String,
    email:String,
    password:String,
});

const Registration=mongoose.model("Registration",registrationSchema);
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json())

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/pages/index.html");
});

app.post("/register",async(req,res)=>{
    try{
        const {name,email,password} = req.body;

        const existingUser = await Registration.findOne({ email: email });
        //check for existing user
        if(!existingUser)
        {
            const registrationData= new Registration({
                name,
                email,
                password,
            });
            await registrationData.save();
            res.redirect("/success");
        }
        else
        {
            res.redirect("/exists");
        
        }
    }
    catch(error) {
    console.log(error);
        
        res.redirect("/error");
        
    }

})

app.get("/success",(req,res)=>{
    res.sendFile(__dirname+"/pages/success.html");
});

app.get("/error",(req,res)=>{
    res.sendFile(__dirname+"/pages/error.html");
});

app.get("/exists",(req,res)=>{
    res.sendFile(__dirname+"/pages/exists.html");
});




app.listen(port,()=>{
    console.log(`Server is running on port ${port}`);
}) 

