import { GitHubAPI } from "probot/lib/github"
import { LoggedError } from "./logged-error"
import { addComment } from "../github/add-comment"
import { Context } from "./context"

/** UserError indicates a user error */
export class UserError extends Error {
  activity: string
  cause: Error
  context: object

  constructor(activity: string, cause: Error, context: object = {}) {
    super()
    this.activity = activity
    this.cause = cause
    this.context = context
  }
}

/** Logs a user mistake. */
export function userError(err: Error, desc: string, context: Context, pullRequest: number, github: GitHubAPI): never {
  console.log(`${context.org}|${context.repo}: USER ERROR: ${desc}:`, err.message)
  if (pullRequest > 0) {
    addComment(context.org, context.repo, pullRequest, bodyTemplate(err, desc), github)
  }
  throw new LoggedError()
}

export function bodyTemplate(err: Error, desc: string): string {
  return `Prettifier-Bot here. I noticed a problem with your setup:

\`\`\`
${desc}
\`\`\`

More details:
\`\`\`
${err.message}
\`\`\`

I can't format your code until this is fixed.

If you think this is an error on my side, please report this problem using [this form](https://github.com/kevgo/prettifier/issues/new).

I will only comment when I see relevant configuration changes.`
}
