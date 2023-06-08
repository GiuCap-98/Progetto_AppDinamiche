const { gql } = require('apollo-server-express');

// Define GraphQL schema
const typeDefs = gql`
  type Customer {
    create_date: String
    last_update: String
    customer_id: ID!
    address_id: ID!
    activebool: Boolean
    first_name: String
    last_name: String
    email: String
  }

  type Film {
    film_id: ID!
    title: String!
    description: String
    release_year: Int
    language_id: Int
    rental_duration: Int
    rental_rate: Float
    length: Int
    replacement_cost: Float
    rating: String
    special_features: [String]
    fulltext: String
    last_update: String
  }

  type Category {
    category_id: ID!
    name: String!
    last_update: String
  }
    
  type User {
    customer_id: ID!
    first_name: String
    last_name: String
    email: String
    password: String
  }

  type Store{
    store_id: ID!
    address: String
    num_film: Int
  }

  type Query {
    customers: [Customer]
    films: [Film]
    filmById(film_id: ID!): Film
    searchFilms(term: String!): [Film]
    searchFilmsByCategory(category: String!): [Film]
    categories: [Category]
    userById(customer_id: ID!): User 
    users: [User]
    stores(film_id: ID!): [Store]

  }
`;

// Resolvers GraphQL query
const resolvers = {
  Query: {
    customers: async (_, __, { db_rent }) => {
      try {
        const result = await db_rent.query('SELECT * FROM customer');
        return result.rows;
      } catch (error) {
        console.error('Errore durante l\'esecuzione della query:', error);
        throw new Error('Errore del server');
      }
    },
    films: async (_, __, { db_rent }) => {
      try {
        const result = await db_rent.query('SELECT * FROM film');
        return result.rows;
      } catch (error) {
        console.error('Errore durante l\'esecuzione della query:', error);
        throw new Error('Errore del server');
      }
    },

    users: async (_, __, { db_user }) => {
      try {
        const result = await db_user.query('SELECT * FROM user_app');
        return result.rows;
      } catch (error) {
        console.error('Errore durante l\'esecuzione della query:', error);
        throw new Error('Errore del server');
      }
    },

    filmById: async (_, { film_id }, { db_rent }) => {
      try {
        const result = await db_rent.query('SELECT * FROM film WHERE film_id = $1', [film_id]);
        return result.rows[0];
      } catch (error) {
        console.error('Errore durante l\'esecuzione della query:', error);
        throw new Error('Errore del server');
      }
    },
    searchFilms: async (_, { term }, { db_rent }) => {
      try {
        const query = `
          SELECT *
          FROM film
          WHERE title ILIKE '%' || $1 || '%'
        `;
        const result = await db_rent.query(query, [term]);
        return result.rows;
      } catch (error) {
        console.error('Errore durante l\'esecuzione della query:', error);
        throw new Error('Errore del server');
      }
    },
    searchFilmsByCategory: async (_, { category }, { db_rent }) => {
      try {
        const client = await db_rent.connect();
        const query = `
          SELECT film.*
          FROM film
          JOIN film_category ON film.film_id = film_category.film_id
          JOIN category ON film_category.category_id = category.category_id
          WHERE category.name ILIKE '%' || $1 || '%'
        `;
        const result = await client.query(query, [category]);
        client.release();
        return result.rows;
      } catch (error) {
        console.error('Errore durante l\'esecuzione della query:', error);
        throw new Error('Errore del server');
      }
    },
    userById: async (_, { customer_id }, { db_user }) => {
      try {
        
        const result = await db_user.query('SELECT * FROM user_app WHERE customer_id = $1', [customer_id]);
        return result.rows[0];
      } catch (error) {
        console.error('Errore durante l\'esecuzione della query:', error);
        throw new Error('Errore del server');
      }
    },
    categories: async (_, __, { db_rent }) => {
      try {
        const client = await db_rent.connect();
        const result = await client.query('SELECT name FROM category');
        client.release();
        return result.rows;
      } catch (error) {
        console.error('Errore durante l\'esecuzione della query:', error);
        throw new Error('Errore del server');
      }
    },
    stores: async (_, { film_id }, { db_rent }) => {
      try {
        const query = `
        SELECT addr.address, s.store_id, COALESCE(COUNT(i.film_id), 0) AS num_film
        FROM store s
        JOIN address addr ON s.address_id = addr.address_id
        LEFT JOIN inventory i ON s.store_id = i.store_id AND i.film_id = $1
        LEFT JOIN rental r ON i.inventory_id = r.inventory_id AND r.return_date IS NULL
        WHERE r.inventory_id IS NULL
        GROUP BY addr.address, s.store_id;
        `;
        const result = await db_rent.query(query, [film_id]);
        return result.rows;
      } catch (error) {
        console.error('Errore durante l\'esecuzione della query:', error);
        throw new Error('Errore del server');
      }
    }
    
  },
};

module.exports = { typeDefs, resolvers };