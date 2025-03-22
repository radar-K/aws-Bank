// Databas utan sql
import express from "express"; // Skapar och hanterar en webbserver.
import bodyParser from "body-parser"; // Gör att servern kan läsa JSON och formulärdata.
import cors from "cors"; // cors → Tillåter förfrågningar från andra domäner.

const app = express();
const port = 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Starta servern
app.listen(port, () => {
  console.log(`Bankens backend körs på http://localhost:${port}`);
});

// Generera engångslösenord
function generateOTP() {
  // Generera en sexsiffrig numerisk OTP
  const otp = Math.floor(100000 + Math.random() * 900000);
  return otp.toString();
}

// arrayer
let userIds = 1;
let accountsIds = 1;
let sessionsIds = 1;

const users = [];
const accounts = [];
const sessions = [];

// routes:
app.post("/users", async (req, res) => {
  const { username, password } = req.body;

  // Skapa användare och lägg till i users-arrayen
  const userId = userIds++;
  const user = { id: userId, username, password };
  users.push(user);

  // Skapa konto för användaren
  const accountId = accountsIds++;
  const account = { id: accountId, userId, amount: 0 };
  accounts.push(account);

  console.log("users", users);
  console.log("accounts", accounts);

  res.send("User created");
});

// Logga in
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  const user = users.find(
    (user) => user.username === username && user.password === password
  );

  if (user) {
    const token = generateOTP();
    const sessionId = sessionsIds++;
    const session = { id: sessionId, userId: user.id, token };

    sessions.push(session);
    console.log("sessions", sessions);

    res.json(session);
  } else {
    res.status(401).send("Login failed");
  }
});

// Hämta saldo
app.post("/me/accounts", async (req, res) => {
  const { token } = req.body;
  const session = sessions.find((sessions) => sessions.token == token);

  if (session) {
    const { userId } = session;
    const account = accounts.find((account) => account.userId == userId);

    res.json(account);
  } else {
    res.send("session ogiltig");
  }
});
