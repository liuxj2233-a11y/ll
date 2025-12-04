import { NextResponse } from "next/server";

// ---- Helper function: fetch transcript via noembed API ----
async function fetchTranscript(url) {
  const api = `https://noembed.com/embed?url=${encodeURIComponent(url)}`;
  const res = await fetch(api);
  const data = await res.json();

  // NOTE: NoEmbed doesn't provide transcript — real MCP should use youtube-captions API
  // Here we just return title + placeholder transcript for testing.
  return {
    title: data.title || "Unknown Title",
    transcript: "This is a placeholder transcript. Replace with real transcript logic."
  };
}

export const GET = async (req) => {
  return NextResponse.json({
    mcp: {
      version: "1.0",
      tools: [
        {
          name: "fetch_youtube_transcript",
          description: "Fetch full transcript from a YouTube video",
          input_schema: {
            type: "object",
            properties: {
              url: {
                type: "string",
                description: "YouTube video URL"
              }
            },
            required: ["url"]
          }
        }
      ]
    }
  });
};

export const POST = async (req) => {
  const body = await req.json();

  if (body.tool === "fetch_youtube_transcript") {
    const videoUrl = body.input.url;
    const transcript = await fetchTranscript(videoUrl);

    return NextResponse.json({
      output: transcript
    });
  }

  return NextResponse.json(
    { error: "Unknown tool" },
    { status: 400 }
  );
};

