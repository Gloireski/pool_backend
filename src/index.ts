// index.ts
import "dotenv/config";
import { connectToDatabase } from "./config/db";
import app from "./app";

const PORT = process.env.PORT || 3001;

connectToDatabase()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`API listening at http://localhost:${PORT}`);
    });
  })
  .catch((err: any) => {
    console.error("Failed to connect to MongoDB:", err);
    process.exit(1);
  });



  

