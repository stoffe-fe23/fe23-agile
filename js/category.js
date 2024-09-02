/*
    Script for building content on the category list page.
*/
import * as productdata from "./productdata.js";

// Box to display added categories on the test page. 
const testResultBox = document.querySelector("#category-card-template");
if (testResultBox) {
    console.log("LOADING TEST DATA...");
    showCategoryList(".category-list");
}

// Fetch list of categories and display them on the page. 
async function showCategoryList(targetSelector) {
    const groupFilter = new URLSearchParams(window.location.search).get("group");
    const groups = productdata.getGroups();
    const outBox = document.querySelector(targetSelector);
    const template = document.querySelector("#category-card-template");

    const categories = await productdata.getCategories((groupFilter && groupFilter.length && groups.some((group) => group.name == groupFilter)) ? groupFilter : null);

    if (template) {
        outBox.innerHTML = "";

        for (const category of categories) {
            console.log("category: ", category);
            const card = template.content.firstElementChild.cloneNode(true);
            const image = card.querySelector("img");
            const label = card.querySelector("span");
            image.src = category.image;
            label.innerText = category.name;
            outBox.appendChild(card);
        }
    }

    const listTitle = document.querySelector("main > section > h2");
    if (groupFilter && groupFilter.length && groups.some((group) => group.name == groupFilter)) {
        const displayedGroup = groups.find((group) => group.name == groupFilter);
        listTitle.innerText = displayedGroup.label;
    }
}