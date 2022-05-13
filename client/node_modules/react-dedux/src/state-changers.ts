import { combineReducers } from './combine-reducers';

import { getConfig } from './config';
import { Store, StateChangerGroupReduced, StateChangerGroupWithDefaultsList, Configuration, AnyConfiguration } from './types';

export const stateChangersSelector = (config: Configuration) => (...args: string[]) =>
  (stateChangers: StateChangerGroupReduced): StateChangerGroupReduced => {

    let stateChangersNoDomain: StateChangerGroupReduced = stateChangers;
    config.getDomainNames().forEach(domain => {
      stateChangersNoDomain = (<any>stateChangersNoDomain)[domain];
    });

    return Object.keys(stateChangersNoDomain)
      .filter(key => args.indexOf(key) >= 0)
      .reduce((accumulator, key) => ({ ...accumulator, [key]: stateChangersNoDomain[key] }), {});
  }

export const replaceStateChangers = <S>(store: Store<S>, stateChangers: StateChangerGroupWithDefaultsList, config?: AnyConfiguration) =>
  store.replaceReducer(combineReducers(stateChangers, getConfig(config)))
