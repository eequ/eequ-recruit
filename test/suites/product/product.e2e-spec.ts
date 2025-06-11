import { INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { EntityTestService } from '../../services/entity/entity-test.service';
import { TestDatabaseService } from '../../services/test-database.service';
import { getMainModule } from '../../app';
import supertest from 'supertest';
import { ProductDto } from '../../../src/main/dtos/product.dto';
import { ProductRequest } from '../../../src/main/requests/product.request';
import { PageDto } from '../../../src/main/dtos/page.dto';

describe('/product', () => {
  let app: INestApplication;
  let module: TestingModule;
  let testDatabaseService: TestDatabaseService;
  let testService: EntityTestService;

  beforeAll(async () => {
    module = await getMainModule();
    testDatabaseService = module.get<TestDatabaseService>(TestDatabaseService);
    testService = module.get<EntityTestService>(EntityTestService);

    app = module.createNestApplication();
    await app.init();
  });

  beforeEach(async () => {
    await testDatabaseService.cleanDatabase();
  });

  afterAll(async () => {
    await testDatabaseService.closeDatabaseConnection();
    await app.close();
  });

  describe('GET / search product', () => {
    it('GET /', async () => {
      const user = await testService.user.create();
      const product = await testService.product.createItem({ userId: user.id });
      const response = await supertest(app.getHttpServer())
        .get('/product')
        .auth(user.id.toString(), { type: 'bearer' })
        .expect(200);

      const {
        items: results,
        total,
        limit,
        offset,
      } = response.body as PageDto<ProductDto>;
      expect(total).toBe(1);
      expect(results).toHaveLength(1);
      expect(limit).toBeUndefined();
      expect(offset).toBeUndefined();

      const result = results.at(0);
      expect(result.id).toBeDefined();
      expect(result.number).toBe(product.number);
      expect(result.title).toBe(product.title);
      expect(result.description).toBe(product.description);
    });

    it('GET / should paginate', async () => {
      const user = await testService.user.create();
      const product = await testService.product.createItem({ userId: user.id });
      const product2 = await testService.product.createItem({
        title: 'The Very Hungry Caterpillar',
        userId: user.id,
      });
      const response = await supertest(app.getHttpServer())
        .get('/product?limit=1&offset=0')
        .auth(user.id.toString(), { type: 'bearer' })
        .expect(200);

      const {
        items: results,
        total,
        limit,
        offset,
      } = response.body as PageDto<ProductDto>;
      expect(total).toBe(2);
      expect(results).toHaveLength(1);
      expect(limit).toBe('1');
      expect(offset).toBe('0');

      const result = results.at(0);
      expect(result.id).toBeDefined();
      expect(result.number).toBe(product.number);
      expect(result.title).toBe(product.title);
      expect(result.description).toBe(product.description);
    });

    it('GET / should find by title', async () => {
      const user = await testService.user.create();
      const product = await testService.product.createItem({ userId: user.id });
      const product2 = await testService.product.createItem({
        title: 'The Very Hungry Caterpillar',
        userId: user.id,
      });
      const response = await supertest(app.getHttpServer())
        .get('/product?search=Moby')
        .auth(user.id.toString(), { type: 'bearer' })
        .expect(200);

      const {
        items: results,
        total,
        limit,
        offset,
      } = response.body as PageDto<ProductDto>;
      expect(total).toBe(1);
      expect(results).toHaveLength(1);
      expect(limit).toBeUndefined();
      expect(offset).toBeUndefined();

      const result = results.at(0);
      expect(result.id).toBeDefined();
      expect(result.number).toBe(product.number);
      expect(result.title).toBe(product.title);
      expect(result.description).toBe(product.description);
    });
  });

  it('GET /:id', async () => {
    const user = await testService.user.create();
    const product = await testService.product.createItem({ userId: user.id });
    const response = await supertest(app.getHttpServer())
      .get(`/product/${product.id}`)
      .auth(user.id.toString(), { type: 'bearer' })
      .expect(200);

    const result = response.body as ProductDto;

    expect(result.id).toBeDefined();
    expect(result.number).toBe(product.number);
    expect(result.title).toBe(product.title);
    expect(result.description).toBe(product.description);
  });

  it('POST /', async () => {
    const user = await testService.user.create();
    const request = {
      userId: user.id,
      number: 'a1b2',
      title: 'Matilda',
      description: 'Kids book',
    } as ProductRequest;
    const response = await supertest(app.getHttpServer())
      .post('/product')
      .send(request)
      .auth(user.id.toString(), { type: 'bearer' })
      .expect(201);

    const result = response.body as ProductDto;
    expect(result.id).toBeDefined();
    expect(result.userId).toBe(request.userId);
    expect(result.number).toBe(request.number);
    expect(result.title).toBe(request.title);
    expect(result.description).toBe(request.description);
  });

  it('PUT /', async () => {
    const user = await testService.user.create();
    const product = await testService.product.createItem({ userId: user.id });
    const request = {
      userId: user.id,
      number: 'a1b2',
      title: 'Matilda',
      description: 'Kids book',
    } as ProductRequest;
    const response = await supertest(app.getHttpServer())
      .put(`/product/${product.id}`)
      .send(request)
      .auth(user.id.toString(), { type: 'bearer' })
      .expect(200);

    const result = response.body as ProductDto;
    expect(result.id).toBe(product.id);
    expect(result.userId).toBe(request.userId);
    expect(result.number).toBe(request.number);
    expect(result.title).toBe(request.title);
    expect(result.description).toBe(request.description);
  });

  it('DELETE /', async () => {
    const user = await testService.user.create();
    const product = await testService.product.createItem({ userId: user.id });
    const response = await supertest(app.getHttpServer())
      .delete(`/product/${product.id}`)
      .auth(user.id.toString(), { type: 'bearer' })
      .expect(200);
  });
});
