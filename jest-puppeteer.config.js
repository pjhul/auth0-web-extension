const path = require("path");

const extensionPath = path.resolve(__dirname, "integration");

module.exports = {
  launch: {
    headless: false,
    executablePath: "/usr/bin/google-chrome",
    args: [
      `--disable-extensions-except=${extensionPath}`,
      `--load-extension=${extensionPath}`
    ]
  },
  browserContext: 'default',
}
