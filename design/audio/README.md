# Card Narration Archive

The owner approved the second Sulafat preview take on 2026-10-10 and requested the complete replacement of browser speech. The batch uses Google `gemini-3.8-flash-tts` through the Interactions API. Mandarin instructions preserve the exact approved style. English alphabet names use the same voice with a narrowly scoped English pronunciation instruction.

Each WAV is the unmodified provider response. Its JSON records text, style, voice, model, duration, interaction ID and file hashes. `approved-v2-preview` entries reuse the approved bytes rather than making another request. The public MP3 is a 96 kbps delivery derivative without time stretching or edits.

Generation and safe rerun instructions are maintained in the root `AGENTS.md`. Credentials are private machine configuration and must never be archived here. Automated checks verify structural integrity, matching text and file coverage; they do not certify the accent or verbatim acoustic content of every recording.
