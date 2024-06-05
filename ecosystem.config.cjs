module.exports = {
  apps: [
    {
      name: "johnapi",
      script: "./dist/app.js",
      cron_restart: "40 15 * * *",
    },
  ],
};
