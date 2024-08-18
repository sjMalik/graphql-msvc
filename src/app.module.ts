import { Logger, Module } from '@nestjs/common';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloDriver, ApolloDriverConfig } from '@nestjs/apollo';
import { join } from 'path';
import { BooksModule } from './books/books.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MongooseModule } from '@nestjs/mongoose';
import { FooResolver } from './foo.resolver';

@Module({
  imports: [
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
    }),
    BooksModule,
    GraphQLModule.forRoot<ApolloDriverConfig>({
      driver: ApolloDriver,
      autoSchemaFile: join(process.cwd(), 'src/schema.gql'),
    }),
  ],
  providers: [FooResolver],
})
export class AppModule {}
