import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js"
import { orders, HashTable } from "../data/orders.js"
import { products } from "../data/products.js"

const H = new HashTable()
H.setOrders(orders,orders.length)
H.setProducts(products, products.length)

const url = new URL(window.location.href)
console.log(url)
const productId = url.searchParams.get('productId')
const orderId = url.searchParams.get('orderId')

const product = H.getProductFromOrder(productId,orderId)
console.log(product)
const productDetail = H.getProductFromId(productId)

const dateString = product.estimatedDeliveryTime
const formattedDate = dayjs(dateString).format('MMMM DD YYYY');

const html = `
<div class="delivery-date">
        Arriving on ${formattedDate}
    </div>

    <div class="product-info">
        ${productDetail.name}
    </div>

    <div class="product-info">
        Quantity: ${product.quantity}
    </div>

    <img class="product-image" src="${productDetail.image}">    
`
document.querySelector('.order-detail').innerHTML = html