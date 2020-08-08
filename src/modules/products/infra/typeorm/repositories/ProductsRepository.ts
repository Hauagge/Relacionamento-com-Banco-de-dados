import { getRepository, Repository, In } from 'typeorm';

import IProductsRepository from '@modules/products/repositories/IProductsRepository';
import ICreateProductDTO from '@modules/products/dtos/ICreateProductDTO';
import IUpdateProductsQuantityDTO from '@modules/products/dtos/IUpdateProductsQuantityDTO';
import AppError from '@shared/errors/AppError';
import Product from '../entities/Product';

interface IFindProducts {
  id: string;
}

class ProductsRepository implements IProductsRepository {
  private ormRepository: Repository<Product>;

  constructor() {
    this.ormRepository = getRepository(Product);
  }

  public async create({
    name,
    price,
    quantity,
  }: ICreateProductDTO): Promise<Product> {
    const product = this.ormRepository.create({
      name,
      price,
      quantity,
    });

    await this.ormRepository.save(product);

    return product;
  }

  public async findByName(name: string): Promise<Product | undefined> {
    const findProduct = await this.ormRepository.findOne({ where: { name } });

    return findProduct;
  }

  public async findAllById(products: IFindProducts[]): Promise<Product[]> {
    const ids = products.map(product => product.id);
    const listProducts = await this.ormRepository.find({
      where: {
        id: In(ids),
      },
    });

    if (ids.length !== listProducts.length) {
      throw new AppError('One or mor product are not available');
    }
    // console.log(listProducts);
    return listProducts;
  }

  public async updateQuantity(
    products: IUpdateProductsQuantityDTO[],
  ): Promise<Product[]> {
    const findProduct = await this.findAllById(products);

    const newProducts = findProduct.map(product => {
      const productExist = products.find(
        existProduct => product.id === existProduct.id,
      );

      if (!productExist) {
        throw new AppError('One or mor product are not available');
      }

      if (product.quantity < productExist.quantity) {
        throw new AppError('Quantity insufficient');
      }

      const productToUpdate = product;

      productToUpdate.quantity -= Number(productExist.quantity);

      return productToUpdate;
    });

    await this.ormRepository.save(newProducts);

    return newProducts;
  }
}

export default ProductsRepository;
