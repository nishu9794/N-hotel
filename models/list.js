const express = require("express");
const mongoose = require("mongoose")
const { Schema } = mongoose; 

const userlist = new Schema({
    title: String,
    description: String,
    img: { type: String
        ,
    default : "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aG90ZWx8ZW58MHx8MHx8fDA%3D",
    set:(v)=> v===""? "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=500&auto=format&fit=crop&q=60&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxzZWFyY2h8Mnx8aG90ZWx8ZW58MHx8MHx8fDA%3D":v,
    },
    price: Number ,
    location: String,
    reviews:[
        {
            type: Schema.Types.ObjectId,
            ref:'Review'
        }
    ]
})
const usd = mongoose.model("usd",userlist)
module.exports =usd;