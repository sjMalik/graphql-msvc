import { Resolver, Query, Args } from '@nestjs/graphql';
import { BookService } from './books.service';
import { Book } from './schemas/book.schema';
import { BookConnection, FilterBookDto } from './graphql/book.graphql';
import { debug } from 'console';
// import { CreateBookDto } from './dto/create-book.dto';
// import { UpdateBookDto } from './dto/update-book.dto';

@Resolver()
export class BooksResolver {
  constructor(private bookService: BookService) {}

  @Query(() => BookConnection)
  async search(
    @Args('collection') collection: string,
    @Args('query') query: string,
    @Args('pageNumber') pageNumber: number,
    @Args('limit') limit: number,
  ) {
    if (collection !== 'Books') {
      throw new Error('Invalid collection name');
    }
    return this.bookService.search(query, pageNumber, limit);
  }

  // @Query(() => [Book])
  // async books(
  //   @Args('filterBookDto', { nullable: true }) filterBookDto: FilterBookDto
  //   // @Args('title', { nullable: true }) title: string,
  //   // @Args('author', { nullable: true }) author: string,
  //   // @Args('year', { nullable: true }) year: number,
  // ): Promise<Book[]> {
  //   // console.log(title);
  //   console.log('Author', filterBookDto);
  //   // const filterBookDto: FilterBookDto = { title: '', author };

  //   // debug('Resolver', filterBookDto);
  //   return this.bookService.findAll(filterBookDto);
  // }

  // @Query(() => SearchResult)
  // async search(@Args() searchInput: SearchInput): Promise<SearchResult> {
  //   debug('Resolver', searchInput)
  //   return this.bookHelper.findByPage(searchInput);
  // }

  // @Query(() => [Book])
  // async books(): Promise<Book[]> {
  //   return this.booksService.findAll();
  // }

  // @Query(() => Book)
  // async book(@Args('id') id: string): Promise<Book> {
  //   return this.booksService.findOne(id);
  // }

  //   @Mutation(() => Book)
  //   async createBook(@Args('createBookDto') createBookDto: CreateBookDto): Promise<Book> {
  //     return this.booksService.create(createBookDto);
  //   }

  //   @Mutation(() => Book)
  //   async updateBook(@Args('id') id: string, @Args('updateBookDto') updateBookDto: UpdateBookDto): Promise<Book> {
  //     return this.booksService.update(id, updateBookDto);
  //   }

  //   @Mutation(() => Book)
  //   async deleteBook(@Args('id') id: string): Promise<Book> {
  //     return this.booksService.delete(id);
  //   }
}
