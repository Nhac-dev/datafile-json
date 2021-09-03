"use strict";
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Schema_instances, _Schema_SaveData;
Object.defineProperty(exports, "__esModule", { value: true });
exports.Schema = void 0;
const verifyData_1 = require("../functions/verifyData");
const df_tools_1 = require("./df_tools");
class Schema extends df_tools_1.UtilsDataFiles {
    constructor(nameData, data) {
        super();
        _Schema_instances.add(this);
        this.model = {};
        this.nameData = nameData;
        let keys = Object.keys(data);
        for (let item of keys) {
            if (data[item].default) {
                verifyData_1.VerifyDataType(data[item].default, data[item].type) ?
                    (() => {
                        if (data[item].type == "Money") {
                            let verify = `${data[item].default}`.split(".");
                            data[item].default = `${verify[1] ?
                                data[item].default :
                                parseFloat(data[item].default).toFixed(2)}`;
                            data[item].default = `${data[item].defaultMoney ? data[item].defaultMoney : "R$"}:${data[item].default}`;
                        }
                        __classPrivateFieldGet(this, _Schema_instances, "m", _Schema_SaveData).call(this, item, data);
                    })()
                    : (() => {
                        console.log(`O tipo ${data[item].type} não coincide com o valor ${data[item].default} que é um/a ${typeof data[item].default}`);
                    })();
                continue;
            }
            else {
                __classPrivateFieldGet(this, _Schema_instances, "m", _Schema_SaveData).call(this, item, data);
            }
        }
    }
    SetDF(df) {
        this.df = df;
    }
}
exports.Schema = Schema;
_Schema_instances = new WeakSet(), _Schema_SaveData = function _Schema_SaveData(key, obj) {
    this.model[key] = obj[key];
};
