const { gql } = require('apollo-server-express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

// Define GraphQL schema
const typeDefs = gql`

  type Customer {
    customer_id: ID!
    store_id: ID
    first_name: String
    last_name: String
    email: String
    address_id: ID
    activebool: Boolean
    create_date: String
    last_update: String
    active: Boolean    
  }

  type Film {
    film_id: ID!
    title: String
    description: String
    release_year: Int
    language_id: Int
    rental_duration: Int
    rental_rate: Float
    length: Int
    replacement_cost: Float
    rating: String
    last_update: String
    special_features: String
    fulltext: String
  }

  type Category {
    category_id: ID!
    name: String
    last_update: String
  }

  type Address {
    address_id: ID!
    address: String
    address2: String
    district: String
    city_id: ID
    postal_code: Int
    phone: Int
    last_update: String
  }
    
  type Store{
    store_id: ID!
    manager_staff_id: ID
    address_id: ID
    last_update: String
  }


  type Rental {
    rental_id: ID!
    rental_date: Float
    inventory_id: ID!
    customer_id: ID!
    return_date: Float
    staff_id: ID
    last_update: String
    
  }

  
  type Rental_FilmPaymant {
    film: Film
    payment: Payment
    rental:Rental
  }


  type Payment {
    payment_id: ID!
    customer_id: ID!
    rental_id: ID!
    amount: Float!
    payment_date: String
  }

  type Film_Category {
    film: Film
    category: Category
  }

  type StoreOccorrency{
    store: Store
    address: Address
    num_film: Float
  }

  type User {
    customer_id: ID!
    first_name: String
    last_name: String
    email: String!
    password: String!
  }

  type Query {
    customers: [Customer]
    films: [Film_Category]
    searchFilms(term: String!): [Film_Category]
    searchFilmsByCategory(category: String!): [Film_Category]
    categories: [Category]
    stores(film_id: ID!): [StoreOccorrency]
    rentalsByCustomer(customerId: ID!): [Rental_FilmPaymant]
    returnNameCustomer(email:String!): Customer
  }

  type Mutation {
    register(customer_id: ID!, first_name: String!, last_name: String!, email: String!, password: String!): User
    login(email: String!, password: String!): String!
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
        const query = `
        SELECT f.film_id, f.title, f.description, f.release_year, f.language_id, f.rental_duration, f.rental_rate, f.length, f.rating, f.last_update, cat.name
        FROM film f
        JOIN film_category f_cat ON f_cat.film_id = f.film_id
        LEFT JOIN category cat ON cat.category_id = f_cat.category_id
        `;
        
        const result = await db_rent.query(query);

        const film_obj = result.rows.map(row => ({
          film: { 
            film_id: row.film_id,
            title: row.title,
            description: row.description,
            release_year: row.release_year,
            language_id: row.language_id,
            rental_duration: row.rental_duration,
            rental_rate: row.rental_rate,
            length: row.length,
            rating: row.rating,
            last_update: row.last_update
          },
          category: { name: row.name }
        }));

        return film_obj; 
      } 
      
      catch (error) {
        console.error('Errore durante l\'esecuzione della query:', error);
        throw new Error('Errore del server');
      }
    },

    searchFilms: async (_, { term }, { db_rent }) => {
      try {
        const query = `
        SELECT f.film_id, f.title, f.description, f.release_year, f.language_id, f.rental_duration, f.rental_rate, f.length, f.rating, f.last_update, cat.name AS category 
        FROM film f
        JOIN film_category f_cat ON f_cat.film_id = f.film_id
        LEFT JOIN category cat ON cat.category_id = f_cat.category_id
        WHERE f.title ILIKE '%' || $1 || '%'
        `;
        const result = await db_rent.query(query, [term]);    
        return result.rows; 

      } 
      
      catch (error) {
        console.error('Errore durante l\'esecuzione della query:', error);
        throw new Error('Errore del server');
      }
    },

    searchFilmsByCategory: async (_, { category }, { db_rent }) => {
      try {
        const client = await db_rent.connect();
        const query = `
        SELECT f.film_id, f.title, f.description, f.release_year, f.language_id, f.rental_duration, f.rental_rate, f.length, f.rating, f.last_update, cat.name AS category 
        FROM film f
        JOIN film_category f_cat ON f_cat.film_id = f.film_id
        LEFT JOIN category cat ON cat.category_id = f_cat.category_id
        WHERE cat.name= $1
        `;
        const result = await client.query(query, [category]);    
        return result.rows; 

      } 
      
      catch (error) {
        console.error('Errore durante l\'esecuzione della query:', error);
        throw new Error('Errore del server');
      }
    },

    categories: async (_, __, { db_rent }) => {
      try {
        const client = await db_rent.connect();
        const result = await client.query('SELECT name FROM category');
        return result.rows;
      } 
      
      catch (error) {
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
        
      } 
      
      catch (error) {
        console.error('Errore durante l\'esecuzione della query:', error);
        throw new Error('Errore del server');
      }
    },
    
    rentalsByCustomer: async (_, { customerId }, { db_rent }) => {
      try{
        const query = `
          SELECT f.title, p.amount, r.return_date, r.rental_date, r.rental_id
          FROM film f
          JOIN inventory i ON f.film_id = i.film_id
          JOIN rental r ON i.inventory_id = r.inventory_id
          JOIN payment p ON r.rental_id = p.rental_id
          WHERE r.customer_id = $1;
        `;
        const result = await db_rent.query(query, [customerId]);
        
        const rentals = result.rows.map(row => ({
          film: { title: row.title },
          payment: { amount: row.amount },
          rental: {
            rental_date: row.rental_date,
            return_date: row.return_date,
            rental_id: row.rental_id
          }
          
        }));
        
        return rentals; 
      }catch{
        console.error('Errore durante l\'esecuzione della query:', error);
        throw new Error('Errore del server');
      }     
    },

    returnNameCustomer : async (_, { email }, { db_rent }) => {
      try{

            // Genera il nuovo valore per customer_id
            const queryGetCustomerId = `
            SELECT c.customer_id, c.first_name, c.last_name FROM customer as c WHERE c.email=$1;
          `;
          const result = await db_rent.query(queryGetCustomerId,[email]);
          
          const user = result.rows[0];
            
          return user;


      }catch{

        console.error('Errore durante l\'esecuzione della query:', error);
        throw new Error('Errore del server');
      }
    }
     
  },

  Mutation: {
    register: async (_, { customer_id, first_name, last_name, email, password }, { db_user }) => {
      try {
        // Verifica se l'utente esiste già nel database
        const queryCheckUser = `
          SELECT email FROM user_app WHERE email = $1;
        `;
        const existingUser = await db_user.query(queryCheckUser, [email]);
  
        if (existingUser.rows.length > 0) {
          throw new Error('Utente già registrato con questa email');
        }
  
        // Genera l'hash della password
        const hashedPassword = await bcrypt.hash(password, 12);
  
        // Inserisci l'utente nel database
        const queryInsertUser = `
          INSERT INTO user_app (customer_id, first_name, last_name, email, password)
          VALUES ($1, $2, $3, $4, $5)
          RETURNING *;
        `;
        const result = await db_user.query(queryInsertUser, [customer_id, first_name, last_name, email, hashedPassword]);
        const newUser = result.rows[0];
  
        return newUser;
      } catch (error) {
        console.error('Errore durante l\'esecuzione della query:', error);
        throw new Error('Errore del server');
      }
    },

    login: async (_, { email, password }, { db_user, SECRET }) => {
      try {
        // Check if the user exists in the database
        const queryCheckUser = `
          SELECT customer_id, email, password FROM user_app WHERE email = $1;
        `;
        const result = await db_user.query(queryCheckUser, [email]);
        const user = result.rows[0];
  
        if (!user) {
          throw new Error('Email non valida');
        }
  
        // Verify the password
        const isPasswordMatched = await bcrypt.compare(password, user.password);
        if (!isPasswordMatched) {
          throw new Error('Password non valida');
        }
  
        // Generate a JWT token
        const token = jwt.sign({ email: user.email, customer_id: user.customer_id }, SECRET, { expiresIn: '1d' });
  
        return token;
      } catch (error) {
        console.error('Errore durante l\'esecuzione della query:', error);
        throw new Error('Errore del server');
      }
    }
  }

};

module.exports = { typeDefs, resolvers };

