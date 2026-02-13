import { Seeder } from '@mikro-orm/seeder';
import { EntityManager } from '@mikro-orm/core';
import { Product } from '../../data-access/product/product.entity';

export class ProductSeeder extends Seeder {
  async run(em: EntityManager): Promise<void> {
    const productsData = [
      { name: "Sweet Popcorn (L)", category: "SNACK", price: 65000, description: "Large bucket of classic sweet popcorn", isActive: true },
      { name: "Salted Popcorn (L)", category: "SNACK", price: 65000, description: "Large bucket of classic salted popcorn", isActive: true },
      { name: "Coca Cola (M)", category: "DRINK", price: 35000, description: "Refreshing Coca Cola", isActive: true },
      { name: "Sprite (M)", category: "DRINK", price: 35000, description: "Refreshing Sprite", isActive: true },
      { name: "Hot Dog", category: "FOOD", price: 45000, description: "Grilled sausage in a bun", isActive: true },
      { name: "Nacho Cheese", category: "SNACK", price: 55000, description: "Crispy nachos with warm cheese dip", isActive: true }
    ];

    for (const pData of productsData) {
      const existing = await em.findOne(Product, { name: pData.name });
      if (!existing) {
        em.create(Product, pData);
      }
    }

    await em.flush();
  }
}
