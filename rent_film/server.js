const jwt = require('jsonwebtoken');

const express = require('express');
const { ApolloServer } = require('apollo-server-express');
const { typeDefs, resolvers } = require('./schema'); // Import GraphQL schema
const { configureDB, SECRET } = require('./db'); // Import database

async function startServer() {
  // Inizializza Apollo server
  const server = new ApolloServer({
    typeDefs,
    resolvers,
    // req rappresenta l'oggetto di richiesta HTTP
    context: ({ req }) => ({
      db_rent,
      db_user,
      SECRET,
      user: req.user // Imposta l'utente nel contesto
    })
  });

  // Initialize Express app
  const app = express();

  // Aggiungi questa funzione per verificare il token JWT
  const verifyToken = (token, secret) => {
    return new Promise((resolve, reject) => {
      jwt.verify(token, secret, (err, decoded) => {
        if (err) {
          reject(err);
        } else {
          resolve(decoded);
        }
      });
    });
  };

  // Modifica la funzione addUser per verificare il token e impostare l'utente nel campo req.user
  const addUser = async (req, res, next) => {
    const token = req.headers.authorization;
    try {
      if (token) {
        const decodedToken = await verifyToken(token, SECRET);
        req.user = decodedToken.user;
      }
    } catch (err) {
      console.log(err);
    }
    next();
  };

  app.use(addUser);

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
