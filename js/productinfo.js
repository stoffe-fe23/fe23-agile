/*
    Script for populating data on the product info page.
*/
import * as productdata from "./productdata.js";

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

            productName.innerText = product.name;
            productDesc.innerText = product.description;
            productPrice.innerText = product.price;
            productImage.src = product.image[0];
        }
    }
}


