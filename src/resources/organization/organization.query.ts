import { Organization } from './entities/organization.entity';

const tableName = 'organizations';

export const createInsertQuery = (name: string, userId: number) => ({
  query: `INSERT INTO ${tableName} (name, "createdBy") VALUES ($1, $2) RETURNING *`,
  queryParams: [name, userId],
});

export const createSelectAllQuery = () => [`SELECT * FROM ${tableName}`, `SELECT COUNT(*) FROM ${tableName}`];

export const createSelectWhereQuery = (orgId: number) => ({
  query: `SELECT org.id, org.name, u.name as "createdBy" FROM ${tableName} as org JOIN "users" as u ON org."createdBy" = u.id WHERE org.id = $1`,
  queryParams: [orgId],
});

export const createUpdateQuery = (name: string, org: Organization) => {
  console.log('org :>> ', org);
  return {
    query: `UPDATE ${tableName} SET name = $1 WHERE id = $2`,
    queryParams: [name ?? org.name, org.id],
  };
};

export const createDeleteQuery = (id: number) => ({
  query: `DELETE FROM ${tableName} WHERE id = $1`,
  queryParams: [id],
});
