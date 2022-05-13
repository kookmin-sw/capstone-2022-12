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
var redux_1 = require("redux");
var reducer = function (typeName, defaultValue, stateChangers, config) {
    return function (prevState, action) {
        var splitter = config.SPLITTER;
        var actionType = action.type.split(splitter);
        if (actionType.length === 2 && actionType[0].toLowerCase() === typeName.toLowerCase()) {
            return stateChangers[actionType[1]](prevState, action);
        }
        return prevState || defaultValue;
    };
};
exports.combineReducers = function (stateChangers, config) {
    var reducers = Object.keys(stateChangers).reduce(function (accumulator, key) {
        return (__assign({}, accumulator, (_a = {}, _a[key] = reducer(key, stateChangers[key].defaultValue, stateChangers[key].stateChangers, config), _a)));
        var _a;
    }, {});
    var domainNames = config.getDomainNames().reverse();
    var reducerObject = reducers;
    domainNames.forEach(function (domain) {
        reducerObject = (_a = {},
            _a[domain] = redux_1.combineReducers(reducerObject),
            _a);
        var _a;
    });
    return redux_1.combineReducers(reducerObject);
};
