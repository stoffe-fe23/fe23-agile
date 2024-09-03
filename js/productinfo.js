/*
    Script for populating data on the product info page.
*/
import * as productdata from "./productdata.js";
import * as db from "./database.js";

const productInfoBox = document.querySelector(".productinfo-page");
if (productInfoBox) {
    loadProductData();
}

async function loadProductData() {
    const productId = Number(new URLSearchParams(window.location.search).get("product"));
    console.log("Display product ID", productId);
    if (productId && (productId > 0)) {
        const product = await productdata.getProduct(productId);
        if (product) {
            console.log("Showing product info", product);
            const productName = document.querySelector(".product-name");
            const productDesc = document.querySelector(".product-desc");
            const productPrice = document.querySelector(".product-price");
            const productImage = document.querySelector(".product-image img");
            const productElement = document.querySelector('.productinfo-page');
            const productStock = document.querySelector('.product-stock');

            productName.innerText = product.name;
            productDesc.innerText = product.description;
            productPrice.innerText = product.price;
            productImage.src = product.image[0];
            productElement.id = `productid-${productId}`;
            productStock.lastElementChild.innerText = `I Lager (${product.amount})`;

            return product;

            productImage.innerHTML = "";
            for (const image of product.image) {
                const imgElement = document.createElement("img");
                imgElement.src = image;
                productImage.appendChild(imgElement);
            }
        }
    }
}

const buyButton = document.querySelector('.product-buy');
buyButton.addEventListener('click', async (event) => {
    try {
        const product = await loadProductData();
        if(product) {
            db.addToCart(product.productid, 1)
            console.log('added to cart');
        }
        else console.log("Error adding product data");
    }
    catch (error) {
        console.log("Error loading product data", error);
    }
})

db.getShoppingCart().then(list => console.log(list))