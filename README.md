# Content

- [What is NestJS](#what-is-nestjs)
- [GraphQL](#graphql)

## What is NestJS

NestJS, a progressive Node.js framework for building efficient, reliable, and scalable server-side applications. NestJS leverages TypeScript and combines elements of OOP (Object-Oriented Programming), FP (Functional Programming), and FRP (Functional Reactive Programming).

## GraphQL

GraphQL is a query language for APIs and a server-side runtime for executing those queries by providing a complete and understandable description of the data in your API. It allows clients to request only the data they need, making APIs more efficient and flexible.

### Key Concepts

- **Schema:** Defines the types and relationships of your data. It serves as the contract between the client and the server.
- **Queries:** Requests for data. Clients specify what data they need in a query, and the server responds with exactly that data.
- **Mutations:** Requests for modifying data. Similar to queries but used to create, update, or delete data.
- **Resolvers:** Functions that resolve the data for each field in the schema. They connect your GraphQL schema to your data sources.

## Project Structure

```js
src
 |- main.ts                   // Entry point of the application, bootstraps the NestJS application
 |- app.module.ts             // Root module of the application, imports other modules and sets up GraphQL
 |- schema.gql                // Auto-generated GraphQL schema file
 |- book_collection           // Directory for book-related functionality
    |- graphql                // Directory for GraphQL related files
    |    |- book.graphql.ts   // GraphQL types, queries, and mutations for books
    |- model                  // Directory for model definitions
    |    |- book.model.ts     // Book model for the application
    |- schemas                // Directory for schema definitions
    |    |- book.schema.ts    // Schema for books, used for databases like MongoDB
    |- book.helper.ts         // Helper functions related to books
    |- book.module.ts         // Module for book-related functionality, imports, providers, and exports
    |- book.resolver.ts       // Resolver to handle GraphQL queries and mutations for books
    |- book.service.ts        // Service to handle business logic related to books
```

## Steps to generate Graphql MSVC

### Step 1

```sh
nest new graphql-msvc
```

### Step 2

```sh
npm i @apollo/server @nestjs/apollo @nestjs/graphql @nestjs/mongoose graphql mongoose
```

## @apollo/server NPM Package

@apollo/server is a package provided by Apollo that helps set up a GraphQL server. Apollo Server is an open-source, community-driven GraphQL server that allows you to quickly create a GraphQL API. It's built to work with many popular JavaScript frameworks and libraries.

### Key features

- **Schema Definition:** Easily define your GraphQL schema using the GraphQL schema language.
- **Resolvers:** Connect your GraphQL schema to your data with resolver functions.
- **Middleware:** Integrates with popular middleware libraries such as Express, Koa, and Hapi.

## @nestjs/apollo NPM Package

@nestjs/apollo is a package that integrates Apollo Server with NestJS

### Key features

- **Integration:** Seamlessly integrates Apollo Server into the NestJS ecosystem.
- **Decorators:** Uses decorators to define GraphQL schemas and resolvers, enhancing readability and maintainability.
- **Dependency Injection:** Leverages NestJS's powerful dependency injection system.
- **Modularity:** Encourages a modular architecture, making your codebase more organized and maintainable.

## @nestjs/graphql NPM Package

@nestjs/graphql is a package designed to integrate GraphQL into a NestJS application. It provides tools and decorators to make it easier to build GraphQL APIs using NestJS, a framework that combines elements of OOP, FP, and FRP for building efficient and scalable server-side applications.

### Features

- **Schema Definition:** Allows you to define your GraphQL schema using TypeScript classes and decorators.
- **Decorators:** Provides decorators like @Query(), @Mutation(), and @Resolver() to simplify schema and resolver definition.
- **Automatic Schema Generation:** Can automatically generate your GraphQL schema based on TypeScript classes and decorators.
- **Integration:** Works seamlessly with other NestJS features like dependency injection, middleware, and guards.

## In app.module.ts imports configuration for setting up GraphQL with NestJS

This code snippet is part of the configuration for setting up GraphQL with NestJS using the Apollo Driver. It is inside a NestJS module and is used to initialize and configure the GraphQL module

```js
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';

@Module({
  imports: [
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
  ],
})
```

### Purpose

The purpose of this configuration is to set up the GraphQL server using Apollo within a NestJS application. By specifying autoSchemaFile, it ensures that the GraphQL schema is automatically generated based on your GraphQL resolvers and types, simplifying the development process and ensuring that the schema is always up-to-date with your code.

## In app.module.ts imports configuring the ConfigModule and MongooseModule in a NestJS application to connect to a MongoDB database

### Purpose

The purpose of this configuration is to:

- Initialize the ConfigModule globally so that environment variables and configuration options can be accessed throughout the application.
- Configure the MongooseModule to connect to MongoDB asynchronously, leveraging environment variables for the connection string.
- Customize the MongoDB connection with logging for connection status and errors.
This setup ensures that the MongoDB connection can be easily managed and monitored, and it keeps the configuration flexible and secure by using environment variables.

```js
ConfigModule.forRoot({ isGlobal: true }),
MongooseModule.forRootAsync({
  imports: [ConfigModule],
  useFactory: async (configService: ConfigService) => ({
    uri: configService.get('MONGODB_URI'),
    connectionFactory: (connection) => {
      const mongoLogger = new Logger('MongoDB');
      connection.on('connected', () => {
        mongoLogger.debug('MongoDB Connected');
      });
      connection.on('error', (err) => {
        mongoLogger.error('MongoDB Connection Error', err);
      });

      connection._events.connected();
      return connection;
    },
  }),
  inject: [ConfigService],
})
```

### Create a .env file in Root directory

```sh
MONGODB_URI=
```

## Create Book Schema src/books/schemas/book.schema.ts

```js
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BookDocument = Book & Document;

@Schema()
export class Book {
  @Prop()
  title: string;

  @Prop()
  author: string;

  @Prop()
  year: number;
}

export const BookSchema = SchemaFactory.createForClass(Book);
```

## Configures Mongoose to work with a specific MongoDB collection in src/books/book.module.ts

```js
imports: [
  MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }]),
]
```

### Purpose

The purpose of this configuration is to:

- Register the Book model with Mongoose in the current module.
- Provide the schema definition for the Book model to ensure the correct structure of the documents in the MongoDB collection.

By including this configuration in a NestJS module, you enable the application to interact with the Book collection in MongoDB using the Mongoose model, allowing for CRUD (Create, Read, Update, Delete) operations and other database interactions.

## Defines the GraphQL type definitions for the Book entity src/books/graphql/book.graphql.ts

```js
import { Field, ObjectType, Int, ID } from '@nestjs/graphql';

@ObjectType()
export class Book {
  @Field()
  title: string;

  @Field()
  author: string;

  @Field(type => Int)
  year: number;
}
```

### Purpose

The purpose of this code is to define the structure of the Book object type in the GraphQL schema. This allows the Book type to be used in GraphQL queries and mutations, enabling clients to interact with Book objects.

### Example GraphQL Query

With this setup, you could define GraphQL queries like:

```js
{
  books {
    title
    author
    year
  }
}
```

This query would retrieve a list of books with their id, title, author, and year fields.

### Summary

- @ObjectType(): Marks the class as a GraphQL object type.
- @Field(type => ID): Defines the id field as a unique identifier.
- @Field(): Defines the title and author fields as standard string fields.
- @Field(type => Int): Defines the year field as an integer.

## Create a book service (src/books/books.service.ts)

```js
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book, BookDocument } from './schemas/book.schema';

@Injectable()
export class BooksService {
  constructor(@InjectModel(Book.name) private bookModel: Model<BookDocument>) {}

  async findAll(): Promise<Book[]> {
    return this.bookModel.find().exec();
  }

  async findOne(id: string): Promise<Book> {
    return this.bookModel.findById(id).exec();
  }

  async create(createBookDto: CreateBookDto): Promise<Book> {
    const createdBook = new this.bookModel(createBookDto);
    return createdBook.save();
  }

  async update(id: string, updateBookDto: UpdateBookDto): Promise<Book> {
    return this.bookModel.findByIdAndUpdate(id, updateBookDto, { new: true }).exec();
  }

  async delete(id: string): Promise<Book> {
    return this.bookModel.findByIdAndRemove(id).exec();
  }
}
```

### Purpose

The BooksService class provides a set of methods to interact with the Book collection in MongoDB. It allows for performing CRUD (Create, Read, Update, Delete) operations on the Book documents. By using Mongoose models and integrating them into a NestJS service, the code leverages the power of both frameworks to manage data efficiently.

### Summary

- @Injectable(): Marks the class as a NestJS service.
- constructor(@InjectModel(Book.name) private bookModel: Model<BookDocument>): Injects the Mongoose model for the Book schema.
- Methods: Provides CRUD operations (findAll, findOne, create, update, delete) to interact with the Book collection in MongoDB.

This setup encapsulates the database logic in a service, promoting a clean and modular code structure.

## Create a book resolver (src/books/books.resolver.ts)

```js
import { Resolver, Query, Mutation, Args } from '@nestjs/graphql';
import { BooksService } from './books.service';
import { Book } from './schemas/book.schema';
import { CreateBookDto } from './dto/create-book.dto';
import { UpdateBookDto } from './dto/update-book.dto';

@Resolver(() => Book)
export class BooksResolver {
  constructor(private booksService: BooksService) {}

  @Query(() => [Book])
  async books(): Promise<Book[]> {
    return this.booksService.findAll();
  }

  @Query(() => Book)
  async book(@Args('id') id: string): Promise<Book> {
    return this.booksService.findOne(id);
  }

  @Mutation(() => Book)
  async createBook(@Args('createBookDto') createBookDto: CreateBookDto): Promise<Book> {
    return this.booksService.create(createBookDto);
  }

  @Mutation(() => Book)
  async updateBook(@Args('id') id: string, @Args('updateBookDto') updateBookDto: UpdateBookDto): Promise<Book> {
    return this.booksService.update(id, updateBookDto);
  }

  @Mutation(() => Book)
  async deleteBook(@Args('id') id: string): Promise<Book> {
    return this.booksService.delete(id);
  }
}
```

### Purpose

The BooksResolver class provides a set of methods to handle GraphQL queries and mutations for the Book object type. It uses the BooksService to perform the actual database operations, thus separating the business logic from the GraphQL resolver logic.

### Summary

- @Resolver(() => Book): Marks the class as a GraphQL resolver for the Book object type.
- @Query(() => [Book]) books(): Defines a query to get all books.
- @Query(() => Book) book(@Args('id') id: string): Defines a query to get a book by ID.
- @Mutation(() => Book) createBook(@Args('createBookDto') createBookDto: CreateBookDto): Defines a mutation to create a new book.
- @Mutation(() => Book) updateBook(@Args('id') id: string, @Args('updateBookDto') updateBookDto: UpdateBookDto): Defines a mutation to update an existing book.
- @Mutation(() => Book) deleteBook(@Args('id') id: string): Defines a mutation to delete a book.
  
This setup ensures that the BooksResolver class handles all GraphQL operations related to the Book object, providing a clean and organized way to manage the GraphQL API.

## Create Book module, service and resolver

```sh
nest g module books
nest g service books
nest g resolver books
```

##
