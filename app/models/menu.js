//modal is singular and table name is prural
const mongoose = require('mongoose')

//by general convention if some variable name start with caps , it means value that this variable holds is  either its class or contructor function
const Schema = mongoose.Schema
const menuSchema = new Schema({
    name : {
        type : String,
        required : true
    },
    image : {
        type : String, 
        required : true
    }, 
    price : {
        type : Number, 
        required : true
    }, 
    size : {
        type : String, 
        required : true
    }
})
module.exports =  mongoose.model('Menu', menuSchema)