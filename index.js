const conectToMongo = require("./db");
const express = require("express");
const cors = require("cors");

conectToMongo();

const app = express();
// Use cors on all routes and allow access only from
app.use(cors());
const port = 3001;

//To get query from re.body
app.use(express.json());

//Available routes
app.use("/api/auth", require("./routes/auth"));
app.use("/api/notes", require("./routes/notes"));

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(port, () => {
  console.log(`iNotebook backend listening at http://localhost:${port}`);
});
