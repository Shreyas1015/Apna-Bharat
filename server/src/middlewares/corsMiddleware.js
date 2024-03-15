const cors = require("cors");

const corsOptions = cors({
  origin: "http://localhost:3000",
  methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
  credentials: true,
});

module.exports = corsOptions;
