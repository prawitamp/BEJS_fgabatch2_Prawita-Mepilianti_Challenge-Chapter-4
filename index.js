const express = require("express");
const main_route = require("./src/routes");
const app = express();

// middleware
app.use(express.json());

app.use("/api/v1", main_route);

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server is running on ${PORT}`);
});
