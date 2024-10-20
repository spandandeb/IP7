const express = require('express');
const app = express();
const port = 5000;

// Sample product data
const products = [
  { id: 1, name: 'Pencil', category: 'Stationary', price: 9 },
  { id: 2, name: 'Cricket Bat', category: 'Sports', price: 100 },
  { id: 3, name: 'Chairs', category: 'Furnitures', price: 800 },
  { id: 4, name: 'Running Shoes', category: 'Sports', price: 89 },
  { id: 5, name: 'Coffee Maker', category: 'Home Appliances', price: 74 },
];

// Middleware to parse JSON bodies
app.use(express.json());

// HTML template function
const htmlTemplate = (content) => `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Product Management API</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
        }
        h1 {
            color: #2c3e50;
        }
        .product {
            background-color: yellow;
            border: 1px solid #ddd;
            padding: 10px;
            margin-bottom: 10px;
            border-radius: 5px;
        }
        .product h2 {
            margin-top: 0;
            color: orange;
        }
    </style>
</head>
<body>
    ${content}
</body>
</html>
`;

// Root route
app.get('/', (req, res) => {
  const content = `
    <h1>Welcome to the Product Management API</h1>
    <p>Use the following endpoints:</p>
    <ul>
        <li>/products - Get all products</li>
        <li>/products/:id - Get a specific product</li>
        <li>/search - Search for products</li>
    </ul>
  `;
  res.send(htmlTemplate(content));
});

// GET all products
app.get('/products', (req, res) => {
  const productsHtml = products.map(p => `
    <div class="product">
        <h2>${p.name}</h2>
        <p>Category: ${p.category}</p>
        <p>Price: $${p.price.toFixed(2)}</p>
    </div>
  `).join('');
  
  const content = `
    <h1>All Products</h1>
    ${productsHtml}
  `;
  
  res.send(htmlTemplate(content));
});

// GET product by ID
app.get('/products/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const product = products.find(p => p.id === id);
  
  if (product) {
    const content = `
      <h1>Product Details</h1>
      <div class="product">
        <h2>${product.name}</h2>
        <p>Category: ${product.category}</p>
        <p>Price: $${product.price.toFixed(2)}</p>
      </div>
    `;
    res.send(htmlTemplate(content));
  } else {
    res.status(404).send(htmlTemplate('<h1>Product not found</h1>'));
  }
});

// GET search products
app.get('/search', (req, res) => {
  const { name, category, minPrice, maxPrice } = req.query;
  let filteredProducts = [...products];

  if (name) {
    filteredProducts = filteredProducts.filter(p => 
      p.name.toLowerCase().includes(name.toLowerCase())
    );
  }
  if (category) {
    filteredProducts = filteredProducts.filter(p => 
      p.category.toLowerCase() === category.toLowerCase()
    );
  }
  if (minPrice) {
    filteredProducts = filteredProducts.filter(p => p.price >= parseFloat(minPrice));
  }
  if (maxPrice) {
    filteredProducts = filteredProducts.filter(p => p.price <= parseFloat(maxPrice));
  }

  const productsHtml = filteredProducts.map(p => `
    <div class="product">
        <h2>${p.name}</h2>
        <p>Category: ${p.category}</p>
        <p>Price: $${p.price.toFixed(2)}</p>
    </div>
  `).join('');
  
  const content = `
    <h1>Search Results</h1>
    ${productsHtml || '<p>No products found matching your criteria.</p>'}
  `;
  
  res.send(htmlTemplate(content));
});

// Handle 404 errors
app.use((req, res, next) => {
  res.status(404).send(htmlTemplate('<h1>404 - Route not found</h1>'));
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send(htmlTemplate('<h1>500 - Something went wrong!</h1>'));
});

// Start the server
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});