const model = require("../model/Individual");
const baseService = require("../Service/BaseService");

module.exports = new (class Individual extends baseService {}(model))();
