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
                    const name = card.querySelector(".search-product-name");
                    const desc = card.querySelector(".search-product-desc");
                    const link = card.querySelector(".search-product-link");
                    const image = card.querySelector(".search-product-image");

                    // Fill in product data on the card elements.
                    name.innerText = product.name;
                    desc.innerText = product.description;
                    card.setAttribute("data-productid", product.productid);
                    link.href = `productinfo.html?product=${product.productid}`;
                    image.src = product.image[0];

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