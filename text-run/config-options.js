const diff = require("assert-no-diff")
const { PrettifierConfiguration } = require("../bot/dist/prettifier-configuration.js")

module.exports = async function(activity) {
  const documentedOptions = activity.nodes
    .textInNodesOfType("strong")
    .map(s => s.substr(0, s.length - 1))
    .sort()
    .join("\n")
  const actualOptions = Object.keys(PrettifierConfiguration.defaults)
    .sort()
    .join("\n")
  diff.trimmedLines(documentedOptions, actualOptions)
}
