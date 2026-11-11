"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const auth_1 = require("../middlewares/auth");
const stats_1 = require("../controllers/stats");
const router = (0, express_1.Router)();
router.get('/', auth_1.protect, stats_1.getStats);
exports.default = router;
