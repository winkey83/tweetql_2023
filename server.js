import { ApolloServer, gql } from "apollo-server";

let tweets = [
    {
        id: "1",
        text: "first",
        userId: "2",
    },
    {
        id: "2",
        text: "second",
        userId: "1",
    }
]

let users = [
    {
        id: "1",
        firstName: "byeol",
        lastName: "eum",
    },
    {
        id: "2",
        firstName: "jihyun",
        lastName: "shin",
    }
]

const typeDefs = gql`
    type User {
        id:ID!
        firstName: String!
        lastName: String!
        fullName: String!
    }
    type Tweet {
        id:ID!
        text:String!
        author: User
    }
    type Query {
        allUsers: [User!]!
        allTweets:[Tweet!]!
        tweet(id: ID!): Tweet
    }
    type Mutation {
        postTweet(text:String!, userId:ID!): Tweet!
        deleteTweet(id:ID!): Boolean!
    }
`

const resolvers = {
    User: {
        fullName({ firstName, lastName }) {
            return `${lastName} ${firstName}`;
        }
    },
    Tweet: {
        author({ userId }) {
            return users.find(u => u.id == userId);
        }
    },
    Query: {
        allTweets() {
            return tweets;
        },
        allUsers() {
            return users;
        },
        tweet(root, { id }) {
            return tweets.find((t) => t.id == id);
        },
    },
    Mutation: {
        postTweet(root, { text, userId }) {
            const newTweet = {
                id: tweets.length + 1,
                text,
            }
            tweets.push(newTweet);
            return newTweet;
        },
        deleteTweet(root, { id }) {
            const tweet = tweets.find(t => t.id == id);
            if (!tweet) {
                return false;
            } else {
                tweets = tweets.filter(t => t.id !== id);
                return true;
            }
        }
    }
}


const server = new ApolloServer({ typeDefs, resolvers })

server.listen().then(({ url }) => {
    console.log(`Running on ${url}`)
})