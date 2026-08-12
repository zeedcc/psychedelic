var __typeError = (msg) => {
  throw TypeError(msg);
};
var __accessCheck = (obj, member, msg) => member.has(obj) || __typeError("Cannot " + msg);
var __privateGet = (obj, member, getter) => (__accessCheck(obj, member, "read from private field"), getter ? getter.call(obj) : member.get(obj));
var __privateAdd = (obj, member, value) => member.has(obj) ? __typeError("Cannot add the same private member more than once") : member instanceof WeakSet ? member.add(obj) : member.set(obj, value);
var __privateSet = (obj, member, value, setter) => (__accessCheck(obj, member, "write to private field"), setter ? setter.call(obj, value) : member.set(obj, value), value);
var _config, _connection, _a, _db, _b, _db2, _d1, _c, _config2, _d;
import { createRequire } from "module";
const require2 = createRequire(import.meta.url);
import { D as DEFAULT_MIGRATION_TABLE, a as DEFAULT_MIGRATION_LOCK_TABLE } from "./kysely-migration-tables-JkVUjPF_-BzGVAzYZ.js";
import { S as SqliteQueryCompiler, a as SqliteAdapter } from "../server.bundle.mjs";
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
var D1SqliteAdapter = class extends SqliteAdapter {
};
var D1SqliteDriver = (_a = class {
  constructor(config) {
    __privateAdd(this, _config);
    __privateAdd(this, _connection);
    __privateSet(this, _config, { ...config });
  }
  async init() {
    __privateSet(this, _connection, new D1SqliteConnection(__privateGet(this, _config).database));
    if (__privateGet(this, _config).onCreateConnection) await __privateGet(this, _config).onCreateConnection(__privateGet(this, _connection));
  }
  async acquireConnection() {
    return __privateGet(this, _connection);
  }
  async beginTransaction() {
    throw new Error("D1 does not support interactive transactions. Use the D1 batch() API instead.");
  }
  async commitTransaction() {
    throw new Error("D1 does not support interactive transactions. Use the D1 batch() API instead.");
  }
  async rollbackTransaction() {
    throw new Error("D1 does not support interactive transactions. Use the D1 batch() API instead.");
  }
  async releaseConnection() {
  }
  async destroy() {
  }
}, _config = new WeakMap(), _connection = new WeakMap(), _a);
var D1SqliteConnection = (_b = class {
  constructor(db) {
    __privateAdd(this, _db);
    __privateSet(this, _db, db);
  }
  async executeQuery(compiledQuery) {
    const results = await __privateGet(this, _db).prepare(compiledQuery.sql).bind(...compiledQuery.parameters).all();
    const numAffectedRows = results.meta.changes != null ? BigInt(results.meta.changes) : void 0;
    return {
      insertId: results.meta.last_row_id === void 0 || results.meta.last_row_id === null ? void 0 : BigInt(results.meta.last_row_id),
      rows: (results == null ? void 0 : results.results) || [],
      numAffectedRows
    };
  }
  async *streamQuery() {
    throw new Error("D1 does not support streaming queries.");
  }
}, _db = new WeakMap(), _b);
var D1SqliteIntrospector = (_c = class {
  constructor(db, d1) {
    __privateAdd(this, _db2);
    __privateAdd(this, _d1);
    __privateSet(this, _db2, db);
    __privateSet(this, _d1, d1);
  }
  async getSchemas() {
    return [];
  }
  async getTables(options = { withInternalKyselyTables: false }) {
    let query = __privateGet(this, _db2).selectFrom("sqlite_master").where("type", "in", ["table", "view"]).where("name", "not like", "sqlite_%").where("name", "not like", "_cf_%").select([
      "name",
      "type",
      "sql"
    ]).$castTo();
    if (!options.withInternalKyselyTables) query = query.where("name", "!=", DEFAULT_MIGRATION_TABLE).where("name", "!=", DEFAULT_MIGRATION_LOCK_TABLE);
    const tables = await query.execute();
    if (tables.length === 0) return [];
    const statements = tables.map((table) => __privateGet(this, _d1).prepare("SELECT * FROM pragma_table_info(?)").bind(table.name));
    const batchResults = await __privateGet(this, _d1).batch(statements);
    return tables.map((table, index) => {
      var _a2, _b2, _c2, _d2, _e, _f, _g;
      const columnInfo = ((_a2 = batchResults[index]) == null ? void 0 : _a2.results) ?? [];
      let autoIncrementCol = (_g = (_f = (_e = (_d2 = (_c2 = (_b2 = table.sql) == null ? void 0 : _b2.split(/[(),]/)) == null ? void 0 : _c2.find((it) => it.toLowerCase().includes("autoincrement"))) == null ? void 0 : _d2.split(/\s+/)) == null ? void 0 : _e.filter(Boolean)) == null ? void 0 : _f[0]) == null ? void 0 : _g.replace(/["`]/g, "");
      if (!autoIncrementCol) {
        const pkCols = columnInfo.filter((r) => r.pk > 0);
        const singlePk = pkCols.length === 1 ? pkCols[0] : void 0;
        if (singlePk && singlePk.type.toLowerCase() === "integer") autoIncrementCol = singlePk.name;
      }
      return {
        name: table.name,
        isView: table.type === "view",
        isForeign: false,
        columns: columnInfo.map((col) => ({
          name: col.name,
          dataType: col.type,
          isNullable: !col.notnull,
          isAutoIncrementing: col.name === autoIncrementCol,
          hasDefaultValue: col.dflt_value != null
        }))
      };
    });
  }
}, _db2 = new WeakMap(), _d1 = new WeakMap(), _c);
var D1SqliteQueryCompiler = class extends SqliteQueryCompiler {
};
var D1SqliteDialect = (_d = class {
  constructor(config) {
    __privateAdd(this, _config2);
    __privateSet(this, _config2, { ...config });
  }
  createDriver() {
    return new D1SqliteDriver(__privateGet(this, _config2));
  }
  createQueryCompiler() {
    return new D1SqliteQueryCompiler();
  }
  createAdapter() {
    return new D1SqliteAdapter();
  }
  createIntrospector(db) {
    return new D1SqliteIntrospector(db, __privateGet(this, _config2).database);
  }
}, _config2 = new WeakMap(), _d);
export {
  D1SqliteDialect
};
