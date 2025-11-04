interface EnvConfig {
  BASE_URL: string;
  USERNAME: string;
  PASSWORD: string;
}

export function getEnvConfig(): EnvConfig {
  const env = process.env.ENVIRONMENT ?? "test";

  switch (env) {
    case "staging":
      return {
        BASE_URL: "https://crm.staging.smartflyer.com/",
        USERNAME: process.env.STAGING_USER ?? "",
        PASSWORD: process.env.STAGING_PASS ?? "",
      };

    default:
      return {
        BASE_URL: "https://crm.test.smartflyer.com/",
        USERNAME: process.env.TEST_USER ?? "",
        PASSWORD: process.env.TEST_PASS ?? "",
      };
  }
}
