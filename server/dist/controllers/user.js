"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteAddress = exports.updateAddress = exports.addAddress = exports.deleteUser = exports.updateUser = exports.getUserById = exports.createUser = exports.getUsers = void 0;
const express_async_handler_1 = __importDefault(require("express-async-handler"));
const User_1 = __importDefault(require("../models/User"));
const getUsers = (0, express_async_handler_1.default)(async (req, res) => {
    // #swagger.tags = ['Users']
    const users = await User_1.default.find({}).select("-password");
    res.json({
        success: true,
        users,
    });
});
exports.getUsers = getUsers;
const createUser = (0, express_async_handler_1.default)(async (req, res) => {
    // #swagger.tags = ['Users']
    const { name, email, addresses, password, role, avatar } = req.body;
    const userExists = await User_1.default.findOne({ email });
    if (userExists) {
        res.status(400);
        throw new Error("User already exists");
    }
    const user = await User_1.default.create({
        name,
        email,
        role,
        password,
        addresses: addresses || [],
        avatar: avatar || ''
    });
    if (user) {
        res.status(201).json({
            _id: user._id,
            name: user.name,
            email: user.email,
            avatar: user.avatar,
            role: user.role,
            addresses: user.addresses,
        });
    }
    else {
        res.status(400);
        throw new Error("Invalid user data");
    }
});
exports.createUser = createUser;
const getUserById = (0, express_async_handler_1.default)(async (req, res) => {
    // #swagger.tags = ['Users']
    const { id } = req.params;
    const user = await User_1.default.findById(id).select("-password");
    if (!user) {
        res.status(404);
        throw new Error("User not found!");
    }
    res.json(user);
});
exports.getUserById = getUserById;
const updateUser = (0, express_async_handler_1.default)(async (req, res) => {
    // #swagger.tags = ['Users']
    const { name, role, email, addresses, password, avatar } = req.body;
    const { id } = req.params;
    const user = await User_1.default.findById(id);
    if (!user) {
        res.status(404);
        throw new Error("User not found!");
    }
    user.name = name || user.name;
    user.role = role || user.role;
    user.email = email || user.email;
    user.password = password || user.password;
    user.avatar = avatar || user.avatar;
    user.addresses = addresses || user.addresses;
    await user.save();
    res.json({
        _id: user._id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        role: user.role,
        addresses: user.addresses,
        success: true
    });
});
exports.updateUser = updateUser;
const deleteUser = (0, express_async_handler_1.default)(async (req, res) => {
    // #swagger.tags = ['Users']
    const { id } = req.params;
    const user = await User_1.default.findByIdAndDelete(id);
    if (!user) {
        res.status(404);
        throw new Error("User not found!");
    }
    res.json({ success: true, message: "User deleted successfully!" });
});
exports.deleteUser = deleteUser;
const addAddress = (0, express_async_handler_1.default)(async (req, res) => {
    const { id } = req.params;
    const user = await User_1.default.findById(id);
    if (!user) {
        res.status(404);
        throw new Error("User not found!");
    }
    const { street, city, country, postalCode, isDefault } = req.body;
    if (!street || !city || !country || !postalCode) {
        res.status(400);
        throw new Error("All address fields are required!");
    }
    if (isDefault) {
        user.addresses.forEach((add) => (add.isDefault = false));
    }
    user.addresses.push({
        city,
        street,
        country,
        postalCode,
        isDefault,
    });
    await user.save();
    res.status(201).json({
        success: true,
        addresses: user.addresses,
        message: "Address added successfully",
    });
});
exports.addAddress = addAddress;
const updateAddress = (0, express_async_handler_1.default)(async (req, res) => {
    const { id, addressId } = req.params;
    const { street, city, country, postalCode, isDefault } = req.body;
    const user = await User_1.default.findById(id);
    if (!user) {
        res.status(404);
        throw new Error("User not found!");
    }
    if (!addressId || typeof addressId !== "string") {
        res.status(400);
        throw new Error("Invalid address id");
    }
    const address = user.addresses.id(addressId);
    if (!address) {
        res.status(404);
        throw new Error("Address not found");
    }
    if (street)
        address.street = street;
    if (city)
        address.city = city;
    if (country)
        address.country = country;
    if (postalCode)
        address.postalCode = postalCode;
    if (isDefault) {
        user.addresses.forEach((add) => {
            add.isDefault = false;
        });
        address.isDefault = true;
    }
    await user.save();
    res.status(200).json({
        success: true,
        addresses: user.addresses,
        message: "Address updated successfully",
    });
});
exports.updateAddress = updateAddress;
const deleteAddress = (0, express_async_handler_1.default)(async (req, res) => {
    const { id, addressId } = req.params;
    if (!addressId || typeof addressId !== 'string') {
        res.status(400);
        throw new Error('Invalid address id');
    }
    const user = await User_1.default.findById(id);
    if (!user) {
        res.status(404);
        throw new Error("User not found!");
    }
    const address = user.addresses.id(addressId);
    if (!address) {
        res.status(404);
        throw new Error("Address not found");
    }
    address?.deleteOne();
    await user.save();
    res.json({
        success: true,
        addresses: user.addresses,
        message: "Address deleted successfully",
    });
});
exports.deleteAddress = deleteAddress;
