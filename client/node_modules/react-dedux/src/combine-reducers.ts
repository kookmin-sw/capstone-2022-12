import { combineReducers as reduxCombineReducers } from 'redux';

import {
  ActionObject,
  StateChangerGroup,
  StateChangerReduced,
  StateChangerGroupWithDefaultsList,
  StateChangerGroupReduced,
  Configuration,
} from './types';

const reducer = <S>(typeName: string, defaultValue: any, stateChangers: StateChangerGroup<S>, config: Configuration): StateChangerReduced<S> =>
  (prevState: S, action: ActionObject): S => {
    const splitter = config.SPLITTER;
    const actionType = action.type.split(splitter);
    if (actionType.length === 2 && actionType[0].toLowerCase() === typeName.toLowerCase()) {
      return stateChangers[actionType[1]](prevState, action);
    }
    return prevState || defaultValue;
  };

export const combineReducers = (stateChangers: StateChangerGroupWithDefaultsList, config: Configuration): StateChangerReduced<any> => {

  const reducers =  Object.keys(stateChangers).reduce((accumulator, key) => ({
    ...accumulator,
    [key]: reducer(key, stateChangers[key].defaultValue, stateChangers[key].stateChangers, config),
  }), {});

  const domainNames = config.getDomainNames().reverse();
  let reducerObject: StateChangerGroupReduced = reducers;

  domainNames.forEach(domain => {
    reducerObject = {
      [domain]: reduxCombineReducers(reducerObject),
    };
  });
  return reduxCombineReducers(reducerObject);
}
