import {cart, saveDataQuantity, count_Quantity, updateCartQuantity} from '../data/cart.js';
import {products, loadProducts, loadProductsFetch} from '../data/products.js';
import { saveDataCart, check_exist,searchProduct, renderProducsGrid } from '../data/cart.js';
import { deliveryOptions } from '../data/deliveryOptions.js';

updateCartQuantity()
await loadProductsFetch()
renderProducsGrid(products)
searchProduct(products)