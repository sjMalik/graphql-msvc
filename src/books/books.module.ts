import { Module } from '@nestjs/common';
import { BookService } from './books.service';
import { BooksResolver } from './books.resolver';
import { MongooseModule } from '@nestjs/mongoose';
import { Book, BookSchema } from './schemas/book.schema';
import { BookModel } from './model/book.model';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Book.name, schema: BookSchema }]),
    BookModel
  ],
  providers: [BookService, BooksResolver],
})
export class BooksModule {}
