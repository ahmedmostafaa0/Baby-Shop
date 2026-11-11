"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../middlewares/auth");
const analytics_1 = require("../controllers/analytics");
const router = express_1.default.Router();
router.use(auth_1.protect);
router.use(auth_1.admin);
router.get("/overview", analytics_1.getAnalyticsOverview);
router.get("/products", analytics_1.getProductAnalytics);
router.get("/sales", analytics_1.getSalesAnalytics);
router.get("/inventory-alerts", analytics_1.getInventoryAlerts);
exports.default = router;
