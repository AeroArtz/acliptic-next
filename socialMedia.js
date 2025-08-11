const amqp = require('amqplib');
const axios = require('axios');
const https = require('https');
const fetch = require('node-fetch');

const agent = new https.Agent({
    rejectUnauthorized: false
});
// RabbitMQ Configuration
const RABBITMQ_CONFIG = {
    host: 'localhost',
    port: 5672,
    username: 'guest',
    password: 'guest',
    exchange: 'stream_processing',
    exchange_type: 'topic',
    connection_attempts: 3,
    retry_delay: 5
};

const QUEUES = {
    processing: 'stream.start_processing',
    transcription: 'stream.transcription',
    ml_inference: 'stream.ml_inference',
    reframing: 'stream.reframing',
    cloud_upload: 'stream.cloud_upload',
    styling: 'stream.styling',
    social_media: 'stream.social_media'
};

const ROUTING_KEYS = {
    plugin_launched: 'stream.*.monitor.start',
    segment_extracted: 'stream.*.segment.extracted',
    segment_transcribed: 'stream.*.segment.transcribed',
    segment_analyzed: 'stream.*.segment.analyzed',
    segment_reframed: 'stream.*.segment.reframed',
    segment_uploaded: 'stream.*.segment.uploaded',
    segment_styled: 'stream.*.segment.styled',
    segment_published: 'stream.*.segment.published'
};

const SERVICE_CONFIG = {
    max_retries: 3,
    retry_delay: 5, // seconds
    prefetch_count: 1
};

// Utility Functions
async function getConnection() {
    const credentials = amqp.credentials.plain(RABBITMQ_CONFIG.username, RABBITMQ_CONFIG.password);
    const connection = await amqp.connect({
        hostname: RABBITMQ_CONFIG.host,
        port: RABBITMQ_CONFIG.port,
        credentials,
        heartbeat: 600, // Keep connection alive
        connectionTimeout: 10000 // 10 seconds
    });
    return connection;
}

async function setupExchange(channel) {
    await channel.assertExchange(RABBITMQ_CONFIG.exchange, RABBITMQ_CONFIG.exchange_type, { durable: true });
}

async function declareQueue(channel, queueName) {
    return channel.assertQueue(queueName, { durable: true });
}

async function bindQueue(channel, queueName, routingKey) {
    await channel.bindQueue(queueName, RABBITMQ_CONFIG.exchange, routingKey);
}

async function publishMessage(channel, routingKey, message) {
    await channel.publish(
        RABBITMQ_CONFIG.exchange,
        routingKey,
        Buffer.from(JSON.stringify(message)),
        { persistent: true }
    );
}

// Social Media Service
async function startSocialMediaService() {
    try {
        // Connect to RabbitMQ
        const connection = await getConnection();
        const channel = await connection.createChannel();
        
        // Set up exchange, queue, and bindings
        await setupExchange(channel);
        await declareQueue(channel, QUEUES.social_media);
        await bindQueue(channel, QUEUES.social_media, ROUTING_KEYS.segment_styled);
        
        // Set prefetch count
        await channel.prefetch(SERVICE_CONFIG.prefetch_count);
        
        console.log("Social media service started, waiting for styled segments...");

        // Consume messages from the queue
        channel.consume(QUEUES.social_media, async (msg) => {
            if (msg !== null) {
                try {
                    const data = JSON.parse(msg.content.toString());
                    const { 
                        segment_id, 
                        stream_id,
                        clip_id,
                        captions,
                        public_url_captioned,
                        transcription,
                        confidence,
                        streamer_id,
                        metadata

                    } = data;

                    console.log(`data : ${JSON.stringify(data)}`)

                    console.log(`Processing segment ${segment_id} for social media upload`);
 
                    // Call your existing Next.js API endpoint
                    const response = await fetch("https://localhost:3000/api/clips/upload_clip", {
                        method: "POST",
                        headers: {
                            "Content-Type": "application/json",
                        }, 
                        body: JSON.stringify({
                            user_id: streamer_id,
                            title: "Test Video",
                            clip_id: clip_id,
                            clip_created_at: new Date(Date.now()),
                            description: transcription || "Test Description",
                            video_path: public_url_captioned,
                        }),
                        agent: agent  // Apply the custom agent only to this request

                    });

                    if (!response.ok) {
                        throw new Error(`HTTP error! Status: ${response.status}`);
                    }

                    const result = await response.json(); // Parse the response JSON

                    console.log(`response : ${JSON.stringify(response)}`)
                    console.log(result)
                    // Publish results back to RabbitMQ
                    const routingKey = `stream.${segment_id}.segment.published`;
                    const message = {
                        segment_id,
                        result: result.results || [], // Use a default value if `results` is not returned
                        metadata: {
                            processed_at: Date.now(),
                            service: 'social_media'
                        }
                    };
                    
                    await publishMessage(channel, routingKey, message);
                    
                    console.log(`Published results for segment ${segment_id}`);
                    channel.ack(msg); // Acknowledge the message
                } catch (error) {
                    console.error(`Error processing segment ${error.message}`);
                    channel.nack(msg, false, true); // Requeue the message for retry
                }
            }
        });

    } catch (error) {
        console.error(`Fatal error: ${error.message}`);
        process.exit(1); // Exit the process on fatal errors
    }
}

startSocialMediaService();