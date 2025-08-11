import { NextResponse } from "next/server";

/* 
THE PLAN:
FETCH LISTS OF VIDEOS RATHER THAN ONE BY ONE?
SO WE QUERY THE uploaded_clips TABLE, FOR THE LAST 10 STREAM IDs WE CALCULATE TOTAL NUMBER OF CLIPS, EG. 40 CLIPS
WE FETCH FIRST 40 CLIPS FROM INSTA AND FROM YOUTUBE THEN GET ANALYTCIS FOR THEM AND DO ALL THE CALCULATIONS
AND ALSO MAYBE STORE IN THE DATABASE?
*/



// GET https://www.googleapis.com/youtube/v3/search?part=snippet&channelId={CHANNEL_ID}&maxResults=10&order=date&type=video&key={YOUR_API_KEY}

// Define interfaces for API responses
interface YouTubeComment {
  author: string;
  text: string;
  likes: number;
}

interface YouTubeAnalytics {
  views: string | number;
  likes: string | number;
  comments: string | number;
  shares: string | number | null;
  topComments?: YouTubeComment[];
}

interface InstagramAnalytics {
  views: number;
  likes: number;
  comments: number;
  shares: number;
}

interface YouTubeCommentItem {
  snippet: {
    topLevelComment: {
      snippet: {
        authorDisplayName: string;
        textDisplay: string;
        likeCount: number;
      }
    }
  }
}

interface InstagramMetric {
  name: string;
  values: Array<{
    value: number;
  }>;
}

// Helper function to fetch analytics for YouTube Shorts
async function fetchYouTubeAnalytics(url: string, apiKey: string): Promise<YouTubeAnalytics> {
  const videoId = extractYouTubeVideoId(url);
  if (!videoId) throw new Error("Invalid YouTube URL");

  const analyticsEndpoint = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoId}&key=${apiKey}`;
  const commentsEndpoint = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&maxResults=5&key=${apiKey}`;

  // Fetch analytics
  const analyticsResponse = await fetch(analyticsEndpoint);
  if (!analyticsResponse.ok) {
    const errorText = await analyticsResponse.text();
    throw new Error(`Failed to fetch YouTube analytics: ${errorText}`);
  }
  const analyticsData = await analyticsResponse.json();
  const statistics = analyticsData.items[0]?.statistics || {};

  // Fetch top 5 comments
  const commentsResponse = await fetch(commentsEndpoint);
  if (!commentsResponse.ok) {
    const errorText = await commentsResponse.text();
    throw new Error(`Failed to fetch YouTube comments: ${errorText}`);
  }
  const commentsData = await commentsResponse.json();

  const comments = commentsData.items.map((item: YouTubeCommentItem) => ({
    author: item.snippet.topLevelComment.snippet.authorDisplayName,
    text: item.snippet.topLevelComment.snippet.textDisplay,
    likes: item.snippet.topLevelComment.snippet.likeCount,
  }))
  .sort((a: YouTubeComment, b: YouTubeComment) => b.likes - a.likes) // Sort comments by likes in descending order
  .slice(0, 5); // Take the top 5 comments

  return {
    views: statistics.viewCount,
    likes: statistics.likeCount,
    comments: statistics.commentCount,
    shares: null, // YouTube API doesn't provide share count
    topComments: comments,
  };
}

// Helper function to fetch analytics for Instagram Reels
async function fetchInstagramAnalytics(mediaId: string, accessToken: string): Promise<InstagramAnalytics> {
  const analyticsEndpoint = `https://graph.instagram.com/v19.0/${mediaId}/insights?metric=reach,likes,comments,shares&period=lifetime&access_token=${accessToken}`;

  // Fetch analytics
  const analyticsResponse = await fetch(analyticsEndpoint);
  if (!analyticsResponse.ok) {
    const errorText = await analyticsResponse.text();
    throw new Error(`Failed to fetch Instagram analytics: ${errorText}`);
  }
  const analyticsData = await analyticsResponse.json();

  return {
    views: analyticsData.data.find((metric: InstagramMetric) => metric.name === "reach")?.values[0].value || 0,
    likes: analyticsData.data.find((metric: InstagramMetric) => metric.name === "likes")?.values[0].value || 0,
    comments: analyticsData.data.find((metric: InstagramMetric) => metric.name === "comments")?.values[0].value || 0,
    shares: analyticsData.data.find((metric: InstagramMetric) => metric.name === "shares")?.values[0].value || 0,
  };
}


