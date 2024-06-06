module.exports = {
  apps: [
    {
      name: "johnapi",
      script: "./dist/app.js",
      cron_restart: "50 15 * * *",
    },
  ],
};
