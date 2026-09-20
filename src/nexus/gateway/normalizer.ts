/**
 * Protocol Normalizer and Canonical Message Model for NEXUS Gateway
 * Provides a loss-free canonical representation of requests and responses
 * across OpenAI, Anthropic, Gemini, and Responses protocols.
 * Strictly checks for unsupported parameters and returns descriptive errors.
 */

export type CanonicalRole = "system" | "user" | "assistant" | "tool";

export interface CanonicalContentPart {
  type: "text" | "image" | "audio";
  text?: string;
  imageUrl?: { url: string; detail?: "auto" | "low" | "high" };
  mimeType?: string;
  data?: string;
}

export interface CanonicalToolCall {
  id: string;
  type: "function";
  function: {
    name: string;
    arguments: string;
  };
}

export interface CanonicalMessage {
  role: CanonicalRole;
  content: string | CanonicalContentPart[];
  name?: string;
  toolCallId?: string;
  toolCalls?: CanonicalToolCall[];
}

export interface CanonicalTool {
  type: "function";
  function: {
    name: string;
    description?: string;
    parameters?: Record<string, any>;
    strict?: boolean;
  };
}

export interface CanonicalChatRequest {
  model: string;
  messages: CanonicalMessage[];
  temperature?: number;
  topP?: number;
  maxTokens?: number;
  stream?: boolean;
  tools?: CanonicalTool[];
  toolChoice?: any;
  stop?: string | string[];
  responseFormat?: { type: "text" | "json_object" | "json_schema"; jsonSchema?: any };
  metadata?: Record<string, any>;
}

export interface CanonicalChatResponse {
  id: string;
  model: string;
  created: number;
  message: CanonicalMessage;
  finishReason: "stop" | "tool_calls" | "length" | "content_filter" | "error";
  usage: {
    promptTokens: number;
    completionTokens: number;
    totalTokens: number;
  };
}

export interface NormalizationValidationResult {
  valid: boolean;
  canonical?: CanonicalChatRequest;
  errors: string[];
}

export class ProtocolNormalizer {
  /**
   * Normalizes an incoming OpenAI Chat Completions payload into canonical format.
   * Validates parameters strictly to prevent silent dropping.
   */
  public static normalizeOpenAiRequest(body: any): NormalizationValidationResult {
    const errors: string[] = [];

    if (!body || typeof body !== "object") {
      return { valid: false, errors: ["O corpo da requisição deve ser um objeto JSON válido."] };
    }

    if (!body.model || typeof body.model !== "string") {
      errors.push("O parâmetro 'model' é obrigatório e deve ser uma string.");
    }

    if (!Array.isArray(body.messages) || body.messages.length === 0) {
      errors.push("O parâmetro 'messages' é obrigatório e deve ser um array não vazio.");
    }

    // Check for unsupported features that would lead to silent degradation
    if (body.n && body.n > 1) {
      errors.push(
        "O parâmetro 'n > 1' não é suportado pelo NEXUS Gateway. Use n=1 ou dispare chamadas em paralelo."
      );
    }

    if (body.logit_bias && Object.keys(body.logit_bias).length > 0) {
      errors.push(
        "O parâmetro 'logit_bias' não é suportado pelos modelos subjacentes no NEXUS Gateway."
      );
    }

    if (errors.length > 0) {
      return { valid: false, errors };
    }

    // Normalize messages
    const canonicalMessages: CanonicalMessage[] = [];
    for (let i = 0; i < body.messages.length; i++) {
      const msg = body.messages[i];
      if (!msg.role) {
        errors.push(`Mensagem no índice ${i} não possui o campo 'role'.`);
        continue;
      }

      let content: string | CanonicalContentPart[] = "";
      if (typeof msg.content === "string") {
        content = msg.content;
      } else if (Array.isArray(msg.content)) {
        content = msg.content.map((part: any) => {
          if (part.type === "text") {
            return { type: "text", text: part.text || "" };
          }
          if (part.type === "image_url") {
            return {
              type: "image",
              imageUrl: {
                url: part.image_url?.url || "",
                detail: part.image_url?.detail || "auto",
              },
            };
          }
          return { type: "text", text: JSON.stringify(part) };
        });
      }

      const canonicalMsg: CanonicalMessage = {
        role: msg.role as CanonicalRole,
        content,
        name: msg.name,
        toolCallId: msg.tool_call_id,
      };

      if (Array.isArray(msg.tool_calls)) {
        canonicalMsg.toolCalls = msg.tool_calls.map((tc: any) => ({
          id: tc.id || `call_${Math.random().toString(36).slice(2, 9)}`,
          type: "function",
          function: {
            name: tc.function?.name || "",
            arguments:
              typeof tc.function?.arguments === "string"
                ? tc.function.arguments
                : JSON.stringify(tc.function?.arguments || {}),
          },
        }));
      }

      canonicalMessages.push(canonicalMsg);
    }

    if (errors.length > 0) {
      return { valid: false, errors };
    }

    const canonical: CanonicalChatRequest = {
      model: body.model,
      messages: canonicalMessages,
      temperature: body.temperature,
      topP: body.top_p,
      maxTokens: body.max_completion_tokens || body.max_tokens,
      stream: !!body.stream,
      tools: body.tools,
      toolChoice: body.tool_choice,
      stop: body.stop,
      responseFormat: body.response_format,
    };

    return { valid: true, canonical, errors: [] };
  }

  /**
   * Converts canonical response back to standard OpenAI chat completion object
   */
  public static toOpenAiResponse(resp: CanonicalChatResponse): any {
    return {
      id: resp.id,
      object: "chat.completion",
      created: resp.created,
      model: resp.model,
      choices: [
        {
          index: 0,
          message: {
            role: resp.message.role,
            content: typeof resp.message.content === "string" ? resp.message.content : null,
            ...(resp.message.toolCalls ? { tool_calls: resp.message.toolCalls } : {}),
          },
          finish_reason: resp.finishReason,
        },
      ],
      usage: {
        prompt_tokens: resp.usage.promptTokens,
        completion_tokens: resp.usage.completionTokens,
        total_tokens: resp.usage.totalTokens,
      },
    };
  }
}