// Extract YouTube Video ID from URL
function extractYouTubeVideoId(url: string): string | null {
  const match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/);
  return match ? match[1] : null;
}



export async function POST(req: Request) {
  try {
    // Parse JSON body safely
    let body;
    try {
      body = await req.json();
    } catch (err) {
      console.log(err)
      throw new Error("Invalid JSON body");
    }

    const { urls } = body;

    // Validate `urls` field
    if (!urls || !Array.isArray(urls)) {
      return NextResponse.json(
        { error: "Invalid input. Expected an array of URLs." },
        { status: 400 }
      );
    }

    // First, get the media ID from the short code
    async function getInstagramMediaId(shortcode: string, accessToken: string) {
      
      // First, get your Instagram user ID (you need to know this beforehand or get it from the token)
      const userEndpoint = `https://graph.instagram.com/me?fields=id&access_token=${accessToken}`;
      
      const userResponse = await fetch(userEndpoint);
      if (!userResponse.ok) {
        const errorText = await userResponse.text();
        throw new Error(`Failed to get Instagram user ID: ${errorText}`);
      }
      
      const userData = await userResponse.json();
      const userId = userData.id;
      
      // Now get your media list
      const mediaEndpoint = `https://graph.instagram.com/${userId}/media?access_token=${accessToken}`;
      
      const mediaResponse = await fetch(mediaEndpoint);
      if (!mediaResponse.ok) {
        const errorText = await mediaResponse.text();
        throw new Error(`Failed to get Instagram media list: ${errorText}`);
      }
      
      const mediaData = await mediaResponse.json();
      
      // Find the media with the matching shortcode or permalink containing the shortcode
      for (const mediaItem of mediaData.data) {
        // Get media details to check permalink or other identifiers
        const mediaDetailEndpoint = `https://graph.instagram.com/${mediaItem.id}?fields=permalink,media_url&access_token=${accessToken}`;
        const detailResponse = await fetch(mediaDetailEndpoint);
        if (!detailResponse.ok) continue;
        
        const mediaDetail = await detailResponse.json();
        
        if (mediaDetail.permalink && mediaDetail.permalink.includes(shortcode)) {
          return mediaItem.id;
        }
      }
      
      throw new Error(`Could not find media with shortcode: ${shortcode}`);
    }

    function extractInstagramShortcode(url: string) {
      // Try to match common Instagram URL patterns
      const reelMatch = url.match(/instagram\.com\/reel\/([^/?#]+)/);
      const pMatch = url.match(/instagram\.com\/p\/([^/?#]+)/);
      const tvMatch = url.match(/instagram\.com\/tv\/([^/?#]+)/);
      
      // Return the first matching shortcode
      return reelMatch?.[1] || pMatch?.[1] || tvMatch?.[1] || null;
    }

    const apiKey = "AIzaSyDyuySRLYCZEbWg9VUPNJvou2ZJNPSnEpU";
    const instagramAccessToken = "IGAATPmRbEfKlBZAE1uaEZABZAXBWSVRFUWNPN3o1Ym1yTmVKMEY5WVVsMVR6MEcwWkJVUHdpYWJvcm4tSldsU3dKM3pncC1rcG5neUFCMGl0dDNHcjJCTGFaQ2xrVkc0SVVFaUdXOEhVXzc3d0JQOUdTc180X0wwSU16ZAGo5V0lCTQZDZD";


    const analyticsPromises = urls.map(async ({ platform, url }: { platform: string; url: string }) => {
      if (platform === "youtube") {
        return { platform, url, analytics: await fetchYouTubeAnalytics(url, apiKey) };
      } else if (platform === "instagram") {
          const shortcode = extractInstagramShortcode(url);
          if (!shortcode) {
            throw new Error("Invalid Instagram URL - Could not extract shortcode");
          }
          if (!instagramAccessToken) {
            throw new Error("Missing Instagram access token");
          }
          const mediaId = await getInstagramMediaId(shortcode, instagramAccessToken);
          console.log("Extracted Instagram shortcode:", shortcode); // Add this for debugging
          return { platform, url, analytics: await fetchInstagramAnalytics(mediaId, instagramAccessToken) };
      } else {
        throw new Error(`Unsupported platform: ${platform}`);
      }
    });

    const analyticsData = await Promise.all(analyticsPromises);
    return NextResponse.json({ data: analyticsData });
  } catch (error) {
    console.error(error);

    const errorMessage =
      error instanceof Error ? error.message : "Unknown error occurred";

    return NextResponse.json(
      { error: "Failed to fetch analytics", details: errorMessage },
      { status: 500 }
    );
  }
}

// import { NextResponse } from "next/server";
// // import { createClient } from "@/lib/supabase/server";

// // Define TypeScript interfaces
// interface RequestBody {
//   fetchMethod?: string;
//   urls?: Array<{platform: string, url: string}>;
//   calculateLimit?: boolean;
//   limit?: number;
//   storeInDatabase?: boolean;
// }

// interface YoutubeComment {
//   author: string;
//   text: string;
//   likes: number;
// }

// interface YoutubeAnalytics {
//   views: string | number;
//   likes: string | number;
//   comments: string | number;
//   shares: string | number | null;
//   topComments?: YoutubeComment[];
// }

// interface InstagramComment {
//   username: string;
//   text: string;
//   timestamp: string;
//   like_count: number;
// }

// interface InstagramAnalytics {
//   views: string | number;
//   likes: string | number;
//   comments: string | number;
//   shares: string | number;
//   topComments?: InstagramComment[];
// }

// interface AnalyticsItem {
//   platform: string;
//   id: string;
//   url: string;
//   title?: string;
//   publishedAt?: string;
//   analytics: YoutubeAnalytics | InstagramAnalytics;
// }

// interface AggregatedAnalytics {
//   platform: string;
//   totalViews: number;
//   totalLikes: number;
//   totalComments: number;
//   totalShares: number;
//   topComments?: YoutubeComment[];
//   itemCount: number;
// }

// interface YoutubeBatchAnalytics {
//   videoId: string;
//   views: string | number;
//   likes: string | number;
//   comments: string | number;
//   shares: string | number | null;
// }

// interface YoutubeCommentsBatch {
//   videoId: string;
//   comments: YoutubeComment[];
// }

// interface InstagramBatchAnalytics {
//   mediaId: string;
//   error?: string;
//   views: number;
//   likes: number;
//   comments: number;
//   shares: number;
//   topComments?: InstagramComment[];
// }

// interface Stream {
//   stream_id: string; // Adjust the type if necessary
// }

// // Helper function to calculate limit based on recent streams
// async function calculateLimitFromStreamData(supabase: any, userId: string): Promise<number> {
//   try {
//     // Get the 10 most recent streams for the user
//     const { data: recentStreams, error: streamsError } = await supabase
//       .from('streams')
//       .select('stream_id')
//       .eq('user_id', userId)
//       .order('created_at', { ascending: false })
//       .limit(10);
    
//     if (streamsError || !recentStreams || recentStreams.length === 0) {
//       console.error("Error fetching recent streams:", streamsError);
//       return 10; // Default if no streams found or error
//     }
    
//     // Extract stream IDs
//     const streamIds = recentStreams.map((stream: Stream) => stream.stream_id); // Explicitly define the type here
    
//     // Get the total count of clips for these streams
//     const { data: clipCountData, error: clipCountError } = await supabase
//       .from('uploaded_clips')
//       .select('stream_id', { count: 'exact' })
//       .in('stream_id', streamIds);
    
//     if (clipCountError) {
//       console.error("Error counting clips:", clipCountError);
//       return 10; // Default on error
//     }
    
//     const totalClips = clipCountData ? clipCountData.length : 0;
    
//     // Return the calculated limit (with a minimum of 10 and a reasonable maximum)
//     return Math.max(10, Math.min(totalClips, 100)); // Min 10, max 100
//   } catch (error) {
//     console.error("Error in calculateLimitFromStreamData:", error);
//     return 10; // Default on any error
//   }
// }

// // Helper function to fetch analytics for YouTube Shorts
// async function fetchYouTubeAnalytics(url: string, accessToken: string): Promise<YoutubeAnalytics> {
//   const videoId = extractYouTubeVideoId(url);
//   if (!videoId) throw new Error("Invalid YouTube URL");

//   const analyticsEndpoint = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoId}&access_token=${accessToken}`;
//   const commentsEndpoint = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&maxResults=5&access_token=${accessToken}`;

//   // Fetch analytics
//   const analyticsResponse = await fetch(analyticsEndpoint);
//   if (!analyticsResponse.ok) {
//     const errorText = await analyticsResponse.text();
//     throw new Error(`Failed to fetch YouTube analytics: ${errorText}`);
//   }
//   const analyticsData = await analyticsResponse.json();
//   const statistics = analyticsData.items[0]?.statistics || {};

//   // Fetch top 5 comments
//   const commentsResponse = await fetch(commentsEndpoint);
//   if (!commentsResponse.ok) {
//     const errorText = await commentsResponse.text();
//     throw new Error(`Failed to fetch YouTube comments: ${errorText}`);
//   }
//   const commentsData = await commentsResponse.json();

//   const comments = commentsData.items.map((item: any) => ({
//     author: item.snippet.topLevelComment.snippet.authorDisplayName,
//     text: item.snippet.topLevelComment.snippet.textDisplay,
//     likes: item.snippet.topLevelComment.snippet.likeCount,
//   }))
//   .sort((a: YoutubeComment, b: YoutubeComment) => b.likes - a.likes) // Sort comments by likes in descending order
//   .slice(0, 5); // Take the top 5 comments

//   return {
//     views: statistics.viewCount,
//     likes: statistics.likeCount,
//     comments: statistics.commentCount,
//     shares: null, // YouTube API doesn't provide share count
//     topComments: comments,
//   };
// }

// // Helper function to fetch analytics for Instagram Reels
// async function fetchInstagramAnalytics(mediaId: string, accessToken: string): Promise<InstagramAnalytics> {
//   const analyticsEndpoint = `https://graph.instagram.com/v19.0/${mediaId}/insights?metric=reach,likes,comments,shares&period=lifetime&access_token=${accessToken}`;

//   // Fetch analytics
//   const analyticsResponse = await fetch(analyticsEndpoint);
//   if (!analyticsResponse.ok) {
//     const errorText = await analyticsResponse.text();
//     throw new Error(`Failed to fetch Instagram analytics: ${errorText}`);
//   }
//   const analyticsData = await analyticsResponse.json();

//   return {
//     views: analyticsData.data.find((metric: any) => metric.name === "reach")?.values[0].value || 0,
//     likes: analyticsData.data.find((metric: any) => metric.name === "likes")?.values[0].value || 0,
//     comments: analyticsData.data.find((metric: any) => metric.name === "comments")?.values[0].value || 0,
//     shares: analyticsData.data.find((metric: any) => metric.name === "shares")?.values[0].value || 0,
//   };
// }

// // Extract YouTube Video ID from URL
// function extractYouTubeVideoId(url: string): string | null {
//   const match = url.match(/(?:https?:\/\/)?(?:www\.)?(?:youtube\.com\/watch\?v=|youtu\.be\/)([\w-]{11})/);
//   return match ? match[1] : null;
// }

// // Function to get recent YouTube videos from a channel
// async function fetchRecentYouTubeVideos(channelId: string, maxResults: number, accessToken: string): Promise<Array<{id: string, url: string, title: string, publishedAt: string}>> {
//   const endpoint = `https://www.googleapis.com/youtube/v3/search?part=snippet&channelId=${channelId}&maxResults=${maxResults}&order=date&type=video&access_token=${accessToken}`;
  
//   const response = await fetch(endpoint);
//   if (!response.ok) {
//     throw new Error(`Failed to fetch YouTube videos: ${await response.text()}`);
//   }
  
//   const data = await response.json();
//   return data.items.map((item: any) => ({
//     id: item.id.videoId,
//     url: `https://youtube.com/watch?v=${item.id.videoId}`,
//     title: item.snippet.title,
//     publishedAt: item.snippet.publishedAt
//   }));
// }

// // Function to get recent Instagram media - UPDATED to include all types of posts
// async function fetchRecentInstagramMedia(userId: string, limit: number, accessToken: string): Promise<Array<{id: string, url: string, mediaType: string, publishedAt: string}>> {
//   const endpoint = `https://graph.instagram.com/${userId}/media?fields=id,media_type,permalink,thumbnail_url,media_url,timestamp&limit=${limit}&access_token=${accessToken}`;
  
//   const response = await fetch(endpoint);
//   if (!response.ok) {
//     throw new Error(`Failed to fetch Instagram media: ${await response.text()}`);
//   }
  
//   const data = await response.json();
//   // Include ALL media types now, not just filtering for videos
//   return data.data.map((item: any) => ({
//     id: item.id,
//     url: item.permalink,
//     mediaType: item.media_type,
//     publishedAt: item.timestamp
//   }));
// }

// // Batch YouTube analytics
// async function fetchYouTubeBatchAnalytics(videoIds: string[], accessToken: string): Promise<YoutubeBatchAnalytics[]> {
//   // Join video IDs with commas for the API
//   const idsString = videoIds.join(',');
  
//   const analyticsEndpoint = `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${idsString}&access_token=${accessToken}`;
  
//   const analyticsResponse = await fetch(analyticsEndpoint);
//   if (!analyticsResponse.ok) {
//     throw new Error(`Failed to fetch YouTube batch analytics: ${await analyticsResponse.text()}`);
//   }
  
//   const analyticsData = await analyticsResponse.json();
  
//   // Process each video's analytics
//   return analyticsData.items.map((item: any) => ({
//     videoId: item.id,
//     views: item.statistics.viewCount,
//     likes: item.statistics.likeCount,
//     comments: item.statistics.commentCount,
//     shares: null // YouTube API doesn't provide share count
//   }));
// }

// // Batch fetch top comments (still needs individual calls)
// async function fetchYouTubeTopComments(videoIds: string[], accessToken: string, commentsPerVideo = 5): Promise<YoutubeCommentsBatch[]> {
//   const commentsPromises = videoIds.map(async (videoId) => {
//     const endpoint = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet&videoId=${videoId}&maxResults=${commentsPerVideo}&access_token=${accessToken}`;
    
//     const response = await fetch(endpoint);
//     if (!response.ok) return { videoId, comments: [] }; // Handle videos with comments disabled
    
//     const data = await response.json();
//     const comments = data.items.map((item: any) => ({
//       author: item.snippet.topLevelComment.snippet.authorDisplayName,
//       text: item.snippet.topLevelComment.snippet.textDisplay,
//       likes: item.snippet.topLevelComment.snippet.likeCount,
//     }))
//     .sort((a: YoutubeComment, b: YoutubeComment) => b.likes - a.likes)
//     .slice(0, commentsPerVideo);
    
//     return { videoId, comments };
//   });
  
//   return Promise.all(commentsPromises);
// }

// // Add this new function to fetch Instagram comments
// async function fetchInstagramComments(mediaId: string, accessToken: string): Promise<InstagramComment[]> {
//   const commentsEndpoint = `https://graph.instagram.com/v19.0/${mediaId}/comments?access_token=${accessToken}`;
  
//   try {
//     const response = await fetch(commentsEndpoint);
//     if (!response.ok) {
//       console.error(`Failed to fetch comments for media ID ${mediaId}`);
//       return [];
//     }
    
//     const data = await response.json();
//     return data.data
//       .map((comment: any) => ({
//         username: comment.username,
//         text: comment.text,
//         timestamp: comment.timestamp,
//         like_count: comment.like_count || 0
//       }))
//       .sort((a: InstagramComment, b: InstagramComment) => b.like_count - a.like_count)
//       .slice(0, 5);
      
//   } catch (error) {
//     console.error(`Error fetching comments for media ID ${mediaId}:`, error);
//     return [];
//   }
// }

// // Update the fetchInstagramBatchAnalytics function
// async function fetchInstagramBatchAnalytics(mediaIds: string[], accessToken: string): Promise<InstagramBatchAnalytics[]> {
//   const analyticsPromises = mediaIds.map(async (mediaId) => {
//     const endpoint = `https://graph.instagram.com/v19.0/${mediaId}/insights?metric=reach,likes,comments,shares&period=lifetime&access_token=${accessToken}`;
    
//     try {
//       const response = await fetch(endpoint);
//       if (!response.ok) {
//         return { 
//           mediaId, 
//           error: `Failed to fetch insights for media ID ${mediaId}`,
//           views: 0,
//           likes: 0,
//           comments: 0,
//           shares: 0,
//           topComments: []
//         };
//       }
      
//       const data = await response.json();
//       // Fetch comments for this media
//       const topComments = await fetchInstagramComments(mediaId, accessToken);
      
//       return {
//         mediaId,
//         views: data.data.find((metric: any) => metric.name === "reach")?.values[0].value || 0,
//         likes: data.data.find((metric: any) => metric.name === "likes")?.values[0].value || 0,
//         comments: data.data.find((metric: any) => metric.name === "comments")?.values[0].value || 0,
//         shares: data.data.find((metric: any) => metric.name === "shares")?.values[0].value || 0,
//         topComments: topComments
//       };
//     } catch (error) {
//       const errorMessage = error instanceof Error ? error.message : "Unknown error";
//       return { 
//         mediaId, 
//         error: errorMessage,
//         views: 0,
//         likes: 0,
//         comments: 0,
//         shares: 0,
//         topComments: []
//       };
//     }
//   });
  
//   return Promise.all(analyticsPromises);
// }

// // Function to get Instagram MediaId from shortcode
// async function getInstagramMediaId(shortcode: string, userId: string, accessToken: string): Promise<string> {
//   // Now get your media list
//   const mediaEndpoint = `https://graph.instagram.com/${userId}/media?access_token=${accessToken}`;
  
//   const mediaResponse = await fetch(mediaEndpoint);
//   if (!mediaResponse.ok) {
//     const errorText = await mediaResponse.text();
//     throw new Error(`Failed to get Instagram media list: ${errorText}`);
//   }
  
//   const mediaData = await mediaResponse.json();
  
//   // Find the media with the matching shortcode or permalink containing the shortcode
//   for (const mediaItem of mediaData.data) {
//     // Get media details to check permalink or other identifiers
//     const mediaDetailEndpoint = `https://graph.instagram.com/${mediaItem.id}?fields=permalink,media_url&access_token=${accessToken}`;
//     const detailResponse = await fetch(mediaDetailEndpoint);
//     if (!detailResponse.ok) continue;
    
//     const mediaDetail = await detailResponse.json();
    
//     if (mediaDetail.permalink && mediaDetail.permalink.includes(shortcode)) {
//       return mediaItem.id;
//     }
//   }
  
//   throw new Error(`Could not find media with shortcode: ${shortcode}`);
// }

// // Function to extract Instagram shortcode
// function extractInstagramShortcode(url: string): string | null {
//   // Try to match common Instagram URL patterns
//   const reelMatch = url.match(/instagram\.com\/reel\/([^/?#]+)/);
//   const pMatch = url.match(/instagram\.com\/p\/([^/?#]+)/);
//   const tvMatch = url.match(/instagram\.com\/tv\/([^/?#]+)/);
  
//   // Return the first matching shortcode
//   return reelMatch?.[1] || pMatch?.[1] || tvMatch?.[1] || null;
// }

// // Function to store analytics in database
// async function storeAnalyticsInDatabase(supabase: any, userId: string, platformData: AnalyticsItem[]): Promise<boolean> {
//   try {
//     for (const item of platformData) {
//       // Prepare data for insertion
//       const analyticsRecord = {
//         user_id: userId,
//         platform: item.platform,
//         content_id: item.id,
//         url: item.url,
//         views: parseInt(item.analytics.views as string) || 0,
//         likes: parseInt(item.analytics.likes as string) || 0,
//         comments: parseInt(item.analytics.comments as string) || 0,
//         shares: parseInt((item.analytics.shares as string) || '0') || 0,
//         fetched_at: new Date().toISOString()
//       };
      
//       // Insert into analytics table
//       const { error } = await supabase
//         .from('content_analytics')
//         .upsert(analyticsRecord, { 
//           onConflict: 'platform,content_id',
//           ignoreDuplicates: false 
//         });
      
//       if (error) {
//         console.error(`Error storing analytics for ${item.platform} content ${item.id}:`, error);
//       }
//     }
    
//     console.log(`Stored analytics for ${platformData.length} items`);
//     return true;
//   } catch (error) {
//     console.error("Error in storeAnalyticsInDatabase:", error);
//     return false;
//   }
// }

// // New function to aggregate analytics by platform
// function aggregateAnalyticsByPlatform(analyticsData: AnalyticsItem[]): AggregatedAnalytics[] {
//   // Group by platform
//   const platformGroups: Record<string, AnalyticsItem[]> = {};
  
//   analyticsData.forEach(item => {
//     if (!platformGroups[item.platform]) {
//       platformGroups[item.platform] = [];
//     }
//     platformGroups[item.platform].push(item);
//   });
  
//   // Create aggregated data for each platform
//   return Object.keys(platformGroups).map(platform => {
//     const items = platformGroups[platform];
//     const itemCount = items.length;
    
//     const totalViews = items.reduce((sum, item) => sum + (parseInt(item.analytics.views as string) || 0), 0);
//     const totalLikes = items.reduce((sum, item) => sum + (parseInt(item.analytics.likes as string) || 0), 0);
//     const totalComments = items.reduce((sum, item) => sum + (parseInt(item.analytics.comments as string) || 0), 0);
//     const totalShares = items.reduce((sum, item) => sum + (parseInt((item.analytics.shares as string) || '0') || 0), 0);
    
//     // Only collect comments for YouTube
//     let topComments: YoutubeComment[] | undefined;
//     if (platform === 'youtube') {
//       const allComments: YoutubeComment[] = [];
//       items.forEach(item => {
//         const analytics = item.analytics as YoutubeAnalytics;
//         if (analytics.topComments) {
//           allComments.push(...analytics.topComments);
//         }
//       });
      
//       topComments = allComments
//         .sort((a, b) => b.likes - a.likes)
//         .slice(0, 10);
//     }
    
//     return {
//       platform,
//       totalViews,
//       totalLikes,
//       totalComments,
//       totalShares,
//       topComments,
//       itemCount
//     };
//   });
// }

// export async function POST(req: Request) {
//   try {
//     // Initialize Supabase client
//     const supabase = await createClient();

//     // Get authenticated user
//     const {
//       data: { user },
//       error: userError,
//     } = await supabase.auth.getUser();

//     if (userError || !user) {
//       return NextResponse.json(
//         { error: "Unauthorized. User not authenticated." },
//         { status: 401 }
//       );
//     }
    
//     // Parse JSON body safely
//     let body: RequestBody;
//     try {
//       body = await req.json();
//     } catch (err) {
//       throw new Error("Invalid JSON body");
//     }
    
//     // Fetch social media handles for this user
//     const { data: socialMediaHandles, error: socialMediaError } = await supabase
//       .from('social_media_handle')
//       .select('platform_id, account_user_id, access_token')
//       .eq('user_id', user.id);

//     if (socialMediaError) {
//       throw new Error(`Failed to fetch social media handles: ${socialMediaError.message}`);
//     }

//     // Extract YouTube and Instagram credentials
//     const youtubeHandle = socialMediaHandles.find(handle => handle.platform_id === 701);
//     const instagramHandle = socialMediaHandles.find(handle => handle.platform_id === 703);

//     const youtubeChannelId = youtubeHandle?.account_user_id;
//     const youtubeAccessToken = youtubeHandle?.access_token;
//     const instagramUserId = instagramHandle?.account_user_id;
//     const instagramAccessToken = instagramHandle?.access_token;

//     // Extract request parameters
//     const { 
//       fetchMethod = "list",
//       urls = [], 
//       calculateLimit = false,
//       limit: userProvidedLimit = 10,
//       storeInDatabase = false
//     } = body;

//     // Calculate limit if requested
//     let limit = userProvidedLimit;
//     if (calculateLimit) {
//       limit = await calculateLimitFromStreamData(supabase, user.id);
//       console.log(`Dynamically calculated limit: ${limit} based on user ${user.id}'s recent streams`);
//     }

//     let analyticsData: AnalyticsItem[] = [];

//     // Process based on fetch method
//     if (fetchMethod === "list") {
//       // Validate required parameters for list fetching
//       if (!youtubeChannelId && !instagramUserId) {
//         return NextResponse.json(
//           { error: "No connected social media accounts found" },
//           { status: 400 }
//         );
//       }

//       // Fetch YouTube videos if channel ID is provided
//       if (youtubeChannelId && youtubeAccessToken) {
//         try {
//           // Get recent videos with the calculated or provided limit
//           const videos = await fetchRecentYouTubeVideos(youtubeChannelId, limit, youtubeAccessToken);
          
//           // Get analytics for all videos
//           const videoIds = videos.map(video => video.id);
//           const batchAnalytics = await fetchYouTubeBatchAnalytics(videoIds, youtubeAccessToken);
          
//           // Get top comments for all videos
//           const commentsData = await fetchYouTubeTopComments(videoIds, youtubeAccessToken);
          
//           // Combine all data
//           const youtubeData = videos.map(video => {
//             const analytics = batchAnalytics.find(item => item.videoId === video.id) || {
//               videoId: video.id,
//               views: 0,
//               likes: 0,
//               comments: 0,
//               shares: null
//             };
            
//             const comments = commentsData.find(item => item.videoId === video.id)?.comments || [];
            
//             return {
//               platform: "youtube",
//               id: video.id,
//               url: video.url,
//               title: video.title,
//               publishedAt: video.publishedAt,
//               analytics: {
//                 views: analytics.views,
//                 likes: analytics.likes,
//                 comments: analytics.comments,
//                 shares: analytics.shares,
//                 topComments: comments
//               }
//             };
//           });
          
//           analyticsData = [...analyticsData, ...youtubeData];
//         } catch (error) {
//           console.error("Error fetching YouTube data:", error);
//         }
//       }

//       // Fetch Instagram media if user ID is provided
//       if (instagramUserId && instagramAccessToken) {
//         try {
//           // Get recent media with the calculated or provided limit - now includes ALL post types, not just videos
//           const media = await fetchRecentInstagramMedia(instagramUserId, limit, instagramAccessToken);
          
//           // Get analytics for all media
//           const mediaIds = media.map(item => item.id);
//           const batchAnalytics = await fetchInstagramBatchAnalytics(mediaIds, instagramAccessToken);
          
//           // Combine all data
//           const instagramData = media.map(item => {
//             const analytics = batchAnalytics.find(data => data.mediaId === item.id) || {
//               mediaId: item.id,
//               views: 0,
//               likes: 0,
//               comments: 0,
//               shares: 0,
//               topComments: []
//             };
            
//             return {
//               platform: "instagram",
//               id: item.id,
//               url: item.url,
//               publishedAt: item.publishedAt,
//               analytics: {
//                 views: analytics.views,
//                 likes: analytics.likes,
//                 comments: analytics.comments,
//                 shares: analytics.shares,
//                 topComments: analytics.topComments
//               }
//             };
//           });
          
//           analyticsData = [...analyticsData, ...instagramData];
//         } catch (error) {
//           console.error("Error fetching Instagram data:", error);
//         }
//       }
//     } else {
//       // Original approach processing individual URLs
//       // Validate `urls` field
//       if (!urls || !Array.isArray(urls)) {
//         return NextResponse.json(
//           { error: "Invalid input. Expected an array of URLs." },
//           { status: 400 }
//         );
//       }

//       // Use the original URL processing logic
//       const analyticsPromises = urls.map(async ({ platform, url }) => {
//         if (platform === "youtube") {
//           if (!youtubeAccessToken) {
//             throw new Error("Missing YouTube credentials");
//           }
//           const videoId = extractYouTubeVideoId(url);
//           return { 
//             platform, 
//             id: videoId || '',
//             url, 
//             analytics: await fetchYouTubeAnalytics(url, youtubeAccessToken) 
//           };
//         } else if (platform === "instagram") {
//           if (!instagramUserId || !instagramAccessToken) {
//             throw new Error("Missing Instagram credentials");
//           }
//           const shortcode = extractInstagramShortcode(url);
//           if (!shortcode) {
//             throw new Error("Invalid Instagram URL - Could not extract shortcode");
//           }
//           const mediaId = await getInstagramMediaId(shortcode, instagramUserId, instagramAccessToken);
//           return { 
//             platform, 
//             id: mediaId,
//             url, 
//             analytics: await fetchInstagramAnalytics(mediaId, instagramAccessToken) 
//           };
//         } else {
//           throw new Error(`Unsupported platform: ${platform}`);
//         }
//       });

//       analyticsData = await Promise.all(analyticsPromises);
//     }

//     // Optionally store analytics in database
//     if (storeInDatabase) {
//       await storeAnalyticsInDatabase(supabase, user.id, analyticsData);
//     }

//     // Aggregate data by platform
//     const aggregatedData = aggregateAnalyticsByPlatform(analyticsData);

//     return NextResponse.json({ 
//       individualData: analyticsData,
//       aggregatedData: aggregatedData,
//       meta: {
//         calculatedLimit: limit, 
//         totalFetched: analyticsData.length,
//         userId: user.id
//       }
//     });
//   } catch (error) {
//     console.error(error);

//     const errorMessage =
//       error instanceof Error ? error.message : "Unknown error occurred";

//     return NextResponse.json(
//       { error: "Failed to fetch analytics", details: errorMessage },
//       { status: 500 }
//     );
//   }
// }