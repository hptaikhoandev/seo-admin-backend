const Domain = require("../models/domain");
const { Op } = require('sequelize');
const { ca } = require('date-fns/locale');

class DomainService {
    constructor() {
        this.init();
    }

    async init() {
        //
    }

    sendSMS = async ({ phoneList, messageLis }) => {
        //
    };
}

module.exports = DomainService;
