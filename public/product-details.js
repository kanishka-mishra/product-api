async function fetchProductDetails() {
    try {
        const response = await fetch('http://localhost:3000/products');
        if (response.ok) {
            const products = await response.json();
            displayProductDetails(products);
        } else {
            alert('Failed to fetch product details.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while fetching product details.');
    }
}

function displayProductDetails(products) {
    const productDetails = document.getElementById('productDetails');
    productDetails.innerHTML = ''; // Clear previous results

    products.forEach(product => {
        const productItem = document.createElement('div');
        productItem.className = 'product-item';
        productItem.innerHTML = `
            <img src="${product.Image}" alt="Product Image">
            <h3>${product.Title}</h3>
            <p>Price: $${product.Price}</p>
            <p>Sold: ${product.Sold ? 'Yes' : 'No'}</p>
            <p class="${product.IsSale ? 'sale-true' : 'sale-false'}">${product.IsSale ? 'On Sale' : 'Not on Sale'}</p>
        `;
        productDetails.appendChild(productItem);
    });
}

async function applyFilters() {
    const category = document.getElementById('filterCategory').value;
    const sold = document.getElementById('filterSold').value;
    const priceMin = document.getElementById('filterPriceMin').value;
    const priceMax = document.getElementById('filterPriceMax').value;

    let query = '?';
    if (category) query += `category=${category}&`;
    if (sold) query += `sold=${sold}&`;
    if (priceMin) query += `priceMin=${priceMin}&`;
    if (priceMax) query += `priceMax=${priceMax}&`;

    try {
        const response = await fetch(`http://localhost:3000/products${query}`);
        if (response.ok) {
            const products = await response.json();
            displayProductDetails(products);
        } else {
            alert('Failed to apply filters.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while applying filters.');
    }
}

async function searchProducts() {
    const searchTerm = document.getElementById('searchBar').value;

    try {
        const response = await fetch(`http://localhost:3000/products?search=${searchTerm}`);
        if (response.ok) {
            const products = await response.json();
            const filteredProducts = products.filter(product => 
                product.Title.toLowerCase().includes(searchTerm.toLowerCase())
            );
            displayProductDetails(filteredProducts);
        } else {
            alert('Failed to search products.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while searching products.');
    }
}

fetchProductDetails();