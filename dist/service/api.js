"use strict";

var __importDefault = void 0 && (void 0).__importDefault || function (mod) {
  return mod && mod.__esModule ? mod : {
    "default": mod
  };
};

Object.defineProperty(exports, "__esModule", {
  value: true
});

const axios_1 = __importDefault(require("axios"));

const api = axios_1.default.create({
  baseURL: "http://localhost:8080/suporte17Java/rest/"
});
exports.default = api;