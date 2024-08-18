import { Injectable, Scope } from '@nestjs/common';
import { BookService } from './books.service';

@Injectable({
  scope: Scope.REQUEST,
})
export class BookHelper {
  constructor(private readonly bookService: BookService) {}

  // async findByPage(searchInput): Promise<SearchResult> {
  //   debug(searchInput)
  //   if (!searchInput) throw new BadRequestException();
  //   try {
  //     const query = JSON.parse(searchInput.query);

  //     const totalCount = await this.bookService.findCount(query);
  //     const startCursor = (searchInput.page - 1) * searchInput.perPage;

  //     const results = await this.bookService.findByPage(
  //       startCursor,
  //       searchInput.page,
  //       query,
  //     );

  //     const items: PaginatedResult[] = results.map((item: Book) => ({
  //       cursor: item._id,
  //       item: item,
  //     }));
  //     const page = {
  //       current: searchInput.page ? parseInt(searchInput.page as string) : 1,
  //       size: items.length,
  //       total: totalCount,
  //     };
  //     return {
  //       page,
  //       items,
  //     };
  //   } catch (e) {}
  // }
}
