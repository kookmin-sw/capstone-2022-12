"use strict";
var __assign = (this && this.__assign) || Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
        s = arguments[i];
        for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
            t[p] = s[p];
    }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
var capitalise_1 = require("./capitalise");
var config = {
    DOMAIN: '',
    ACTIONS_PREFIX: '',
    ACTIONS_SUFFIX: 'Actions',
    SPLITTER: '/',
    INIT_FUNCTION: 'init',
    getActionsName: function (_) { return ''; },
    getActionType: function (_, __) { return ({ type: '' }); },
    getDomainNames: function () { return []; },
};
var buildHelpers = function (newConfig) { return (__assign({}, newConfig, { getActionsName: function (name) {
        var prefixed = (newConfig.ACTIONS_PREFIX && "" + newConfig.ACTIONS_PREFIX + capitalise_1.capitalise(name)) || "" + name;
        return "" + prefixed + (newConfig.ACTIONS_SUFFIX || config.ACTIONS_SUFFIX);
    }, getActionType: function (typeName, typeAction) { return ({
        type: "" + typeName + newConfig.SPLITTER + typeAction,
    }); }, getDomainNames: function () { return newConfig.DOMAIN.split(newConfig.SPLITTER).filter(function (d) { return !!d; }); } })); };
exports.getConfig = function (newConfig) {
    return buildHelpers(__assign({}, config, newConfig));
};
