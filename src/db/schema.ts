import { relations } from "drizzle-orm";
import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";

export const user = pgTable("user", {
  id: text("id").primaryKey(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  emailVerified: boolean("email_verified")
    .$defaultFn(() => false)
    .notNull(),
  image: text("image"),
  createdAt: timestamp("created_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
  updatedAt: timestamp("updated_at")
    .$defaultFn(() => /* @__PURE__ */ new Date())
    .notNull(),
});

export const session = pgTable("session", {
  id: text("id").primaryKey(),
  expiresAt: timestamp("expires_at").notNull(),
  token: text("token").notNull().unique(),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
  ipAddress: text("ip_address"),
  userAgent: text("user_agent"),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
});

export const account = pgTable("account", {
  id: text("id").primaryKey(),
  accountId: text("account_id").notNull(),
  providerId: text("provider_id").notNull(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  accessToken: text("access_token"),
  refreshToken: text("refresh_token"),
  idToken: text("id_token"),
  accessTokenExpiresAt: timestamp("access_token_expires_at"),
  refreshTokenExpiresAt: timestamp("refresh_token_expires_at"),
  scope: text("scope"),
  password: text("password"),
  createdAt: timestamp("created_at").notNull(),
  updatedAt: timestamp("updated_at").notNull(),
});

export const verification = pgTable("verification", {
  id: text("id").primaryKey(),
  identifier: text("identifier").notNull(),
  value: text("value").notNull(),
  expiresAt: timestamp("expires_at").notNull(),
  createdAt: timestamp("created_at").$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
  updatedAt: timestamp("updated_at").$defaultFn(
    () => /* @__PURE__ */ new Date(),
  ),
});

// Tabela de Transações (Ganhos)
export const transaction = pgTable("transaction", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  amountInCents: integer("amount_in_cents").notNull(), // Valor em centavos (sempre positivo para ganhos)
  title: text("title").notNull(), // Título da transação (ex: "Freelance", "Salário")
  description: text("description"), // Descrição detalhada (opcional)
  createdAt: timestamp("created_at")
    .notNull()
    .$defaultFn(() => new Date()), // Data e hora automática
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdateFn(() => new Date())
    .$defaultFn(() => new Date()),
});

// Tabela de Gastos
export const expense = pgTable("expense", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  amountInCents: integer("amount_in_cents").notNull(), // Valor em centavos (sempre positivo, mas representa gasto)
  title: text("title").notNull(), // Título do gasto (ex: "Compra no Supermercado", "Conta de Luz")
  description: text("description"), // Descrição detalhada (opcional)
  createdAt: timestamp("created_at")
    .notNull()
    .$defaultFn(() => new Date()), // Data e hora automática
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdateFn(() => new Date())
    .$defaultFn(() => new Date()),
});

// Tabela de Ganhos Essenciais (Templates)
export const essentialIncome = pgTable("essential_income", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  amountInCents: integer("amount_in_cents").notNull(), // Valor em centavos (sempre positivo)
  title: text("title").notNull(), // Título do ganho essencial (ex: "Salário Mensal", "Freelance Fixo")
  description: text("description"), // Descrição detalhada (opcional)
  createdAt: timestamp("created_at")
    .notNull()
    .$defaultFn(() => new Date()), // Data de criação do template
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdateFn(() => new Date())
    .$defaultFn(() => new Date()),
});

// Tabela de Gastos Essenciais (Templates)
export const essentialExpense = pgTable("essential_expense", {
  id: uuid("id").primaryKey().defaultRandom(),
  userId: text("user_id")
    .notNull()
    .references(() => user.id, { onDelete: "cascade" }),
  amountInCents: integer("amount_in_cents").notNull(), // Valor em centavos (sempre positivo, mas representa gasto)
  title: text("title").notNull(), // Título do gasto essencial (ex: "Conta de Luz", "Aluguel")
  description: text("description"), // Descrição detalhada (opcional)
  createdAt: timestamp("created_at")
    .notNull()
    .$defaultFn(() => new Date()), // Data de criação do template
  updatedAt: timestamp("updated_at")
    .notNull()
    .$onUpdateFn(() => new Date())
    .$defaultFn(() => new Date()),
});

// Relacionamentos
export const userRelations = relations(user, ({ many }) => ({
  transactions: many(transaction),
  expenses: many(expense),
  essentialIncomes: many(essentialIncome),
  essentialExpenses: many(essentialExpense),
}));

export const transactionRelations = relations(transaction, ({ one }) => ({
  user: one(user, {
    fields: [transaction.userId],
    references: [user.id],
  }),
}));

export const expenseRelations = relations(expense, ({ one }) => ({
  user: one(user, {
    fields: [expense.userId],
    references: [user.id],
  }),
}));

export const essentialIncomeRelations = relations(
  essentialIncome,
  ({ one }) => ({
    user: one(user, {
      fields: [essentialIncome.userId],
      references: [user.id],
    }),
  }),
);

export const essentialExpenseRelations = relations(
  essentialExpense,
  ({ one }) => ({
    user: one(user, {
      fields: [essentialExpense.userId],
      references: [user.id],
    }),
  }),
);
