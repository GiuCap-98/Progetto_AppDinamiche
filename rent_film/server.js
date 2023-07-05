const jwt = require('jsonwebtoken');

const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./schema'); // Import GraphQL schema
const { configureDB, SECRET } = require('./db'); // Import database

async function startServer() {
  
  // Initialize Express app
  const app = express();

  const checkUser = async (req, res) => {
    const token = req.headers["authorization"] || ""
    console.log(token)
  
    try{
      const {user} = await jwt.verify(token, SECRET);
      req.user = user
    }catch(err){
      // console.log(err)
    }
    req.next();
  };
  
  app.use(checkUser);

  // Initialize Apollo server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    context: ({ req }) => ({
      db_rent,
      db_user,
      SECRET,
      user: req.user // Imposta l'utente nel contesto (opzionale)
    })
  });

  // Set up and connect to the databases
  const { db_rent, db_user } = await configureDB();
  
  // Starts Apollo server
  await server.start();

  // Integrates the Apollo server with Express
  server.applyMiddleware({ app });

  // Start the Node.js server
  const port = 3000;
  app.listen(port, () => {
    console.log(`Server started on port ${port}`);
  });
}

startServer();
