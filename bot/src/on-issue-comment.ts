import * as probot from "probot"
import webhooks from "@octokit/webhooks"

const commandRE = /^\/([\w]+)\b *(.*)?$/

export function onIssueComment(context: probot.Context<webhooks.WebhookPayloadIssueComment>): void {
  let org = ""
  let repo = ""
  let issue = 0
  try {
    org = context.payload.repository.owner.login
    repo = context.payload.repository.name
    issue = context.payload.issue.number
    const repoPrefix = `${org}/${repo}`
    const text = context.payload.comment.body.trim()
    console.log(`${repoPrefix}: NEW COMMENT ON ISSUE #${issue}:\n${text}`)
    if (text === "") {
      console.log(`${repoPrefix}: NO COMMAND GIVEN`)
      // postReply("no command given", "Please provide a command")
      return
    }
    if (!text.startsWith("/")) {
      console.log(`${repoPrefix}: NOT A BOT COMMAND, IGNORING`)
      return
    }
    const command = text.match(commandRE)
    console.log(command)
    if (command == null) {
      throw new Error("unexpected NULL result")
    }
    if (command[1] !== "prettifier") {
      console.log(`${repoPrefix}: NOT A PRETTIFIER COMMAND, IGNORING`)
      return
    }
    if (command[2] === "debug") {
      console.log(`${repoPrefix}: DEBUGGING`)
      return
    }
    console.log(`${repoPrefix}: UNKNOWN COMMAND: ${command}`)
  } catch (e) {
    console.log(e)
  }
}
