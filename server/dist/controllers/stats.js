"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getStats = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const User_1 = __importDefault(require("../models/User"));
const Product_1 = __importDefault(require("../models/Product"));
const Category_1 = __importDefault(require("../models/Category"));
const Brand_1 = __importDefault(require("../models/Brand"));
const Order_1 = __importDefault(require("../models/Order"));
const getStats = (0, express_async_handler_1.default)(async (req, res) => {
    const usersCount = await User_1.default.countDocuments();
    const productsCount = await Product_1.default.countDocuments();
    const categoriesCount = await Category_1.default.countDocuments();
    const brandsCount = await Brand_1.default.countDocuments();
    const ordersCount = await Order_1.default.countDocuments();
    const revenueData = await Order_1.default.aggregate([
        { $match: { status: { $in: ["paid", "completed", "delivered"] } } },
        { $group: { _id: null, totalRevenue: { $sum: "$total" } } },
    ]);
    const totalRevenue = revenueData[0]?.totalRevenue || 0;
    const roles = await User_1.default.aggregate([
        { $group: { _id: "$role", count: { $sum: 1 } } },
    ]);
    const categoryData = await Product_1.default.aggregate([
        {
            $lookup: {
                from: "categories",
                localField: "category",
                foreignField: "_id",
                as: "categoryInfo",
            },
        },
        { $unwind: "$categoryInfo" },
        { $group: { _id: "$categoryInfo.name", count: { $sum: 1 } } },
    ]);
    const brandData = await Product_1.default.aggregate([
        {
            $lookup: {
                from: "brands",
                localField: "brand",
                foreignField: "_id",
                as: "brandInfo",
            },
        },
        { $unwind: "$brandInfo" },
        { $group: { _id: "$brandInfo.name", count: { $sum: 1 } } },
    ]);
    res.json({
        counts: {
            users: usersCount,
            products: productsCount,
            categories: categoriesCount,
            brands: brandsCount,
            orders: ordersCount,
            totalRevenue: totalRevenue,
        },
        roles: roles.map((role) => ({
            name: role._id,
            value: role.count,
        })),
        categories: categoryData.map((category) => ({
            name: category._id,
            value: category.count,
        })),
        brands: brandData.map((brand) => ({
            name: brand._id,
            value: brand.count,
        })),
    });
});
exports.getStats = getStats;
