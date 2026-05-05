// This file is required for Expo/React Native SQLite migrations - https://orm.drizzle.team/quick-sqlite/expo

import journal from "./meta/_journal.json";
import m0001 from "./0001_sharp_the_fallen.sql";

export default {
  journal,
  migrations: {
    m0001,
  },
};
