const Order = require('../../../models/order')

function orderController(){
    return {
        index(req, res){
             Order.find({status : {$ne : 'completed'}}, null, {sort : {'createdAt':-1}}).
            populate('customerId', '-password').exec((err , orders)=>{
                if(req.xhr){    
                    console.log('it is executed');
                    return res.json(orders)

                }
                    
                else {
                    console.log('this is executed')
                    return res.render('admin/order')
                }
            })
        }
    }
}

module.exports = orderController