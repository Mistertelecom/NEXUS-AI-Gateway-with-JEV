import { z } from "zod";

import { synthesizeOpenAiSseFromJson } from "../compat/protocol";

const messageSchema = z
  .object({
    content: z.string().nullable().optional(),
    tool_calls: z
      .array(
        z
          .object({
            id: z.string().min(1),
            type: z.literal("function"),
            function: z.object({ name: z.string().min(1), arguments: z.string() }).passthrough(),
          })
          .passthrough()
      )
      .optional(),
    reasoning_content: z.string().nullable().optional(),
    reasoning: z.string().nullable().optional(),
  })
  .passthrough();
const completionSchema = z
  .object({
    choices: z
      .array(
        z
          .object({
            message: messageSchema,
            finish_reason: z.string().nullable().optional(),
          })
          .passthrough()
      )
      .min(1),
    usage: z
      .object({
        completion_tokens_details: z
          .object({ reasoning_tokens: z.number().optional() })
          .passthrough()
          .optional(),
        output_tokens_details: z
          .object({ reasoning_tokens: z.number().optional() })
          .passthrough()
          .optional(),
      })
      .passthrough()
      .optional(),
  })
  .passthrough();

export type PairCompletion = {
  readonly payload: z.infer<typeof completionSchema>;
  readonly content: string;
  readonly toolCalls: boolean;
  readonly truncated: boolean;
  readonly reasoningObserved: boolean;
  readonly headers: Headers;
};

export async function readPairCompletion(
  response: Response,
  signal?: AbortSignal | null
): Promise<PairCompletion | null> {
  signal?.throwIfAborted();
  if (!response.body) return null;
  const reader = response.body.getReader();
  let onAbort: (() => void) | undefined;
  const aborted = new Promise<never>((_resolve, reject) => {
    onAbort = () => reject(signal?.reason);
    signal?.addEventListener("abort", onAbort, { once: true });
  });
  const decoder = new TextDecoder();
  let text = "";
  let size = 0;
  try {
    while (true) {
      const part = await Promise.race([reader.read(), aborted]);
      signal?.throwIfAborted();
      if (part.done) break;
      size += part.value.byteLength;
      if (size > 1_000_000) {
        await reader.cancel();
        return null;
      }
      text += decoder.decode(part.value, { stream: true });
    }
    text += decoder.decode();
  } finally {
    if (onAbort) signal?.removeEventListener("abort", onAbort);
    try {
      if (signal?.aborted) await reader.cancel(signal.reason);
    } finally {
      reader.releaseLock();
    }
  }
  let value: unknown;
  try {
    value = JSON.parse(text);
  } catch (error) {
    if (!(error instanceof SyntaxError)) throw error;
    return null;
  }
  const parsed = completionSchema.safeParse(value);
  if (!parsed.success) return null;
  const choice = parsed.data.choices[0];
  if (!choice) return null;
  const usage = parsed.data.usage;
  return {
    payload: parsed.data,
    content: choice.message.content ?? "",
    toolCalls: Boolean(choice.message.tool_calls?.length),
    truncated: choice.finish_reason === "length" || choice.finish_reason === "content_filter",
    reasoningObserved:
      Boolean(choice.message.reasoning_content?.trim() || choice.message.reasoning?.trim()) ||
      (usage?.completion_tokens_details?.reasoning_tokens ?? 0) > 0 ||
      (usage?.output_tokens_details?.reasoning_tokens ?? 0) > 0,
    headers: new Headers(response.headers),
  };
}

export function localPairCompletion(content: string, model: string): PairCompletion {
  return {
    payload: {
      id: `chatcmpl-nexus-${crypto.randomUUID()}`,
      object: "chat.completion",
      model,
      created: Math.floor(Date.now() / 1000),
      choices: [{ index: 0, message: { role: "assistant", content }, finish_reason: "stop" }],
    },
    content,
    toolCalls: false,
    truncated: false,
    reasoningObserved: false,
    headers: new Headers(),
  };
}

export function pairCompletionResponse(result: PairCompletion, stream: boolean): Response {
  const text = JSON.stringify(result.payload);
  const headers = new Headers(result.headers);
  headers.delete("Content-Length");
  headers.delete("Content-Encoding");
  headers.set("Content-Type", stream ? "text/event-stream" : "application/json");
  if (stream) headers.set("Cache-Control", "no-cache");
  return new Response(stream ? synthesizeOpenAiSseFromJson(text) : text, { headers });
}
