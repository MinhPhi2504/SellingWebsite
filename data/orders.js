import dayjs from "https://unpkg.com/dayjs@1.11.10/esm/index.js"
export let orders = JSON.parse(localStorage.getItem('order')) || []
export function addOrder (order) {
    orders.unshift(order)
    saveStorage()
}
export function saveStorage () {
    localStorage.setItem('order', JSON.stringify(orders))
}
/*function containsObject(arr, order) {
    let result = false
    let dateString = ''
    let formattedDate = ''
    const order_dateString = order.orderTime
    const order_formattedDate = dayjs(order_dateString).format('MMMM DD YYYY');
    arr.forEach((element) => {
        dateString = element.orderTime;
        formattedDate = dayjs(dateString).format('MMMM DD YYYY');
        if (formattedDate === order_formattedDate && 
            JSON.stringify(element.products) === JSON.stringify(order.products)) {
                result = true
        }
    });
    return result
}*/
/////////////We create a hash table for searching
export class HashTable {
    array; // use for orders
    productArray// use for producs
    m;// length of array orders
    n; // length of products array
    constructor () {
        this.array = []
        this.productArray = []
        this.m = 0
        this.n = 0
    }
    setOrders (orders, sizeofArray) { // orders, length of orders     id of order -> order
    // save orders again, after that, with just id, we can find an order easy
        this.m = sizeofArray
        this.array = Array(this.m)
        console.log(orders)
        let bamlai = 0
        orders.forEach((order) => {
            const key = this.stringToNumber(order.id) //9
            console.log(`key: ${key}`)
            let index = this.hashFunc(key, this.m)//9
            let j = 0
            while(j < this.m) {
                console.log(`index: ${index}`)
                if ( index === this.m) {
                    index = 0
                }
                if (this.array[index] === undefined) {
                    this.array[index] = order
                    console.log('added')
                    console.log(this.array[index])
                    break
                }
                else {
                    console.log('hash again')
                    j++
                    bamlai++
                    index = this.hashFuncAgain(key,this.m,j)
                }
            }
        });
        console.log(this.array)
        console.log(`Tong so lan bam lai: ${bamlai}`)
    }
    setProducts (products, sizeofArray) {
            this.n = sizeofArray
            this.productArray = Array(this.n)
            console.log(products)
            let bamlai = 0
            products.forEach((product) => {
                const key = this.stringToNumber(product.id) //9
                console.log(`key: ${key}`)
                let index = this.hashFunc(key, this.n)//9
                let j = 0
                while(j < this.n) {
                    console.log(`index: ${index}`)
                    if ( index === this.m) {
                        index = 0
                    }
                    if (this.productArray[index] === undefined) {
                        this.productArray[index] = product
                        console.log('added')
                        console.log(this.productArray[index])
                        break
                    }
                    else {
                        console.log('hash again')
                        j++
                        bamlai++
                        index = this.hashFuncAgain(key,this.n,j)
                    }
                }
            });
            console.log(this.productArray)
            console.log(`Tong so lan bam lai: ${bamlai}`)
        }

    getOrderFromOrderId(orderId) { // this will return an order from orderid
        const key = this.stringToNumber(orderId) 
        let index = this.hashFunc(key, this.m)
        let j = 0
        while (1) {
            if (this.array[index] != undefined)
                return this.array[index]
            else {
                j++
                index = this.hashFuncAgain(key,this.m,j)
            }
        }
    }
    getProductFromId (productId) {
        const key = this.stringToNumber(productId) 
        let index = this.hashFunc(key, this.n)
        let j = 0
        while (1) {
            if (this.productArray[index] != undefined)
                return this.productArray[index]
            else {
                j++
                index = this.hashFuncAgain(key,this.n,j)
            }
        }
    }
    getProductFromOrder (productId, orderId) {
        const order = this.getOrderFromOrderId(orderId)
        let matchingProduct = ''
        order.products.forEach((product) => {
            if (productId === product.productId)
                matchingProduct = product
        })
        return matchingProduct
    }
    stringToNumber(str) { //string -> number
        return str.split('').reduce((sum, char) => sum + char.charCodeAt(0), 0);
    }
    hashFunc (number, sizeofArray) {
        return number % sizeofArray
    }
    hashFuncAgain (number, sizeofArray, j) {
        return (number + j*j) % sizeofArray
    }
}
export function test () {
    const h = new HashTable()
    const m = orders.length
    console.log(m)
    h.setOrders(orders, m)
    console.log(h.getOrderFromOrderId('ef115979-88cf-4729-b722-73a349688849'))
}
