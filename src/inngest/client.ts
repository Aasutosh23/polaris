import { Inngest, eventType, staticSchema } from "inngest";
import { sentryMiddleware } from "@inngest/middleware-sentry";

type MessageSentPayload = {
  messageId: string;
  conversationId: string;
  projectId: string;
  message: string;
};

type MessageCancelPayload = {
  messageId: string;
};

export const messageSent = eventType("message/sent", {
  schema: staticSchema<MessageSentPayload>(),
});

export const messageCancel = eventType("message/cancel", {
  schema: staticSchema<MessageCancelPayload>(),
});

export const inngest = new Inngest({
  id: "polaris",
  middleware: [sentryMiddleware()],
});
