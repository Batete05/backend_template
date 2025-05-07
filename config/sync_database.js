const { sequelize } = require("./dbConnection");

// Register models before sync
require("../models/user");
require("../models/employees");
require("../models/oneTimeCode");

sequelize
  .sync({ force: true }) // <-- auto updates schema
  .then(() => console.log("✅ All models synchronized (altered) with DB."))
  .catch((err) => console.error("❌ Sync failed:", err));
