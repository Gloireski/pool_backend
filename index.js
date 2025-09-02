// index.js
const express = require("express");
const app = express();
const PORT = process.env.PORT || 3000;

// Middleware pour lire le JSON
app.use(express.json());

// Route test
app.get("/", (req, res) => {
  res.send("Hello, Backend léger avec Express 🚀");
});

// Lancer le serveur
app.listen(PORT, () => {
  console.log(`Serveur démarré sur http://localhost:${PORT}`);
});

