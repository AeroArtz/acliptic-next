const https = require('https');
const fetch = require('node-fetch');

const agent = new https.Agent({
    rejectUnauthorized: false
});
 
async function startSocialMediaService() {
    let response = await fetch("https://localhost:3000/api/clips/upload_clip", {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
        },
        
        body: JSON.stringify({
            user_id: "8c78e4e8-6c5f-4c57-a200-f4e45f49f737",
            title: "Test Video",
            clip_id: "a7665632-7123-4722-93ad-007b00dd1f1a",
            clip_created_at: new Date("2025-03-17 11:41:24.435362+00"),
            description: "Test Description",
            video_path: "https://storage.googleapis.com/nca-toolkit-bucket-se/c47bfb9b-2455-48a8-8ad4-8ee104e4344d_captioned.mp4",
        }),
        agent: agent  // Apply the custom agent only to this request

    });

    response = await response.json()

    console.log(response)

}

async function getMostRecentInstagramPost() {
    const accessToken = "IGAAYYSV01ATFBZAE9jckE0cXZAiZA2Flbi1FbUljR2tyRkgwQlhDYXk1M1JFRkx3eUZAIMlFOcy1GalBPVE52NUc1dFVYWXMwQ1dLOTNJUFVhZAGdhN2hPY2JfcVNvRkxraHBzQ1gxWHR2RS05ak5TajdTdjh3";
    const businessAccountId = "9614574678593179";
    
    try {
      // Get media with additional fields and a limit of 5 (to ensure we get the most recent)
      const response = await fetch(
        `https://graph.instagram.com/v22.0/${businessAccountId}/media?fields=id,media_type,permalink,timestamp,caption,media_url&limit=5&access_token=${accessToken}`
      );
      
      const data = await response.json();
      
      if (!data.data || data.data.length === 0) {
        console.log("No posts found");
        return null;
      }
      
      // Sort by timestamp to ensure we get the most recent post
      // (Instagram usually returns in reverse chronological order, but this ensures it)
      data.data.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
      
      // Get the most recent post
      const mostRecentPost = data.data[0];
      
      // this is the URL Full
      console.log("- URL:", mostRecentPost.permalink);
     
      return mostRecentPost.permalink;

    } catch (error) {
      console.error("Error fetching Instagram data:", error);
      return null;
    }
  }


/*
get insta post=

{
    message: 'Upload(s) completed',
    results: {
      youtube: { success: true, videoId: '53yU54xa11g' },
      instagram: { success: true, videoId: '18071048926803254' }
    }
  }

*/

  
// Execute the function
startSocialMediaService();
  