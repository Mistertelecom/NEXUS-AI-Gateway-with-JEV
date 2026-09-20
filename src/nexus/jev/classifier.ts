/**
 * Semantic Task Classifier using TypeSafe Jev (System One)
 * Assembles atomic, calibrated questions with explicit rubrics in PT-BR and EN.
 */

import { JevClient } from "./client";
import { ChoiceQuestion, NoulQuestion, ScoreQuestion, SystemOneResponse } from "./types";

export interface SemanticClassificationResult {
  taskKind: "implementation" | "explanation" | "refactor" | "review" | "other";
  taskKindConfidence: number;
  touchesAuth: boolean;
  authProbability: number;
  apparentScope: "localized" | "multi_component" | "architectural";
  scopeConfidence: number;
  rawResponse: SystemOneResponse;
}

export class JevSemanticClassifier {
  private client: JevClient;

  constructor(client?: JevClient) {
    this.client = client || new JevClient();
  }

  public getMode(): "cloud_openrouter" | "cloud_typesafe" | "local_deterministic" {
    return this.client.getMode();
  }

  /**
   * Classifies a user's development request into semantic dimensions.
   */
  public async classifyRequest(
    request: string,
    evidence?: string,
    options: { mockFallback?: boolean } = {}
  ): Promise<SemanticClassificationResult> {
    const state = {
      request,
      evidence: evidence || "Nenhuma evidência adicional informada.",
    };

    const taskKindQuestion: ChoiceQuestion = {
      type: "choice",
      instructions: "Qual categoria descreve melhor o objetivo do pedido?",
      criteria: {
        implementation:
          "Criar nova funcionalidade ou modificar código existente para atender a um requisito",
        explanation:
          "Explicar funcionamento, tirar dúvidas conceituais ou documentar sem alterar arquivos de código",
        refactor:
          "Reorganizar código, limpar dívida técnica ou otimizar estrutura preservando o comportamento externo",
        review:
          "Revisar alterações, analisar pull requests, identificar bugs ou auditar segurança de código",
        other: "Nenhuma das anteriores descreve adequadamente a solicitação",
      },
    };

    const touchesAuthQuestion: NoulQuestion = {
      type: "noul",
      instructions:
        "A alteração solicitada envolve autenticação, senhas, chaves de API, permissões ou recuperação de acesso?",
      criteria: {
        true: "Toca explicitamente credenciais, autenticação, tokens, criptografia ou controle de acesso",
        false: "Não envolve fluxos de autenticação, segredos ou permissões",
      },
    };

    const scopeQuestion: ScoreQuestion = {
      type: "score",
      instructions: "Qual é a abrangência aparente da alteração descrita?",
      criteria: [
        "Alteração localizada (um único arquivo, função pontual ou correção simples)",
        "Múltiplos componentes (interação entre vários arquivos, componentes de UI ou módulos)",
        "Mudança arquitetural (estruturação ampla do sistema, migrations de banco ou múltiplos serviços)",
      ],
    };

    const response = await this.client.evaluate(
      state,
      {
        task_kind: taskKindQuestion,
        touches_auth: touchesAuthQuestion,
        scope: scopeQuestion,
      },
      options
    );

    // Extract answers safely
    const taskKindAnswer = response.answers.task_kind;
    const touchesAuthAnswer = response.answers.touches_auth;
    const scopeAnswer = response.answers.scope;

    const taskKind =
      taskKindAnswer && taskKindAnswer.type === "choice"
        ? (taskKindAnswer.choice as SemanticClassificationResult["taskKind"])
        : "other";
    const taskKindConfidence =
      taskKindAnswer && taskKindAnswer.type === "choice" ? taskKindAnswer.confidence : 0;

    const authProbability =
      touchesAuthAnswer && touchesAuthAnswer.type === "noul" ? touchesAuthAnswer.noul : 0;
    const touchesAuth = authProbability >= 0.5;

    let apparentScope: SemanticClassificationResult["apparentScope"] = "localized";
    let scopeConfidence = 0;
    if (scopeAnswer && scopeAnswer.type === "score") {
      scopeConfidence = scopeAnswer.confidence;
      if (scopeAnswer.score >= 1.5) {
        apparentScope = "architectural";
      } else if (scopeAnswer.score >= 0.6) {
        apparentScope = "multi_component";
      } else {
        apparentScope = "localized";
      }
    }

    return {
      taskKind,
      taskKindConfidence,
      touchesAuth,
      authProbability,
      apparentScope,
      scopeConfidence,
      rawResponse: response,
    };
  }

  /**
   * Filters test outputs or diff lines to prioritize high-relevance evidence.
   */
  public async filterEvidenceRelevance(
    logSnippet: string,
    testFailureReason: string,
    options: { mockFallback?: boolean } = {}
  ): Promise<{ isRelevant: boolean; probability: number }> {
    const state = {
      testFailureReason,
      logSnippet,
    };

    const relevanceQuestion: NoulQuestion = {
      type: "noul",
      instructions:
        "O trecho de log apresentado é evidência direta da causa da falha do teste informada?",
      criteria: {
        true: "O trecho contém a mensagem de erro, stack trace ou linha do código que falhou no teste",
        false:
          "O trecho é ruído informativo, log repetitivo ou inicialização não relacionada à falha",
      },
    };

    const res = await this.client.evaluate(state, { is_relevant: relevanceQuestion }, options);

    const answer = res.answers.is_relevant;
    const prob = answer && answer.type === "noul" ? answer.noul : 0.5;

    return {
      isRelevant: prob >= 0.5,
      probability: prob,
    };
  }

  public async classifyTaskKind(prompt: string) {
    const res = await this.classifyRequest(prompt);
    return { answer: res.taskKind, confidence: res.taskKindConfidence };
  }

  public async touchesAuthentication(prompt: string) {
    const res = await this.classifyRequest(prompt);
    return { answer: res.touchesAuth, confidence: res.authProbability };
  }

  public async classifyScope(prompt: string) {
    const res = await this.classifyRequest(prompt);
    return { answer: res.apparentScope, confidence: res.scopeConfidence };
  }
}

export const JevClassifier = JevSemanticClassifier;
