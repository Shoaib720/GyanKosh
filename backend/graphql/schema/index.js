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

    type AuthData {
        _id: ID!
        name: String!
        role: String!
        email: String!
        token: String!
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
        isIssued: Boolean!
        issuedBy: ID!
        checkedOutBy: ID!
        coverImageUrl: String
    }

    input BookRecordInput {
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
        books: [Book!]!
        booksByAuthor(author: String!): [Book!]!
        booksBytitle(title: String!): [Book!]!
        booksByCategory(category: String!): [Book!]!
        booksByPublicationDate(date: String!): [Book!]!

        users: [User!]!
        usersByRole(role: String!): [User!]!

        racks: [Rack!]!

    }

    type RootMutation {
        addBook(bookInput: BookInput!): Book!
        updateBook(bookInput: BookInput!): Book!
        deleteBook(bookId: ID!): String!
        issueBook(bookId: ID!, customerId: ID!): String!
        returnBook(bookId: ID!, customerId: ID!): String!

        login(email: String!, password: String!): AuthData!
        signup(userInput: UserInput!): User!
        update(userInput: UserInput!): User!
        delete(userId: ID!): String!
    }

    schema {
        query: RootQuery
        mutation: RootMutation
    }

`);