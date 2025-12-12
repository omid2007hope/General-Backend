const model = require("../model/Individual");
const BaseService = require("../Service/BaseService");

module.exports = new (class Individual extends BaseService {})(model);
