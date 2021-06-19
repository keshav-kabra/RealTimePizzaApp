const express = require('express')
  const app = express()
const ejs = require('ejs')
const path = require('path')
const expressLayout = require('express-ejs-layouts')
const { dirname } = require('path')
const mongoose = require('mongoose')
const session = require('express-session')
require('dotenv').config()
const flash = require('express-flash')
const MongoDbStore = require('connect-mongo')(session) //use to store session in mongodb data base
const passport = require('passport')
const Emitter = require('events') 



//database connection
const url = 'mongodb://localhost:27017/pizza' 
mongoose.connect(url ,
  {
    useNewUrlParser: true,
    useFindAndModify: false,
    useUnifiedTopology: true
  }
);


const db = mongoose.connection;
db.once("open",  ()=> {
  console.log("Connected successfully")
}).catch(err => {
    console.log('connection failed')
})


//Event Emitter

const eventEmitter = new Emitter()
app.set('eventEmitter', eventEmitter)



//session store
let mongoStrore = new MongoDbStore({
  mongooseConnection : db, // pass a connection
  collection : 'sessions' //which collection
})


//session config =>middle ware of express 
app.use(session({
  secret :  process.env.COOKIE_SECRET,     //for cookies
  resave : false, 
  store : mongoStrore, //where to store this session
  saveUninitialized : false,
  cookie : {maxAge :  1000 * 60 * 60 * 24} //24 hours
}))

app.use(flash()) //middle ware for sessions

//passport config

const passportInit = require('./app/config/passport')
passportInit(passport)
app.use(passport.initialize())
app.use(passport.session())

//global middleware
app.use((req, res, next)=>{
  res.locals.session = req.session
  res.locals.user = req.user
  next()
})

//Assets
app.use(express.json())
app.use(express.urlencoded({extended: false }))

//set template engine
app.use(express.static('public'))
app.use(expressLayout)
app.set('views', path.join(__dirname, '/resources/views'))
app.set ('view engine' , 'ejs')

//import and call the function
require('./routes/web')(app);



const PORT = process.env.PORT || 3000
const server = app.listen(3000, ()=>{
    console.log('listening on port 3000')
})


const io = require('socket.io')(server)
io.on('connection', (socket) => {
      // Join
      socket.on('join', (orderId) => {
        socket.join(orderId)
      })
})


eventEmitter.on('orderUpdated', (data) => {
  io.to(`order_${data.id}`).emit('orderUpdated', data)
})

eventEmitter.on('orderPlaced', (data)=>{
  io.to('adminRoom').emit('orderPlaced', data)
})

/*

app.set('views' , path.join(__dirname , 'views'));
app.set('view engine' , 'ejs');

//set the public folder
app.use(express.static(path.join(__dirname , 'public')));*/ 