import { Request, Response } from 'express';

import CreateCustomerService from '@modules/customers/services/CreateCustomerService';

import { container } from 'tsyringe';

import Customer from '@modules/customers/infra/typeorm/entities/Customer';

export default class CustomersController {
  public async create(request: Request, response: Response): Promise<Response> {
    try {
      const { name, email } = request.body;

      const createUser = container.resolve(CreateCustomerService);

      const customer = await createUser.execute({
        name,
        email,
      });

      return response.json(customer);
    } catch (err) {
      return response.status(400).json({ error: err.message });
    }
  }
}
