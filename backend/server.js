import express from "express"; //  Skapar och hanterar en webbserver.
import bodyParser from "body-parser"; //  Gör att servern kan läsa JSON och formulärdata.
import cors from "cors"; //  cors → Tillåter förfrågningar från andra domäner.

import mysql from "mysql2/promise";

const app = express();

app.use(bodyParser.json());
app.use(cors());

const port = 3001;

// sql uppkoppling,  Skapa en anslutning till databasen, pool: flera uppkopplingar
const pool = mysql.createPool({
  user: "root", // Databasanvändare,
  password: "root", // Databaslösenord,    tom sträng eller root
  host: "localhost", // Databasens IP-adress eller domän
  database: "bank", // Databasens namn
  port: "8889", // Kolla port på MAMP
});

// help function to make code look nicer
async function query(sql, params) {
  const [results] = await pool.execute(sql, params);
  return results;
}

// app är en Express-applikation, som hanterar HTTP-förfrågningar och svar.

// Middleware-funktioner/Route-handler har alltid tre parametrar:
// req → Innehåller all information om förfrågan (t.ex. headers, body).
// res → Används för att skicka svar till klienten.
// next() → Skickar requesten vidare till nästa middleware eller route.

app.post("/users", async (req, res) => {
  const { username, password } = req.body;

  try {
    const sql = "INSERT INTO users (username, password) VALUES(?, ?)";
    const params = [username, password];
    const result = await query(sql, params);
    console.log("hej");
    console.log("result", result);

    res.send("user created");
  } catch (error) {
    res.status(500).send("Error creating user", error);
  }
});

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Starta servern
app.listen(port, () => {
  console.log(`Bankens backend körs på http://localhost:${port}`);
});
//Grundstruktur -------------->

// Generera engångslösenord
// function generateOTP() {
//     // Generera en sexsiffrig numerisk OTP
//     const otp = Math.floor(100000 + Math.random() * 900000);
//     return otp.toString();
// }

// Din kod här. Skriv dina arrayer

// Din kod här. Skriv dina routes:
