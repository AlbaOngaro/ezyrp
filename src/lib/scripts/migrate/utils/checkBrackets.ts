export function checkBrackets(expression: string) {
  const stack: string[] = [];
  const bracketLookup: Record<string, string> = {
    "{": "}",
    "(": ")",
    "[": "]",
  };

  for (const key of expression) {
    if (Object.keys(bracketLookup).includes(key)) {
      stack.push(key);
    } else if (Object.values(bracketLookup).includes(key)) {
      const lastBracket = stack.pop();
      if (lastBracket && bracketLookup[lastBracket] !== key) {
        return false;
      }
    }
  }

  return stack.length === 0;
}
