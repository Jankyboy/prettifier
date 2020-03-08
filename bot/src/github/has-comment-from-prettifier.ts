import { GitHubAPI } from "probot/lib/github"
import { promises as fs } from "fs"
import path from "path"

/** returns whether the given pull request already has a comment from PrettifierBot */
export async function hasCommentFromPrettifier(
  org: string,
  repo: string,
  pullrequest: number,
  github: GitHubAPI
): Promise<boolean> {
  const query = await fs.readFile(path.join("src", "github", "pullrequest-comment-authors.graphql"), "utf-8")
  const callResult = await github.graphql(query, { org, repo, pullrequest })
  for (const comment of callResult?.repository.pullRequest.comments.nodes) {
    if (comment.author.login === "prettifier") {
      return true
    }
  }
  return false
}
