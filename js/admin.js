/*
    Script for the admin control panel page.
*/
import * as database from "./database.js";
import * as productdata from "./productdata.js";

//////////////////////// ADD CATEGORIES ////////////////////////

const newProductCatList = document.querySelector("#create-product-category");
const newCategoryForm = document.querySelector("#create-category-form");

// Submit handler for New Category form. 
if (newCategoryForm) {
    newCategoryForm.addEventListener("submit", (event) => {
        event.preventDefault();

        const formData = new FormData(event.target);
        const fileReader = new FileReader();
        const formImage = formData.get("category-image");

        // Store the new category in the browser IndexedDB.
        fileReader.addEventListener("load", (event) => {
            let imageBlob = fileReader.result;
            database.addCategory(formData.get("category-name"), imageBlob, formData.get("category-group")).then(() => {
                buildCategoryMenuOptions(newProductCatList);
            });

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

        onNewProductSubmit(event.target).then((product) => {
            alert("Ny produkt skapad!");
            event.target.reset();
            document.querySelector("#product-preview").innerHTML = "";
        }).catch((error) => {
            console.error("Error creating new product!", error);
        });
    });
}


// Show preview of image selected in New Product form
const productImageInput = document.querySelector("#create-product-image");
if (newProductForm && productImageInput) {
    productImageInput.addEventListener("change", (event) => {
        const previewBox = document.querySelector("#product-preview");
        const formData = new FormData(newProductForm);
        const images = formData.getAll("product-image");

        previewBox.innerHTML = "";
        for (const image of images) {
            const previewImage = document.createElement("img");
            previewImage.src = URL.createObjectURL(image);
            previewBox.append(previewImage);
        }
    });
}


// Build menu options for Category menu in the new Product form.
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

// Handle submitted New Product form data, store it in the db.
async function onNewProductSubmit(productForm) {
    const images = [];
    const formData = new FormData(productForm);
    const formImages = formData.getAll("product-image");

    // Get and encode selected product images
    for (const formImage of formImages) {
        try {
            const image = await readProductImage(formImage);
            images.push(image);
        }
        catch (error) {
            console.error("Unable to read file", formImage);
        }
    }

    // Save the product
    const newProduct = await database.addProduct(
        formData.get("product-name"),
        formData.get("product-desc"),
        formData.get("product-price"),
        formData.get("product-category"),
        images
    );

    return newProduct;
}

function readProductImage(formImage) {
    return new Promise((resolve, reject) => {
        const fileReader = new FileReader();

        fileReader.addEventListener("load", (event) => {
            resolve(fileReader.result);
        });

        fileReader.addEventListener("error", (event) => {
            reject("Unable to load file.");
        });

        if (formImage) {
            fileReader.readAsDataURL(formImage);
        }
    });
}
