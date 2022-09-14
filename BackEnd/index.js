const express = require("express");
const app = express();
const db = require("./config/db");
const cors = require("cors");
const auth = require("./Routes/auth");
const port = process.env.PORT;
require("dotenv").config();

const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const session = require("express-session");

app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

// app.use(cors());
// middleware <<
app.use(express.json());
app.use(cookieParser());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    key: "userID",
    secret: "trying Out session cookie",
    resave: false,
    saveUninitialized: false,
    cookie: { expires: 60 * 60 * 24 },
  })
);

db.getConnection((err, connection) => {
  if (err) {
    throw err;
  }
  console.log(`Database connections successful  ${connection.threadId}`);
});

app.use("/auth", auth);

app.listen(port, () => {
  console.log(`Server Started On Port ${port}`);
});
