/**
 * Safe AST Condition Evaluator for NEXUS Gateway
 * Evaluates workflow conditional expressions without any `eval()` or `new Function()`.
 * Guaranteed safe against injection and arbitrary code execution.
 */

export type TokenType =
  | "IDENTIFIER"
  | "STRING"
  | "NUMBER"
  | "BOOLEAN"
  | "NULL"
  | "OPERATOR"
  | "LPAREN"
  | "RPAREN"
  | "DOT";

export interface Token {
  type: TokenType;
  value: any;
}

export type ASTNode =
  | { type: "Literal"; value: any }
  | { type: "Identifier"; name: string }
  | { type: "MemberExpression"; object: ASTNode; property: string }
  | { type: "UnaryExpression"; operator: string; argument: ASTNode }
  | { type: "BinaryExpression"; operator: string; left: ASTNode; right: ASTNode };

export class SafeConditionEvaluator {
  /**
   * Tokenizes an expression string.
   */
  public static tokenize(expr: string): Token[] {
    const tokens: Token[] = [];
    let i = 0;

    while (i < expr.length) {
      const char = expr[i];

      if (/\s/.test(char)) {
        i++;
        continue;
      }

      if (char === "(") {
        tokens.push({ type: "LPAREN", value: "(" });
        i++;
        continue;
      }

      if (char === ")") {
        tokens.push({ type: "RPAREN", value: ")" });
        i++;
        continue;
      }

      if (char === ".") {
        tokens.push({ type: "DOT", value: "." });
        i++;
        continue;
      }

      // Operators: ==, !=, >=, <=, &&, ||, >, <, !
      if (
        expr.startsWith("==", i) ||
        expr.startsWith("!=", i) ||
        expr.startsWith(">=", i) ||
        expr.startsWith("<=", i) ||
        expr.startsWith("&&", i) ||
        expr.startsWith("||", i)
      ) {
        tokens.push({ type: "OPERATOR", value: expr.slice(i, i + 2) });
        i += 2;
        continue;
      }

      if (char === ">" || char === "<" || char === "!") {
        tokens.push({ type: "OPERATOR", value: char });
        i++;
        continue;
      }

      // Strings (single or double quoted)
      if (char === '"' || char === "'") {
        const quote = char;
        let str = "";
        i++;
        while (i < expr.length && expr[i] !== quote) {
          if (expr[i] === "\\" && i + 1 < expr.length) {
            str += expr[i + 1];
            i += 2;
          } else {
            str += expr[i];
            i++;
          }
        }
        i++; // skip closing quote
        tokens.push({ type: "STRING", value: str });
        continue;
      }

      // Numbers
      if (/[0-9]/.test(char) || (char === "-" && /[0-9]/.test(expr[i + 1] || ""))) {
        let numStr = char;
        i++;
        while (i < expr.length && /[0-9\.]/.test(expr[i])) {
          numStr += expr[i];
          i++;
        }
        tokens.push({ type: "NUMBER", value: parseFloat(numStr) });
        continue;
      }

      // Identifiers / Keywords (true, false, null)
      if (/[a-zA-Z_]/.test(char)) {
        let ident = "";
        while (i < expr.length && /[a-zA-Z0-9_]/.test(expr[i])) {
          ident += expr[i];
          i++;
        }

        if (ident === "true") {
          tokens.push({ type: "BOOLEAN", value: true });
        } else if (ident === "false") {
          tokens.push({ type: "BOOLEAN", value: false });
        } else if (ident === "null") {
          tokens.push({ type: "NULL", value: null });
        } else {
          tokens.push({ type: "IDENTIFIER", value: ident });
        }
        continue;
      }

      throw new Error(`Caractere inesperado na expressão de condição: '${char}' na posição ${i}`);
    }

    return tokens;
  }

