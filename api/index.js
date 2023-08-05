"use strict";
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
var zod_1 = require("zod");
var express_1 = __importDefault(require("express"));
var cors_1 = __importDefault(require("cors"));
var path_1 = __importDefault(require("path"));
var mongoose_1 = require("mongoose");
var models_1 = require("./models");
require("dotenv/config");
// connet to MongoDB
(0, mongoose_1.connect)(process.env.MONGO_URI);
// setup express
var app = (0, express_1.default)();
app.use((0, cors_1.default)());
app.use(express_1.default.static("public"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
// handle requests
app.get("/", function (_req, res) {
    res.sendFile("/views/index.html", { root: path_1.default.join(__dirname, "..") });
});
app
    .route("/api/users")
    .post(function (req, res) {
    var username = req.body.username;
    var newUser = new models_1.User({ username: username });
    newUser
        .save()
        .then(function (data) {
        res.json({ username: username, _id: data._id });
    })
        .catch(function (e) {
        return res.json(e.code == 11000
            ? { error: "username is already taken" }
            : { error: e });
    });
})
    .get(function (_req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var users;
    return __generator(this, function (_a) {
        switch (_a.label) {
            case 0: return [4 /*yield*/, models_1.User.find().select("username")];
            case 1:
                users = _a.sent();
                res.json(users);
                return [2 /*return*/];
        }
    });
}); });
app.post("/api/users/:_id/exercises", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, description, duration, date, exercise, user, e_1;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _a = req.body, description = _a.description, duration = _a.duration, date = _a.date;
                exercise = {
                    description: description,
                    duration: Number(duration),
                    date: date ? new Date(date) : new Date(),
                };
                _b.label = 1;
            case 1:
                _b.trys.push([1, 3, , 4]);
                return [4 /*yield*/, models_1.User.findOneAndUpdate({ _id: req.params._id }, { $push: { log: exercise } }, {
                        runValidators: true,
                        new: true,
                    })
                        .select("-__v -log")
                        .lean()
                        .exec()];
            case 2:
                user = _b.sent();
                res.json(__assign(__assign(__assign({}, user), exercise), { date: exercise.date.toDateString() }));
                return [3 /*break*/, 4];
            case 3:
                e_1 = _b.sent();
                res.json(e_1);
                return [3 /*break*/, 4];
            case 4: return [2 /*return*/];
        }
    });
}); });
app.get("/api/users/:_id/logs", function (req, res) { return __awaiter(void 0, void 0, void 0, function () {
    var _a, from_1, to_1, limit, user, log, e_2;
    return __generator(this, function (_b) {
        switch (_b.label) {
            case 0:
                _b.trys.push([0, 2, , 3]);
                _a = req.query, from_1 = _a.from, to_1 = _a.to, limit = _a.limit;
                if ((from_1 ? !zod_1.z.coerce.date().safeParse(from_1).success : false) ||
                    (to_1 ? !zod_1.z.coerce.date().safeParse(to_1).success : false)) {
                    return [2 /*return*/, res.json({ error: "Invalid date format." })];
                }
                if (from_1 && to_1 && from_1 > to_1) {
                    return [2 /*return*/, res.json({ error: "'from' date must be before 'to' date." })];
                }
                if (limit && !zod_1.z.coerce.number().int().safeParse(limit.toString()).success) {
                    return [2 /*return*/, res.json({ error: "'limit' parameter can only be an integer." })];
                }
                return [4 /*yield*/, models_1.User.findById(req.params._id, "-__v").lean().exec()];
            case 1:
                user = _b.sent();
                log = user === null || user === void 0 ? void 0 : user.log.slice(limit ? -Number(limit) : 0).filter(function (_a) {
                    var date = _a.date;
                    var isodate = date.toISOString().split("T")[0];
                    if (from_1 && to_1)
                        return isodate >= from_1 && isodate <= to_1;
                    else if (from_1)
                        return isodate >= from_1;
                    else if (to_1)
                        return isodate <= to_1;
                    else
                        return true; // return all if user doesn't specify quries
                }).map(function (_a) {
                    var date = _a.date, duration = _a.duration, description = _a.description;
                    return {
                        duration: duration,
                        description: description,
                        date: date.toDateString(),
                    };
                });
                res.json(__assign(__assign({}, user), { log: log, count: log ? log.length : 0 }));
                return [3 /*break*/, 3];
            case 2:
                e_2 = _b.sent();
                console.error(e_2);
                res.json({ error: e_2 });
                return [3 /*break*/, 3];
            case 3: return [2 /*return*/];
        }
    });
}); });
var server = app.listen(process.env.PORT || 3000, function () {
    var port = server.address().port;
    console.log("Your app is listening on port " + port);
});
exports.default = app;
