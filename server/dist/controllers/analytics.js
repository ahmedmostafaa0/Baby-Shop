"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getInventoryAlerts = exports.getSalesAnalytics = exports.getProductAnalytics = exports.getAnalyticsOverview = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const Product_1 = __importDefault(require("../models/Product"));
const Order_1 = __importDefault(require("../models/Order"));
const User_1 = __importDefault(require("../models/User"));
const getAnalyticsOverview = (0, express_async_handler_1.default)(async (req, res) => {
    const totalProducts = await Product_1.default.countDocuments();
    const totalOrders = await Order_1.default.countDocuments();
    const totalUsers = await User_1.default.countDocuments();
    const revenueAggregation = await Order_1.default.aggregate([
        { $match: { status: { $in: ["paid", "completed"] } } },
        { $group: { _id: null, totalRevenue: { $sum: "$total" } } },
    ]);
    const totalRevenue = revenueAggregation[0]?.totalRevenue || 0;
    const lowStockProducts = await Product_1.default.find({ stock: { $lt: 10, $gt: 0 } })
        .select("name stock price images")
        .limit(10);
    const outOfStockProducts = await Product_1.default.find({
        stock: 0,
    })
        .select("name stock price images")
        .limit(10);
    const bestSellingProducts = await Order_1.default.aggregate([
        { $match: { status: { $in: ["paid", "completed"] } } },
        { $unwind: "$items" },
        {
            $group: {
                _id: "$items.productId",
                totalSold: { $sum: "$items.quantity" },
                totalRevenue: {
                    $sum: { $multiply: ["$items.price", "$items.quantity"] },
                },
                productName: { $first: "$items.name" },
                productImage: { $first: "$items.image" },
            },
        },
        { $sort: { totalSold: -1 } },
        { $limit: 10 },
    ]);
    const recentOrders = await Order_1.default.find()
        .populate("userId", "name email")
        .sort({ createdAt: -1 })
        .limit(10)
        .select("total status createdAt userId items");
    const sixMonthsAgo = new Date();
    sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);
    const monthlyRevenue = await Order_1.default.aggregate([
        {
            $match: {
                status: { $in: ["paid", "completed"] },
                createdAt: { $gte: sixMonthsAgo },
            },
        },
        {
            $group: {
                _id: {
                    year: { $year: "$createdAt" },
                    month: { $month: "$createdAt" },
                },
                revenue: { $sum: "$total" },
                orders: { $sum: 1 },
            },
        },
        { $sort: { "_id.year": 1, "_id.month": 1 } },
    ]);
    const orderStatusBreakdown = await Order_1.default.aggregate([
        {
            $group: {
                _id: "$status",
                count: { $sum: 1 },
                totalValue: { $sum: "$total" },
            },
        },
    ]);
    res.json({
        success: true,
        data: {
            overview: {
                totalProducts,
                totalOrders,
                totalUsers,
                totalRevenue,
            },
            inventory: {
                lowStockProducts,
                outOfStockProducts,
                lowStockCount: lowStockProducts.length,
                outOfStockCount: outOfStockProducts.length,
            },
            sales: {
                bestSellingProducts,
                recentOrders,
                monthlyRevenue,
                orderStatusBreakdown,
            },
        },
    });
});
exports.getAnalyticsOverview = getAnalyticsOverview;
const getProductAnalytics = (0, express_async_handler_1.default)(async (req, res) => {
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 20;
    const sortBy = typeof req.query.sortBy === 'string' ? req.query.sortBy : 'totalSold';
    const sortOrder = typeof req.query.sortBy === 'string' && req.query.sortOrder === 'desc' ? -1 : 1;
    const skip = (page - 1) * limit;
    const productAnalytics = await Order_1.default.aggregate([
        { $match: { status: { $in: ["paid", "completed"] } } },
        { $unwind: "$items" },
        {
            $group: {
                _id: "$items.productId",
                totalSold: { $sum: "$items.quantity" },
                totalRevenue: {
                    $sum: { $multiply: ["$items.price", "$items.quantity"] },
                },
                averagePrice: { $avg: "$items.price" },
                orderCount: { $sum: 1 },
                productName: { $first: "$items.name" },
                productImage: { $first: "$items.image" },
            },
        },
        {
            $lookup: {
                from: "products",
                localField: "_id",
                foreignField: "_id",
                as: "productDetails",
            },
        },
        {
            $addFields: {
                currentStock: { $arrayElemAt: ['$productDetails.stock', 0] },
                category: { $arrayElemAt: ["$productDetails.category", 0] },
                brand: { $arrayElemAt: ["$productDetails.brand", 0] },
            },
        },
        { $sort: { [sortBy]: sortOrder } },
        { $skip: Number(skip) },
        { $limit: Number(limit) },
    ]);
    const totalCount = await Order_1.default.aggregate([
        { $match: { status: { $in: ["paid", "completed"] } } },
        { $unwind: "$items" },
        { $group: { _id: "$items.productId" } },
        { $count: "total" },
    ]);
    const total = totalCount[0]?.total || 0;
    const totalPages = Math.ceil(total / limit);
    res.json({
        success: true,
        data: {
            products: productAnalytics,
            pagination: {
                page: Number(page),
                limit: Number(limit),
                total,
                totalPages,
                hasNextPage: page < totalPages,
                hasPrevPage: page > 1,
            },
        },
    });
});
exports.getProductAnalytics = getProductAnalytics;
const getSalesAnalytics = (0, express_async_handler_1.default)(async (req, res) => {
    const { period = "monthly", year = new Date().getFullYear() } = req.query;
    let matchStage = {
        status: { $in: ["paid", "completed"] },
        createdAt: {
            $gte: new Date(`${year}-01-01`),
            $lte: new Date(`${year}-12-31`),
        },
    };
    let groupStage;
    if (period === "daily") {
        groupStage = {
            _id: {
                year: { $year: "$createdAt" },
                month: { $month: "$createdAt" },
                day: { $dayOfMonth: "$createdAt" },
            },
            revenue: { $sum: "$total" },
            orders: { $sum: 1 },
            avgOrderValue: { $avg: "$total" },
        };
    }
    else if (period === "weekly") {
        groupStage = {
            _id: {
                year: { $year: "$createdAt" },
                week: { $week: "$createdAt" },
            },
            revenue: { $sum: "$total" },
            orders: { $sum: 1 },
            avgOrderValue: { $avg: "$total" },
        };
    }
    else {
        groupStage = {
            _id: {
                year: { $year: "$createdAt" },
                month: { $month: "$createdAt" },
            },
            revenue: { $sum: "$total" },
            orders: { $sum: 1 },
            avgOrderValue: { $avg: "$total" },
        };
    }
    const salesData = await Order_1.default.aggregate([
        { $match: matchStage },
        { $group: groupStage },
        { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1, "_id.week": 1 } },
    ]);
    const topCustomers = await Order_1.default.aggregate([
        { $match: { status: { $in: ["paid", "completed"] } } },
        {
            $group: {
                _id: "$userId",
                totalSpent: { $sum: "$total" },
                orderCount: { $sum: 1 },
                avgOrderValue: { $avg: "$total" },
            },
        },
        {
            $lookup: {
                from: "users",
                localField: "_id",
                foreignField: "_id",
                as: "customer",
            },
        },
        {
            $addFields: {
                customerName: { $arrayElemAt: ["$customer.name", 0] },
                customerEmail: { $arrayElemAt: ["$customer.email", 0] },
            },
        },
        { $sort: { totalSpent: -1 } },
        { $limit: 10 },
    ]);
    res.json({
        success: true,
        data: {
            salesData,
            topCustomers,
            period,
            year: Number(year),
        },
    });
});
exports.getSalesAnalytics = getSalesAnalytics;
const getInventoryAlerts = (0, express_async_handler_1.default)(async (req, res) => {
    const { threshold = 10 } = req.query;
    const lowStockProducts = await Product_1.default.find({
        stock: { $lte: Number(threshold), $gt: 0 },
    }).select("name stock price images category brand createdAt");
    const outOfStockProducts = await Product_1.default.find({ stock: 0 }).select("name stock price images category brand createdAt");
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    const staleProducts = await Product_1.default.find({
        updatedAt: { $lt: thirtyDaysAgo },
    }).select("name stock price images category brand updatedAt");
    const soldProductIds = await Order_1.default.aggregate([
        {
            $match: {
                status: { $in: ["paid", "completed"] },
                createdAt: { $gte: thirtyDaysAgo },
            },
        },
        { $unwind: "$items" },
        { $group: { _id: "$items.productId" } },
    ]);
    const soldIds = soldProductIds.map((item) => item._id);
    const noSalesProducts = await Product_1.default.find({
        _id: { $nin: soldIds },
    })
        .select("name stock price images category brand createdAt")
        .limit(20);
    res.json({
        success: true,
        data: {
            lowStockProducts,
            outOfStockProducts,
            staleProducts,
            noSalesProducts,
            counts: {
                lowStock: lowStockProducts.length,
                outOfStock: outOfStockProducts.length,
                staleProducts: staleProducts.length,
                noSales: noSalesProducts.length,
            },
        },
    });
});
exports.getInventoryAlerts = getInventoryAlerts;
