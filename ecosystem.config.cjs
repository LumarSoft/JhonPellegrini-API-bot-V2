module.exports = {
  apps: [
    {
      name: "johnapi",
      script: "./dist/app.js",
      cron_restart: "0 * * * *", // Configuración existente para johnapi
    },
    {
      name: "delete-bot-sessions",
      script: "./deleteBotSessions.js",
      cron_restart: "0 15 * * 1-5", // Ejecutar de lunes a viernes a las 15:00 hs
      autorestart: false, // Evitar que PM2 lo reinicie automáticamente
    },
  ],
};
