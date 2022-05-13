import { createStore as reduxCreateStore, applyMiddleware, Middleware } from 'redux';
import * as thunk from 'redux-thunk';

import { getConfig } from './config';
import { combineReducers } from './combine-reducers';
import { StateChangerGroupWithDefaultsList, Store, AnyConfiguration } from './types';

declare var window: any;

let middleware: Middleware[] = [ thunk.default ];
if (window && window.devToolsExtension && typeof window.devToolsExtension === 'function') {
  middleware = [ ...middleware, window.devToolsExtension() ];
}

export const createStore = <S>(stateChangers: StateChangerGroupWithDefaultsList, config?: AnyConfiguration) =>
  (initialState?: S): Store<S> => reduxCreateStore(
    combineReducers(stateChangers, getConfig(config)),
    initialState,
    applyMiddleware(...middleware)
  );
