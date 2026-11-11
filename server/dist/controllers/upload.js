"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.uploadImage = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const cloudinary_1 = __importDefault(require("../config/cloudinary"));
exports.uploadImage = (0, express_async_handler_1.default)(async (req, res) => {
    if (!req.file) {
        res.status(400).json({ message: "No file uploaded" });
        return;
    }
    const folder = req.body.folder || 'baby-shop/test';
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = 'data:' + req.file?.mimetype + ';base64,' + b64;
    const result = await cloudinary_1.default.uploader.upload(dataURI, {
        folder
    });
    res.json({
        url: result.secure_url,
        publid_id: result.public_id
    });
});
