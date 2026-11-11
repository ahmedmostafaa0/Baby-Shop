"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const dotenv_1 = __importDefault(require("dotenv"));
const error_1 = __importDefault(require("./middlewares/error"));
const db_1 = __importDefault(require("./config/db"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const swagger_ui_express_1 = __importDefault(require("swagger-ui-express"));
const swagger_output_json_1 = __importDefault(require("./utils/swagger-output.json"));
// import routes
const auth_1 = __importDefault(require("./routes/auth"));
const user_1 = __importDefault(require("./routes/user"));
const product_1 = __importDefault(require("./routes/product"));
const brand_1 = __importDefault(require("./routes/brand"));
const category_1 = __importDefault(require("./routes/category"));
const stats_1 = __importDefault(require("./routes/stats"));
const order_1 = __importDefault(require("./routes/order"));
const cart_1 = __importDefault(require("./routes/cart"));
const analytics_1 = __importDefault(require("./routes/analytics"));
const banner_1 = __importDefault(require("./routes/banner"));
const upload_1 = __importDefault(require("./routes/upload"));
dotenv_1.default.config();
(0, db_1.default)();
const app = (0, express_1.default)();
app.get('/', (req, res) => {
    res.send('server is running');
});
const allowedOrigins = [
    process.env.ADMIN_URL,
    process.env.CLIENT_URL,
    "http://localhost:3000",
    "http://localhost:5173",
].filter(Boolean);
app.use((0, cors_1.default)({
    origin: function (origin, callback) {
        if (!origin)
            return callback(null, true);
        if (process.env.NODE_ENV === "development")
            return callback(null, true);
        if (allowedOrigins.includes(origin)) {
            return callback(null, true);
        }
        return callback(new Error("Not allowed by CORS"));
    },
    credentials: true,
    methods: ["GET", "PUT", "POST", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
    exposedHeaders: ['x-access-token']
}));
app.use((0, cookie_parser_1.default)());
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ limit: "10mb", extended: true }));
// API Routes
app.use("/api/auth", auth_1.default);
app.use("/api/users", user_1.default);
app.use("/api/products", product_1.default);
app.use("/api/brands", brand_1.default);
app.use("/api/categories", category_1.default);
app.use("/api/stats", stats_1.default);
app.use("/api/orders", order_1.default);
app.use("/api/cart", cart_1.default);
app.use("/api/analytics", analytics_1.default);
app.use("/api/banners", banner_1.default);
app.use("/api/upload", upload_1.default);
// API Doc Route
app.use("/api/docs", swagger_ui_express_1.default.serve, swagger_ui_express_1.default.setup(swagger_output_json_1.default));
app.use(error_1.default);
// const PORT = process.env.PORT || 8000;
// app.listen(PORT, () => {
//   console.log("BabyShop API Server is running!");
// });
exports.default = app;
