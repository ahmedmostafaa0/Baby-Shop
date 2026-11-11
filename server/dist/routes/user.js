"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_1 = require("../controllers/user");
const auth_1 = require("../middlewares/auth");
const router = express_1.default.Router();
router.get("/", auth_1.protect, auth_1.admin, user_1.getUsers);
router.post("/", auth_1.protect, auth_1.admin, user_1.createUser);
router.get("/:id", auth_1.protect, user_1.getUserById);
router.put("/:id", auth_1.protect, user_1.updateUser);
router.delete("/:id", auth_1.protect, auth_1.admin, user_1.deleteUser);
router.post("/:id/addresses", auth_1.protect, user_1.addAddress);
router
    .route("/:id/addresses/:addressId")
    .put(auth_1.protect, user_1.updateAddress)
    .delete(auth_1.protect, user_1.deleteAddress);
exports.default = router;
