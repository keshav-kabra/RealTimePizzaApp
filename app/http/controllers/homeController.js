const Menu = require('../../models/menu')

// factory function
function homeController() {
    return {


        //1. first method using promise

        // index (req, res){
        //     Menu.find().then((pizzas)=>{
        //         console.log(pizzas)
        //         res.render('home' , {pizzas : pizzas})
        //     })

        //2 using async and await
        async index(req , res){

            const pizzas = await Menu.find()
            res.render('home' , {pizzas : pizzas})
        }
        
            
        
    }
}

module.exports = homeController