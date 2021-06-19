const homeController = require('../app/http/controllers/homeController')
const authController = require('../app/http/controllers/authController')
const cartController = require('../app/http/controllers/customer/cartController')
const guest = require('../app/http/middleware/guest')
const auth = require('../app/http/middleware/auth')
const orderController = require('../app/http/controllers/customer/orderController')
const adminOrderController = require('../app/http/controllers/admin/orderController')
const admin = require('../app/http/middleware/admin')
const statusController = require('../app/http/controllers/admin/statusController')


function initRoutes(app){

    app.get('/', homeController().index)
    app.get('/cart',cartController().index )
    app.get('/register',guest,authController().register)
    app.post('/register', authController().postRegister)

    app.get('/login',guest ,authController().login)
    app.post('/login', authController().postLogin)
    app.post('/logout', authController().logout)
    
    app.post('/update-cart', cartController().update)

    
    //customer routes
    app.post('/orders',auth , orderController().store)
    app.get('/customer/orders',auth  , orderController().index)
    app.get('/customer/orders/:id',auth  , orderController().show)

    //admin route
    app.get('/admin/orders',admin ,adminOrderController().index);
    app.post('/admin/order/status',admin ,statusController().update);




}

module.exports = initRoutes;