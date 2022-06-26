const userRoutes = require("./userRoutes");

const router = (app) => {
      app.use("/api/v1/user", userRoutes);
};

module.exports = router