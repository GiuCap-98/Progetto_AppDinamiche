const { ApolloServer } = require('apollo-server');
const express = require('express');
const { typeDefs, resolvers } = require('./schema');
const { SECRET } = require('./db'); // Import database

url = 'http://localhost:4000';
const server = new ApolloServer({ 
    
    typeDefs, 
    resolvers, 
    context: async({req}) => {

        const token = req.headers.authorization || ''; // Ottieni il token dalle intestazioni della richiesta
        let customer_id = 0;

        if (token) {

            try {
                console.log("verify token");
                const decoded  = jwt.verify(token, SECRET);
                customer_id = decoded.customer_id;
                console.log(customer_id);
            } catch (e) {}

        }

        return {
            customer_id: customer_id,
            SECRET
        }
    }
});

server.listen().then(({url}) => {
    console.log(`🚀  Server ready at ${url}`)
})