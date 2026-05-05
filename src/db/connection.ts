import * as SQLite from "expo-sqlite";
import { drizzle } from "drizzle-orm/expo-sqlite";
import * as schema from "./schema";

const expoDb = SQLite.openDatabaseSync("temper.db");

expoDb.execSync("PRAGMA foreign_keys = ON;");
expoDb.execSync("PRAGMA journal_mode = WAL;");

export const db = drizzle(expoDb, { schema });
