// client side javascript


import initAdmin  from './admin'
import axios from 'axios'
import Noty from 'noty'
import moment from 'moment'

let addToCart  = document.querySelectorAll('.add-to-cart')
let cartCounter = document.querySelector('#cartCounter')

function updateCart(pizza)
{
    axios.post('update-cart', pizza).then(res => {
        cartCounter.innerText = res.data.totalQty

        new Noty({
            type : 'success',
            timeout : 1000,
            progressBar: false,
            text : 'item added to cart'
        }).show();
    }).catch(err =>{
        new Noty({
            type : 'error',
            timeout : 1000,
            progressBar: false,
            text : 'Something went wrong'
        }).show();

    })
}

addToCart.forEach((btn)=>{
    btn.addEventListener('click', (e)=>{
        let pizza = JSON.parse(btn.dataset.pizza)
        updateCart(pizza)

    })
})

const alertMsg = document.querySelector('#success-alert')
if(alertMsg){
    setTimeout(()=>{
        alertMsg.remove()
    }, 2000)
}





//add class to  single order status page
//change order status

let statuses = document.querySelectorAll('.status-line')
let hiddenInput = document.querySelector('#hiddenInput') 
let order = hiddenInput ? hiddenInput.value : null
order = JSON.parse(order)

let time = document.createElement('small')

function updateStatus(order)
{
    statuses.forEach((status)=>{
         status.classList.remove('step-completed')
         status.classList.remove('curr')

    })
    let stepCompleted = true;
    statuses.forEach((el)=>{
    
        let data = el.dataset.status
        if(stepCompleted){
            el.classList.add('step-completed')
        }

        if(data === order.status)
        {
            stepCompleted = false 
            time.innerText = moment(order.updatedAt).format('hh:mm A')
            el.appendChild(time)
            if(el.nextElementSibling)
            el.nextElementSibling.classList.add('curr')
        }

    })

}

updateStatus(order)


let socket = io()


//admin file
initAdmin(socket)

// Join
if(order) {
    socket.emit('join', `order_${order._id}`)
}



let adminAreaPath = window.location.pathname //it gives url 
if(adminAreaPath.includes('admin')){
    socket.emit('join','adminRoom' )
}

socket.on('orderUpdated', (data) => {
    const updatedOrder = { ...order }
    updatedOrder.updatedAt = moment().format()
    updatedOrder.status = data.status
    updateStatus(updatedOrder)
    new Noty({
        type : 'success',
        timeout : 1000,
        progressBar: false,
        text : 'order updated'
    }).show();
})


