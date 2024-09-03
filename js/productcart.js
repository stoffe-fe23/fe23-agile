/*
    Script for populating data on the cart page.
*/

import * as db from "./database.js";
import * as productdata from "./productdata.js";

const productCart = document.querySelector('.product-cart');
if(productCart) {
    loadShoppingCart();
}

async function loadShoppingCart() {
    const shoppingCart = await db.getShoppingCart();

    for(const product of shoppingCart) {
        const matchedProduct = await productdata.getProduct(product.productid)
        showProductsInCart(matchedProduct, product.amount, product.id);
    }
}

// Displays all products from shoppingcart in IndexedDB
function showProductsInCart(product, cartProductAmount, cartProductId) {
    const productList = document.querySelector('.product-list');
    const template = document.querySelector('#product-card-template');
    
    if(template) {
        const card = template.content.cloneNode(true);
        const container = card.querySelector('article');
        const image = card.querySelector('img');
        const title = card.querySelector('h3');
        const description = card.querySelector('.product-desc');
        const price = card.querySelector('.product-price');
        const quantityInput = card.querySelector('input');

        container.id = `cart-product-id-${cartProductId}`
        container.className = `product-card`;
        image.src = product.image[0];
        title.innerText = product.name;
        description.innerText = product.description;
        price.lastElementChild.innerText = `${product.price} kr`;
        quantityInput.value = cartProductAmount;

        productList.prepend(card);

        // Listens for changes in input, also updates totalPrice and amount in IndexedDB
        quantityInput.addEventListener('input', (event) => {
            const parentElement = event.target.closest('.product-card');
            const cartId = Number(parentElement.id.replace(/\D/g,''));
            const updatedInput = Number(event.target.value);

            db.updateCartProductAmount(cartId, updatedInput);
            updateTotalPrice(product.price, cartProductAmount, updatedInput);
            cartProductAmount = updatedInput;
        });
    }

    updateTotalPrice(product.price, 0, cartProductAmount);
}

// Update the Total Price of all products
function updateTotalPrice(productPrice, oldAmount, newAmount) {
    const totalPriceDiv = document.querySelector('.product-cart-price-summary');
    const currentTotalPrice = Number(totalPriceDiv.lastElementChild.innerText.replace(' kr', '') || 0);

    const newTotalPrice = currentTotalPrice + (Number(productPrice) * (newAmount - oldAmount));

    totalPriceDiv.lastElementChild.innerText = `${newTotalPrice} kr`;
}