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
var combine_reducers_1 = require("./combine-reducers");
var config_1 = require("./config");
exports.stateChangersSelector = function (config) { return function () {
    var args = [];
    for (var _i = 0; _i < arguments.length; _i++) {
        args[_i] = arguments[_i];
    }
    return function (stateChangers) {
        var stateChangersNoDomain = stateChangers;
        config.getDomainNames().forEach(function (domain) {
            stateChangersNoDomain = stateChangersNoDomain[domain];
        });
        return Object.keys(stateChangersNoDomain)
            .filter(function (key) { return args.indexOf(key) >= 0; })
            .reduce(function (accumulator, key) {
            return (__assign({}, accumulator, (_a = {}, _a[key] = stateChangersNoDomain[key], _a)));
            var _a;
        }, {});
    };
}; };
exports.replaceStateChangers = function (store, stateChangers, config) {
    return store.replaceReducer(combine_reducers_1.combineReducers(stateChangers, config_1.getConfig(config)));
};
