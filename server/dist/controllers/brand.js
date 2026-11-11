"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteBrand = exports.updateBrand = exports.getBrandById = exports.createBrand = exports.getBrands = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const Brand_1 = __importDefault(require("../models/Brand"));
const getBrands = (0, express_async_handler_1.default)(async (req, res) => {
    const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;
    const brands = await Brand_1.default.find({}).sort({ createdAt: sortOrder });
    res.json({ brands });
});
exports.getBrands = getBrands;
const getBrandById = (0, express_async_handler_1.default)(async (req, res) => {
    const { id } = req.params;
    const brand = await Brand_1.default.findById(id);
    if (!brand) {
        res.status(404);
        res.json({ message: 'Brand not found!' });
    }
    res.json(brand);
});
exports.getBrandById = getBrandById;
const createBrand = (0, express_async_handler_1.default)(async (req, res) => {
    const { name, image } = req.body;
    const brandExists = await Brand_1.default.findOne({ name });
    if (brandExists) {
        res.status(404);
        res.json({ message: 'Brand already exists!' });
    }
    const brand = await Brand_1.default.create({
        name,
        image: image || ''
    });
    res.status(201).json(brand);
});
exports.createBrand = createBrand;
const updateBrand = (0, express_async_handler_1.default)(async (req, res) => {
    const { name, image } = req.body;
    const brand = await Brand_1.default.findById(req.params.id);
    if (!brand) {
        res.status(404);
        throw new Error('Brand not found!');
    }
    if (name)
        brand.name = name;
    brand.image = image || brand.image;
    const updatedBrand = await brand.save();
    res.json(updatedBrand);
});
exports.updateBrand = updateBrand;
const deleteBrand = (0, express_async_handler_1.default)(async (req, res) => {
    const brand = await Brand_1.default.findByIdAndDelete(req.params.id);
    if (!brand) {
        res.status(404);
        throw new Error('Brand not found');
    }
    res.json({ message: 'Brand removed' });
});
exports.deleteBrand = deleteBrand;
