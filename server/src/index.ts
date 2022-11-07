require('dotenv').config()

import 'reflect-metadata'
import express from 'express'
import {createConnection} from 'typeorm'
import { User } from './entities/user'
import { Post } from './entities/Post'
import { ApolloServer } from 'apollo-server-express'
import { buildSchema } from 'type-graphql'
import { HelloResovlver } from './resolvers/Hello'
import { ApolloServerPluginLandingPageGraphQLPlayground } from 'apollo-server-core'
import { UserResolver } from './resolvers/user'
import mongoose from 'mongoose'
import MongoStore from 'connect-mongo'
import session from 'express-session'
import { COOKIE_NAME, __prod__ } from './constants'
import { Context } from './types/Context'
import { PostResolver } from './resolvers/post'
import cors from 'cors';

const main = async () => {
    await createConnection({
        type: 'postgres',
        database: 'reddit',
        username: process.env.DB_USERNAME_DEV,
        password: process.env.DB_PASSWORD_DEV,
        logging: true,
        synchronize: true,
        entities:[User, Post]
    })
    const app = express()
    app.use(cors({
        origin: 'http://localhost:8080',
        credentials: true
    }))

    const mongoUrl =`mongodb+srv://${process.env.SESSION_DB_USERNAME_DEV}:${process.env.SESSION_DB_PASSWORD_DEV}@cluster0.ibtcjtr.mongodb.net/myFirstDatabase?retryWrites=true&w=majority`

    //session/cookie store
    await mongoose.connect(mongoUrl, {
		useCreateIndex: true,
		useNewUrlParser: true,
		useUnifiedTopology: true,
        useFindAndModify: false,
    })
    
    console.log('MongoDB connected')
    app.use(session({
        name: COOKIE_NAME,
        store: MongoStore.create({ mongoUrl: mongoUrl }),
        cookie: {
            maxAge: 1000 * 60 * 60, // one hour
            httpOnly: true, //Js frontend cannot access the cookie
            secure: __prod__, //cookie only works in https
            sameSite: 'lax', //protection against csrf
        },
        secret: process.env.SESSION_SECRET_DEV_PROD as string,
        saveUninitialized: false, // done't save empty sessions, right from start
        resave: false
    }))

    const apolloServer = new ApolloServer({
        schema: await buildSchema({ resolvers: [HelloResovlver, UserResolver, PostResolver], validate: false }),
        context:({req,res}):Context=>({req,res}),
        plugins:[ApolloServerPluginLandingPageGraphQLPlayground()]
    })

    await apolloServer.start()

    apolloServer.applyMiddleware({app,cors:false})
    
    const PORT = process.env.PORT || 4000
    app.listen(4000,()=>console.log(`Server started on port ${PORT}. GraphQl server started on localhost: ${PORT}${apolloServer.graphqlPath}`))
}
main().catch(err=>console.log(err))