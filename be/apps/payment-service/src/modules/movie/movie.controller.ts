import { Controller, Get, Post, Put, Delete, Param, Body, Query } from '@nestjs/common';
import { MovieService } from './movie.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { CreateMovieDto } from './dto/create-movie.dto';
import { UpdateMovieDto } from './dto/update-movie.dto';
import { Public } from '@app/common';

@ApiTags('Movies')
@Controller('movies')
export class MovieController {
  constructor(private readonly movieService: MovieService) {}

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
}
