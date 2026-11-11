"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middlewares/auth");
const banner_1 = require("../controllers/banner");
const router = express_1.default.Router();
router.route("/").get(banner_1.getBanners).post(auth_1.protect, auth_1.admin, banner_1.createBanner);
router
    .route("/:id")
    .get(auth_1.protect, banner_1.getBannerById)
    .put(auth_1.protect, auth_1.admin, banner_1.updateBanner)
    .delete(auth_1.protect, auth_1.admin, banner_1.deleteBanner);
exports.default = router;
