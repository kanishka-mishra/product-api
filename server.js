const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const path = require('path');

const app = express();
const port = 3000;

app.use(bodyParser.json());

mongoose.connect('mongodb+srv://kanishka:1234@cluster0.8xcaj.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0', { useNewUrlParser: true, useUnifiedTopology: true });

const productSchema = new mongoose.Schema({
  Title: String,
  Price: Number,
  Description: String,
  Category: String,
  Image: String,
  Sold: Boolean,
  IsSale: Boolean,
  DateOfSale: Date
});

const Product = mongoose.model('Product', productSchema);

app.use(express.static(path.join(__dirname, 'public')));

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});

// Create a new product
app.post('/products', async (req, res) => {
  const product = new Product(req.body);
  try {
    await product.save();
    res.status(201).send(product);
  } catch (error) {
    res.status(400).send(error);
  }
});

// Get all products with filters and search
app.get('/products', async (req, res) => {
  const { category, sold, priceMin, priceMax, search } = req.query;
  const filter = {};

  if (category) filter.Category = category;
  if (sold) filter.Sold = sold === 'true';
  if (priceMin) filter.Price = { ...filter.Price, $gte: Number(priceMin) };
  if (priceMax) filter.Price = { ...filter.Price, $lte: Number(priceMax) };
  if (search) filter.Title = new RegExp(search, 'i');

  try {
    const products = await Product.find(filter);
    res.status(200).send(products);
  } catch (error) {
    res.status(500).send(error);
  }
});

// Get a product by ID
app.get('/products/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).send();
    }
    res.status(200).send(product);
  } catch (error) {
    res.status(500).send(error);
  }
});