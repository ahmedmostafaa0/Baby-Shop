"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const swagger_autogen_1 = __importDefault(require("swagger-autogen"));
const doc = {
    info: {
        title: "Baby Shop API",
        description: "API backend endpoints for Baby Shop website",
    },
    host: "localhost:8000",
    schemes: ["http"],
    servers: [
        {
            url: "http://localhost:8000",
        },
    ],
    components: {
        securitySchemes: {
            bearerAuth: {
                type: "http",
                scheme: "bearer",
            },
        },
    },
    security: [
        {
            bearerAuth: [],
        },
    ],
};
const outputFile = "./swagger-output.json";
const routes = ["../index.ts"];
(0, swagger_autogen_1.default)({
    openapi: "3.0.0",
    autoHeaders: false,
})(outputFile, routes, doc);
