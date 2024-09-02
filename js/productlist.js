/*
    Script for building content on the product list page.
*/
import * as productdata from "./productdata.js";

// Box to display added categories on the test page. 
const productCardTemplate = document.querySelector("#product-card-template");
if (productCardTemplate) {
    console.log("LOADING TEST DATA...");
    showProductList(".product-list");
}

// Fetch list of categories and display them on the page. 
async function showProductList(targetSelector) {
    const categoryFilter = Number(new URLSearchParams(window.location.search).get("category"));
    const categories = await productdata.getCategories();
    const outBox = document.querySelector(targetSelector);
    const template = document.querySelector("#product-card-template");
    const filterBy = (!isNaN(categoryFilter) && (categoryFilter >= 0) && (categoryFilter < categories.length)) ? categoryFilter : null;

    const products = await productdata.getProducts(filterBy);
    console.log("PRODUCT LIST", products);

    if (template) {
        if (products.length > 0) {
            outBox.innerHTML = "";
        }

        for (const product of products) {
            console.log("product: ", product);
            const card = template.content.firstElementChild.cloneNode(true);
            const image = card.querySelector("img");
            const label = card.querySelector("h3");
            const desc = card.querySelector("div");
            const button = card.querySelector("a");
            image.src = product.image[0];
            label.innerText = product.name;
            desc.innerText = product.description;
            button.href = `productinfo.html?product=${product.productid}`;
            outBox.appendChild(card);
        }
    }

    const listTitle = document.querySelector("main > section > h2");
    if (!isNaN(categoryFilter) && (categoryFilter >= 0) && (categoryFilter < categories.length)) {
        const displayedCategory = categories.find((category) => category.categoryid == categoryFilter);
        if (displayedCategory) {
            listTitle.innerText = displayedCategory.name;
        }
    }
}