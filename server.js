const express = require('express')
const expressGraphQL = require('express-graphql').graphqlHTTP;
const {
    GraphQLSchema,
    GraphQLObjectType,
    GraphQLString,
    GraphQLList,
    GraphQLInt,
    GraphQLNonNull
} = require('graphql');
const { resolve } = require('path');

const app = express()

const authors = [
    { id: 9876, name: "JK Rowling" },
    { id: 5432, name: "Harper Lee" },
    { id: 1234, name: "F. Scott Fitzgerald" },
    { id: 7890, name: "George Orwell" },
    { id: 2468, name: "Jane Austen" },
    { id: 1357, name: "J.R.R. Tolkien" },
    { id: 8023, name: "J.D. Salinger" },
    { id: 5555, name: "Mark Twain" },
    { id: 9870, name: "C.S. Lewis" },
    { id: 1111, name: "George Orwell" },
    { id: 2222, name: "Aldous Huxley" },
    { id: 3333, name: "J.R.R. Tolkien" },
    { id: 4444, name: "Dan Brown" },
    { id: 5555, name: "Paulo Coelho" },
    { id: 6666, name: "Ray Bradbury" },
    { id: 7777, name: "Suzanne Collins" },
    { id: 8888, name: "Stieg Larsson" },
    { id: 9999, name: "J.D. Salinger" },
    { id: 4444, name: "Harper Lee" },
    { id: 5555, name: "J.R.R. Tolkien" }
];

const books = [
    { id: 1, name: "Harry Potter", authorId: 9876 },
    { id: 2, name: "To Kill a Mockingbird", authorId: 5432 },
    { id: 3, name: "The Great Gatsby", authorId: 1234 },
    { id: 4, name: "1984", authorId: 7890 },
    { id: 5, name: "Pride and Prejudice", authorId: 2468 },
    { id: 6, name: "The Lord of the Rings", authorId: 1357 },
    { id: 7, name: "The Catcher in the Rye", authorId: 8023 },
    { id: 8, name: "To Kill a Mockingbird", authorId: 5555 },
    { id: 9, name: "The Chronicles of Narnia", authorId: 9870 },
    { id: 10, name: "Animal Farm", authorId: 1111 },
    { id: 11, name: "Book Eleven", authorId: 2222 },
    { id: 12, name: "Book Twelve", authorId: 3333 },
    { id: 13, name: "Book Thirteen", authorId: 4444 },
    { id: 14, name: "Book Fourteen", authorId: 5555 },
    { id: 15, name: "Book Fifteen", authorId: 6666 },
    { id: 16, name: "Book Sixteen", authorId: 7777 },
    { id: 17, name: "Book Seventeen", authorId: 8888 },
    { id: 18, name: "Book Eighteen", authorId: 9999 },
    { id: 19, name: "Book Nineteen", authorId: 4444 },
    { id: 20, name: "Book Twenty", authorId: 5555 }
];

const BookType = new GraphQLObjectType(
    {
        name: 'Book',
        description: "This is the book written by an author",
        fields: () => ({
            id: { type: GraphQLNonNull(GraphQLInt) }
            ,
            name: { type: GraphQLNonNull(GraphQLString) },
            authorId: { type: GraphQLNonNull(GraphQLInt) },
            author: {
                type: AuthorType,
                resolve: (book) => {
                    return authors.find(author => author.id === book.authorId)
                }
            }
        })
    }
)

const AuthorType = new GraphQLObjectType(
    {
        name: 'Author',
        description: "THis represents the author of a book.",
        fields: () => ({
            id: { type: GraphQLNonNull(GraphQLInt) },
            name: { type: GraphQLNonNull(GraphQLString) },
            books: {
                type: new GraphQLList(BookType),
                resolve: (author) => {
                    return books.filter(book => book.authorId === author.id)
                }
            }
        })
    }
)

const RootQueryType = new GraphQLObjectType({
    name: 'Query',
    description: 'Root Query',
    fields: () => ({

        book: {
            type: BookType,
            description: "A single book",
            args: {
                id: { type: GraphQLInt }
            },
            resolve: (parent, args) => books.find(book => book.id === args.id)
        },
        books: {
            type: new GraphQLList(BookType), //define booktype later 
            description: "The list of books",
            resolve: () => books
        },

        authors: {
            type: new GraphQLList(AuthorType),
            description: "List of all authors",
            resolve: () => authors
        }
    })
})

const RootMutationType = new GraphQLObjectType(
    {
        name: 'Mutation',
        description: 'Root Mutation',
        fields: () => ({
            addBook: {
                type: BookType,
                description: "Add a book",
                args: {
                    name: { type: GraphQLNonNull(GraphQLString) },
                    authorId: { type: GraphQLNonNull(GraphQLInt) },
                },
                resolve: (parent, args) => {
                    const book = { id: books.length + 1, name: args.name, authorId: args.authorId }

                    books.push(book)
                    return book
                }
            }
        })
    }
)

const schema = new GraphQLSchema({
    query: RootQueryType,
    mutation: RootMutationType
})

app.use('/graphql', expressGraphQL({
    schema: schema,
    graphiql: true,
}))

app.listen(5000, () => console.log("Server Running..."))

// const schema = new GraphQLSchema({
//     query: new GraphQLObjectType(
//         {
//             name: 'HelloWorld',
//             fields: () => ({
//                 message: {
//                     type: GraphQLString,
//                     resolve: () => "Hello World"
//                 }
//             })
//         }
//     )
// })