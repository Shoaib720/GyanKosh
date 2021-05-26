const { buildSchema } = require('graphql');

module.exports = buildSchema(`

    type User {
        _id: ID!
        name: String!
        role: String!
        email: String!
        password: String!
        card: Card
        createdAt: String!
        updatedAt: String!
    }

    type Card {
        _id: ID!
        cardHolder: User!
        bookRecord: BookRecord!
        createdAt: String!
        updatedAt: String!
    }

    type Rack {
        _id: ID!
        rackNumber: Int!
        category: String!
    }

    type Book {
        _id: ID!
        title: String!
        authors: [String]!
        category: String!
        publicationDate: String!
        rack: Rack!
        isIssued: Boolean!
        issuedBy: User
        checkedOutBy: User
        coverImageUrl: String!
        createdAt: String!
        updatedAt: String!
    }

    type BookRecord {
        _id: ID!
        book: Book!
        title: String!
        issuedOn: String!
        dueOn: String!
        createdAt: String!
        updatedAt: String!
    }

    type Fine {
        _id: ID!
        customer: User!
        book: Book!
        daysOverDue: Int!
        totalFine: Int!
        createdAt: String!
        updatedAt: String!
    }

    input UserInput {
        name: String!
        role: String!
        email: String!
        password: String!
        card: ID
    }

    input CardInput {
        cardHolder: ID!
        bookRecord: ID!
    }

    input RackInput {
        rackNumber: Int!
        category: String!
    }

    input BookInput{
        title: String!
        authors: [String]!
        category: String!
        publicationDate: String!
        rack: ID!
        isIssued: Boolean
        issuedBy: User
        checkedOutBy: User
        coverImageUrl: String
    }

    input BookRecord {
        book: ID!
        issuedOn: String!
        dueOn: String!
    }

    input FineInput {
        customer: ID!
        book: ID!
        daysOverDue: Int!
        totalFine: Float!
    }

    type RootQuery {
        fines: [Fine!]!
    }

    type RootMutation {

    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }

`);