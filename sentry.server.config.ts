import * as Sentry from "@sentry/nextjs";

Sentry.init({
  dsn: "https://e54b7cbcccdf8bb839bd4e195acdad35@o4511930055458816.ingest.de.sentry.io/4511930061684816",

  tracesSampleRate: 1,

  enableLogs: true, 

  dataCollection: {},

  integrations: [
    Sentry.vercelAIIntegration(),

    Sentry.consoleLoggingIntegration({
      levels: ["log", "warn", "error"],
    }),
  ],
});
