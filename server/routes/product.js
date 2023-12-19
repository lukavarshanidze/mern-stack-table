const express = require('express')
const { body } = require('express-validator');
const Product = require('../models/product');
const productController = require('../controllers/product')
const isAuth = require('../middleware/is-auth')

const router = express.Router();

router.post('/api/add-product', isAuth, productController.postAddProduct)

router.get('/api/get-products', isAuth, productController.getProducts)

router.get('/api/get-product/:id', isAuth, productController.getProduct)

router.delete('/api/delete-product/:id', isAuth, productController.deleteProduct)

router.post('/api/edit-product/:productId', isAuth,  productController.updateProduct)

module.exports = router;