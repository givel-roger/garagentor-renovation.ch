export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    const { startVoicemailPoller } = await import("./lib/voicemail-sync");
    startVoicemailPoller(120_000);
  }
}
