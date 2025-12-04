import { youtubeTranscript } from "youtube-transcript";

export default async function handler(req, res) {
  try {
    const url = req.query.url;

    if (!url) {
      return res.status(400).json({
        error: "Missing parameter: url"
      });
    }

    // Fetch transcript
    const transcript = await youtubeTranscript.fetchTranscript(url);

    return res.status(200).json({
      transcript,
      videoUrl: url
    });

  } catch (error) {
    return res.status(500).json({
      error: error.message,
    });
  }
}
