import {
  pgTable,
  text,
  timestamp,
  integer,
  bigint,
  jsonb,
  index,
  boolean,
  primaryKey
} from "drizzle-orm/pg-core"; 
import type { AdapterAccountType } from "@auth/core/adapters";

export const users = pgTable("user", {
  id: text("id")
    .primaryKey()
    .$defaultFn(() => crypto.randomUUID()),
  name: text("name"),
  email: text("email").unique(),
  emailVerified: timestamp("emailVerified", { mode: "date" }),
  image: text("image"),
});

export const accounts = pgTable(
  "account",
  {
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    type: text("type").$type<AdapterAccountType>().notNull(),
    provider: text("provider").notNull(),
    providerAccountId: text("providerAccountId").notNull(),
    refresh_token: text("refresh_token"),
    access_token: text("access_token"),
    expires_at: integer("expires_at"),
    token_type: text("token_type"),
    scope: text("scope"),
    id_token: text("id_token"),
    session_state: text("session_state"),
  },
  (account) => [
    {
      compoundKey: primaryKey({
        columns: [account.provider, account.providerAccountId],
      }),
    },
  ]
);

export const sessions = pgTable("session", {
  sessionToken: text("sessionToken").primaryKey(),
  userId: text("userId")
    .notNull()
    .references(() => users.id, { onDelete: "cascade" }),
  expires: timestamp("expires", { mode: "date" }).notNull(),
});

export const verificationTokens = pgTable(
  "verificationToken",
  {
    identifier: text("identifier").notNull(),
    token: text("token").notNull(),
    expires: timestamp("expires", { mode: "date" }).notNull(),
  },
  (verificationToken) => [
    {
      compositePk: primaryKey({
        columns: [verificationToken.identifier, verificationToken.token],
      }),
    },
  ]
);

export const authenticators = pgTable(
  "authenticator",
  {
    credentialID: text("credentialID").notNull().unique(),
    userId: text("userId")
      .notNull()
      .references(() => users.id, { onDelete: "cascade" }),
    providerAccountId: text("providerAccountId").notNull(),
    credentialPublicKey: text("credentialPublicKey").notNull(),
    counter: integer("counter").notNull(),
    credentialDeviceType: text("credentialDeviceType").notNull(),
    credentialBackedUp: boolean("credentialBackedUp").notNull(),
    transports: text("transports"),
  },
  (authenticator) => [
    {
      compositePK: primaryKey({
        columns: [authenticator.userId, authenticator.credentialID],
      }),
    },
  ]
);

export const containerSessions = pgTable(
  "ContainerSession",
  {
    id: text("id")
      .primaryKey()
      .$defaultFn(() => crypto.randomUUID()),
    userId: text("userId").notNull(),
    containerId: text("containerId").notNull(),
    containerName: text("containerName").notNull(),
    createdAt: timestamp("createdAt", { mode: "date" }).notNull(),
    expiresAt: timestamp("expiresAt", { mode: "date" }).notNull(),
    lastActivityAt: timestamp("lastActivityAt", { mode: "date" }),
    status: text("status").notNull().default("active"),
    cpuLimit: integer("cpuLimit").notNull().default(1),
    memoryLimit: bigint("memoryLimit", { mode: "number" })
      .notNull()
      .default(2147483648), // 2GB in bytes

    metadata: jsonb("metadata")
      .$type<Record<string, string>>()
      .notNull()
      .default({}),
  },
  (table) => {
    return {
      userIdIdx: index("container_session_user_id_idx").on(table.userId),
      containerIdIdx: index("container_session_container_id_idx").on(
        table.containerId
      ),
    };
  }
);
