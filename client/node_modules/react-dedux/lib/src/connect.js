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
var Redux = require("react-redux");
var config_1 = require("./config");
var actions_1 = require("./actions");
var state_changers_1 = require("./state-changers");
exports.connect = function (actions, config) {
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        var configuration = config_1.getConfig(config);
        return Redux.connect(state_changers_1.stateChangersSelector(configuration).apply(void 0, args), actions_1.actionsSelector(Object.keys(actions).reduce(function (accumulator, key) {
            return (__assign({}, accumulator, (_a = {}, _a[configuration.getActionsName(key)] = actions[key], _a)));
            var _a;
        }, {}), configuration).apply(void 0, args));
    };
};
