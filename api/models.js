"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Exercise = exports.User = void 0;
var mongoose_1 = __importDefault(require("mongoose"));
var exerciseSchema = new mongoose_1.default.Schema({
    description: {
        type: String,
        required: true,
    },
    duration: {
        type: Number,
        required: true,
    },
    date: {
        type: Date,
        default: Date.now,
    },
});
var userSchema = new mongoose_1.default.Schema({
    username: {
        type: String,
        unique: true,
        required: true,
    },
    log: {
        type: [exerciseSchema],
    },
});
exports.User = mongoose_1.default.model("user", userSchema);
exports.Exercise = mongoose_1.default.model("exercise", exerciseSchema);
