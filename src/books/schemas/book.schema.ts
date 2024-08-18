import { ObjectType, Field, Int } from '@nestjs/graphql';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { Document } from 'mongoose';

export type BookDocument = Book & Document;

@Schema()
@ObjectType() // Decorate with @ObjectType() to make it a GraphQL type
export class Book {
  @Prop()
  @Field(() => String) // Decorate with @Field() to expose it in the GraphQL schema
  title: string;

  @Prop()
  @Field(() => String) // Decorate with @Field() to expose it in the GraphQL schema
  author: string;

  @Prop()
  @Field(() => Int) // Specify the type for numerical fields
  year: number;
}

export const BookSchema = SchemaFactory.createForClass(Book);
