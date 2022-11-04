const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    _id: ID
    firstName: String
    lastName: String
    email: String
    orders: [Order]
    image: String
    password: String
  }

  type Order {
    _id: ID
    purchaseDate: String
    products: [Product]
  }

  type Variant {
    size: String
    color: String
    inventory: Int
    image: String
  }

  type Review {
    rating: Int
    body: String
  }

  type Product {
    _id: ID
    title: String
    description: String
    category: String
    price: Int
    compareAtPrice: Int
    vendor: String
    tags: [String]
    reviews: [Review]
    upc: Int
    variants: [Variant]
  }

  type Checkout {
    session: ID
  }

  type Auth {
    token: ID
    user: User
  }

  type Query {
    user: User
    products(name: String): [Product]
    product(_id: ID!): Product
    order(_id: ID!): Order
    checkout(products: [ID]!): Checkout
  }

  type Mutation {
    addUser(
      firstName: String!
      lastName: String!
      email: String!
      password: String!
    ): Auth
    addOrder(products: [ID]!): Order
    updateUser(
      firstName: String
      lastName: String
      email: String
      password: String
      image: String
    ): User
    login(email: String!, password: String!): Auth
  }
`;

module.exports = typeDefs;
