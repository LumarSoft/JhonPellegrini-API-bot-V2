import fs from "fs";
import path from "path";

// src/deleteBotSessions.js
const directory = path.join(__dirname, "..", "bot_sessions");

fs.rm(directory, { recursive: true, force: true }, (err) => {
  if (err) {
    console.error(`Error al eliminar la carpeta ${directory}:`, err);
  } else {
    console.log(`Carpeta ${directory} eliminada exitosamente.`);
  }
});
