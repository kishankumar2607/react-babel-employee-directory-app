const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const { ApolloServer } = require("apollo-server-express");
const typeDefs = require("./graphql/UserSchema");
const resolvers = require("./graphql/resolvers");
require("./helpers/connection");

// Create an express application
const app = express();

app.use(cors());

app.use(express.json());

// Serve the static files from the React app
const server = new ApolloServer({ typeDefs, resolvers });

const PORT = process.env.PORT || 7000;

// Start the server and listen on the specified port
async function startServer() {
  await server.start();

  server.applyMiddleware({ app, path: "/graphql" });

  app.listen(PORT, () => {
    console.log(`GraphQL is running at http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startServer();
