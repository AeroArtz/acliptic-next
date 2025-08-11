CREATE TABLE IF NOT EXISTS streamer (
    streamer_id SERIAL PRIMARY KEY,
    email VARCHAR(255) UNIQUE,    
    password_hash VARCHAR(255),
    profile_picture_link TEXT,
    date_of_birth DATE,
    phone_number VARCHAR(20),
    first_name VARCHAR(50),
    last_name VARCHAR(50),
    twitch_username VARCHAR(255),
    account_status VARCHAR(10) DEFAULT 'active' CHECK (account_status IN ('active', 'suspended', 'deleted')),
    last_login_at TIMESTAMPTZ,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);
CREATE TABLE IF NOT EXISTS streamer_auth_provider (
    auth_provider_id SERIAL PRIMARY KEY,
    streamer_id INTEGER NOT NULL REFERENCES streamer(streamer_id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL,
    provider_info JSONB,
    auth_status VARCHAR(10) DEFAULT 'active' CHECK (auth_status IN ('active', 'expired', 'revoked', 'failed')),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (streamer_id, provider)
);

CREATE TABLE IF NOT EXISTS password_recovery (
    recovery_id SERIAL PRIMARY KEY,
    streamer_id INTEGER NOT NULL REFERENCES streamer(streamer_id) ON DELETE CASCADE,
    recovery_code VARCHAR(100) NOT NULL,
    is_used BOOLEAN DEFAULT false,
    expires_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (streamer_id, recovery_code)
);

CREATE TABLE IF NOT EXISTS analytics (
    analytics_id SERIAL PRIMARY KEY,
    streamer_id INTEGER NOT NULL REFERENCES streamer(streamer_id) ON DELETE CASCADE,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    clips_likes INTEGER DEFAULT 0 CHECK (clips_likes >= 0),
    clips_views INTEGER DEFAULT 0 CHECK (clips_views >= 0),
    clips_shares INTEGER DEFAULT 0 CHECK (clips_shares >= 0),
    clips_comments INTEGER DEFAULT 0 CHECK (clips_comments >= 0),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (streamer_id, period_start, period_end),
    CONSTRAINT valid_period CHECK (period_end >= period_start)
);

CREATE TABLE IF NOT EXISTS social_media_platform (
    platform_id SERIAL PRIMARY KEY,
    platform_name VARCHAR(50) UNIQUE NOT NULL,
    platform_link TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE IF NOT EXISTS social_media_handle (
    handle_id SERIAL PRIMARY KEY,
    streamer_id INTEGER NOT NULL REFERENCES streamer(streamer_id) ON DELETE CASCADE,
    platform_id INTEGER NOT NULL REFERENCES social_media_platform(platform_id),
    account_handle VARCHAR(100) NOT NULL,
    access_token TEXT NOT NULL,
    refresh_token TEXT,
    token_expires_at TIMESTAMPTZ,
    last_refresh_attempt TIMESTAMPTZ,
    connection_status VARCHAR(10) DEFAULT 'active' CHECK (connection_status IN ('active', 'expired', 'revoked', 'failed')),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (streamer_id, platform_id),
    UNIQUE (platform_id, account_handle)
);

CREATE TABLE IF NOT EXISTS stream (
    stream_id SERIAL PRIMARY KEY,
    streamer_id INTEGER NOT NULL REFERENCES streamer(streamer_id) ON DELETE CASCADE,
    stream_title VARCHAR(255),
    stream_link VARCHAR(255),
    stream_start TIMESTAMPTZ,
    stream_end TIMESTAMPTZ,
    audio_link TEXT,
    transcript TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_stream_times CHECK (stream_end IS NULL OR stream_end > stream_start)
);

CREATE TABLE IF NOT EXISTS clip (
    clip_id SERIAL PRIMARY KEY,
    stream_id INTEGER NOT NULL REFERENCES stream(stream_id) ON DELETE CASCADE,
    start_time INTEGER NOT NULL CHECK (start_time >= 0),
    end_time INTEGER NOT NULL,
    applied_effects JSONB,
    subtitles TEXT,
    thumbnail_link TEXT,
    clip_link TEXT,
    confidence_score DECIMAL(5,2),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_clip_times CHECK (end_time > start_time)
);

CREATE TABLE IF NOT EXISTS uploaded_clip (
    upload_id SERIAL PRIMARY KEY,
    clip_id INTEGER NOT NULL REFERENCES clip(clip_id) ON DELETE CASCADE,
    social_media_handle_id INTEGER NOT NULL REFERENCES social_media_handle(handle_id),
    upload_link TEXT NOT NULL,
    uploaded_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (clip_id, social_media_handle_id)
);

CREATE TABLE IF NOT EXISTS chat_activity (
    activity_id SERIAL PRIMARY KEY,
    stream_id INTEGER NOT NULL REFERENCES stream(stream_id) ON DELETE CASCADE,
    activity_type VARCHAR(50),
    posted_at TIMESTAMPTZ NOT NULL,
    user_handle VARCHAR(100) NOT NULL,
    message TEXT NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
);



CREATE TABLE IF NOT EXISTS streamer_auth_provider (
    auth_provider_id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    provider VARCHAR(50) NOT NULL,
    provider_info JSONB,
    auth_status VARCHAR(10) DEFAULT 'active' CHECK (auth_status IN ('active', 'expired', 'revoked', 'failed')),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, provider)
);

CREATE TABLE IF NOT EXISTS analytics (
    analytics_id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    period_start DATE NOT NULL,
    period_end DATE NOT NULL,
    clips_likes INTEGER DEFAULT 0 CHECK (clips_likes >= 0),
    clips_views INTEGER DEFAULT 0 CHECK (clips_views >= 0),
    clips_shares INTEGER DEFAULT 0 CHECK (clips_shares >= 0),
    clips_comments INTEGER DEFAULT 0 CHECK (clips_comments >= 0),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, period_start, period_end),
    CONSTRAINT valid_period CHECK (period_end >= period_start)
);

