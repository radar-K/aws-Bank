import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import mysql from "mysql2/promise";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = 3001;
const JWT_SECRET = process.env.JWT_SECRET || "fallback_secret";

// CORS – tillåt specifika domäner
const allowedOrigins = process.env.ALLOWED_ORIGINS.split(",");

app.use((req, res, next) => {
  const origin = req.headers.origin;
  if (allowedOrigins.includes(origin)) {
    res.header("Access-Control-Allow-Origin", origin);
  }

  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  if (req.method === "OPTIONS") {
    return res.sendStatus(200);
  }

  next();
});

// Middleware
app.use(express.json());
app.use(bodyParser.json());
app.use(cors());

// Databasanslutning
const pool = mysql.createPool({
  user: "root",
  password: "root",
  host: "mysql", //localhost
  database: "bank",
  port: 3306,
});

async function query(sql, params) {
  const [results] = await pool.execute(sql, params);
  return results;
}

// JWT-autentisering
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Åtkomst nekad" });
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified;
    next();
  } catch (error) {
    return res.status(403).json({ message: "Ogiltig token" });
  }
};

// Endpoints
app.get("/ping", (req, res) => {
  res.json({ message: "pong" });
});

app.post("/users", async (req, res) => {
  const { username, password } = req.body;

  try {
    const checkUser = await query("SELECT id FROM users WHERE username = ?", [
      username,
    ]);
    if (checkUser.length > 0) {
      return res.status(409).json({ message: "Användarnamnet finns redan" });
    }

    const sql = "INSERT INTO users (username, password) VALUES(?, ?)";
    const result = await query(sql, [username, password]);

    res.json({ message: "Användare skapad" });
  } catch (error) {
    console.error("Error creating user:", error);
    res
      .status(500)
      .json({ message: "Fel vid skapande av användare", error: error.message });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const sql = "SELECT * FROM users WHERE username = ? and password = ?";
    const result = await query(sql, [username, password]);

    if (result.length === 0) {
      return res
        .status(401)
        .json({ message: "Ogiltigt användarnamn eller lösenord" });
    }

    const user = result[0];
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    res.json({
      message: "Inloggning lyckades",
      token,
      user: { id: user.id, username: user.username },
    });
  } catch (error) {
    console.error("Login error:", error);
    res
      .status(500)
      .json({ message: "Fel vid inloggning", error: error.message });
  }
});

app.get("/verify-token", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const result = await query("SELECT id, username FROM users WHERE id = ?", [
      userId,
    ]);

    if (result.length === 0) {
      return res.status(404).json({ message: "Användaren hittades inte" });
    }

    res.json(result[0]);
  } catch (error) {
    res
      .status(500)
      .json({ message: "Fel vid verifiering", error: error.message });
  }
});

app.put("/new-password", authenticateToken, async (req, res) => {
  const { newPassword } = req.body;
  const userId = req.user.userId;

  try {
    const result = await query("UPDATE users SET password = ? WHERE id = ?", [
      newPassword,
      userId,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Användaren hittades inte" });
    }

    res.json({ message: "Lösenord uppdaterat" });
  } catch (error) {
    console.error("Password update error:", error);
    res
      .status(500)
      .json({ message: "Fel vid uppdatering", error: error.message });
  }
});

app.delete("/users", authenticateToken, async (req, res) => {
  const userId = req.user.userId;

  try {
    const result = await query("DELETE FROM users WHERE id = ?", [userId]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Användaren hittades inte" });
    }

    res.json({ message: "Användaren raderad" });
  } catch (error) {
    console.error("Delete error:", error);
    res.status(500).json({ message: "Fel vid radering", error: error.message });
  }
});

app.get("/transactions", authenticateToken, async (req, res) => {
  const userId = req.user.userId;

  try {
    const transactions = await query(
      "SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC",
      [userId]
    );

    res.json(transactions);
  } catch (error) {
    console.error("Transaction fetch error:", error);
    res.status(500).json({ message: "Fel vid hämtning", error: error.message });
  }
});

app.post("/transactions", authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const { description, amount, type, category, recipient } = req.body;

  if (!description || amount === undefined || !type) {
    return res
      .status(400)
      .json({ message: "Beskrivning, belopp och typ krävs" });
  }

  try {
    const result = await query(
      "INSERT INTO transactions (user_id, description, amount, transaction_type, category, recipient, date) VALUES (?, ?, ?, ?, ?, ?, NOW())",
      [userId, description, amount, type, category || null, recipient || null]
    );

    res
      .status(201)
      .json({ message: "Transaktion skapad", transactionId: result.insertId });
  } catch (error) {
    console.error("Transaction create error:", error);
    res.status(500).json({ message: "Fel vid skapande", error: error.message });
  }
});

// Starta servern
app.listen(port, "0.0.0.0", () => {
  console.log(`Bankens backend körs på port ${port}`);
});
