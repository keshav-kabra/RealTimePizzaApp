function cartController() {

    return {
        index (req, res){
            res.render('customers/cart')
        },
        update(req, res)
        {
            //adding pizza to cart logic fromat
            /*
                let cart = {
                    
                    items : {
                        pizzaId : {item : pizzaobj , qty : 0}
                    }

                    totalqty : 0,
                    totalprice
                }
            
            */ 
        //    if(!req.session.cart){  //if first time we are adding something into cart

        //         req.session.cart = {
        //             items : {},
        //             totalQyt : 0,
        //             totalPrice :0
        //         }
        //    }
            
        //    let cart = req.session.cart
        //    if(!cart.items[req.body._id]){
        //         cart.items[req.body._id] = {
        //             item : req.body,
        //             qty : 1,
        //         }
        //         cart.totalQty  =  cart.totalQty + 1
        //         cart.totalPrice = cart.totalPrice + req.body.price
        //     } else {
        //         cart.items[req.body._id].qty = cart.items[req.body._id].qty + 1 
        //         cart.totalQty  =  cart.totalQty+1;
        //         cart.totalPrice = cart.totalPrice + req.body.price

        //     }




        //     return res.json({totalQty : req.session.cart.totalQty})
        //     }
        if (!req.session.cart) {
            req.session.cart = {
                items: {},
                totalQty: 0,
                totalPrice: 0
            }
        }
        let cart = req.session.cart

        // Check if item does not exist in cart 
        if(!cart.items[req.body._id]) {
            cart.items[req.body._id] = {
                item: req.body,
                qty: 1
            }
            cart.totalQty = cart.totalQty + 1
            cart.totalPrice = cart.totalPrice + req.body.price
        } else {
            cart.items[req.body._id].qty = cart.items[req.body._id].qty + 1
            cart.totalQty = cart.totalQty + 1
            cart.totalPrice =  cart.totalPrice + req.body.price
        }
        return res.json({ totalQty: req.session.cart.totalQty })
    }
    }
}

module.exports = cartController