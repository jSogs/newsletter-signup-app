//jshint esversion: 6

const express = require('express');
const mailchimp = require('@mailchimp/mailchimp_marketing');
const app = express();
const path = require('path');
require('dotenv').config({path:'vars/.env'});
mailchimp.setConfig({
    apiKey: process.end.API_KEY,
    server: process.env.API_SERVER,
});

app.use(express.static("public"));
app.use(express.urlencoded({extended: true}));


app.get("/", (req,res)=>{
    res.sendFile(__dirname+"/signup.html");
});

app.post("/",(req,res)=>{
    
    const {fullName, email, dateOfBirth} = req.body;
    const fName = fullName.split(' ')[0];
    const lName = fullName.split(' ')[1];
    var date = new Date(dateOfBirth);
    var bday = [(date.getMonth()+1),date.getDate()].join('/');
    const run = async ()=>{
        try{
        const response = await mailchimp.lists.addListMember(process.env.LIST_ID,{
            email_address: email,
            status:'subscribed',
            merge_fields:{
                FNAME: fName,
                LNAME: lName,
                BIRTHDAY: bday
            }
        });
        res.sendFile(path.join(__dirname,"/success.html"));
        } catch (err){
            res.sendFile(path.join(__dirname,"/failure.html"));
        }
    }
    run();
});


app.listen(process.env.PORT || 3000, ()=>{
    console.log("Server is running");
});

//b5c914fc9bfb40f5837c9201b01c0c8c-us21
//0fc98248db