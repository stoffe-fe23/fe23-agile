/*
    Script for the admin control panel page.
*/
import * as database from "./database.js";
import * as productdata from "./productdata.js";

//////////////////////// ADD CATEGORIES ////////////////////////

// Submit handler for New Category form. 
const newCategoryForm = document.querySelector("#create-category-form");
if (newCategoryForm) {
    newCategoryForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const fileReader = new FileReader();
        const formImage = formData.get("category-image");

        // Store the new category in the browser IndexedDB.
        fileReader.addEventListener("load", (event) => {
            let imageBlob = fileReader.result;
            database.addCategory(formData.get("category-name"), imageBlob, formData.get("category-group"));
        });

        if (formImage) {
            fileReader.readAsDataURL(formImage);
        }

        alert("Ny kategori skapad!");
        event.target.reset();
        document.querySelector("#category-preview").innerHTML = "";
    });
}

// Show preview of image selected in New Category form
const categoryImageInput = document.querySelector("#create-category-image");
if (newCategoryForm && categoryImageInput) {
    categoryImageInput.addEventListener("change", (event) => {
        const previewBox = document.querySelector("#category-preview");
        const formData = new FormData(newCategoryForm);

        previewBox.innerHTML = "";
        const previewImage = document.createElement("img");
        previewImage.src = URL.createObjectURL(formData.get("category-image"));
        previewBox.append(previewImage);
    });
}


//////////////////////// ADD PRODUCTS ////////////////////////

// Submit handler for New Product form. 
const newProductForm = document.querySelector("#create-product-form");
if (newProductForm) {
    newProductForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const fileReader = new FileReader();
        const formImage = formData.get("product-image");

        // Store the new product in the browser IndexedDB when image file is loaded. 
        fileReader.addEventListener("load", (event) => {
            database.addProduct(
                formData.get("product-name"),
                formData.get("product-desc"),
                formData.get("product-price"),
                formData.get("product-category"),
                fileReader.result
            );
        });

        if (formImage) {
            fileReader.readAsDataURL(formImage);
        }

        alert("Ny produkt skapad!");
        event.target.reset();
        document.querySelector("#product-preview").innerHTML = "";
    });
}

// Show preview of image selected in New Product form
const productImageInput = document.querySelector("#create-product-image");
if (newProductForm && productImageInput) {
    productImageInput.addEventListener("change", (event) => {
        const previewBox = document.querySelector("#product-preview");
        const formData = new FormData(newProductForm);

        previewBox.innerHTML = "";
        const previewImage = document.createElement("img");
        console.log("DEBUG", formData.get("product-image"));
        previewImage.src = URL.createObjectURL(formData.get("product-image"));
        previewBox.append(previewImage);
    });
}


// Build menu options for Category menu in the new Product form.
const newProductCatList = document.querySelector("#create-product-category");
if (newProductCatList && newProductForm) {
    buildCategoryMenuOptions(newProductCatList);
}

async function buildCategoryMenuOptions(targetSelectMenu) {
    const categories = await productdata.getCategories();

    targetSelectMenu.innerHTML = "";

    for (const category of categories) {
        const menuOption = document.createElement("option");
        menuOption.value = category.categoryid;
        menuOption.innerText = category.name;
        targetSelectMenu.appendChild(menuOption);
    }
}