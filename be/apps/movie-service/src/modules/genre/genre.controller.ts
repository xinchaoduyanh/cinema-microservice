import { Controller, Get, Param } from '@nestjs/common';
import { GenreService } from './genre.service';
import { ApiTags, ApiOperation } from '@nestjs/swagger';
import { Public } from '@app/common';

@ApiTags('Genres')
@Controller('genres')
export class GenreController {
  constructor(private readonly genreService: GenreService) {}

  @Public()
  @Get()
  @ApiOperation({ summary: 'Get all genres' })
  async findAll() {
    return this.genreService.findAll();
  }

  @Public()
  @Get(':id')
  @ApiOperation({ summary: 'Get genre by ID' })
  async findOne(@Param('id') id: string) {
    return this.genreService.findOne(id);
  }
}
