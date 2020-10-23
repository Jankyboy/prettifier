import * as probot from "probot"
import webhooks from "@octokit/webhooks"
import { addComment } from "./github/add-comment"

const commandRE = /^\/([\w]+)\b *(.*)?$/

export function onIssueComment(context: probot.Context<webhooks.WebhookPayloadIssueComment>): void {
  let org = ""
  let repo = ""
  let issueID = ""
  let issueNr = 0
  try {
    org = context.payload.repository.owner.login
    repo = context.payload.repository.name
    issueID = context.payload.issue.node_id
    issueNr = context.payload.issue.number
    const repoPrefix = `${org}/${repo}`
    const text = context.payload.comment.body.trim()
    console.log(`${repoPrefix}: NEW COMMENT ON ISSUE #${issueNr}:\n${text}`)
    if (text === "") {
      console.log(`${repoPrefix}: NO COMMAND GIVEN`)
      addComment(issueID, "no command given\n\nValid commands are: debug", context.github)
      return
    }
    const command = text.match(commandRE)
    if (command == null) {
      console.log(`${repoPrefix}: NOT A BOT COMMAND, IGNORING`)
      return
    }
    if (command[1] !== "prettifier") {
      console.log(`${repoPrefix}: NOT A PRETTIFIER COMMAND, IGNORING`)
      return
    }
    if (command[2] === "debug") {
      console.log(`${repoPrefix}: DEBUGGING`)
      return
    }
    console.log(`${repoPrefix}: UNKNOWN PRETTIFIER COMMAND: ${command[2]}`)
  } catch (e) {
    console.log(e)
  }
}
