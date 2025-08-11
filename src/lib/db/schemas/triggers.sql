CREATE TRIGGER update_streamer_updated_at
    BEFORE UPDATE ON streamer
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_streamer_auth_provider_updated_at
    BEFORE UPDATE ON streamer_auth_provider
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_password_recovery_updated_at
    BEFORE UPDATE ON password_recovery
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_analytics_updated_at
    BEFORE UPDATE ON analytics
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_social_media_platform_updated_at
    BEFORE UPDATE ON social_media_platform
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_social_media_handle_updated_at
    BEFORE UPDATE ON social_media_handle
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_stream_updated_at
    BEFORE UPDATE ON stream
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_clip_updated_at
    BEFORE UPDATE ON clip
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_uploaded_clip_updated_at
    BEFORE UPDATE ON uploaded_clip
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_chat_activity_updated_at
    BEFORE UPDATE ON chat_activity
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();