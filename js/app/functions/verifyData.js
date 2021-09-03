"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyDataType = exports.IsNum = void 0;
function IsNum(value) {
    return value <= 0 || value > 0;
}
exports.IsNum = IsNum;
function VerifyDataType(data, typeTarget) {
    switch (typeTarget) {
        case "String":
            return typeof data == "string";
        case "Object":
            return typeof data == "object" && (!Array.isArray(data));
        case "List":
            return Array.isArray(data);
        case "Number":
            return IsNum(data);
        case "Money":
            return IsNum(data);
        case "Bool":
            return data == true || data == "false";
        default:
            return false;
    }
}
exports.VerifyDataType = VerifyDataType;
