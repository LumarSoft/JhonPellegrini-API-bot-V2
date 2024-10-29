import { exec } from "child_process";

// pm2 start monitor.js --name "internet-monitor"


// Función para comprobar la conexión a Internet
function checkInternet(callback) {
  exec("ping -c 1 google.com", (error) => {
    callback(!error); // Devuelve verdadero si no hay error
  });
}

// Función para reiniciar las aplicaciones en PM2
function restartApps() {
  exec("pm2 restart all", (error) => {
    if (error) {
      console.error(`Error reiniciando aplicaciones: ${error}`);
    } else {
      console.log("Aplicaciones reiniciadas con éxito.");
    }
  });
}

// Comprueba la conexión a Internet cada 10 segundos
setInterval(() => {
  checkInternet((isConnected) => {
    if (isConnected) {
      console.log("Conexión a Internet restaurada.");
      restartApps();
    } else {
      console.log("Sin conexión a Internet...");
    }
  });
}, 60000); // 1 minuto
