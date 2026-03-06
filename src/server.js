const dotenv = require("dotenv");
const app = require("./app");
const sequelize = require("./config/database");

dotenv.config();

const PORT = Number(process.env.PORT || 5000);

async function startServer() {
  try {
    await sequelize.authenticate();
    console.log("PostgreSQL connection established successfully.");

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Unable to connect to PostgreSQL:", error.message);
    process.exit(1);
  }
}

startServer();
