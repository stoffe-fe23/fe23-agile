/*
    Script for building content on the product list page.
*/
import * as productdata from "./productdata.js";

// Display products in product list element. 
const productCardTemplate = document.querySelector("#product-card-template");
if (productCardTemplate) {
    showProductList(".product-list");
}

// Fetch list of products in the specified category and display them on the page. 
async function showProductList(targetSelector) {
    const categoryFilter = Number(new URLSearchParams(window.location.search).get("category"));
    const categories = await productdata.getCategories();
    const outBox = document.querySelector(targetSelector);
    const template = document.querySelector("#product-card-template");
    const filterBy = (!isNaN(categoryFilter) && (categoryFilter >= 0)) ? categoryFilter : null;

    const products = await productdata.getProducts(filterBy);

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

    // Update page title to show the name of the category whose products are displayed. 
    const listTitle = document.querySelector("main > section > h2");
    if (!isNaN(categoryFilter) && (categoryFilter >= 0)) {
        const displayedCategory = categories.find((category) => category.categoryid == categoryFilter);
        if (displayedCategory) {
            listTitle.innerText = displayedCategory.name;
        }
    }
}