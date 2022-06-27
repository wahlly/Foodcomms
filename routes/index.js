const userRoutes = require("./userRoutes");
const adminRoutes = require("./adminRoutes");

const router = (app) => {
      app.use("/api/v1/user", userRoutes);
      app.use("/api/v1/admin", adminRoutes);
};

module.exports = router