"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.rateProduct = exports.deleteProduct = exports.updateProduct = exports.getProductById = exports.getProducts = exports.createProduct = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const Product_1 = __importDefault(require("../models/Product"));
const getProducts = (0, express_async_handler_1.default)(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const perPage = Number(req.query.perPage) || 10;
    const sortOrder = req.query.sortOrder === "asc" ? 1 : -1;
    const skip = (page - 1) * perPage;
    const total = await Product_1.default.countDocuments({});
    const totalPages = Math.ceil(total / perPage);
    const products = await Product_1.default.find({})
        .skip(skip)
        .limit(perPage)
        .sort({ createdAt: sortOrder })
        .populate("category", "name")
        .populate("brand", "name");
    res.json({ page, perPage, total, totalPages, products });
});
exports.getProducts = getProducts;
const createProduct = (0, express_async_handler_1.default)(async (req, res) => {
    const { name, description, price, category, brand, image, discountPercentage, stock, } = req.body;
    const productExists = await Product_1.default.findOne({ name });
    if (productExists) {
        res.status(400);
        throw new Error("Product with this name already exists");
    }
    const product = await Product_1.default.create({
        name,
        description,
        price,
        category,
        brand,
        image,
        discountPercentage: discountPercentage || 0,
        stock: stock || 0,
    });
    res.status(201).json({ product });
});
exports.createProduct = createProduct;
const getProductById = (0, express_async_handler_1.default)(async (req, res) => {
    const { id } = req.params;
    const product = await Product_1.default.findById(id)
        .populate("category", "name")
        .populate("brand", "name");
    if (!product) {
        res.status(404);
        throw new Error("Product not found!");
    }
    res.json(product);
});
exports.getProductById = getProductById;
const updateProduct = (0, express_async_handler_1.default)(async (req, res) => {
    const { name, description, price, category, brand, image, discountPercentage, stock, } = req.body;
    const product = await Product_1.default.findById(req.params.id);
    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }
    product.name = name || product.name;
    product.description = description || product.description;
    product.price = price || product.price;
    product.category = category || product.category;
    product.brand = brand || product.brand;
    product.discountPercentage = discountPercentage || product.discountPercentage;
    product.stock = stock || product.stock;
    if (image) {
        product.image = image || product.image;
    }
    const updatedProduct = await product.save();
    res.json(updatedProduct);
});
exports.updateProduct = updateProduct;
const deleteProduct = (0, express_async_handler_1.default)(async (req, res) => {
    const product = await Product_1.default.findByIdAndDelete(req.params.id);
    if (!product) {
        res.status(404);
        throw new Error("Product not found");
    }
    res.json({ message: "Product deleted successfully" });
});
exports.deleteProduct = deleteProduct;
const rateProduct = (0, express_async_handler_1.default)(async (req, res) => {
    const { rating } = req.body;
    const product = await Product_1.default.findById(req.params.id);
    if (!product) {
        res.status(404);
        throw new Error("Product not found!");
    }
    const alreadyRated = product.ratings.find((r) => r.userId.toString() === req.user?._id.toString());
    if (alreadyRated) {
        alreadyRated.rating = rating;
    }
    else {
        product.ratings.push({
            userId: req.user?._id,
            rating,
        });
    }
    await product.save();
    res.json(product);
});
exports.rateProduct = rateProduct;
