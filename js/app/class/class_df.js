"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _DataFile_dataName, _DataFile_collectionsName, _DataFile_path, _DataFile_id;
Object.defineProperty(exports, "__esModule", { value: true });
exports.DataFile = void 0;
const fs_1 = require("fs");
class DataFile {
    constructor(dataName, path) {
        _DataFile_dataName.set(this, void 0);
        _DataFile_collectionsName.set(this, void 0);
        _DataFile_path.set(this, void 0);
        _DataFile_id.set(this, void 0);
        __classPrivateFieldSet(this, _DataFile_id, (Math.random() * (100 - 58) + 50).toString(18), "f");
        __classPrivateFieldSet(this, _DataFile_dataName, dataName, "f");
        __classPrivateFieldSet(this, _DataFile_collectionsName, new Array(), "f");
        this.SetPath(path);
        const settings = {
            id: this.GetId,
            name: this.GetName,
            genBy: "Jefferson"
        };
        fs_1.promises.mkdir(`${this.GetPath}/${this.GetName}`).catch((e) => { });
        fs_1.promises.mkdir(`${this.GetPath}/${this.GetName}/collections/`).catch((e) => { });
        fs_1.promises.readFile(`${this.GetPath}/${this.GetName}/${this.GetName}-settings.json`, "utf8").then((data) => {
            settings.id = dataName;
        }).catch((e) => {
            fs_1.promises.writeFile(`${this.GetPath}/${this.GetName}/${this.GetName}-settings.json`, JSON.stringify(settings, undefined, 3), "utf8");
        });
    }
    // GET
    get GetName() {
        return __classPrivateFieldGet(this, _DataFile_dataName, "f");
    }
    get GetPath() {
        return __classPrivateFieldGet(this, _DataFile_path, "f");
    }
    get GetId() {
        return __classPrivateFieldGet(this, _DataFile_id, "f");
    }
    get GetCollections() {
        return __classPrivateFieldGet(this, _DataFile_collectionsName, "f");
    }
    // SET
    SetPath(dir) {
        __classPrivateFieldSet(this, _DataFile_path, dir, "f");
    }
    NewCollection(nameCollection, model) {
        fs_1.promises.readFile(`${this.GetPath}/${this.GetName}/collections/${nameCollection}.json`, "utf8").then((data) => {
            let datamodel = model.model;
            let dataRecibe = JSON.parse(data);
            dataRecibe[0] = datamodel;
            fs_1.promises.writeFile(`${this.GetPath}/${this.GetName}/collections/${nameCollection}.json`, JSON.stringify(dataRecibe, undefined, 3)).catch((e) => {
            });
        }).catch((e) => {
            console.log(e);
            fs_1.promises.writeFile(`${this.GetPath}/${this.GetName}/collections/${nameCollection}.json`, JSON.stringify([model.model], undefined, 3)).then(() => {
            }).catch((e) => {
            });
        });
        model.SetDF({ name: this.GetName, path: this.GetPath });
        __classPrivateFieldGet(this, _DataFile_collectionsName, "f").push(nameCollection);
    }
}
exports.DataFile = DataFile;
_DataFile_dataName = new WeakMap(), _DataFile_collectionsName = new WeakMap(), _DataFile_path = new WeakMap(), _DataFile_id = new WeakMap();
