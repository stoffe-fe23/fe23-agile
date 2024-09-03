/*
    Fake categories and products database.
    Hardcoded base values, and user additions read from browser IndexedDB. 
*/
import * as database from "./database.js";

////////// LIST OF CATEGORY GROUPS
const groupList = [
    { name: "clothes", label: "Kläder" },
    { name: "skate", label: "Skate" },
    { name: "misc", label: "Blandat" },
]

////////// DEFAULT LIST OF PRODUCT CATEGORIES
const categoryList = [
    { categoryid: 1, name: "Jackor", image: "images/categories/jackor.png", group: "clothes" },
    { categoryid: 2, name: "Hooodies", image: "images/categories/hoodies.png", group: "clothes" },
    { categoryid: 3, name: "T-shirts", image: "images/categories/tshirts.png", group: "clothes" },
    { categoryid: 4, name: "Brädor", image: "images/categories/skateboard1.png", group: "skate" },
    { categoryid: 5, name: "Solglasögon", image: "images/categories/sunglasses.png", group: "misc" },
    { categoryid: 6, name: "Prylar", image: "images/categories/prylar.png", group: "misc" }
];

////////// DEFAULT PRODUCT LIST
const productList = [
    {
        productid: 1,
        category: "1",
        name: "Jeans jacka",
        date: "2024-09-02",
        price: "400",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate, id nisi excepturi soluta esse animi tempore distinctio? Praesentium illo molestias doloribus ex, exercitationem maiores beatae, aliquid nesciunt, impedit sunt rerum.",
        image: ["images/products/jacketjeans1.png", "images/products/jacketjeans2.png", "images/products/jacketjeans3.png"]
    },
    {
        productid: 2,
        category: "1",
        name: "Annan jacka",
        date: "2024-08-01",
        price: "600",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate, id nisi excepturi soluta esse animi tempore distinctio? Praesentium illo molestias doloribus ex, exercitationem maiores beatae, aliquid nesciunt, impedit sunt rerum.",
        image: ["images/products/jacketmisc1.png", "images/products/jacketmisc2.png"]
    },
    {
        productid: 3,
        category: "1",
        name: "Läderjacka",
        date: "2024-07-22",
        price: "550",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate, id nisi excepturi soluta esse animi tempore distinctio? Praesentium illo molestias doloribus ex, exercitationem maiores beatae, aliquid nesciunt, impedit sunt rerum.",
        image: ["images/products/jacketleather.png"]
    },
    {
        productid: 4,
        category: "4",
        name: "En skateboard",
        date: "2024-09-02",
        price: "1000",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate, id nisi excepturi soluta esse animi tempore distinctio? Praesentium illo molestias doloribus ex, exercitationem maiores beatae, aliquid nesciunt, impedit sunt rerum.",
        image: []
    },
    {
        productid: 5,
        category: "4",
        name: "En annan bräda",
        date: "2024-08-12",
        price: "1200",
        description: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Cupiditate, id nisi excepturi soluta esse animi tempore distinctio? Praesentium illo molestias doloribus ex, exercitationem maiores beatae, aliquid nesciunt, impedit sunt rerum.",
        image: []
    }
];

/*
    FUNCTIONS FOR GETTING PRODUCT/CATEGORY DATA 
*/


// Retrieve list of valid category groups.
export function getGroups() {
    return [...groupList];
}

// Retrieve array of all product categories (both default and admin-added)
export async function getCategories(filterGroup = null) {
    const newCategories = await database.getCategories();

    // Get the next free ID to use for admin-added categories
    let nextId = 0;
    categoryList.forEach((category) => {
        if (category.categoryid > nextId) {
            nextId = category.categoryid;
        }
    });

    // Assign IDs to admin-added categories
    newCategories.forEach((category, idx, arr) => {
        arr[idx].categoryid = ++nextId;
    });

    // Merge default and admin-added category lists
    const categories = [...categoryList, ...newCategories];

    // Set default/placeholder image if a category lacks a button image
    categories.forEach((category, idx, arr) => {
        if (!category.image.length) {
            arr[idx].image = "./images/image-placeholder.jpg";
        }
    });

    // Apply group filter if set. 
    if (filterGroup !== null) {
        return categories.filter((category) => category.group == filterGroup);
    }
    return categories;
}

// Retrieve array of all products (both default and admin-added). If filterCategory is set, only products belonging to that category is included.
export async function getProducts(filterCategory = null) {
    const newProducts = await database.getProducts();

    // Get the next free ID to use for admin-added products
    let nextId = 0;
    productList.forEach((product) => {
        if (product.productid > nextId) {
            nextId = product.productid;
        }
    });

    // Assign IDs to admin-added products
    newProducts.forEach((product, idx, arr) => {
        arr[idx].productid = ++nextId;
    });

    // Merge default and admin-added product lists
    const products = [...productList, ...newProducts];

    // Set default/placeholder image if a product has no images.
    products.forEach((product, idx, arr) => {
        if (!product.image.length) {
            arr[idx].image.push("./images/image-placeholder.jpg");
        }
    });

    // Apply category filter if set
    if (filterCategory !== null) {
        return products.filter((product) => product.category == filterCategory);
    }
    return products;
}


// Get the product object matching the specified product ID.
export async function getProduct(productId) {
    const products = await getProducts();
    return products.find((product) => product.productid == productId);
}
