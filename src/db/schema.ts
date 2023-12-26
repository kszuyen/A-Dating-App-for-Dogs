import { relations, sql } from "drizzle-orm";
import {
  index,
  pgTable,
  serial,
  uuid,
  varchar,
  date,
  timestamp,
  unique,
  boolean,
} from "drizzle-orm/pg-core";

// Checkout the relationship in the following tutorial:
// https://orm.drizzle.team/docs/rqb

export const usersTable = pgTable(
  "users",
  {
    id: serial("id").primaryKey(),
    displayId: uuid("display_id").defaultRandom().notNull().unique(),
    username: varchar("username", { length: 100 }).notNull(),
    email: varchar("email", { length: 100 }).notNull().unique(),
    hashedPassword: varchar("hashed_password", { length: 100 }),
    provider: varchar("provider", {
      length: 100,
      enum: ["github", "credentials", "google"],
    })
      .notNull()
      .default("credentials"),
  },
  (table) => ({
    userDisplayIdIndex: index("user_display_id_index").on(table.displayId),
    emailIndex: index("email_index").on(table.email),
  }),
);

// export const usersToDogsRelations = relations(usersTable, ({ one }) => ({
//   dogs: one(dogsTable),
// }));

export const dogsTable = pgTable(
  "dogs",
  {
    id: serial("id").primaryKey(),
    displayId: uuid("display_id").references(() => usersTable.displayId, {
      onDelete: "cascade",
    }),
    //狗的displayId應該要跟人的displayId一樣，實現一對一
    dogname: varchar("dogname", { length: 100 }).notNull(),
    breed: varchar("breed", { length: 100 }).notNull(),
    gender: varchar("gender", {
      length: 100,
      enum: ["male", "female"],
    }).notNull(),
    birthday: date("date", { mode: "string" }),
    description: varchar("description", { length: 280 }).notNull(),
    imageUrl: varchar("image_url", { length: 280 }),
    thumbnailUrl: varchar("thumbnail_url", { length: 280 }),
  },
  (table) => ({
    dogDisplayIdIndex: index("dog_display_id_index").on(table.displayId),
  }),
);

export const likedTable = pgTable(
  "liked",
  {
    id: serial("id").primaryKey(),
    firstId: uuid("firstId").notNull(),
    secondId: uuid("secondId").notNull(),
    likeStatus: boolean("like_status").notNull(),
  },
  (table) => ({
    likedFirstIdIndex: index("liked_first_id_index").on(table.firstId),
    likedSecondIdIndex: index("liked_second_id_index").on(table.secondId),
    // unique constraints ensure that there are no duplicate combinations of
    // values in the table. In this case, we want to ensure that a user can't
    // like the same dog twice.
    uniqCombination: unique().on(table.firstId, table.secondId),
  }),
);

export const viewedTable = pgTable(
  "viewed",
  {
    id: serial("id").primaryKey(),
    firstId: uuid("firstId").notNull(),
    secondId: uuid("secondId").notNull(),
  },
  (table) => ({
    viewedFirstIdIndex: index("viewed_first_id_index").on(table.firstId),
    ViewedSecondIdIndex: index("viewed_second_id_index").on(table.secondId),
    uniqCombination: unique().on(table.firstId, table.secondId),
  }),
);

export const messagesTable = pgTable(
  "messages",
  {
    id: serial("id").primaryKey(),
    content: varchar("content", { length: 280 }).notNull(),
    senderId: uuid("senderId").notNull(),
    receiverId: uuid("receiverId").notNull(),
    sentAt: timestamp("sentAt").default(sql`now()`),
  },
  (table) => ({
    senderIdIndex: index("sender_id_index").on(table.senderId),
    receiverIdIndex: index("receiver_id_index").on(table.receiverId),
  }),
);
