module.exports = {
  apps: [
    {
      name: "johnapi",
      script: "./dist/app.js",
      cron_restart: "39 15 * * *",
    },
  ],
};
