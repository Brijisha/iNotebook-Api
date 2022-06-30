const conectToMongo = require("./db");
const express = require("express");

conectToMongo();

const app = express();
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
  console.log(`Example app listening at http://localhost:${port}`);
});
