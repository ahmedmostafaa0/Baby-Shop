"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBanner = exports.updateBanner = exports.getBannerById = exports.createBanner = exports.getBanners = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const Banner_1 = __importDefault(require("../models/Banner"));
const getBanners = (0, express_async_handler_1.default)(async (req, res) => {
    const banners = await Banner_1.default.find({});
    res.json(banners);
});
exports.getBanners = getBanners;
const getBannerById = (0, express_async_handler_1.default)(async (req, res) => {
    const banner = await Banner_1.default.findById(req.params.id);
    if (banner) {
        res.json(banner);
    }
    else {
        res.status(404);
        throw new Error("Banner not found");
    }
});
exports.getBannerById = getBannerById;
const createBanner = (0, express_async_handler_1.default)(async (req, res) => {
    const { name, title, startFrom, image, bannerType } = req.body;
    const banner = new Banner_1.default({
        name,
        title,
        startFrom,
        image,
        bannerType,
    });
    const createdBanner = await banner.save();
    res.status(201).json(createdBanner);
});
exports.createBanner = createBanner;
const updateBanner = (0, express_async_handler_1.default)(async (req, res) => {
    const { name, title, startFrom, image, bannerType } = req.body;
    const banner = await Banner_1.default.findById(req.params.id);
    if (!banner) {
        res.status(404);
        throw new Error("Banner not found");
    }
    banner.name = name || banner.name;
    banner.title = title || banner.title;
    banner.startFrom = startFrom || banner.startFrom;
    banner.bannerType = bannerType || banner.bannerType;
    banner.image = image || banner.image;
    const updatedBanner = await banner.save();
    res.json(updatedBanner);
});
exports.updateBanner = updateBanner;
const deleteBanner = (0, express_async_handler_1.default)(async (req, res) => {
    const banner = await Banner_1.default.findById(req.params.id);
    if (banner) {
        await banner.deleteOne();
        res.json({ message: "Banner removed" });
    }
    else {
        res.status(404);
        throw new Error("Banner not found");
    }
});
exports.deleteBanner = deleteBanner;
