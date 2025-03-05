
const mongoose = require("mongoose");
const db = mongoose.connection;

const uri = process.env.URI;

mongoose.connect(uri)
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.error("Error connecting to MongoDB:", error));

db.on("open", () => {
    console.log("Database is open");
});

db.on("error", (error) => {
    console.error("Error connecting to MongoDB:", error);
});

db.on("close", () => {
    console.log("Database is closed");
});