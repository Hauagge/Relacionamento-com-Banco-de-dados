import { Request, Response } from 'express';

import { container } from 'tsyringe';
import CreateProductService from '@modules/products/services/CreateProductService';

export default class ProductsController {
  public async create(request: Request, response: Response): Promise<Response> {
    try {
      const { name, price, quantity } = request.body;

      const creaProduct = container.resolve(CreateProductService);

      const newProduct = await creaProduct.execute({
        name,
        price,
        quantity,
      });

      return response.json(newProduct);
    } catch (err) {
      return response.status(400).json({ error: err.message });
    }
  }
}
