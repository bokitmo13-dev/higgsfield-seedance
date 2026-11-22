
import { config, higgsfield } from "@higgsfield/client/v2";
import { config as loadEnv } from "dotenv";

loadEnv({ path: ".env.local" });

const credentials = process.env.HF_CREDENTIALS;

if (!credentials) {
  throw new Error("HF_CREDENTIALS is missing from .env.local");
}

config({ credentials });

async function main() {
  const result = await higgsfield.subscribe(
    "bytedance/seedance-2.5/text-to-video",
    {
      input: {
        prompt: "A cinematic scene at sunset",
        duration: 5,
        resolution: "720p",
        aspect_ratio: "16:9",
        output_format: "mp4",
      },
      withPolling: true,
    }
  );

  if (result.status !== "completed") {
    console.error("Generation did not complete:", result.status);
    process.exitCode = 1;
    return;
  }

  const videoUrl = result.video?.url;

  if (!videoUrl) {
    throw new Error("No video URL returned");
  }

  console.log("Video generated:", videoUrl);
}

main().catch((error) => {
  console.error("Generation failed:", error.message);
  process.exitCode = 1;
});
