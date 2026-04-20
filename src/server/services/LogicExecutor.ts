export type LogicRule = {
  fact: string;
  operator: 'lt' | 'gt' | 'eq' | 'gte' | 'lte' | 'contains' | 'not_contains';
  value: any;
  severity: 'CRITICAL' | 'MAJOR' | 'MINOR';
};

export class LogicExecutor {
  static evaluate(rule: LogicRule, data: Record<string, any>) {
    const actual = data[rule.fact];
    const ops: Record<string, (a: any, b: any) => boolean> = {
      'lt': (a: any, b: any) => a < b,
      'gt': (a: any, b: any) => a > b,
      'eq': (a: any, b: any) => a === b,
      'gte': (a: any, b: any) => a >= b,
      'lte': (a: any, b: any) => a <= b,
      'contains': (a: any, b: any) => String(a).includes(String(b)),
      'not_contains': (a: any, b: any) => !String(a).includes(String(b)),
    };
    
    const operation = ops[rule.operator];
    const compliant = operation ? operation(actual, rule.value) : false;
    
    return {
      compliant,
      reason: compliant
        ? `✓ Critère respecté [${rule.fact} = ${actual}]`
        : `✗ Violation: ${rule.fact} (${actual}) doit être ${rule.operator} ${rule.value}`,
      severity: compliant ? null : rule.severity,
    };
  }
}
