"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.admin = exports.protect = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const generateToken_1 = __importDefault(require("../utils/generateToken"));
const User_1 = __importDefault(require("../models/User"));
const protect = (0, express_async_handler_1.default)(async (req, res, next) => {
    let accessToken = req.headers.authorization?.split(" ")[1];
    if (accessToken) {
        try {
            const decoded = jsonwebtoken_1.default.verify(accessToken, process.env.JWT_ACCESS_SECRET);
            const user = await User_1.default.findById(decoded.id).select("-password");
            if (!user) {
                res.clearCookie("refreshToken", {
                    httpOnly: true,
                    secure: process.env.NODE_ENV === "production",
                    sameSite: process.env.NODE_ENV === "production" ? "none" : "lax",
                });
                res.status(401);
                throw new Error("Authentication failed. User not found.");
            }
            req.user = user;
            return next();
        }
        catch (err) {
            // accessToken = undefined
        }
    }
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
        req.user = user;
        next();
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
exports.protect = protect;
const admin = (req, res, next) => {
    if (req.user && req.user.role === "admin") {
        return next();
    }
    res.status(403);
    throw new Error("Not authorized as an admin");
};
exports.admin = admin;
