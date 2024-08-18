import { Field, ObjectType, ID, Int } from '@nestjs/graphql';

@ObjectType()
export class PageInfo {
  @Field(() => Int)
  current: number;

  @Field(() => Int)
  size: number;

  @Field(() => Int)
  total: number;
}

@ObjectType()
export class Book {
  @Field(() => ID)
  _id: string;

  @Field()
  title: string;

  @Field()
  author: string;

  @Field(() => Int)
  year: number;
}

@ObjectType()
export class BookEdge {
  @Field(() => ID)
  cursor: string;

  @Field(() => Book)
  node: Book;
}

@ObjectType()
export class BookConnection {
  @Field(() => PageInfo)
  page: PageInfo;

  @Field(() => [BookEdge])
  edges: BookEdge[];
}
