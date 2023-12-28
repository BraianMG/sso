import { ENVIRONMENT } from './enum';

export const isEnvironmentMatch = (environment: ENVIRONMENT) => {
  const stage = process.env.STAGE;
  return stage === environment;
};
