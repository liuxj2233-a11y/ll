import ytdl from "ytdl-core";

// Let OpenAI know what tools this MCP server provides
export default async function handler(req, res) {
  if (req.method === "POST") {
    const body = req.body;

    // Return the list of tools
    if (body.action === "get_tools") {
      return res.json({
        tools: [
          {
            name: "fetch_youtube_transcript",
            description: "Extract full transcript from a YouTube video",
            input_schema: {
              type: "object",
              properties: { url: { type: "string" } },
              required: ["url"]
            }
          }
        ]
      });
    }

    // Run the tool
    if (body.action === "run_tool" && body.tool === "fetch_youtube_transcript") {
      const url = body.input.url;

      try {
        const info = await ytdl.getInfo(url);
        const tracks = info.player_response.captions?.playerCaptionsTracklistRenderer?.captionTracks;

        if (!tracks || tracks.length === 0) {
          return res.json({ output: "No transcript available." });
        }

        const transcriptUrl = tracks[0].baseUrl;
        const transcriptRes = await fetch(transcriptUrl);
        const transcriptText = await transcriptRes.text();

        return res.json({ output: transcriptText });
      } catch (err) {
        return res.status(500).json({ error: err.message });
      }
    }
  }

  // Fallback
  return res.status(404).json({ error: "Not Found" });
}
