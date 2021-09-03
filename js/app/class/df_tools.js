"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UtilsDataFiles = void 0;
const fs_1 = require("fs");
const verifyData_1 = require("../functions/verifyData");
class UtilsDataFiles {
    constructor() {
    }
    Find(search) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let dataList = "";
                dataList = JSON.parse(yield fs_1.promises.readFile(`${this.df.path}/${this.df.name}/collections/${this.nameData}.json`, "utf8"));
                dataList.shift();
                if (search) {
                    let key = Object.keys(search)[0];
                    let val = Object.values(search)[0];
                    dataList.map((value) => {
                        if (value[key] == val) {
                            dataList = value;
                        }
                        else if (val.includes("*") && !val.includes("/*/")) {
                            if (value[key].includes(`${val.replace("*", "")}`))
                                dataList = value;
                            else
                                undefined;
                        }
                        else if (val.includes("/*/")) {
                            val = val.replace("/*/", "*");
                            if (value[key].includes(val))
                                dataList = value;
                            else
                                undefined;
                        }
                        else {
                            dataList = undefined;
                        }
                    });
                }
                return dataList;
            }
            catch (error) {
                return error;
            }
        });
    }
    FindOne(search) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let dataList = "";
                let dataReturn = undefined;
                dataList = JSON.parse(yield fs_1.promises.readFile(`${this.df.path}/${this.df.name}/collections/${this.nameData}.json`, "utf8"));
                dataList.shift();
                let key = Object.keys(search)[0];
                let val = Object.values(search)[0];
                dataList.map((value) => {
                    if (value[key] == val) {
                        dataReturn = value;
                    }
                    else if (val.includes("*") && !val.includes("/*/")) {
                        if (value[key].includes(`${val.replace("*", "")}`))
                            dataReturn = value;
                    }
                    else if (val.includes("/*/")) {
                        val = val.replace("/*/", "*");
                        if (value[key].includes(val))
                            dataReturn = value;
                    }
                });
                return dataReturn;
            }
            catch (error) {
                return error;
            }
        });
    }
    UpdateData(search, newData) {
        return __awaiter(this, void 0, void 0, function* () {
            let allData = JSON.parse(yield fs_1.promises.readFile(`${this.df.path}/${this.df.name}/collections/${this.nameData}.json`, "utf8"));
            let oldData = {};
            let key = Object.keys(search)[0];
            let val = Object.values(search)[0];
            allData.map((value, index) => {
                if (value[key] == val) {
                    oldData = index;
                }
                else if (val.includes("*") && !val.includes("/*/")) {
                    if (value[key].includes(`${val.replace("*", "")}`))
                        oldData = index;
                }
                else if (val.includes("/*/")) {
                    val = val.replace("/*/", "*");
                    if (value[key].includes(val))
                        oldData = index;
                }
            });
            let keys = Object.keys(newData);
            let validValue = [];
            for (let i of keys) {
                if (newData[i]) {
                    allData[oldData][i] = newData[i];
                    if (this.model[i].type == "Money") {
                        let verify = `${newData[i]}`.split(".");
                        allData[oldData][i] = `${verify[1] != undefined ?
                            newData[i] :
                            parseFloat(newData[i]).toFixed(2)}`;
                        allData[oldData][i] = `${this.model[i]["defaultMoney"] ? this.model[i]["defaultMoney"] : "R$"}:${allData[oldData][i]}`;
                    }
                    else if (this.model[i].type == "Number") {
                        allData[oldData][i] = parseFloat(newData[i]);
                        validValue.push(verifyData_1.VerifyDataType(newData[i], this.model[i].type));
                    }
                    else {
                        validValue.push(verifyData_1.VerifyDataType(newData[i], this.model[i].type));
                    }
                }
                else if (newData[i] == false) {
                    allData[oldData][i] = newData[i];
                    validValue.push(verifyData_1.VerifyDataType(newData[i], "Bool"));
                }
            }
            fs_1.promises.writeFile(`${this.df.path}/${this.df.name}/collections/${this.nameData}.json`, JSON.stringify(allData, undefined, 3)).catch((e) => { });
        });
    }
    AddData(data) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                let dataList = "";
                dataList = JSON.parse(yield fs_1.promises.readFile(`${this.df.path}/${this.df.name}/collections/${this.nameData}.json`, "utf8"));
                let validValue = [];
                let keys = Object.keys(dataList[0]);
                for (let i of keys) {
                    let keyVerify = Object.keys(dataList[0][i]);
                    for (let kv of keyVerify) {
                        if (data[i]) {
                            if (kv === "type") {
                                if (dataList[0][i].type == "Money") {
                                    let verify = `${data[i]}`.split(".");
                                    validValue.push(verifyData_1.VerifyDataType(data[i], dataList[0][i][kv]));
                                    data[i] = `${verify[1] ?
                                        data[i] :
                                        parseFloat(data[i]).toFixed(2)}`;
                                    validValue[validValue.length - 1] ?
                                        data[i] = `${dataList[0][i]["defaultMoney"] ? dataList[0][i]["defaultMoney"] : "R$"}:${data[i]}` : data[i];
                                }
                                else if (dataList[0][i].type == "Number") {
                                    data[i] = parseFloat(data[i]);
                                    validValue.push(verifyData_1.VerifyDataType(data[i], dataList[0][i][kv]));
                                }
                                else {
                                    validValue.push(verifyData_1.VerifyDataType(data[i], dataList[0][i][kv]));
                                }
                            }
                        }
                        else if (!data[i] && dataList[0][i]) {
                            if (dataList[0][i].default) {
                                data[i] = dataList[0][i].default;
                                if (dataList[0][i].type == "Number") {
                                    data[i] = parseFloat(data[i]);
                                }
                                validValue.push(verifyData_1.VerifyDataType(data[i], dataList[0][i]["type"]));
                            }
                            else if (dataList[0][i]["required"] && !dataList[0][i].default) {
                                throw new Error(`A chave ${i} requer um valor obrigatório!`);
                            }
                        }
                    }
                }
                dataList.push(data);
                fs_1.promises.writeFile(`${this.df.path}/${this.df.name}/collections/${this.nameData}.json`, JSON.stringify(dataList, undefined, 3)).catch((e) => { });
            }
            catch (error) {
                throw new Error(error);
            }
        });
    }
}
exports.UtilsDataFiles = UtilsDataFiles;
