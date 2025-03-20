import express from "express";
import bodyParser from "body-parser";
import cors from "cors";

const app = express();
const PORT = 4000;

const todos = [];
// Middleware är funktioner som exekveras mellan att en begäran (request) tas emot och ett svar (response) skickas tillbaka i en webbserver.
// Den används för att hantera autentisering, loggning, felhantering, parsing av JSON, och mycket mer.

app.use(bodyParser.json());
app.use(cors());

app.get("/todos", (req, res) => {
  res.json(todos);
});

app.post("/todos", (req, res) => {
  const data = req.body;
  todos.push(data);

  console.log("In todos array: ", todos);

  res.send("Posts received");
});

app.listen(PORT, () => {
  console.log("Started on port: " + PORT);
});

//frontend

export default function App() {
  const [todos, setTodos] = useState([]);
  const [input, setInput] = useState([]);

  // Hämta todo items från backend
  async function getTodos() {
    const respons = await fetch("http://localhost:4000/todos");
    const data = await respons.json();

    console.log("data", data);
    setTodos(data);
  }

  useEffect(() => {
    // getTodos();
  }, []);

  async function addTodo() {
    const newTodo = { id: Date.now(), text: input };

    setInput("");

    await fetch("http://localhost:4000/todos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTodo),
    });

    setTodos([...todos, newTodo]);
  }

  return (
    <div className="p-6 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Todo App</h1>
      <div className="flex gap-2 mb-4">
        <input
          className="border p-2 flex-1"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Add a new todo"
        />
        <button className="bg-blue-500 text-white px-4 py-2" onClick={addTodo}>
          Add
        </button>
      </div>

      <ul className="space-y-2">
        {todos.map((todo) => (
          <li
            key={todo.id}
            className="border p-2 cursor-pointer hover:bg-gray-100"
          >
            {todo.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
