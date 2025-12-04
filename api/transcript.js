import { YoutubeTranscript } from "youtube-transcript";

export default async function handler(req, res) {
  const { url } = req.query;

  if (!url) {
    return res.status(400).json({ error: "Missing YouTube URL ?url=" });
  }

  try {
    const transcript = await YoutubeTranscript.fetchTranscript(url);

    const full = transcript.map(t => t.text).join(" ");

    return res.status(200).json({
      success: true,
      length: full.length,
      transcript: full
    });

  } catch (err) {
    return res.status(500).json({
      error: "Failed to fetch transcript",
      details: err.message
    });
  }
}
