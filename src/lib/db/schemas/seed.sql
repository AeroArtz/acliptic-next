INSERT INTO streamer (streamer_id, email, password_hash, profile_picture_link, date_of_birth, phone_number, first_name, last_name, account_status, last_login_at)
VALUES
(101, 'streamer1@example.com', 'hash1', 'https://example.com/profile1.png', '1995-06-15', '+1234567890', 'Alice', 'Smith', 'active', '2025-01-08 10:45:30'),
(102, 'streamer2@example.com', 'hash2', 'https://example.com/profile2.png', '1990-04-22', '+1987654321', 'Bob', 'Johnson', 'suspended', '2025-01-05 14:20:15'),
(103, 'streamer3@example.com', 'hash3', 'https://example.com/profile3.png', '1988-11-05', '+1123456789', 'Charlie', 'Brown', 'deleted', '2024-12-30 08:00:00'),
(104, 'streamer4@example.com', 'hash4', 'https://example.com/profile4.png', '2000-01-12', '+1222333444', 'Diana', 'Prince', 'active', '2025-01-09 16:10:45'),
(105, 'streamer5@example.com', 'hash5', 'https://example.com/profile5.png', '1998-07-30', '+1333444555', 'Ethan', 'Hunt', 'active', '2025-01-07 11:55:00');

INSERT INTO stream (stream_id, streamer_id, stream_title, stream_link, stream_start, stream_end, audio_link, transcript)
VALUES
(201, 101, 'Morning Gaming Session', 'https://example.com/stream1', '2025-01-08 07:00:00', '2025-01-08 09:00:00', 'https://example.com/audio1.mp3', 'Welcome to my stream!'),
(202, 104, 'Cooking Live: Easy Recipes', 'https://example.com/stream3', '2025-01-09 17:00:00', '2025-01-09 18:30:00', 'https://example.com/audio3.mp3', 'Let’s cook something simple and tasty.'),
(203, 105, 'Fitness Hour with Ethan', 'https://example.com/stream4', '2025-01-07 10:00:00', '2025-01-07 11:00:00', 'https://example.com/audio4.mp3', 'Join me for a fitness session.'),
(204, 101, 'Late Night Chill Stream', 'https://example.com/stream5', '2025-01-08 22:00:00', '2025-01-09 00:00:00', 'https://example.com/audio5.mp3', 'Relax and unwind with me tonight.');

INSERT INTO clip (clip_id, stream_id, start_time, end_time, applied_effects, subtitles, thumbnail_link, clip_link, confidence_score)
VALUES
(301, 201, 0, 600, '{"filter": "black_and_white", "speed": "1.5x"}', 'Welcome to my stream!', 'https://example.com/thumb1.jpg', 'https://example.com/clip1.mp4', 0.95),
(302, 201, 601, 1200, '{"filter": "sepia", "speed": "1x"}', 'Let’s dive into today’s game.', 'https://example.com/thumb2.jpg', 'https://example.com/clip2.mp4', 0.92),
(303, 202, 0, 300, '{"filter": "vintage", "speed": "1x"}', 'Today we’re making a quick breakfast!', 'https://example.com/thumb3.jpg', 'https://example.com/clip3.mp4', 0.98),
(305, 204, 1201, 1800, '{"filter": "retro", "speed": "1.25x"}', 'The game’s getting intense now!', 'https://example.com/thumb5.jpg', 'https://example.com/clip5.mp4', 0.90);

INSERT INTO streamer_auth_provider (auth_provider_id, streamer_id, provider, provider_info, auth_status)
VALUES
(401, 101, 'twitch', '{"access_token": "token123", "refresh_token": "refresh123"}', 'active'),
(402, 102, 'youtube', '{"access_token": "token456", "refresh_token": "refresh456"}', 'active'),
(403, 103, 'discord', '{"access_token": "token789", "refresh_token": "refresh789"}', 'expired'),
(404, 104, 'twitch', '{"access_token": "token012", "refresh_token": "refresh012"}', 'active'),
(405, 105, 'youtube', '{"access_token": "token345", "refresh_token": "refresh345"}', 'active');

INSERT INTO password_recovery (recovery_id, streamer_id, recovery_code, is_used, expires_at)
VALUES
(501, 101, 'REC123456', false, '2025-02-12 10:00:00'),
(502, 102, 'REC789012', true, '2025-02-10 15:00:00'),
(503, 104, 'REC345678', false, '2025-02-15 12:00:00'),
(504, 105, 'REC901234', false, '2025-02-14 09:00:00');

INSERT INTO analytics (analytics_id, streamer_id, period_start, period_end, clips_likes, clips_views, clips_shares, clips_comments)
VALUES
(601, 101, '2025-01-01', '2025-01-31', 1500, 25000, 300, 450),
(602, 102, '2025-01-01', '2025-01-31', 2000, 35000, 400, 600),
(603, 104, '2025-01-01', '2025-01-31', 1800, 30000, 350, 500),
(604, 105, '2025-01-01', '2025-01-31', 2200, 40000, 450, 700);

INSERT INTO social_media_platform (platform_id, platform_name, platform_link)
VALUES
(701, 'YouTube', 'https://youtube.com'),
(702, 'Twitter', 'https://twitter.com'),
(703, 'Instagram', 'https://instagram.com'),
(704, 'TikTok', 'https://tiktok.com'),
(705, 'Facebook', 'https://facebook.com');

INSERT INTO social_media_handle (handle_id, streamer_id, platform_id, account_handle, access_token, refresh_token, token_expires_at, connection_status)
VALUES
(801, 101, 701, '@alicegaming', 'yt_token_123', 'yt_refresh_123', '2025-02-12 00:00:00', 'active'),
(802, 101, 702, '@alicegames', 'tw_token_123', 'tw_refresh_123', '2025-02-12 00:00:00', 'active'),
(803, 104, 703, '@dianacooks', 'ig_token_123', 'ig_refresh_123', '2025-02-12 00:00:00', 'active'),
(804, 105, 704, '@ethanfitness', 'tt_token_123', 'tt_refresh_123', '2025-02-12 00:00:00', 'active'),
(805, 105, 705, '@ethanhuntfit', 'fb_token_123', 'fb_refresh_123', '2025-02-12 00:00:00', 'active');

INSERT INTO chat_activity (activity_id, stream_id, activity_type, posted_at, user_handle, message)
VALUES
(901, 201, 'chat', '2025-01-08 07:15:00', 'viewer1', 'Great stream!'),
(902, 201, 'subscription', '2025-01-08 07:30:00', 'viewer2', 'Just subscribed!'),
(903, 202, 'chat', '2025-01-09 17:15:00', 'viewer3', 'Love this recipe!'),
(904, 203, 'donation', '2025-01-07 10:30:00', 'viewer4', 'Keep up the great work!'),
(905, 204, 'chat', '2025-01-08 22:30:00', 'viewer5', 'This is so relaxing');

INSERT INTO uploaded_clip (upload_id, clip_id, social_media_handle_id, upload_link, uploaded_at)
VALUES
(1001, 301, 801, 'https://youtube.com/clip1', '2025-01-09 10:00:00'),
(1002, 302, 802, 'https://twitter.com/clip2', '2025-01-09 11:00:00'),
(1003, 303, 803, 'https://instagram.com/clip3', '2025-01-10 09:00:00'),
(1004, 305, 804, 'https://tiktok.com/clip4', '2025-01-10 10:00:00');