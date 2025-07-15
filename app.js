const express = require("express");
const app = express();
const { sequelize } = require("./models");
require("dotenv").config();

app.use(express.json());

app.use("/api/events", require("./routes/eventRouter"));
app.use("/api/users", require("./routes/userRouter"));

app.use((err, req, res, next) => {
  res.status(err.status || 500).json({ error: err.message });
});

const PORT = process.env.PORT || 5000;
sequelize.sync({ alter: true }).then(() => {
  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });
});
