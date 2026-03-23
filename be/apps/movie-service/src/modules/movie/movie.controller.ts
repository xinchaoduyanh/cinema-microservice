import { FileValidationPipe, Public } from '@app/common';
import { UploadService } from '@app/core';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Query,
  UploadedFile,
  UseInterceptors,
} from '@nestjs/common';
import { MovieService } from './movie.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { ApiBody, ApiConsumes, ApiOperation, ApiQuery, ApiTags } from '@nestjs/swagger';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';

@ApiTags('Movies')
@Controller('movies')
export class MovieController {
  constructor(
    private readonly movieService: MovieService,
    private readonly uploadService: UploadService,
  ) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all movies' })
  async findAll(@Query() query: any) {
    return this.movieService.findAll(query);
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get movie by ID' })
  async findOne(@Param('id') id: string) {
    return this.movieService.findOne(id);
  }

  @Post()
  @ApiOperation({ summary: 'Create movie' })
  async create(@Body() dto: CreateMovieDto) {
    return this.movieService.create(dto);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Update movie' })
  async update(@Param('id') id: string, @Body() dto: UpdateMovieDto) {
    return this.movieService.update(id, dto);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete movie' })
  async remove(@Param('id') id: string) {
    return this.movieService.remove(id);
  }

  @Post('upload')
  @ApiOperation({ summary: 'Upload movie asset and return public URL' })
  @ApiConsumes('multipart/form-data')
  @ApiQuery({ name: 'folder', required: false, example: 'movies/posters' })
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        file: {
          type: 'string',
          format: 'binary',
        },
      },
      required: ['file'],
    },
  })
  @UseInterceptors(FileInterceptor('file'))
  async uploadMovieAsset(
    @UploadedFile(
      new FileValidationPipe({
        maxSize: 10 * 1024 * 1024,
        allowedTypes: ['image/jpeg', 'image/png', 'image/webp'],
      }),
    )
    file: Express.Multer.File,
    @Query('folder') folder?: string,
  ) {
    return this.uploadService.uploadFile(file, {
      folder: folder || 'movies',
      maxSizeBytes: 10 * 1024 * 1024,
      allowedMimeTypes: ['image/jpeg', 'image/png', 'image/webp'],
      metadata: {
        domain: 'movie',
      },
    });
  }
}
