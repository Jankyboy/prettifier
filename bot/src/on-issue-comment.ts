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
    const botName = command[1]
    if (botName !== "prettifier") {
      console.log(`${repoPrefix}: COMMAND FOR OTHER BOT ${botName}, IGNORING`)
      return
    }
    const botCommand = command[2]
    switch (botCommand) {
      case "debug":
        console.log(`${repoPrefix}: DEBUGGING`)
        return
      case "help":
        console.log(`${repoPrefix}: HELP COMMAND`)
        addComment(issueID, helpTemplate(), context.github)
        return
      case "dev error":
        console.log(`${repoPrefix}: SIMULATING DEV ERROR`)
        return
      case "user error":
        console.log(`${repoPrefix}: SIMULATING USER ERROR`)
        return
      default:
        console.log(`${repoPrefix}: UNKNOWN PRETTIFIER COMMAND: ${botCommand}`)
        addComment(
          issueID,
          `unknown command: ${botCommand}\n\nValid commands are: \`debug\`, \`user error\``,
          context.github
        )
    }
  } catch (e) {
    console.log(e)
  }
}

function helpTemplate(): string {
  return `I understand these commands:\n
- **/prettifier debug** prints the Prettifier configuration used for this repo
- **/prettifier user error** simulates a user error
- **/prettifier help** for this help screen
`
}
