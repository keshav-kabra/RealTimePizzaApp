const Order = require('../../../models/order')
const moment = require('moment')

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

                Order.populate(result, {path : 'customerId'} , (err, placedOrder)=>{
                    req.flash('success', 'Order placed successfully')   
                    delete req.session.cart 
    
                    //emit event for admin  
                    const eventEmitter = req.app.get('eventEmitter')
                    eventEmitter.emit('orderPlaced' , placedOrder ) //result gives the recently saved order
                    return res.redirect('customer/orders') 
                })

                

            }).catch( err => {
                console.log(err)
                req.flash('error', 'something went wrong')
                return res.redirect('/cart')
            })


        },
        async index(req, res){
            //show all order of current user
            const orders = await Order.find({ customerId : req.user._id}, null, {sort : {'createdAt' : -1}})
            res.header('Cache-Control', 'no-store')
            res.render('customers/orders', {orders : orders, moment : moment})

        },

        // async index(req, res) {
        //     const orders = await Order.find({ customerId: req.user._id },
        //         null,
        //         { sort: { 'createdAt': -1 } } )
        //     res.render('customers/orders', { orders: orders, moment: moment })
        // },

        async show(req, res){
            const order = await Order.findById(req.params.id)

            //autherize user => the order we are fectching is of that user or not
            if(req.user._id.toString() === order.customerId.toString()){
                return res.render('customers/singleOrder', {order : order})
            }
            
            return res.redirect('/')
            
        }
    }
}

module.exports = orderController;    