import { Sequelize } from "sequelize-typescript";
import { v4 as uuid } from "uuid";
import Product from "../../../domain/product/entity/product";
import ProductModel from "../../../infrastructure/product/repository/sequelize/product.model";
import ProductRepository from "../../../infrastructure/product/repository/sequelize/product.repository";
import { UpdateProductUseCase } from "./update.product.usecase";

const product = new Product(uuid(), "Product 1", 10);

const input = {
  id: product.id,
  name: "Product 2",
  price: 15,
};

describe("Unit test for product update use case", () => {
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

  it("should update a product", async () => {
    const productRepository = new ProductRepository();
    const productUpdateUseCase = new UpdateProductUseCase(productRepository);
    await productRepository.create(product);

    const output = await productUpdateUseCase.execute(input);

    const row = await productRepository.find(product.id);

    expect(output).toEqual({
      id: row.id,
      name: row.name,
      price: row.price,
    });
  });
});
