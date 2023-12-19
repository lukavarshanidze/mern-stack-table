const Product = require('../models/product')
const User = require('../models/user')

exports.postAddProduct = (req, res) => {
    const title = req.body.title;
    const author = req.body.author;
    const year = req.body.year;
    let creator;
    const product = new Product({
        title,
        author,
        publishYear: year,
        creator: req.userId
    })
    product.save()
        .then(result => {
            return User.findById(req.userId);
        })
        .then(user => {
            creator = user;
            user.products.push(product)
            return user.save()
        })
        .then(result => {
            res.status(200).json({
                message: "Product Added!",
                product: product,
                creator: { _id: creator._id }
            })
        })
        .catch(err => {
            console.log(err);
        })
}

exports.getProducts = (req, res) => {
    Product.find()
        .then(products => {
            res.status(200).json({ products })
        })
        .catch(err => {
            console.log(err);
        })
}


exports.getProduct = (req, res) => {
    const productId = req.params.id
    Product.findById(productId)
        .then(product => {
            if (!product) {
                const error = new Error('Could not find product.')
                error.statusCode = 404;
                throw error;
            }
            res.status(200).json({ message: "Product fetched.", product: product })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err)
        })
}

exports.deleteProduct = (req, res, next) => {
    const id = req.params.id
    Product.findById(id)
        .then(product => {
            if (!product) {
                const error = new Error('Could not find product.')
                error.statusCode = 404;
                throw error;
            }
            if (product.creator.toString() !== req.userId) {
                const error = new Error('Not authorized!')
                error.statusCode = 403;
                throw error;
            }
            // check logged in user
            return Product.findByIdAndDelete(id)
        })
        .then(result => {
            return User.findById(req.userId)
        })
        .then(user => {
            user.products.pull(id)
            return user.save()
        })
        .then(result => {
            res.status(200).json({ message: 'Product Deleted!' })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err)
        })
}

exports.updateProduct = (req, res, next) => {
    const productId = req.params.productId;
    const title = req.body.title;
    const author = req.body.author;
    const year = req.body.year;
    Product.findById(productId)
        .then(product => {
            if (!product) {
                const error = new Error('Could not find product.')
                error.statusCode = 404;
                throw error;
            }
            if (product.creator.toString() !== req.userId) {
                const error = new Error('Not authorized!')
                error.statusCode = 403;
                throw error;
            }
            product.title = title;
            product.author = author;
            product.publishYear = year;
            return product.save()
        })
        .then(result => {
            res.status(200).json({ message: 'Product Updated!' })
        })
        .catch(err => {
            if (!err.statusCode) {
                err.statusCode = 500;
            }
            next(err)
        })
}