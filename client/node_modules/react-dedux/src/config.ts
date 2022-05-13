import { Configuration, AnyConfiguration } from './types';
import { capitalise } from './capitalise';

const config: Configuration = {
  DOMAIN: '',
  ACTIONS_PREFIX: '',
  ACTIONS_SUFFIX: 'Actions',
  SPLITTER: '/',
  INIT_FUNCTION: 'init',
  getActionsName: (_: string) => '',
  getActionType: (_: string, __: string) => ({ type: '' }),
  getDomainNames: () => [],
};

const buildHelpers = (newConfig: Configuration): Configuration => ({
  ...newConfig,
  getActionsName: (name: string) => {
    const prefixed = (newConfig.ACTIONS_PREFIX && `${newConfig.ACTIONS_PREFIX}${capitalise(name)}`) || `${name}`;
    return `${prefixed}${newConfig.ACTIONS_SUFFIX || config.ACTIONS_SUFFIX}`;
  },
  getActionType: (typeName: string, typeAction: string) => ({
    type: `${typeName}${newConfig.SPLITTER}${typeAction}`,
  }),
  getDomainNames: () => newConfig.DOMAIN.split(newConfig.SPLITTER).filter(d => !!d),
});

export const getConfig = (newConfig?: AnyConfiguration) =>
  buildHelpers({ ...config, ...newConfig });
