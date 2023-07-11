const { ApolloServer } = require('apollo-server');
const { typeDefs, resolvers } = require('./schema');
const { SECRET } = require('./db'); // Import database
const jwt = require('jsonwebtoken')

url = 'http://localhost:4000';
const server = new ApolloServer({ 
    
    typeDefs, 
    resolvers, 
    context: async({req}) => {

        let token = req.headers.authorization ?? ''; // Ottieni il token dalle intestazioni della richiesta
        let customer_id = null;
        if (token) {
            try {
                const decoded  = jwt.verify(token, SECRET);
                return {
                    customer_id: decoded.customer_id
                }
            } catch (e) {}
        } 
        return {
            customer_id: customer_id
        }
    }
});

server.listen().then(({url}) => {
    console.log(`🚀  Server ready at ${url}`)
})