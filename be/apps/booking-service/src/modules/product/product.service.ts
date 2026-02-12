import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Product } from '../../data-access/product/product.entity';
import { BaseRepository } from '../../data-access/base.repository';
import { CreateProductDto, UpdateProductDto } from './product.dto';

@Injectable()
export class ProductService {
  constructor(
    @InjectRepository(Product)
    private readonly productRepository: BaseRepository<Product>,
  ) {}

  async create(createProductDto: CreateProductDto) {
    const product = new Product(createProductDto);
    await this.productRepository.getEntityManager().persistAndFlush(product);
    return product;
  }

  async findAll() {
    return this.productRepository.find({ isActive: true });
  }

  async findOne(id: string) {
    return this.productRepository.findOneOrFail(id);
  }

  async update(id: string, updateProductDto: UpdateProductDto) {
    const product = await this.findOne(id);
    Object.assign(product, updateProductDto);
    await this.productRepository.getEntityManager().flush();
    return product;
  }

  async remove(id: string) {
    const product = await this.findOne(id);
    product.isActive = false;
    await this.productRepository.getEntityManager().flush();
    return { success: true };
  }
}
