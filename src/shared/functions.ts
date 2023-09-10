export const isDevelopmentEnvironment = () => {
  const stage = process.env.STAGE;
  return stage === 'development';
};
