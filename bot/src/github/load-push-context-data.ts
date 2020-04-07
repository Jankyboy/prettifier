import { GitHubAPI } from "probot/lib/github"
import { promises as fs } from "fs"
import { DevError } from "../logging/dev-error"
import path from "path"

export interface PushContextData {
  prettifierConfig: string
  prettierConfig: string
  pullRequestNumber: number
  pullRequestId: string
  pullRequestURL: string
}

export async function loadPushContextData(
  org: string,
  repo: string,
  branch: string,
  github: GitHubAPI
): Promise<PushContextData> {
  let query = await fs.readFile(path.join("src", "github", "push-context.graphql"), "utf-8")
  query = query.replace(/\{\{branch\}\}/g, branch)
  const callResult = await github.graphql(query, { org, repo, branch })

  let pullRequestNumber = 0
  let pullRequestId = ""
  let pullRequestURL = ""
  const pulls = callResult?.repository?.ref?.associatedPullRequests
  if (pulls.totalCount > 1) {
    throw new DevError("multiple open pull requests found for branch", new Error())
  }
  if (pulls.totalCount > 0) {
    pullRequestNumber = pulls.nodes[0].number
    pullRequestId = pulls.nodes[0].id
    pullRequestURL = pulls.nodes[0].url
  }

  return {
    prettifierConfig: callResult?.repository.prettifierConfig?.text || "",
    prettierConfig: callResult?.repository.prettierConfig?.text || "",
    pullRequestNumber,
    pullRequestId,
    pullRequestURL,
  }
}
