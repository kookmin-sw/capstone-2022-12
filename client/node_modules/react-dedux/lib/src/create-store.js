"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var redux_1 = require("redux");
var thunk = require("redux-thunk");
var config_1 = require("./config");
var combine_reducers_1 = require("./combine-reducers");
var middleware = [thunk.default];
if (window && window.devToolsExtension && typeof window.devToolsExtension === 'function') {
    middleware = middleware.concat([window.devToolsExtension()]);
}
exports.createStore = function (stateChangers, config) {
    return function (initialState) { return redux_1.createStore(combine_reducers_1.combineReducers(stateChangers, config_1.getConfig(config)), initialState, redux_1.applyMiddleware.apply(void 0, middleware)); };
};
