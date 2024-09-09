import * as productdata from "./productdata.js";

let debounceTimer = null;

const productSearchForm = document.querySelector("#product-search-form");
const searchTextField = document.querySelector("#product-search-text");

if (productSearchForm) {
    productSearchForm.addEventListener("submit", (event) => {
        event.preventDefault();
    });
}

if (searchTextField) {
    searchTextField.addEventListener("input", (event) => {
        clearTimeout(debounceTimer);
        debounceTimer = setTimeout(searchWhileTyping, 500);
    });

}

async function searchWhileTyping() {
    const resultsBox = document.querySelector("#product-search-result");

    resultsBox.innerHTML = "";

    if (searchTextField.value.length) {
        const searchResult = await productdata.searchProducts(searchTextField.value);

        if (searchResult.length) {
            for (const product of searchResult) {
                resultsBox.appendChild(createProductCard(product));
            }
        }
        else {
            console.log("no result!");
            resultsBox.innerHTML = `<div class="search-product-noresult">Inga produkter matchar din sökining.</div>`;
        }
    }
}

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
