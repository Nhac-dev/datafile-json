import { isDate } from "util/types";
import { DataType } from "../type";

export function IsNum(value: string | number){  
    return value <= 0 || value > 0
}

export function VerifyDataType(data: any, typeTarget: DataType){
    switch (typeTarget) {
        case "String":
            return typeof data == "string" 
        case "Object":
            return typeof data == "object" && (!Array.isArray(data))
        case "List":
            return Array.isArray(data)
        case "Number":
            return IsNum(data)
        case "Money":
            return IsNum(data)
        case "Bool":
            return data == true || data == "false"
        default:
            return false
    }
}