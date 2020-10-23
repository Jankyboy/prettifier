import * as probot from "probot"
import webhooks from "@octokit/webhooks"

export function onIssueComment(context: probot.Context<webhooks.WebhookPayloadIssueComment>): void {
  const text = context.payload.comment.body
  console.log(text)
}
