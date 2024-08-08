module.exports = {
  apps: [
    {
      name: "johnapi",
      script: "./dist/src/app.js",
      cron_restart: "0 */2 * * *",
    },
  ],
};
