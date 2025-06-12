// kolla mer om httpOnly-cookie  för JWT-autentisering
import express from "express"; //  Skapar och hanterar en webbserver.
import bodyParser from "body-parser"; //  Gör att servern kan läsa JSON och formulärdata.
import cors from "cors"; //  cors → Tillåter förfrågningar från andra domäner.
import mysql from "mysql2/promise";
import jwt from "jsonwebtoken"; // Add JWT import

const app = express();

// CORS middleware
app.use((req, res, next) => {
  res.header("Access-Control-Allow-Origin", "http://localhost:3000");
  res.header("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS");
  res.header(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );

  // Handle preflight requests
  if (req.method === "OPTIONS") {
    res.sendStatus(200);
  } else {
    next();
  }
});

// Befintliga middleware
app.use(express.json());

app.use(bodyParser.json());
app.use(cors());

const port = 3001;
const JWT_SECRET = "secretkey"; // Secret key for JWT (use environment variable in production)

// sql uppkoppling,  Skapa en anslutning till databasen, pool: flera uppkopplingar
const pool = mysql.createPool({
  user: "root", // Databasanvändare,
  password: "root", // Databaslösenord,    tom sträng eller root
  host: "localhost", // Ändra till "localhost" om du kör utan Docker
  database: "bank", // Databasens namn
  port: 8889, // Standard MySQL port (ändra till 3307 om du använder MAMP)
});

// help function to make code look nicer
async function query(sql, params) {
  const [results] = await pool.execute(sql, params);
  return results;
}

// Creating authentication middleware
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res.status(401).json({ message: "Åtkomst nekad" });
  }

  try {
    const verified = jwt.verify(token, JWT_SECRET);
    req.user = verified; // This adds the user data to the request object
    next();
  } catch (error) {
    return res.status(403).json({ message: "Ogiltig token" });
  }
};

// Test endpoint
app.get("/ping", (req, res) => {
  res.json({ message: "pong" });
});

// SKAPA ANVÄNDARE - create - insert med sql
app.post("/users", async (req, res) => {
  const { username, password } = req.body;

  // Försök att infoga användaren i databasen
  try {
    // Check if username already exists
    const checkUser = await query("SELECT id FROM users WHERE username = ?", [
      username,
    ]);
    if (checkUser.length > 0) {
      return res.status(409).json({ message: "Användarnamnet finns redan" });
    }

    const sql = "INSERT INTO users (username, password) VALUES(?, ?)";
    const params = [username, password];
    const result = await query(sql, params);
    console.log("result", result);

    res.json({ message: "Användare skapad" });
  } catch (error) {
    console.error("Error creating user:", error);
    res
      .status(500)
      .json({ message: "Fel vid skapande av användare", error: error.message });
  }
});

// LOGGA IN - Read - Select med sql (MODIFIED to return JWT token)
app.post("/login", async (req, res) => {
  const { username, password } = req.body;

  try {
    const sql = "SELECT * FROM users WHERE username = ? and password = ?";
    const params = [username, password];
    const result = await query(sql, params);

    // Check if user exists
    if (result.length === 0) {
      return res
        .status(401)
        .json({ message: "Ogiltigt användarnamn eller lösenord" });
    }

    // Get the user object
    const user = result[0];

    // Create JWT token
    const token = jwt.sign({ userId: user.id }, JWT_SECRET, {
      expiresIn: "1h",
    });

    // Return user and token
    res.json({
      message: "Inloggning lyckades",
      token: token,
      user: {
        id: user.id,
        username: user.username,
      },
    });

    console.log("User logged in:", user.username);
  } catch (error) {
    console.error("Login error:", error);
    res.status(500).json({
      message: "Fel vid inloggning",
      error: error.message,
    });
  }
});

// Verify token and return user data
app.get("/verify-token", authenticateToken, async (req, res) => {
  try {
    const userId = req.user.userId;
    const sql = "SELECT id, username FROM users WHERE id = ?";
    const result = await query(sql, [userId]);

    if (result.length === 0) {
      return res.status(404).json({ message: "Användaren hittades inte" });
    }

    res.json(result[0]);
  } catch (error) {
    res.status(500).json({
      message: "Fel vid verifiering av användare",
      error: error.message,
    });
  }
});

// UPPDATERA lösenord - Update (MODIFIED to use token for authentication)
app.put("/new-password", authenticateToken, async (req, res) => {
  const { newPassword } = req.body;
  const userId = req.user.userId; // Get userId from token

  try {
    const sql = "UPDATE users SET password = ? WHERE id = ?";
    const params = [newPassword, userId];

    const result = await query(sql, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Användaren hittades inte" });
    }

    res.json({ message: "Lösenord uppdaterat" });
  } catch (error) {
    console.error("Password update error:", error);
    res.status(500).json({
      message: "Fel vid uppdatering av lösenord",
      error: error.message,
    });
  }
});

// Delete (MODIFIED to use token for authentication)
app.delete("/users", authenticateToken, async (req, res) => {
  const userId = req.user.userId; // Get userId from token

  try {
    const sql = "DELETE FROM users WHERE id = ?";
    const params = [userId];

    const result = await query(sql, params);

    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Användaren hittades inte" });
    }

    res.json({ message: "Användaren raderad" });
  } catch (error) {
    console.error("Delete user error:", error);
    res
      .status(500)
      .json({ message: "Fel vid radering av användare", error: error.message });
  }
});

// ==================== TRANSACTION API ENDPOINTS ====================

// Hämta transaktioner för inloggad användare
app.get("/transactions", authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  console.log("Fetching transactions for userId:", userId);

  try {
    // Använd rätt kolumnnamn baserat på din databas
    const sql =
      "SELECT * FROM transactions WHERE user_id = ? ORDER BY date DESC";
    const params = [userId];
    console.log("SQL:", sql, "Params:", params);

    const transactions = await query(sql, params);
    console.log("Found transactions:", transactions.length);

    res.json(transactions);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({
      message: "Fel vid hämtning av transaktioner",
      error: error.message,
    });
  }
});

// Skapa en ny transaktion
app.post("/transactions", authenticateToken, async (req, res) => {
  const userId = req.user.userId;
  const { description, amount, type, category, recipient } = req.body;

  console.log("Creating transaction:", {
    userId,
    description,
    amount,
    type,
    category,
    recipient,
  });

  if (!description || amount === undefined || !type) {
    return res
      .status(400)
      .json({ message: "Beskrivning, belopp och typ krävs" });
  }

  try {
    // Använd rätt kolumnnamn - transaction_type istället för type
    const sql =
      "INSERT INTO transactions (user_id, description, amount, transaction_type, category, recipient, date) VALUES (?, ?, ?, ?, ?, ?, NOW())";
    const params = [
      userId,
      description,
      amount,
      type, // Detta värde går in i transaction_type kolumnen
      category || null,
      recipient || null,
    ];

    console.log("SQL:", sql);
    console.log("Params:", params);

    const result = await query(sql, params);

    res.status(201).json({
      message: "Transaktion skapad",
      transactionId: result.insertId,
    });
  } catch (error) {
    console.error("Error creating transaction:", error);
    res.status(500).json({
      message: "Fel vid skapande av transaktion",
      error: error.message,
    });
  }
});

// Starta servern
app.listen(port, "0.0.0.0", () => {
  console.log(`Bankens backend körs på http://localhost:3001${port}`);
});
