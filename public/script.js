document.getElementById('productForm').addEventListener('submit', async (event) => {
    event.preventDefault();

    const product = {
        Title: document.getElementById('title').value,
        Price: document.getElementById('price').value,
        Description: document.getElementById('description').value,
        Category: document.getElementById('category').value,
        Image: document.getElementById('image').value,
        Sold: document.getElementById('sold').checked,
        IsSale: document.getElementById('isSale').checked,
        DateOfSale: document.getElementById('dateOfSale').value
    };

    try {
        const response = await fetch('http://13.233.147.191:9000/products', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(product)
        });

        if (response.ok) {
            const createdProduct = await response.json();
            alert('Product created successfully!');
        } else {
            alert('Failed to create product.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while creating the product.');
    }
});

function displayProductDetails(product) {
    document.getElementById('productTitle').textContent = product.Title;
    document.getElementById('productPrice').textContent = product.Price;
    document.getElementById('productDescription').textContent = product.Description;
    document.getElementById('productCategory').textContent = product.Category;
    document.getElementById('productImage').src = product.Image;
    document.getElementById('productSold').textContent = product.Sold ? 'Yes' : 'No';
    const isSaleElement = document.getElementById('productIsSale');
    isSaleElement.textContent = product.IsSale ? 'On Sale' : 'Not on Sale';
    isSaleElement.className = product.IsSale ? 'sale-true' : 'sale-false';
    document.getElementById('productDetails').style.display = 'block';
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
        const response = await fetch(`http://13.233.147.191:9000/products${query}`);
        if (response.ok) {
            const products = await response.json();
            displayFilteredProducts(products);
        } else {
            alert('Failed to apply filters.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while applying filters.');
    }
}

function displayFilteredProducts(products) {
    const productDetails = document.getElementById('productDetails');
    productDetails.innerHTML = ''; // Clear previous results

    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.innerHTML = `
            <p><strong>Title:</strong> ${product.Title}</p>
            <p><strong>Price:</strong> ${product.Price}</p>
            <p><strong>Description:</strong> ${product.Description}</p>
            <p><strong>Category:</strong> ${product.Category}</p>
            <p><strong>Image:</strong> <img src="${product.Image}" alt="Product Image" width="100"></p>
            <p><strong>Sold:</strong> ${product.Sold ? 'Yes' : 'No'}</p>
            <p><strong>Is Sale:</strong> <span class="${product.IsSale ? 'sale-true' : 'sale-false'}">${product.IsSale ? 'On Sale' : 'Not on Sale'}</span></p>
        `;
        productDetails.appendChild(productDiv);
    });
}

async function searchProducts() {
    const searchTerm = document.getElementById('searchBar').value;

    try {
        const response = await fetch(`http://13.233.147.191:9000/products?search=${searchTerm}`);
        if (response.ok) {
            const products = await response.json();
            displayFilteredProducts(products);
        } else {
            alert('Failed to search products.');
        }
    } catch (error) {
        console.error('Error:', error);
        alert('An error occurred while searching products.');
    }
}
