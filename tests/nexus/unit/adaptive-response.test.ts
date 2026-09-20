import assert from "node:assert/strict";
import test from "node:test";

import {
  localPairCompletion,
  pairCompletionResponse,
  readPairCompletion,
} from "../../../src/nexus/pairs/response";

test("completion reader cancels oversized responses", async () => {
  // Given a response larger than the deterministic memory budget.
  let cancelled = false;
  const response = new Response(
    new ReadableStream({
      start(controller) {
        controller.enqueue(new Uint8Array(1_000_001));
      },
      cancel() {
        cancelled = true;
      },
    })
  );
  // When the adaptive stage reads it.
  const result = await readPairCompletion(response);
  // Then the stage fails closed and releases the source.
  assert.equal(result, null);
  assert.equal(cancelled, true);
});

test("completion reader propagates client cancellation during a read", async () => {
  // Given a client cancellation concurrent with upstream data.
  const abort = new AbortController();
  const response = new Response(
    new ReadableStream({
      pull(controller) {
        abort.abort();
        controller.enqueue(
          new TextEncoder().encode('{"choices":[{"message":{"content":"late answer"}}]}')
        );
        controller.close();
      },
    })
  );
  // When the stage reads, then it cannot accept data after cancellation.
  await assert.rejects(readPairCompletion(response, abort.signal), { name: "AbortError" });
});

test("terminal tool calls preserve function arguments in synthetic SSE", async () => {
  // Given a terminal function call returned by the selected model.
  const toolCall = {
    id: "call_1",
    type: "function",
    function: { name: "lookup", arguments: '{"query":"sample"}' },
  };
  const response = Response.json({
    id: "tool-response",
    choices: [
      {
        index: 0,
        message: { role: "assistant", content: null, tool_calls: [toolCall] },
        finish_reason: "tool_calls",
      },
    ],
  });
  // When the adaptive response is parsed and converted to SSE.
  const completion = await readPairCompletion(response);
  assert.ok(completion);
  const streamed = pairCompletionResponse(completion, true);
  // Then tool identity, arguments and the terminal frame remain visible.
  const text = await streamed.text();
  assert.equal(completion.toolCalls, true);
  assert.ok(text.includes(JSON.stringify(toolCall.function)));
  assert.ok(text.endsWith("data: [DONE]\n\n"));
});

test("local completions do not invent provider usage", () => {
  // Given output produced without a generation call.
  const content = "a\nb";
  // When it is represented as a compatible completion.
  const result = localPairCompletion(content, "nexus/local");
  // Then usage stays absent instead of reporting fabricated tokens or savings.
  assert.equal(result.payload.usage, undefined);
  assert.equal(result.content, content);
});
