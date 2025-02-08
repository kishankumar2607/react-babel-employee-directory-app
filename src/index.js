const express = require("express");
const path = require("path");
const dotenv = require("dotenv");
dotenv.config();
const cors = require("cors");
const { ApolloServer } = require("apollo-server-express");
const typeDefs = require("./graphql/UserSchema");
const resolvers = require("./graphql/resolvers");
require("./helpers/connection");

const app = express();

app.use(cors());

app.use(express.static(path.join(__dirname, '../public')));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const server = new ApolloServer({ typeDefs, resolvers });

const PORT = process.env.PORT || 8000;

async function startServer() {
  await server.start();

  server.applyMiddleware({ app, path: "/graphql" });

  app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
  });

  app.listen(PORT, () => {
    console.log(`Server running at http://localhost:${PORT}`);
    console.log(`GraphQL is running at http://localhost:${PORT}${server.graphqlPath}`);
  });
}

startServer();
