import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';

import { GetUserDecorator } from '../auth/decorator';
import { JwtGaurd } from '../auth/gaurd';
import { BookmarkService } from './bookmark.service';
import { CreateBookmarkDto, EditBookmarkDto } from './dto';

@UseGuards(JwtGaurd)
@Controller('bookmarks')
export class BookmarkController {
  constructor(private bookmarService: BookmarkService) {}

  @Get()
  getBookmarks(@GetUserDecorator('id') userId: number) {
    return this.bookmarService.getBookmarks(userId);
  }

  @Get(':id')
  getBookmarkById(
    @GetUserDecorator('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number, // Same on @Get annotation. Default is string but can be converted to number
  ) {
    return this.bookmarService.getBookmarkById(userId, bookmarkId);
  }

  @Post()
  createBookmark(
    @GetUserDecorator('id') userId: number,
    @Body() dto: CreateBookmarkDto,
  ) {
    return this.bookmarService.createBookmark(userId, dto);
  }

  @Patch(':id')
  editBookmarkById(
    @GetUserDecorator('id') userId: number,
    @Body() dto: EditBookmarkDto,
    @Param('id', ParseIntPipe) bookmarId: number, // Same on @Patch annotation. Default is string but can be converted to number
  ) {
    return this.bookmarService.editBookmarkById(userId, bookmarId, dto);
  }

  @HttpCode(HttpStatus.NO_CONTENT)
  @Delete(':id')
  deleteBookmarkById(
    @GetUserDecorator('id') userId: number,
    @Param('id', ParseIntPipe) bookmarkId: number, // Same on @Delete annotation. Default is string but can be converted to number
  ) {
    return this.bookmarService.deleteBookmarkById(userId, bookmarkId);
  }
}
