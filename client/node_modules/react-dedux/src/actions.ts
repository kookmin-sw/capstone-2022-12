import {
  Configuration, DispatchFunction,
  ActionGroup, ActionGroupList,
  ActionGroupDispatched, ActionGroupDispatchedList,
} from './types';

const strip = (str: string, config: Configuration): string => {
  const prefix = config.ACTIONS_PREFIX;
  const suffix = config.ACTIONS_SUFFIX;
  let result = str;

  if (result.indexOf(prefix) === 0) {
    result = result.substring(prefix.length);
  }

  const lengthWithoutSuffix = result.length - suffix.length;
  if (result.indexOf(suffix) === lengthWithoutSuffix) {
    result = result.substring(0, lengthWithoutSuffix);
  }
  return result;
};

const actionsToDispatchables = (actionsGroup: ActionGroup, dispatch: DispatchFunction): ActionGroupDispatched =>
  Object.keys(actionsGroup).reduce((accumulator: ActionGroupDispatched, key: string) => ({
    ...accumulator,
    [key]: (...args: any[]): void => dispatch(actionsGroup[key](...args)),
  }), {});

export const actionsSelector = (actions: ActionGroupList, config: Configuration) => (...args: string[]) =>
  (dispatch: DispatchFunction) => {
    const selected: ActionGroupDispatchedList = Object.keys(actions)
      .filter(key => args.indexOf(strip(key, config)) >= 0)
      .reduce((accumulator, key) => ({
        ...accumulator,
        [key]: actionsToDispatchables(actions[key], dispatch),
      }), {});
    const init = config.INIT_FUNCTION;
    Object.keys(selected).forEach(item => {
      selected[item][init] && typeof selected[item][init] === 'function' && selected[item][init]();
    });
    return selected;
  };
