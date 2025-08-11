import {
	boolean,
	timestamp,
	pgTable,
	text,
	primaryKey,
	integer,
	jsonb,
	varchar,
	interval,
	decimal,
	date,
} from "drizzle-orm/pg-core";

import type { AdapterAccountType } from "next-auth/adapters";

export const users = pgTable("user", {
	id: text("id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	name: text("name").default(""),
	email: text("email").unique(),
	password: text("password"),
	emailVerified: timestamp("emailVerified", { mode: "date" }),
	image: text("image").default(""),
	username: text("username").default(""),
	phone_number: text("phone_number").default(""),
	youtube_channel_id: text("youtube_channel_id").default(""),
	presets: jsonb("presets").default({}),
	onBoardingCompleted: boolean("onBoardingCompleted").default(false),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	plugin_active: boolean("plugin_active").default(false),
  	updatedAt: timestamp("updated_at").defaultNow().notNull(),
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
				columns: [
					verificationToken.identifier,
					verificationToken.token,
				],
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

//remove all constraints apart from primary key and basic not null stuff for all the tables below
export const stream = pgTable("stream", {
	stream_id: text("stream_id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	user_id: text("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	stream_title: varchar("stream_title", { length: 255 }),
	stream_link: varchar("stream_link", { length: 255 }),
	stream_start: timestamp("stream_start", { withTimezone: true }),
	stream_end: timestamp("stream_end", { withTimezone: true }),
	auto_upload: boolean("auto_upload"),
	thumbnail_url: text("thumbnail_url"),
	is_live : boolean("is_live"),
	active : boolean("active"),
	source: text("source"),
	progress: jsonb("progress"),
	created_at: timestamp("created_at", {
		withTimezone: true,
	}).defaultNow(),
	updated_at: timestamp("updated_at", {
		withTimezone: true,
	}).defaultNow(),
});

//make it the start_time and end_time nullable
export const clip = pgTable("clip", {
	clip_id: text("clip_id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	stream_id: text("stream_id")
		.notNull()
		.references(() => stream.stream_id, { onDelete: "cascade" }),
	start_time: interval("start_time"),
	end_time: interval("end_time"),
	clip_title: text("clip_title"),
	content_critique: text("content_critique"),
	clip_link: text("clip_link"),
	transcript: text("transcript"),
	virality_score: decimal("virality_score", { precision: 5, scale: 2 }),
	created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
	updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

//id should be int
export const socialMediaPlatform = pgTable("social_media_platform", {
	platform_id: integer("platform_id").primaryKey(),
	platform_name: varchar("platform_name", { length: 50 }).notNull().unique(),
	platform_link: text("platform_link").notNull(),
	created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
	updated_at: timestamp("updated_at", { withTimezone: true }).defaultNow(),
});

//
export const analytics = pgTable("analytics", {
	analytics_id: text("analytics_id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	user_id: text("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	period_start: date("period_start").notNull(),
	period_end: date("period_end").notNull(),
	clips_likes: integer("clips_likes").default(0).notNull(),
	clips_views: integer("clips_views").default(0).notNull(),
	clips_shares: integer("clips_shares").default(0).notNull(),
	clips_comments: integer("clips_comments").default(0).notNull(),
	created_at: timestamp("created_at", {
		withTimezone: true,
	}).defaultNow(),
	updated_at: timestamp("updated_at", {
		withTimezone: true,
	}).defaultNow(),
});

//make the connection status nullable,
export const socialMediaHandle = pgTable("social_media_handle", {
	handle_id: text("handle_id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	user_id: text("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	platform_id: integer("platform_id")
		.notNull()
		.references(() => socialMediaPlatform.platform_id, {
			onDelete: "cascade",
		}),
	account_handle: varchar("account_handle", { length: 100 }).notNull(),
	account_user_id: text("account_user_id"),
	access_token: text("access_token").notNull(),
	refresh_token: text("refresh_token"),
	token_expires_at: timestamp("token_expires_at", { withTimezone: true }),
	refresh_token_expires_at: timestamp("refresh_token_expires_at", {
		withTimezone: true,
	}),
	connection_status: varchar("connection_status", { length: 10 }).default(
		"active"
	),
	created_at: timestamp("created_at", {
		withTimezone: true,
	}).defaultNow(),
	updated_at: timestamp("updated_at", {
		withTimezone: true,
	}).defaultNow(),
});

//remove not null for uploaded at
export const uploadedClip = pgTable("uploaded_clip", {
	upload_id: text("upload_id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	clip_id: text("clip_id")
		.notNull()
		.references(() => clip.clip_id, { onDelete: "cascade" }),
	social_media_handle_id: text("social_media_handle_id")
		.notNull()
		.references(() => socialMediaHandle.handle_id, {
			onDelete: "cascade",
		}),
	upload_link: text("upload_link").notNull(),
	uploaded_at: timestamp("uploaded_at", { withTimezone: true }),
	created_at: timestamp("created_at", {
		withTimezone: true,
	}).defaultNow(),
	updated_at: timestamp("updated_at", {
		withTimezone: true,
	}).defaultNow(),
});

//
export const clipLike = pgTable("clip_like", {
	like_id: text("like_id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	clip_id: text("clip_id")
		.notNull()
		.references(() => clip.clip_id, { onDelete: "cascade" }),
	user_id: text("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	created_at: timestamp("created_at", {
		withTimezone: true,
	}).defaultNow(),
});

export const clipComment = pgTable("clip_comment", {
	comment_id: text("comment_id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	clip_id: text("clip_id")
		.notNull()
		.references(() => clip.clip_id, { onDelete: "cascade" }),
	user_id: text("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	comment: text("comment").notNull(),
	created_at: timestamp("created_at", { withTimezone: true }).defaultNow(),
});

//
export const clipSave = pgTable("clip_save", {
	save_id: text("save_id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	clip_id: text("clip_id")
		.notNull()
		.references(() => clip.clip_id, { onDelete: "cascade" }),
	user_id: text("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	created_at: timestamp("created_at", {
		withTimezone: true,
	}).defaultNow(),
});

//

export const commentLike = pgTable("comment_like", {
	comment_like_id: text("comment_like_id")
		.primaryKey()
		.$defaultFn(() => crypto.randomUUID()),
	comment_id: text("comment_id")
		.notNull()
		.references(() => clipComment.comment_id, { onDelete: "cascade" }),
	user_id: text("user_id")
		.notNull()
		.references(() => users.id, { onDelete: "cascade" }),
	created_at: timestamp("created_at", {
		withTimezone: true,
	}).defaultNow(),
});