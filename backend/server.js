require("dotenv").config();
const app = require('./app'); // Import pre-configured app

// Just start the server (safe for production & local use)
app.listen(process.env.PORT || 3001, "0.0.0.0", () => {
  console.log(`Server is Running on http://localhost:${process.env.PORT}`);
  console.log(`Api Doc http://localhost:${process.env.PORT}/api-docs`);
});