CREATE TABLE IF NOT EXISTS social_media_handle (
    handle_id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    platform_id INTEGER NOT NULL REFERENCES social_media_platform(platform_id),
    account_handle VARCHAR(100) NOT NULL,
    access_token TEXT NOT NULL,
    refresh_token TEXT,
    token_expires_at TIMESTAMPTZ,
    last_refresh_attempt TIMESTAMPTZ,
    connection_status VARCHAR(10) DEFAULT 'active' CHECK (connection_status IN ('active', 'expired', 'revoked', 'failed')),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (user_id, platform_id),
    UNIQUE (platform_id, account_handle)
);

CREATE TABLE IF NOT EXISTS stream (
    stream_id SERIAL PRIMARY KEY,
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    stream_title VARCHAR(255),
    stream_link VARCHAR(255),
    stream_start TIMESTAMPTZ,
    stream_end TIMESTAMPTZ,
    audio_link TEXT,
    transcript TEXT,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_stream_times CHECK (stream_end IS NULL OR stream_end > stream_start)
);

CREATE TABLE IF NOT EXISTS clip (
    clip_id SERIAL PRIMARY KEY,
    stream_id INTEGER NOT NULL REFERENCES stream(stream_id) ON DELETE CASCADE,
    start_time INTEGER NOT NULL CHECK (start_time >= 0),
    end_time INTEGER NOT NULL,
    applied_effects JSONB,
    subtitles TEXT,
    thumbnail_link TEXT,
    clip_link TEXT,
    confidence_score DECIMAL(5,2),
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT valid_clip_times CHECK (end_time > start_time)
);

CREATE TABLE IF NOT EXISTS uploaded_clip (
    upload_id SERIAL PRIMARY KEY,
    clip_id INTEGER NOT NULL REFERENCES clip(clip_id) ON DELETE CASCADE,
    social_media_handle_id INTEGER NOT NULL REFERENCES social_media_handle(handle_id),
    upload_link TEXT NOT NULL,
    uploaded_at TIMESTAMPTZ NOT NULL,
    created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (clip_id, social_media_handle_id)
);


ok based on this table i need to create some api routes for me use:
i will list the name of the structure, eg. api/stream/[streamId]/route.ts, and so on.

