"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataBase = exports.Model = void 0;
const model_1 = require("./class/model");
Object.defineProperty(exports, "Model", { enumerable: true, get: function () { return model_1.Schema; } });
const class_df_1 = require("./class/class_df");
Object.defineProperty(exports, "DataBase", { enumerable: true, get: function () { return class_df_1.DataFile; } });
