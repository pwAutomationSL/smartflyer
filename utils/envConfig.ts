interface EnvConfig {
  BASE_URL: string;
  USERNAME: string;
  PASSWORD: string;
}
process.env.ENVIRONMENT = process.env.ENVIRONMENT?.trim() || 'qa2';
export function getEnvConfig(): EnvConfig {
  const env = process.env.ENVIRONMENT ?? 'stage';
  switch (env) {
    case 'stage':
      return {
        BASE_URL: 'https://crm.stage.smartflyer.com/',
        USERNAME: process.env.STAGING_USER ?? '',
        PASSWORD: process.env.STAGING_PASS ?? '',
      };

    default:
      return {
        BASE_URL: `https://crm.${env}.smartflyer.com/`,
        USERNAME: process.env.TEST_USER ?? '',
        PASSWORD: process.env.TEST_PASS ?? '',
      };
  }
}
