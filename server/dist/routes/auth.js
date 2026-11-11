"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../controllers/auth");
const auth_2 = require("../middlewares/auth");
const router = express_1.default.Router();
router.post("/register", auth_1.registerUser);
router.post("/login", auth_1.loginUser);
router.get("/profile", auth_2.protect, auth_1.getUserProfile);
router.post("/logout", auth_1.logoutUser);
router.post("/refresh", auth_1.refreshAccessToken);
exports.default = router;
