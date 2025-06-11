import { INestApplication } from '@nestjs/common';
import { TestingModule } from '@nestjs/testing';
import { EntityTestService } from '../../services/entity/entity-test.service';
import { TestDatabaseService } from '../../services/test-database.service';
import { getMainModule } from '../../app';
import supertest from 'supertest';
import { UserRequest } from '../../../src/main/requests/user.request';
import { PageDto } from '../../../src/main/dtos/page.dto';
import { UserDto } from '../../../src/main/dtos/user.dto';
import { UserRole } from '../../../src/main/enums/user-role';

describe('/user', () => {
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

  describe('GET / search user', () => {
    it('GET /', async () => {
      const user = await testService.user.create();
      const response = await supertest(app.getHttpServer())
        .get('/user')
        .auth(user.id.toString(), { type: 'bearer' })
        .expect(200);

      const {
        items: results,
        total,
        limit,
        offset,
      } = response.body as PageDto<UserDto>;
      expect(total).toBe(1);
      expect(results).toHaveLength(1);
      expect(limit).toBeUndefined();
      expect(offset).toBeUndefined();

      const result = results.at(0);
      expect(result.id).toBe(user.id);
      expect(result.firstName).toBe(user.firstName);
      expect(result.lastName).toBe(user.lastName);
      expect(result.role).toBe(user.role);
    });

    it('GET / should paginate', async () => {
      const user = await testService.user.create();
      const user2 = await testService.user.create({
        firstName: 'Donny',
        lastName: 'Don',
      });

      const response = await supertest(app.getHttpServer())
        .get('/user?limit=1&offset=0')
        .auth(user.id.toString(), { type: 'bearer' })
        .expect(200);

      const {
        items: results,
        total,
        limit,
        offset,
      } = response.body as PageDto<UserDto>;
      expect(total).toBe(2);
      expect(results).toHaveLength(1);
      expect(limit).toBe('1');
      expect(offset).toBe('0');

      const result = results.at(0);
      expect(result.id).toBe(user.id);
      expect(result.firstName).toBe(user.firstName);
      expect(result.lastName).toBe(user.lastName);
      expect(result.role).toBe(user.role);
    });

    it('GET / should find by title', async () => {
      const user = await testService.user.create();
      const user2 = await testService.user.create({
        firstName: 'Donny',
        lastName: 'Don',
      });
      const response = await supertest(app.getHttpServer())
        .get('/user?search=Donn')
        .auth(user.id.toString(), { type: 'bearer' })
        .expect(200);

      const {
        items: results,
        total,
        limit,
        offset,
      } = response.body as PageDto<UserDto>;
      expect(total).toBe(1);
      expect(results).toHaveLength(1);
      expect(limit).toBeUndefined();
      expect(offset).toBeUndefined();

      const result = results.at(0);
      expect(result.id).toBe(user2.id);
      expect(result.firstName).toBe(user2.firstName);
      expect(result.lastName).toBe(user2.lastName);
      expect(result.role).toBe(user.role);
    });
  });

  it('GET /:id', async () => {
    const user = await testService.user.create();
    const response = await supertest(app.getHttpServer())
      .get(`/user/${user.id}`)
      .auth(user.id.toString(), { type: 'bearer' })
      .expect(200);

    const result = response.body as UserDto;

    expect(result.id).toBeDefined();
    expect(result.firstName).toBe(user.firstName);
    expect(result.lastName).toBe(user.lastName);
    expect(result.role).toBe(user.role);
  });

  it.skip('POST /', async () => {
    const user = await testService.user.create();
    const request = {
      firstName: 'John',
      lastName: 'Doe',
      role: UserRole.admin,
    } as UserRequest;
    const response = await supertest(app.getHttpServer())
      .post('/user')
      .send(request)
      .auth(user.id.toString(), { type: 'bearer' })
      .expect(201);

    const result = response.body as UserDto;
    expect(result.id).toBeDefined();
    expect(result.firstName).toBe(request.firstName);
    expect(result.lastName).toBe(request.lastName);
    expect(result.role).toBe(user.role);
  });

  it('PUT /', async () => {
    const user = await testService.user.create();
    const request = {
      firstName: 'Mark',
      lastName: 'Stone',
      role: UserRole.admin,
    } as UserRequest;
    const response = await supertest(app.getHttpServer())
      .put(`/user/${user.id}`)
      .send(request)
      .auth(user.id.toString(), { type: 'bearer' })
      .expect(200);

    const result = response.body as UserDto;
    expect(result.id).toBe(user.id);
    expect(result.firstName).toBe(request.firstName);
    expect(result.lastName).toBe(request.lastName);
    expect(result.role).toBe(user.role);
  });

  it('DELETE /', async () => {
    const user = await testService.user.create();
    const user2 = await testService.user.create({
      firstName: 'Donny',
      lastName: 'Don',
    });
    await supertest(app.getHttpServer())
      .delete(`/user/${user2.id}`)
      .auth(user.id.toString(), { type: 'bearer' })
      .expect(200);
  });
});
