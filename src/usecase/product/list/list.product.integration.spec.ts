import { Sequelize } from "sequelize-typescript";
import { v4 as uuid } from "uuid";
import Product from "../../../domain/product/entity/product";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import ListProductUseCase from "./list.product.usecase";
describe("Integration test list product use case", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([ProductModel]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

  it("should list all products", async () => {
    const productRepository = new ProductRepository();
    const usecase = new ListProductUseCase(productRepository);

    const product1 = new Product(uuid(), "Product 1", 10);
    const product2 = new Product(uuid(), "Product 2", 15);

    await productRepository.create(product1);
    await productRepository.create(product2);

    const input = {};

    const output = {
      products: [
        {
          id: product1.id,
          name: "Product 1",
          price: 10,
        },
        {
          id: product2.id,
          name: "Product 2",
          price: 15,
        },
      ],
    };

    const result = await usecase.execute(input);

    expect(result).toEqual(output);
  });
});
