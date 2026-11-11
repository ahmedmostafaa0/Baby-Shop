"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const productSchema = new mongoose_1.default.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    description: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
        default: 0
    },
    discountPercentage: {
        type: Number,
        default: 0,
        min: 0,
        max: 99
    },
    stock: {
        type: Number,
        default: 0,
        min: 0
    },
    ratings: [{
            userId: {
                type: mongoose_1.default.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            rating: {
                type: Number,
                required: true,
                min: 1,
                max: 5
            },
            createdAt: {
                type: Date,
                default: Date.now()
            }
        }],
    averageRating: {
        type: Number,
        default: 0
    },
    image: {
        type: [String],
        set: (val) => Array.isArray(val) ? val : [val],
        required: true
    },
    category: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Category',
        required: true
    },
    brand: {
        type: mongoose_1.default.Schema.Types.ObjectId,
        ref: 'Brand',
        required: true
    },
}, { timestamps: true });
productSchema.pre('save', function () {
    if (this.ratings && this.ratings.length > 0) {
        const sum = this.ratings.reduce((acc, item) => acc + item.rating, 0);
        this.averageRating = sum / this.ratings.length;
    }
});
const Product = mongoose_1.default.model('Product', productSchema);
exports.default = Product;
