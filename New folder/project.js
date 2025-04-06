const searchResultUrl = "https://positive-abalone-reason.glitch.me/searchResult";
const sellbtn = document.getElementById("sellbtn");
const searchBar = document.getElementById("searchBar");
const categoryFilter = document.getElementById("categoryFilter");
const resultsContainer = document.getElementById("results");
const heroSellBtn = document.getElementById("heroSellBtn");

let originalData = []; 
let wishlist = [];
let cartItems = [];



async function getData() {
    try {
        const response = await fetch(searchResultUrl);
        if (!response.ok) {
            throw new Error(`Failed to fetch data. Status: ${response.status}`);
        }
        originalData = await response.json();
        console.log("Fetched Data:", originalData);
        displayData(originalData);
    } catch (err) {
        console.error("Error:", err.message);
    }
}


function displayData(products) {
    resultsContainer.innerHTML = ""; 

    if (products.length === 0) {
        resultsContainer.innerHTML = "<p>No products found.</p>";
        return;
    }

    products.forEach(element => {
        let product = document.createElement("div");
        product.className = "product-card";

        let encodedData = JSON.stringify(element).replace(/"/g, '&quot;'); 

        product.innerHTML = `
            <div class="product-image">
                <img src="${element.image}" alt="${element.title}" class="open-modal" data-product="${encodedData}">
                <button class="wishlist-btn"><span>♡</span></button>
            </div>
            <div class="product-info">
                <div class="product-brand">${element.brand || "Unknown Brand"}</div>
                <div class="product-condition">${element.status || "Condition Unknown"}</div>
                <div class="product-price">$${element?.price?.amount?.amount || "N/A"}</div>
                <div class="product-discount">$${element?.price?.totalAmount?.amount || "N/A"} incl.</div>
            </div>
        `;

        resultsContainer.appendChild(product);
    });

   
    document.querySelectorAll(".open-modal").forEach(img => {
        img.addEventListener("click", function () {

            console.log("Image clicked");
            let encodedData = this.dataset.product;
            if (!encodedData) {
                console.error("No product data found!");
                return;
            }
    
            try {
                let productData = JSON.parse(encodedData.replace(/&quot;/g, '"'));
                localStorage.setItem("selectedProduct", JSON.stringify(productData));
    
                
                const user = localStorage.getItem("loggedInUser");
                const isAuthenticated = document.body.getAttribute("data-authenticated");
    
                if (user || isAuthenticated === "true") {
                    console.log("user is present")
                    
                    window.location.href = "productdetails.html";
                } else {
                    
                    

                    localStorage.setItem("redirectAfterLogin", "productDetails.html");
                    console.log("user is not present")
                    window.location.href = "firebase.html";  
                }
    
            } catch (error) {
                console.error("Error parsing product data:", error);
            }
        });
    });
    
}



function filterProducts(searchText) {
    searchText = searchText.toLowerCase().trim();
    console.log("Search Text:", searchText);

    let filteredData = originalData.filter(product => {
        let title = product.title ? product.title.toLowerCase() : "";
        let brand = product.brand ? product.brand.toLowerCase() : "";
        let seller = product.seller?.username ? product.seller.username.toLowerCase() : "";

        return title.includes(searchText) || brand.includes(searchText) || seller.includes(searchText);
    });

    console.log("Filtered Data:", filteredData);

    displayData(filteredData);
}


searchBar.addEventListener("input", function () {
    filterProducts(this.value);
});



heroSellBtn.addEventListener("click", () => {
    window.location.href = "sellingpage.html";
});

function openFirebase() {
    localStorage.setItem("redirectAfterLogin", "project.html"); 
    window.location.href = "firebase.html"; 
}

document.getElementById("cart-icon").addEventListener("click", function () {
    window.location.href = "cart.html";
    
});


function updateCartCount() {   
    const cartItems = JSON.parse(localStorage.getItem("cartItems")) || [];   
   
    const cartCountElement = document.querySelector(".cart-count");
    cartCountElement.textContent = cartItems.length;
}


document.addEventListener("DOMContentLoaded", () => {
    updateCartCount();
});

function updateWishlistCount(){
    const wishlistItems = JSON.parse(localStorage.getItem("wishlist")) || [];

    const wishlistCountElement = document.querySelector(".wishlist-count");
    wishlistCountElement.textContent = wishlistItems.length;
}
document.addEventListener("DOMContentLoaded", () => {
    updateWishlistCount();
});

document.getElementById("learnBtn").addEventListener("click", function () {
    window.location.href = "learn.html";
});


document.getElementById("logout-btn").addEventListener("click", () => {
    localStorage.removeItem("loggedInUser");
    localStorage.removeItem("selectedProduct");
    showToast("Logged Out Succesfully", "success");
    window.location.href = "firebase.html"; 
});

function showToast(message, type = "success") {
    Swal.fire({
        toast: true,
        position: "top-end",
        icon: type, // "success" | "error" | "warning" | "info"
        title: message,
        showConfirmButton: false,
        timer: 3000
    });
}

getData();
