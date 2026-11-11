"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.refreshAccessToken = exports.logoutUser = exports.getUserProfile = exports.loginUser = exports.registerUser = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const User_1 = __importDefault(require("../models/User"));
const generateToken_1 = __importDefault(require("../utils/generateToken"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const registerUser = (0, express_async_handler_1.default)(async (req, res) => {
    // #swagger.security = []
    // #swagger.tags = ["Auth"]
    const { name, email, password, role } = req.body;
    const existUser = await User_1.default.findOne({ email });
    if (existUser) {
        res.status(400);
        throw new Error("User already exists");
    }
    const user = await User_1.default.create({
        name,
        email,
        password,
        role,
        addresses: [],
    });
    const { accessToken, refreshToken } = (0, generateToken_1.default)(user.id);
    user.refreshToken = refreshToken;
    await user.save();
    res.cookie("refreshToken", refreshToken, {
        maxAge: 30 * 24 * 60 * 60 * 1000,
        secure: process.env.NODE_ENV === "production",
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax',
    });
    res.status(201).json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: accessToken,
        role: user.role
    });
});
exports.registerUser = registerUser;
const loginUser = (0, express_async_handler_1.default)(async (req, res) => {
    // #swagger.security = []
    // #swagger.tags = ["Auth"]
    const { email, password } = req.body;
    const user = await User_1.default.findOne({ email });
    if (!user || !(await user.matchPassword(password))) {
        res.status(400);
        throw new Error("Invalid email or password");
    }
    const { accessToken, refreshToken } = (0, generateToken_1.default)(user.id);
    user.refreshToken = refreshToken;
    await user.save();
    res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax',
        maxAge: 30 * 24 * 60 * 60 * 1000,
    });
    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        token: accessToken,
        role: user.role
    });
});
exports.loginUser = loginUser;
const getUserProfile = (0, express_async_handler_1.default)(async (req, res) => {
    // #swagger.tags = ["Auth"]
    if (!req.user || !req.user._id) {
        res.status(401).json({ message: "Not authenticated" });
        return;
    }
    const user = await User_1.default.findById(req.user._id);
    if (!user) {
        res.status(401).json({ message: "User not found" });
        return;
    }
    res.json({
        _id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        addresses: user.addresses,
    });
});
exports.getUserProfile = getUserProfile;
const logoutUser = (0, express_async_handler_1.default)(async (req, res) => {
    // #swagger.tags = ['Auth']
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
        res.clearCookie('refreshToken');
        res.status(204).json({ message: "Already logged out" });
    }
    const user = await User_1.default.findOne({ refreshToken: refreshToken });
    if (user) {
        user.refreshToken = null;
        await user.save();
    }
    res.clearCookie("refreshToken", {
        httpOnly: true,
        sameSite: process.env.NODE_ENV === "production" ? 'none' : 'lax',
        secure: process.env.NODE_ENV === "production",
    });
    res.json({
        message: "Logged out successfully",
    });
});
exports.logoutUser = logoutUser;
const refreshAccessToken = (0, express_async_handler_1.default)(async (req, res) => {
    // #swagger.tags = ["Auth"]
    const refreshToken = req.cookies?.refreshToken;
    if (!refreshToken) {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        });
        res.status(401);
        throw new Error("No session. Please login again.");
    }
    try {
        const decoded = jsonwebtoken_1.default.verify(refreshToken, process.env.JWT_REFRESH_SECRET);
        const user = await User_1.default.findById(decoded.id).select("-password");
        if (!user || user.refreshToken !== refreshToken) {
            res.clearCookie("refreshToken", {
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
            });
            res.status(401);
            throw new Error("Invalid session. Please login again.");
        }
        const { accessToken: newAccess } = (0, generateToken_1.default)(user.id);
        res.setHeader("x-access-token", newAccess);
        res.json({
            message: "Token refreshed successfully",
            accessToken: newAccess,
        });
    }
    catch (error) {
        res.clearCookie("refreshToken", {
            httpOnly: true,
            secure: process.env.NODE_ENV === "production",
            sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
        });
        res.status(401);
        throw new Error("Session expired. Please login again.");
    }
});
exports.refreshAccessToken = refreshAccessToken;
