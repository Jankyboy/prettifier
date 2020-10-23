import * as probot from "probot"
import webhooks from "@octokit/webhooks"

export function onIssueComment(context: probot.Context<webhooks.WebhookPayloadIssueComment>): void {
  let org = ""
  let repo = ""
  let issue = 0
  try {
    org = context.payload.repository.owner.login
    repo = context.payload.repository.name
    issue = context.payload.issue.id
    const repoPrefix = `${org}/${repo}`
    const text = context.payload.comment.body
    console.log(`${repoPrefix}: NEW COMMENT ON ISSUE #${issue}: ${text}`)
  } catch (e) {
    console.log(e)
  }
}
