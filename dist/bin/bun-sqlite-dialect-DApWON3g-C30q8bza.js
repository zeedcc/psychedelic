var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var __privateMethod = (obj, member, method) => (__accessCheck(obj, member, "access private method"), method);
var _config, _connectionMutex, _db, _connection, _a, _db2, _b, _promise, _resolve, _c, _db3, _BunSqliteIntrospector_instances, getTableMetadata_fn, _d, _config2, _e;
import { createRequire } from "module";
const require2 = createRequire(import.meta.url);
import { D as DEFAULT_MIGRATION_TABLE, a as DEFAULT_MIGRATION_LOCK_TABLE } from "./kysely-migration-tables-JkVUjPF_-BzGVAzYZ.js";
import { C as CompiledQuery, D as DefaultQueryCompiler, s as sql } from "../server.bundle.mjs";
import "tty";
import "util";
import "os";
import "path";
import "buffer";
import "string_decoder";
import "node:zlib";
import "node:events";
import "url";
import "node:path";
import "node:fs";
import "node:http";
import "crypto";
import "fs";
import "node:querystring";
import "node:buffer";
import "node:net";
import "stream";
import "node:url";
import "node:crypto";
import "node:fs/promises";
import "node:os";
import "events";
import "process";
import "net";
import "tls";
import "timers";
import "zlib";
import "node:process";
var BunSqliteAdapter = class {
  get supportsCreateIfNotExists() {
    return true;
  }
  get supportsTransactionalDdl() {
    return false;
  }
  get supportsMultipleConnections() {
    return false;
  }
  get supportsReturning() {
    return true;
  }
  async acquireMigrationLock() {
  }
  async releaseMigrationLock() {
  }
  get supportsOutput() {
    return true;
  }
};
var BunSqliteDriver = (_a = class {
  constructor(config) {
    __privateAdd(this, _config);
    __privateAdd(this, _connectionMutex, new ConnectionMutex());
    __privateAdd(this, _db);
    __privateAdd(this, _connection);
    __privateSet(this, _config, { ...config });
  }
  async init() {
    __privateSet(this, _db, __privateGet(this, _config).database);
    __privateSet(this, _connection, new BunSqliteConnection(__privateGet(this, _db)));
    if (__privateGet(this, _config).onCreateConnection) await __privateGet(this, _config).onCreateConnection(__privateGet(this, _connection));
  }
  async acquireConnection() {
    await __privateGet(this, _connectionMutex).lock();
    return __privateGet(this, _connection);
  }
  async beginTransaction(connection) {
    await connection.executeQuery(CompiledQuery.raw("begin"));
  }
  async commitTransaction(connection) {
    await connection.executeQuery(CompiledQuery.raw("commit"));
  }
  async rollbackTransaction(connection) {
    await connection.executeQuery(CompiledQuery.raw("rollback"));
  }
  async releaseConnection() {
    __privateGet(this, _connectionMutex).unlock();
  }
  async destroy() {
    var _a2;
    (_a2 = __privateGet(this, _db)) == null ? void 0 : _a2.close();
  }
}, _config = new WeakMap(), _connectionMutex = new WeakMap(), _db = new WeakMap(), _connection = new WeakMap(), _a);
var BunSqliteConnection = (_b = class {
  constructor(db) {
    __privateAdd(this, _db2);
    __privateSet(this, _db2, db);
  }
  executeQuery(compiledQuery) {
    const { sql: sql2, parameters } = compiledQuery;
    const stmt = __privateGet(this, _db2).prepare(sql2);
    return Promise.resolve({ rows: stmt.all(parameters) });
  }
  async *streamQuery() {
    throw new Error("Streaming query is not supported by SQLite driver.");
  }
}, _db2 = new WeakMap(), _b);
var ConnectionMutex = (_c = class {
  constructor() {
    __privateAdd(this, _promise);
    __privateAdd(this, _resolve);
  }
  async lock() {
    while (__privateGet(this, _promise) !== void 0) await __privateGet(this, _promise);
    __privateSet(this, _promise, new Promise((resolve) => {
      __privateSet(this, _resolve, resolve);
    }));
  }
  unlock() {
    const resolve = __privateGet(this, _resolve);
    __privateSet(this, _promise, void 0);
    __privateSet(this, _resolve, void 0);
    resolve == null ? void 0 : resolve();
  }
}, _promise = new WeakMap(), _resolve = new WeakMap(), _c);
var BunSqliteIntrospector = (_d = class {
  constructor(db) {
    __privateAdd(this, _BunSqliteIntrospector_instances);
    __privateAdd(this, _db3);
    __privateSet(this, _db3, db);
  }
  async getSchemas() {
    return [];
  }
  async getTables(options = { withInternalKyselyTables: false }) {
    let query = __privateGet(this, _db3).selectFrom("sqlite_schema").where("type", "=", "table").where("name", "not like", "sqlite_%").select("name").$castTo();
    if (!options.withInternalKyselyTables) query = query.where("name", "!=", DEFAULT_MIGRATION_TABLE).where("name", "!=", DEFAULT_MIGRATION_LOCK_TABLE);
    const tables = await query.execute();
    return Promise.all(tables.map(({ name }) => __privateMethod(this, _BunSqliteIntrospector_instances, getTableMetadata_fn).call(this, name)));
  }
}, _db3 = new WeakMap(), _BunSqliteIntrospector_instances = new WeakSet(), getTableMetadata_fn = async function(table) {
  var _a2, _b2, _c2, _d2, _e2, _f;
  const db = __privateGet(this, _db3);
  const autoIncrementCol = (_f = (_e2 = (_d2 = (_c2 = (_b2 = (_a2 = (await db.selectFrom("sqlite_master").where("name", "=", table).select("sql").$castTo().execute())[0]) == null ? void 0 : _a2.sql) == null ? void 0 : _b2.split(/[\(\),]/)) == null ? void 0 : _c2.find((it) => it.toLowerCase().includes("autoincrement"))) == null ? void 0 : _d2.split(/\s+/)) == null ? void 0 : _e2[0]) == null ? void 0 : _f.replace(/["`]/g, "");
  return {
    name: table,
    columns: (await db.selectFrom(sql`pragma_table_info(${table})`.as("table_info")).select([
      "name",
      "type",
      "notnull",
      "dflt_value"
    ]).execute()).map((col) => ({
      name: col.name,
      dataType: col.type,
      isNullable: !col.notnull,
      isAutoIncrementing: col.name === autoIncrementCol,
      hasDefaultValue: col.dflt_value != null
    })),
    isView: false,
    isForeign: false
  };
}, _d);
var BunSqliteQueryCompiler = class extends DefaultQueryCompiler {
  getCurrentParameterPlaceholder() {
    return "?";
  }
  getLeftIdentifierWrapper() {
    return '"';
  }
  getRightIdentifierWrapper() {
    return '"';
  }
  getAutoIncrement() {
    return "autoincrement";
  }
};
var BunSqliteDialect = (_e = class {
  constructor(config) {
    __privateAdd(this, _config2);
    __privateSet(this, _config2, { ...config });
  }
  createDriver() {
    return new BunSqliteDriver(__privateGet(this, _config2));
  }
  createQueryCompiler() {
    return new BunSqliteQueryCompiler();
  }
  createAdapter() {
    return new BunSqliteAdapter();
  }
  createIntrospector(db) {
    return new BunSqliteIntrospector(db);
  }
}, _config2 = new WeakMap(), _e);
export {
  BunSqliteDialect
};
