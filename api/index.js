import { serve } from "@modelcontextprotocol/sdk/server/vercel";
import { MCPError } from "@modelcontextprotocol/sdk/types";
import { transcript as getYoutubeTranscript } from "youtube-transcript";

serve({
  tools: {
    async getTranscript({ url }) {
      if (!url) {
        throw new MCPError("missing_parameter", "URL is required.");
      }

      try {
        const transcript = await getYoutubeTranscript(url);
        return {
          transcript: transcript
            .map((t) => t.text)
            .join(" "),
        };
      } catch (e) {
        throw new MCPError("transcript_error", e.message);
      }
    }
  }
});
