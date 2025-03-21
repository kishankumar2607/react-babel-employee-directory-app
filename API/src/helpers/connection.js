
const mongoose = require("mongoose");
const db = mongoose.connection;

//define the URI for the database
const uri = process.env.URI;

//database connection using mongoose
mongoose.connect(uri)
    .then(() => console.log("Connected to MongoDB"))
    .catch((error) => console.error("Error connecting to MongoDB:", error));

//database connection events
db.on("open", () => {
    console.log("Database is open");
});

//handle connection errors if any occur
db.on("error", (error) => {
    console.error("Error connecting to MongoDB:", error);
});

//handle disconnection events
db.on("close", () => {
    console.log("Database is closed");
});