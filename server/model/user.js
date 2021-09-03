const {Model} = require("../../js/app/main")

module.exports = new Model("usr", {
    nome: {
        type: "String",
        required: true
    },
    email: {
        type: "String",
        required: true
    },
    idade: {
        type: "Number",
        required: true
    }
})