const express = require('express')
const app = express()
const ejs = require('ejs')
const path = require('path')
const expressLayout = require('express-ejs-layouts')
const { dirname } = require('path')


app.get('/', (req, res)=>{
    res.render('home')
})

//set template engine
app.use(express.static('public'))
app.set('views', path.join(__dirname, '/resources/views'))
app.set ('view engine' , 'ejs')
app.use(expressLayout)



const PORT = process.env.PORT || 3000
app.listen(3000, ()=>{
    console.log('listening on port 3000')
})

/*

app.set('views' , path.join(__dirname , 'views'));
app.set('view engine' , 'ejs');

//set the public folder
app.use(express.static(path.join(__dirname , 'public')));*/ 