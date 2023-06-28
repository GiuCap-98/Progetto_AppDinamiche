const { gql } = require('apollo-server-express');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const SECRET_KEY = 'mysecretkey'; // Sostituisci con la tua chiave segreta

const generateToken = (userId) => {
  const payload = {
    userId: userId
  };

  const options = {
    expiresIn: '1h' // Imposta la durata di validità del token (es. 1 ora)
  };

  return jwt.sign(payload, SECRET_KEY, options);
};


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
    
  type User {
    customer_id: ID!
    first_name: String
    last_name: String
    email: String!
    password: String!
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
    film: [Film]
    payment: [Payment]
    rental:[Rental]
  }


  type Payment {
    payment_id: ID!
    customer_id: ID!
    rental_id: ID!
    amount: Float!
    payment_date: String
  }

  type Film_Category {
    film: [Film]
    category: [Category]
  }

  type StoreOccorrency{
    store: [Store]
    address: [Address]
    num_film: Float
  }




  type Query {
    customers: [Customer]
    films: [Film_Category]
    searchFilms(term: String!): [Film_Category]
    searchFilmsByCategory(category: String!): [Film_Category]
    categories: [Category]
    userById(customer_id: ID!): User 
    users: [User]
    stores(film_id: ID!): [StoreOccorrency]
    
    findUser(email: String!, password: String!): User
    findUserByEmailAndPassword(email: String!, password: String!): User
    findUserHash(email: String!, password: String!): User

    rentalsByCustomer(customerId: ID!): [Rental]
    returnNameCustomer(email:String!): Customer
  }



  type Mutation {
    registerUser(input: UserInput!): User
  }

  input UserInput {
    customer_id: ID!
    first_name: String!
    last_name: String!
    email: String!
    password: String!
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
        SELECT f.film_id, f.title, f.description, f.release_year, f.language_id, f.rental_duration, f.rental_rate, f.length, f.rating, f.last_update, cat.name AS name 
        FROM film f
        JOIN film_category f_cat ON f_cat.film_id = f.film_id
        LEFT JOIN category cat ON cat.category_id = f_cat.category_id
        `;
        const result = await db_rent.query(query);
        
        const films = result.rows.map(row => ({
          film: { film_id: row.film_id, title: row.title,description: row.description, release_year: row.release_year, language_id: row.language_id, 
            rental_duration: row.rental_duration, rental_rate: row.rental_rate, length: row.length, rating: row.rating, last_update: row.last_update  },
          category:{
            name: row.name
          }
        }));
        
        return films; 
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
        const films = result.rows.map(row => ({
          film: { film_id: row.film_id, title: row.title, description: row.description, release_year: row.release_year, language_id: row.language_id, rental_duration: row.rental_duration, rental_rate: row.rental_rate, length: row.length, rating: row.rating, last_update: row.last_update  },
          category:{
            name: row.name
          }
        }));
        
        return films; 
      } catch (error) {
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
        client.release();
        const films = result.rows.map(row => ({
          film: { film_id: row.film_id, title: row.title, description: row.description, release_year: row.release_year, language_id: row.language_id, rental_duration: row.rental_duration, rental_rate: row.rental_rate, length: row.length, rating: row.rating, last_update: row.last_update  },
          category:{
            name: row.name
          }
        }));
        
        return films; 
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
        const stores = result.rows.map(row => ({
          store: { store_id: row.store_id },
          address:{
            address: row.address
          },
          num_film: row.num_film
        }));
        
        return stores; 
      } catch (error) {
        console.error('Errore durante l\'esecuzione della query:', error);
        throw new Error('Errore del server');
      }
    },
    

    findUser: async (_, { email, password }, { db_user }) => {
      const query = `
        SELECT u.customer_id, u.first_name, u.last_name, u.email
        FROM user_app as u
        WHERE u.email = $1 AND u.password = $2;
      `;
      
      const result = await db_user.query(query, [email, password]);
      const user = result.rows[0];
      
      return user;
    },

    // Funzione per il login sicuro
    findUserHash: async (_, { email, password }, { db_user }) => {
       try{ 
        // Recupera l'hash della password memorizzato per l'utente dal tuo database
        const HashedPassword = `
            SELECT password FROM user_app 
            WHERE email=$1;
          `;

        //se l'utente esiste e mi trova l'hash della password
        if(HashedPassword){
          // Confronta l'hash memorizzato con la password inserita dall'utente
          const isPasswordMatched = await bcrypt.compare(password, HashedPassword);
          if (isPasswordMatched) {
            const query = `
            SELECT u.customer_id, u.first_name, u.last_name, u.email
            FROM user_app as u
            WHERE u.email = $1 AND u.password = $2;
            `;
            
            const result = await db_user.query(query, [email, HashedPassword]);
            const user = result.rows[0];
            
            return user;
          }
        }else{

        }
      }catch{
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
          rental: {rental_date: row.rental_date,
            return_date: row.return_date,
            rental_id: row.rental_id}
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
    registerUser: async (_, { input }, { db_user  }) => {
      try {
        const {
          customer_id, 
          first_name, 
          last_name,
          email,
          password
        } = input;
  
        // Effettua l'hashing della password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Inserisci i dati dell'utente nel database
        const query = `
        INSERT INTO user_app (customer_id, first_name, last_name, email, password)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING *;
        `;
        const resultInsertUser= await db_user.query(query, [customer_id, first_name, last_name, email, hashedPassword]);
        const registeredUser = resultInsertUser.rows[0];
        return registeredUser;
      } catch (error) {
        console.error('Errore durante l\'esecuzione della query:', error);
        throw new Error('Errore del server');
      }
    },
  }
  
};

module.exports = { typeDefs, resolvers };

