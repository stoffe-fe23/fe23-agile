import * as productdata from "./productdata.js";

let debounceTimer = null;

const productSearchForm = document.querySelector("#product-search-form");
const searchTextField = document.querySelector("#product-search-text");

// Prevent the page from reloading if the form is submitted.
if (productSearchForm) {
    productSearchForm.addEventListener("submit", (event) => {
        event.preventDefault();
    });
}

// Perform search after 0.5 sec of no user input.
if (searchTextField) {
    searchTextField.addEventListener("input", (event) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(searchWhileTyping, 500);
    });

}

// Update search results as the user is typing
async function searchWhileTyping() {
    const resultsBox = document.querySelector("#product-search-result");
    const pageContent = document.querySelector("#main-content");

    resultsBox.innerHTML = "";

    if (pageContent)
        pageContent.style.display = "";

    if (searchTextField.value.length) {
        const searchResult = await productdata.searchProducts(searchTextField.value);

        if (searchResult.length) {
            for (const product of searchResult) {
                resultsBox.appendChild(createProductCard(product));
            }

            if (pageContent)
                pageContent.style.display = "none";
        }
        else {
            console.log("no result!");
            resultsBox.innerHTML = `<div class="search-product-noresult">Inga produkter matchar din sökining.</div>`;
        }
    }
}

// Build and return a product card for the specified product object.
function createProductCard(product) {
    const template = document.querySelector("#product-search-result-template");
    const card = template.content.firstElementChild.cloneNode(true);
    card.querySelector(".search-product-name").innerText = product.name;
    card.querySelector(".search-product-desc").innerText = product.description;
    card.querySelector(".search-product-link").href = `productinfo.html?product=${product.productid}`;
    card.querySelector(".search-product-image").src = product.image[0];
    card.setAttribute("data-productid", product.productid);
    return card;
}
