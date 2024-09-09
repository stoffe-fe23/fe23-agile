import * as productdata from "./productdata.js";

const searchForm = document.querySelector("#product-search-form");
if (searchForm) {
    searchForm.addEventListener("submit", async (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const searchFor = formData.get("search-text");
        if (searchFor && searchFor.length) {
            const resultsBox = document.querySelector("#product-search-result");
            const template = document.querySelector("#product-search-result-template");
            const searchResult = await productdata.searchProducts(searchFor);

            resultsBox.innerHTML = "";
            if (searchResult.length) {
                for (const product of searchResult) {
                    // Create a new product card for this product
                    const card = template.content.firstElementChild.cloneNode(true);
                    card.querySelector(".search-product-name").innerText = product.name;;
                    card.querySelector(".search-product-desc").innerText = product.description;
                    card.querySelector(".search-product-link").href = `productinfo.html?product=${product.productid}`;
                    card.querySelector(".search-product-image").src = product.image[0];
                    card.setAttribute("data-productid", product.productid);

                    // Add product card to search results. 
                    resultsBox.appendChild(card);
                }
            }
            else {
                console.log("no result!");
                resultsBox.innerHTML = `<div class="search-product-noresult">Inga produkter matchar din sökining.</div>`;
            }
        }

    });
}