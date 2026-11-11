"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middlewares/auth");
const products_1 = require("../controllers/products");
const router = express_1.default.Router();
router.route("/").get(products_1.getProducts).post(auth_1.protect, auth_1.admin, products_1.createProduct);
router
    .route("/:id")
    .get(products_1.getProductById)
    .put(auth_1.protect, auth_1.admin, products_1.updateProduct)
    .delete(auth_1.protect, auth_1.admin, products_1.deleteProduct);
router.route("/:id/rate").post(auth_1.protect, products_1.rateProduct);
exports.default = router;
