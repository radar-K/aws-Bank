// databas med sql
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

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Starta servern
app.listen(port, () => {
  console.log(`Bankens backend körs på http://localhost:${port}`);
});

//Grundstruktur -------------->

// Generera engångslösenord
function generateOTP() {
  // Generera en sexsiffrig numerisk OTP
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp.toString();
}

// SKAPA ANVÄNDARE - create - insert med sql
app.post("/users", async (req, res) => {
  const { username, password } = req.body;

  // Försök att infoga användaren i databasen
  try {
    const sql = "INSERT INTO users (username, password) VALUES(?, ?)";
    const params = [username, password]; // en array som innehåller de värden som ska infogas i databasen. (i ? i sql frågan?
    const result = await query(sql, params);
    console.log("result", result); // loggar resultatet från databasinsättningen.

    res.send("user created");
  } catch (error) {
    res.status(500).send("Error creating user", error);
  }
});

// LOGGA IN - Read - Select med sql
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const sql = "SELECT * FROM users WHERE username = ? and password = ?";
    const params = [username, password];
    const result = await query(sql, params);

    console.log("result", result);
    res.json(result);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Error creating user", error: error.message });
  }
});

// UPPDATERA lösenord - Update
app.put("/new-password", async (req, res) => {
  const { userId, newPassword } = req.body;

  try {
    const sql = "UPDATE users SET password = ? WHERE id = ? "; // uppdatera vilken tabell (users) och vilken kolumn (password)
    const params = [newPassword, userId];

    const result = await query(sql, params);
    res.json(result);
  } catch {
    res.status(500).send("error login", error);
  }
});

//Delete
app.delete("/users", async (req, res) => {
  const { userId } = req.body;

  try {
    const sql = "DELETE FROM users WHERE id = ?";
    const params = [userId];

    const result = await query(sql, params);

    res.json(result);
  } catch {
    res.status(500).send("error delete user", error);
  }
});
