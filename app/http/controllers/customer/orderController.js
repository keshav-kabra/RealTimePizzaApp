const Order = require('../../../models/order')

function orderController() {
    return {
        store(req, res){
            //validate request
            const {phone, address} = req.body
            if(!phone || !address)
            {
                console.log('all fields are required')
                req.flash('error', 'all fields are required')
                res.redirect('/cart')
            }

            const order = new Order({
                customerId : req.user._id,
                items : req.session.cart.items,
                phone : phone, 
                address : address, 
            })
            order.save().then(result =>{

                req.flash('success', 'Order placed successfully')
                return res.redirect('/')

            }).catch( err => {
                console.log(err)
                req.flash('error', 'something went wrong')
                return res.redirect('/cart')
            })


        },
        async index(req, res){
            //show all order of current user
            const orders = await Order.find({ customerId : req.user._id})

            console.log(orders);
        }
    }
}

module.exports = orderController;    