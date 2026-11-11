"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const upload_1 = __importDefault(require("../middlewares/upload"));
const upload_2 = require("../controllers/upload");
const router = (0, express_1.Router)();
router.post("/image", auth_1.protect, upload_1.default.single("file"), upload_2.uploadImage);
exports.default = router;
