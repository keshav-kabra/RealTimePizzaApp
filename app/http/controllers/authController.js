// factory function
const User = require('../../models/user')
const bcrypt = require('bcrypt');
const passport = require('passport');

function authController() {
    return {
        register (req, res){
            res.render('auth/register')
        },

        async postRegister(req, res){
            const {name, email, password} = req.body;

            //validating request
            if( !name || !email || !password )
            {
                req.flash('error' , 'All fields are compulsory !!')
                req.flash('name', name)
                req.flash('email', email)

                return res.redirect('/register')
            }

            //if email already exist in data base
            User.exists({email : email}, (err, res)=>{
                if(res){
                    req.flash('error', 'Email already Exist')
                    req.flash('name', name)
                    req.flash('email', email)
                    return res.redirect('/register')
                }

            } )

            //hash password
            const hashedPassword = await bcrypt.hash(password, 10)   // make function async for this 

            //else create a user
            const user = new User({
                name : name,
                email : email,
                password : hashedPassword
            })

            user.save().then((user)=>{
                // Login

                return res.redirect('/') 
            }).catch((err)=>{
                req.flash('error', 'something went wrong')
                res.redirect('/register')

            })
        },

        login (req, res){
            res.render('auth/login')
        },

        postLogin(req, res, next)
        {
            passport.authenticate('local', (err, user, info)=>{
                if(err){
                    req.flash('error' , info.message)
                    return next(err)
                }

                if(!user)
                {
                    req.flash('error' , info.message)
                    return res.redirect('/login')

                }

                req.logIn(user , (err, )=>{
                    if(err){
                        req.flash('error', info.message )
                        return next(err)
                    }

                return res.redirect('/')

            })
        })(req, res, next)

        },
        logout(req, res){
            req.logout()
            return res.redirect('/')
        }
    }
}

module.exports = authController