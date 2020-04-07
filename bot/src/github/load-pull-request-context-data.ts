import { GitHubAPI } from "probot/lib/github"
import { promises as fs } from "fs"
import path from "path"

export interface PullRequestContextData {
  prettifierConfig: string
  prettierConfig: string
}

export async function loadPullRequestContextData(
  org: string,
  repo: string,
  branch: string,
  github: GitHubAPI
): Promise<PullRequestContextData> {
  let query = await fs.readFile(path.join("src", "github", "pull-request-context.graphql"), "utf-8")
  query = query.replace(/\{\{branch\}\}/g, branch)
  const callResult = await github.graphql(query, { org, repo, branch })
  return {
    prettifierConfig: callResult?.repository.prettifierConfig?.text || "",
    prettierConfig: callResult?.repository.prettierConfig?.text || "",
  }
}
