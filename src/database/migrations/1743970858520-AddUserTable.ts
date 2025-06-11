import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserTable1743970858520 implements MigrationInterface {
  name = 'AddUserTable1743970858520';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`CREATE TABLE \`user\`
                                 (
                                     \`id\`           int NOT NULL AUTO_INCREMENT,
                                     \`created_date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6),
                                     \`updated_date\` datetime(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6) ON UPDATE CURRENT_TIMESTAMP(6),
                                     \`first_name\`   varchar(255) NULL,
                                     \`last_name\`    varchar(255) NULL,
                                     PRIMARY KEY (\`id\`)
                                 ) ENGINE=InnoDB`);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE \`user\``);
  }
}
