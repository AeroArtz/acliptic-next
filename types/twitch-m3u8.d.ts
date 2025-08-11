declare module 'twitch-m3u8' {
    interface StreamData {
        quality: string;
        resolution: string;
        url: string;
    }

    const getStream: (username: string) => Promise<StreamData>;
    export { getStream };
}
