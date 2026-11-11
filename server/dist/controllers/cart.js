"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.clearCart = exports.removeItemFromCart = exports.updateCartItem = exports.addItemToCart = exports.getCart = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const Product_1 = __importDefault(require("../models/Product"));
const Cart_1 = __importDefault(require("../models/Cart"));
const getCart = (0, express_async_handler_1.default)(async (req, res) => {
    if (!req.user?._id) {
        res.status(401);
        throw new Error("Unauthorized");
    }
    const userId = req.user._id;
    const cart = await Cart_1.default.findOne({ userId }).populate("items.productId");
    if (!cart) {
        res.json({
            success: true,
            items: [],
        });
        return;
    }
    res.json({
        success: true,
        items: cart.items,
    });
});
exports.getCart = getCart;
const addItemToCart = (0, express_async_handler_1.default)(async (req, res) => {
    const { productId, quantity = 1 } = req.body;
    if (!req.user?._id) {
        res.status(401);
        throw new Error("Unauthorized");
    }
    const userId = req.user._id;
    if (!productId)
        throw new Error("Product ID required");
    const product = await Product_1.default.findById(productId);
    if (!product)
        throw new Error("Product not found");
    let cart = await Cart_1.default.findOne({ userId });
    if (!cart) {
        cart = await Cart_1.default.create({ userId, items: [] });
    }
    const index = cart.items.findIndex((item) => item.productId.toString() === productId);
    if (index !== -1) {
        cart.items[index].quantity += Number(quantity);
    }
    else {
        cart.items.push({
            productId,
            quantity: Number(quantity),
        });
    }
    await cart.save();
    await cart.populate("items.productId");
    res.json({
        success: true,
        items: cart.items,
    });
});
exports.addItemToCart = addItemToCart;
const updateCartItem = (0, express_async_handler_1.default)(async (req, res) => {
    if (!req.user?._id) {
        res.status(401);
        throw new Error("Unauthorized");
    }
    const userId = req.user._id;
    const { quantity } = req.body;
    const { productId } = req.params;
    const cart = await Cart_1.default.findOne({ userId });
    if (!cart)
        throw new Error("Cart not found");
    const index = cart.items.findIndex((item) => item.productId.toString() === productId);
    if (index === -1)
        throw new Error("Item not found");
    if (Number(quantity) < 1) {
        cart.items.splice(index, 1);
    }
    else {
        cart.items[index].quantity = Number(quantity);
    }
    await cart.save();
    await cart.populate("items.productId");
    res.json({
        success: true,
        items: cart.items,
    });
});
exports.updateCartItem = updateCartItem;
const removeItemFromCart = (0, express_async_handler_1.default)(async (req, res) => {
    if (!req.user?._id) {
        res.status(401);
        throw new Error("Unauthorized");
    }
    const userId = req.user._id;
    const { productId } = req.params;
    const cart = await Cart_1.default.findOne({ userId });
    if (!cart)
        throw new Error("Cart not found");
    cart.items = cart.items.filter((item) => item.productId.toString() !== productId);
    await cart.save();
    await cart.populate("items.productId");
    res.json({
        success: true,
        items: cart.items,
    });
});
exports.removeItemFromCart = removeItemFromCart;
const clearCart = (0, express_async_handler_1.default)(async (req, res) => {
    if (!req.user?._id) {
        res.status(401);
        throw new Error("Unauthorized");
    }
    const userId = req.user._id;
    await Cart_1.default.findOneAndUpdate({ userId }, { items: [] });
    res.json({
        success: true,
        items: [],
    });
});
exports.clearCart = clearCart;
