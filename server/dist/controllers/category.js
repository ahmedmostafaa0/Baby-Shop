"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteCategory = exports.updateCategory = exports.createCategory = exports.getCategoryById = exports.getCategories = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const Category_1 = __importDefault(require("../models/Category"));
const getCategories = (0, express_async_handler_1.default)(async (req, res) => {
    const page = Number(req.query.page);
    const perPage = Number(req.query.perPage);
    const sortOrder = req.query.sortOrder === "desc" ? -1 : 1;
    if (page < 1 || perPage < 1) {
        res.status(400);
        throw new Error("Page and perPage must be positive integers");
    }
    const skip = (page - 1) * perPage;
    const total = await Category_1.default.countDocuments({});
    const totalPages = Math.ceil(total / perPage);
    const categories = await Category_1.default.find({})
        .skip(skip)
        .limit(perPage)
        .sort({ createdAt: sortOrder });
    res.json({ categories, total, page, perPage, totalPages });
});
exports.getCategories = getCategories;
const getCategoryById = (0, express_async_handler_1.default)(async (req, res) => {
    const category = await Category_1.default.findById(req.params.id);
    if (!category) {
        res.status(404);
        throw new Error("Category not found");
    }
    res.json(category);
});
exports.getCategoryById = getCategoryById;
const createCategory = (0, express_async_handler_1.default)(async (req, res) => {
    const { name, image, categoryType } = req.body;
    if (!name || typeof name !== "string") {
        res.status(400);
        throw new Error("Category name is required and must be a string");
    }
    const validateCategoryTypes = [
        "Featured",
        "Hot Categories",
        "Top Categories",
    ];
    if (!validateCategoryTypes.includes(categoryType)) {
        res.status(400);
        throw new Error("Invalid category type");
    }
    const categoryExists = await Category_1.default.findOne({ name });
    if (categoryExists) {
        res.status(400);
        throw new Error("Category already exists");
    }
    const category = await Category_1.default.create({
        name,
        image: image || "",
        categoryType,
    });
    res.status(201).json(category);
});
exports.createCategory = createCategory;
const updateCategory = (0, express_async_handler_1.default)(async (req, res) => {
    const { name, image, categoryType } = req.body;
    const validateCategoryTypes = [
        "Featured",
        "Hot Categories",
        "Top Categories",
    ];
    if (!validateCategoryTypes.includes(categoryType)) {
        res.status(400);
        throw new Error("Invalid category type");
    }
    const category = await Category_1.default.findById(req.params.id);
    if (!category) {
        res.status(404);
        throw new Error('Category not found!');
    }
    category.name = name || category.name;
    category.categoryType = categoryType || category.categoryType;
    if (image) {
        category.image = image || category.image;
    }
    const updatedCategory = await category.save();
    res.json(updatedCategory);
});
exports.updateCategory = updateCategory;
const deleteCategory = (0, express_async_handler_1.default)(async (req, res) => {
    const category = await Category_1.default.findByIdAndDelete(req.params.id);
    if (!category) {
        res.status(404);
        throw new Error('Category not found!');
    }
    res.json({ message: 'Category deleted' });
});
exports.deleteCategory = deleteCategory;