  /**
   * Parses tokens into an AST.
   */
  public static parse(tokens: Token[]): ASTNode {
    let current = 0;

    function parseExpression(): ASTNode {
      return parseLogicalOr();
    }

    function parseLogicalOr(): ASTNode {
      let left = parseLogicalAnd();
      while (current < tokens.length && tokens[current].value === "||") {
        const op = tokens[current].value;
        current++;
        const right = parseLogicalAnd();
        left = { type: "BinaryExpression", operator: op, left, right };
      }
      return left;
    }

    function parseLogicalAnd(): ASTNode {
      let left = parseEquality();
      while (current < tokens.length && tokens[current].value === "&&") {
        const op = tokens[current].value;
        current++;
        const right = parseEquality();
        left = { type: "BinaryExpression", operator: op, left, right };
      }
      return left;
    }

    function parseEquality(): ASTNode {
      let left = parseRelational();
      while (
        current < tokens.length &&
        (tokens[current].value === "==" || tokens[current].value === "!=")
      ) {
        const op = tokens[current].value;
        current++;
        const right = parseRelational();
        left = { type: "BinaryExpression", operator: op, left, right };
      }
      return left;
    }

    function parseRelational(): ASTNode {
      let left = parseUnary();
      while (
        current < tokens.length &&
        (tokens[current].value === ">" ||
          tokens[current].value === "<" ||
          tokens[current].value === ">=" ||
          tokens[current].value === "<=")
      ) {
        const op = tokens[current].value;
        current++;
        const right = parseUnary();
        left = { type: "BinaryExpression", operator: op, left, right };
      }
      return left;
    }

    function parseUnary(): ASTNode {
      if (current < tokens.length && tokens[current].value === "!") {
        const op = tokens[current].value;
        current++;
        const argument = parseUnary();
        return { type: "UnaryExpression", operator: op, argument };
      }
      return parseMemberAccess();
    }

    function parseMemberAccess(): ASTNode {
      let node = parsePrimary();
      while (current < tokens.length && tokens[current].type === "DOT") {
        current++; // skip '.'
        const propToken = tokens[current];
        if (!propToken || propToken.type !== "IDENTIFIER") {
          throw new Error("Esperava identificador após '.'");
        }
        current++;
        node = { type: "MemberExpression", object: node, property: propToken.value };
      }
      return node;
    }

    function parsePrimary(): ASTNode {
      const token = tokens[current];
      if (!token) throw new Error("Fim inesperado da expressão");

      if (token.type === "LPAREN") {
        current++;
        const node = parseExpression();
        if (tokens[current]?.type !== "RPAREN") {
          throw new Error("Esperava ')' correspondente");
        }
        current++;
        return node;
      }

      if (
        token.type === "STRING" ||
        token.type === "NUMBER" ||
        token.type === "BOOLEAN" ||
        token.type === "NULL"
      ) {
        current++;
        return { type: "Literal", value: token.value };
      }

      if (token.type === "IDENTIFIER") {
        current++;
        return { type: "Identifier", name: token.value };
      }

      throw new Error(`Token inesperado: ${JSON.stringify(token)}`);
    }

    return parseExpression();
  }

  /**
   * Safely evaluates the AST against a context dictionary.
   */
  public static evaluateNode(node: ASTNode, context: Record<string, any>): any {
    switch (node.type) {
      case "Literal":
        return node.value;

      case "Identifier":
        return context[node.name];

      case "MemberExpression": {
        const obj = SafeConditionEvaluator.evaluateNode(node.object, context);
        if (obj === null || obj === undefined) return undefined;
        return obj[node.property];
      }

      case "UnaryExpression": {
        const val = SafeConditionEvaluator.evaluateNode(node.argument, context);
        if (node.operator === "!") return !val;
        throw new Error(`Operador unário não suportado: ${node.operator}`);
      }

      case "BinaryExpression": {
        const left = SafeConditionEvaluator.evaluateNode(node.left, context);
        const right = SafeConditionEvaluator.evaluateNode(node.right, context);

        switch (node.operator) {
          case "==":
            return left == right;
          case "!=":
            return left != right;
          case ">":
            return left > right;
          case "<":
            return left < right;
          case ">=":
            return left >= right;
          case "<=":
            return left <= right;
          case "&&":
            return Boolean(left && right);
          case "||":
            return Boolean(left || right);
          default:
            throw new Error(`Operador binário não suportado: ${node.operator}`);
        }
      }
    }
  }

  /**
   * Evaluates an expression string in a given context.
   * Returns true/false. Returns true if expression is empty or undefined.
   */
  public static evaluate(expr?: string, context: Record<string, any> = {}): boolean {
    if (!expr || expr.trim() === "") return true;
    try {
      const tokens = SafeConditionEvaluator.tokenize(expr);
      const ast = SafeConditionEvaluator.parse(tokens);
      return Boolean(SafeConditionEvaluator.evaluateNode(ast, context));
    } catch {
      return false;
    }
  }
}
