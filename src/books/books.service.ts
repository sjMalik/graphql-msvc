import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Book } from './schemas/book.schema';
import { BookModel } from './model/book.model';
import { BookConnection, BookEdge, FilterBookDto, PageInfo } from './graphql/book.graphql';
import { debug } from 'console';

@Injectable()
export class BookService {
  constructor(@InjectModel(Book.name) private bookModel: Model<BookModel>) {}

  async search(query: any, pageNumber: number, limit: number): Promise<BookConnection> {
    const parsedQuery = JSON.parse(query);
    const total = await this.bookModel.countDocuments(parsedQuery);
    const books = await this.bookModel
      .find(parsedQuery)
      .skip((pageNumber - 1) * limit)
      .limit(limit)
      .exec();

    const pageInfo: PageInfo = {
      current: pageNumber,
      size: limit,
      total: total,
    };

    const edges: BookEdge[] = books.map((book) => ({
      cursor: book._id.toString(),  // Convert ObjectId to string
      node: {
        ...book.toObject(),  // Convert Mongoose Document to plain JS object
        _id: book._id.toString(),  // Convert ObjectId to string
      } as Book,
    }));

    return { page: pageInfo, edges: edges };
  }

  async findAll(filterBookDto: FilterBookDto): Promise<Book[]> {
    // debug(filterBookDto)
    const filters = {};

    // Construct filters dynamically
    if (filterBookDto?.title) {
      filters['title'] = filterBookDto.title;
    }
    if (filterBookDto?.author) {
      console.log(filterBookDto?.author)
      filters['author'] = filterBookDto.author ? filterBookDto.author['author']: filterBookDto.author;
    }
    if (filterBookDto?.year) {
      filters['year'] = filterBookDto.year;
    }

    // debug(filters)

    return this.bookModel.find(filters).exec();
  }

  // async findOne(id: string): Promise<Book> {
  //   return this.bookModel.findById(id).exec();
  // }

  async findCount(query): Promise<number> {
    return this.bookModel.countDocuments(query);
  }

  async findByPage(skip, limit, query): Promise<Book[]> {
    const result = await this.bookModel
      .find(query)
      .skip(skip)
      .limit(limit)
      .exec();
    return result.map((item) => item.toJSON() as Book);
  }

  //   async create(createBookDto: CreateBookDto): Promise<Book> {
  //     const createdBook = new this.bookModel(createBookDto);
  //     return createdBook.save();
  //   }

  //   async update(id: string, updateBookDto: UpdateBookDto): Promise<Book> {
  //     return this.bookModel.findByIdAndUpdate(id, updateBookDto, { new: true }).exec();
  //   }

  //   async delete(id: string): Promise<Book> {
  //     return this.bookModel.findByIdAndRemove(id).exec();
  //   }
}
