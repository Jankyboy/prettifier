import { GitHubAPI } from "probot/lib/github"
import { promises as fs } from "fs"
import { DevError } from "../logging/dev-error"
import path from "path"

export interface PushContextData {
  prettifierConfig: string
  prettierConfig: string
  pullRequestNumber: number
}

export async function loadPushContextData(
  org: string,
  repo: string,
  branch: string,
  github: GitHubAPI
): Promise<PushContextData> {
  let query = await fs.readFile(path.join("src", "github", "push-context.graphql"), "utf-8")
  query = query.replace(/\{\{branch\}\}/g, branch)
  let callResult
  try {
    callResult = await github.graphql(query, { org, repo, branch })
  } catch (e) {
    throw new DevError(`loading push data from GitHub`, e)
  }

  let pullRequestNumber = 0
  const pulls = callResult?.repository?.ref?.associatedPullRequests
  if (pulls.totalCount > 1) {
    throw new DevError("multiple open pull requests found for branch", new Error())
  }
  if (pulls.totalCount > 0) {
    pullRequestNumber = pulls.nodes[0].number
  }

  return {
    prettifierConfig: callResult?.repository.prettifierConfig?.text || "",
    prettierConfig: callResult?.repository.prettierConfig?.text || "",
    pullRequestNumber
  }
}