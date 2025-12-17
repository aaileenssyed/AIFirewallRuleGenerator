export interface UserInput {
  description: string;
  serverRole: 'web' | 'db' | 'bastion' | 'custom';
  protocols: string[];
  sourceType: 'any' | 'single' | 'cidr';
  sourceValue?: string;
}

export interface FirewallRule {
  rule: string;
  explanation: string;
  threat: string;
}

export interface SecurityWarning {
  severity: 'critical' | 'warning' | 'info';
  message: string;
  recommendation: string;
}

export interface ScoreBreakdown {
  category: string;
  points: number;
  maxPoints: number;
  reason: string;
}

export interface ComparisonExample {
  insecure: {
    rules: string[];
    why: string;
  };
  secure: {
    rules: string[];
    why: string;
  };
}

export interface FirewallResult {
  rules: FirewallRule[];
  warnings: SecurityWarning[];
  score: number;
  scoreBreakdown: ScoreBreakdown[];
  comparison: ComparisonExample;
  learningPoints: string[];
}

const COMMON_PORTS: Record<string, number> = {
  HTTP: 80,
  HTTPS: 443,
  SSH: 22,
  FTP: 21,
  SMTP: 25,
  DNS: 53,
  MySQL: 3306,
  PostgreSQL: 5432,
  MongoDB: 27017,
  Redis: 6379,
};

export function generateFirewallRules(input: UserInput): FirewallResult {
  const rules: FirewallRule[] = [];
  const warnings: SecurityWarning[] = [];
  const scoreBreakdown: ScoreBreakdown[] = [];
  let score = 0;

  const protocols = extractProtocols(input);
  const source = determineSource(input);

  rules.push({
    rule: 'iptables -P INPUT DROP',
    explanation: 'Set default policy to DROP all incoming traffic',
    threat: 'Prevents unauthorized access by denying all traffic unless explicitly allowed',
  });

  rules.push({
    rule: 'iptables -P FORWARD DROP',
    explanation: 'Set default policy to DROP all forwarded traffic',
    threat: 'Prevents routing attacks and unauthorized traffic forwarding',
  });

  rules.push({
    rule: 'iptables -P OUTPUT ACCEPT',
    explanation: 'Allow all outgoing traffic (can be restricted further for maximum security)',
    threat: 'Permits server to initiate connections and respond to requests',
  });

  scoreBreakdown.push({
    category: 'Default Deny Policy',
    points: 25,
    maxPoints: 25,
    reason: 'Implements proper default-deny policy for INPUT and FORWARD chains',
  });
  score += 25;

  rules.push({
    rule: 'iptables -A INPUT -i lo -j ACCEPT',
    explanation: 'Allow all loopback traffic',
    threat: 'Permits internal server processes to communicate with each other',
  });

  rules.push({
    rule: 'iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT',
    explanation: 'Allow established and related connections',
    threat: 'Permits responses to outgoing connections while blocking unsolicited inbound traffic',
  });

  scoreBreakdown.push({
    category: 'Stateful Filtering',
    points: 15,
    maxPoints: 15,
    reason: 'Uses connection tracking to allow legitimate return traffic',
  });
  score += 15;

  for (const protocol of protocols) {
    const port = COMMON_PORTS[protocol.toUpperCase()];
    if (!port) continue;

    const sourceFilter = getSourceFilter(source);
    const rule = `iptables -A INPUT -p tcp --dport ${port}${sourceFilter} -m state --state NEW -j ACCEPT`;

    rules.push({
      rule,
      explanation: `Allow incoming ${protocol} traffic on port ${port}${source.isRestricted ? ' from ' + source.display : ' from anywhere'}`,
      threat: `Enables ${protocol} service while ${source.isRestricted ? 'restricting access to trusted sources' : 'accepting connections from any source'}`,
    });

    if (protocol.toUpperCase() === 'SSH' && !source.isRestricted) {
      warnings.push({
        severity: 'critical',
        message: 'SSH is open to the entire internet (0.0.0.0/0)',
        recommendation: 'Restrict SSH access to specific IP addresses or VPN ranges. SSH exposed to the internet is a prime target for brute-force attacks.',
      });
      scoreBreakdown.push({
        category: `${protocol} Access Control`,
        points: 5,
        maxPoints: 15,
        reason: 'SSH is open to the world - high security risk',
      });
      score += 5;
    } else if (source.isRestricted) {
      scoreBreakdown.push({
        category: `${protocol} Access Control`,
        points: 15,
        maxPoints: 15,
        reason: `${protocol} access is properly restricted to trusted sources`,
      });
      score += 15;
    } else {
      scoreBreakdown.push({
        category: `${protocol} Access Control`,
        points: 10,
        maxPoints: 15,
        reason: `${protocol} is open to all - acceptable for public services but consider rate limiting`,
      });
      score += 10;
    }
  }

  if (protocols.length === 0) {
    warnings.push({
      severity: 'warning',
      message: 'No protocols specified',
      recommendation: 'You should specify which services need to be accessible. Without any ACCEPT rules, all traffic will be blocked.',
    });
  }

  if (protocols.includes('HTTP') && !protocols.includes('HTTPS')) {
    warnings.push({
      severity: 'warning',
      message: 'HTTP enabled without HTTPS',
      recommendation: 'Consider using HTTPS for encrypted communication. HTTP traffic is sent in plain text and can be intercepted.',
    });
  }

  rules.push({
    rule: 'iptables -A INPUT -p icmp --icmp-type echo-request -j ACCEPT',
    explanation: 'Allow ping requests (optional - can be disabled for stealth)',
    threat: 'Enables network diagnostics but reveals server presence',
  });

  rules.push({
    rule: 'iptables -A INPUT -j LOG --log-prefix "DROPPED: "',
    explanation: 'Log all dropped packets for security monitoring',
    threat: 'Helps detect attack attempts and troubleshoot connectivity issues',
  });

  scoreBreakdown.push({
    category: 'Logging & Monitoring',
    points: 10,
    maxPoints: 10,
    reason: 'Implements logging for dropped packets',
  });
  score += 10;

  const comparison = generateComparison(input);
  const learningPoints = generateLearningPoints(input, warnings);

  score = Math.min(100, score);

  return {
    rules,
    warnings,
    score,
    scoreBreakdown,
    comparison,
    learningPoints,
  };
}

function extractProtocols(input: UserInput): string[] {
  const protocols = new Set<string>(input.protocols);

  const desc = input.description.toLowerCase();

  if (input.serverRole === 'web' || desc.includes('web server')) {
    protocols.add('HTTP');
    protocols.add('HTTPS');
  }

  if (input.serverRole === 'db' || desc.includes('database')) {
    if (desc.includes('mysql')) protocols.add('MySQL');
    if (desc.includes('postgres')) protocols.add('PostgreSQL');
    if (desc.includes('mongo')) protocols.add('MongoDB');
    if (desc.includes('redis')) protocols.add('Redis');
  }

  if (input.serverRole === 'bastion' || desc.includes('ssh') || desc.includes('bastion')) {
    protocols.add('SSH');
  }

  if (desc.includes('http')) protocols.add('HTTP');
  if (desc.includes('https')) protocols.add('HTTPS');
  if (desc.includes('ssh')) protocols.add('SSH');
  if (desc.includes('ftp')) protocols.add('FTP');

  return Array.from(protocols);
}

function determineSource(input: UserInput): {
  isRestricted: boolean;
  display: string;
  filter: string;
} {
  if (input.sourceType === 'single' && input.sourceValue) {
    return {
      isRestricted: true,
      display: input.sourceValue,
      filter: ` -s ${input.sourceValue}`,
    };
  }

  if (input.sourceType === 'cidr' && input.sourceValue) {
    return {
      isRestricted: true,
      display: input.sourceValue,
      filter: ` -s ${input.sourceValue}`,
    };
  }

  return {
    isRestricted: false,
    display: 'anywhere (0.0.0.0/0)',
    filter: '',
  };
}

function getSourceFilter(source: ReturnType<typeof determineSource>): string {
  return source.filter;
}

function generateComparison(input: UserInput): ComparisonExample {
  const protocols = extractProtocols(input);
  const mainProtocol = protocols[0] || 'HTTP';
  const port = COMMON_PORTS[mainProtocol.toUpperCase()] || 80;

  return {
    insecure: {
      rules: [
        'iptables -F',
        'iptables -P INPUT ACCEPT',
        'iptables -P FORWARD ACCEPT',
        'iptables -P OUTPUT ACCEPT',
      ],
      why: `This is INSECURE because:
• Flushes all rules without backup
• Sets default policy to ACCEPT (opposite of least-privilege)
• No logging or monitoring
• No protection against port scans or attacks
• Allows all traffic by default - you must explicitly block threats
• If you forget to add a block rule, the service is exposed`,
    },
    secure: {
      rules: [
        'iptables -P INPUT DROP',
        'iptables -A INPUT -i lo -j ACCEPT',
        'iptables -A INPUT -m state --state ESTABLISHED,RELATED -j ACCEPT',
        `iptables -A INPUT -p tcp --dport ${port} -m state --state NEW -j ACCEPT`,
        'iptables -A INPUT -j LOG --log-prefix "DROPPED: "',
      ],
      why: `This is SECURE because:
• Default-deny policy (least-privilege principle)
• Explicitly allows only necessary traffic
• Uses stateful filtering (connection tracking)
• Allows loopback for internal processes
• Logs dropped packets for monitoring
• If you forget to add an allow rule, the service is protected by default`,
    },
  };
}

function generateLearningPoints(input: UserInput, warnings: SecurityWarning[]): string[] {
  const points: string[] = [
    'Principle of Least Privilege: Start with "deny all" and only allow what is necessary',
    'Stateful Filtering: Connection tracking allows return traffic without opening holes',
    'Defense in Depth: Firewall is just one layer - also use app-level auth, rate limiting, and monitoring',
  ];

  if (warnings.some((w) => w.message.includes('SSH'))) {
    points.push(
      'SSH Protection: Always restrict SSH to known IPs. Use key-based auth and consider fail2ban for brute-force protection'
    );
  }

  if (extractProtocols(input).includes('HTTP')) {
    points.push(
      'HTTP vs HTTPS: Unencrypted HTTP traffic can be intercepted. Use HTTPS with proper TLS configuration'
    );
  }

  points.push(
    'Attack Vectors Prevented: Port scanning, unauthorized access, lateral movement, and reconnaissance attacks'
  );

  points.push(
    'Common Mistakes: Using default ACCEPT policies, allowing 0.0.0.0/0 for management ports, forgetting to enable logging'
  );

  points.push(
    'Trust but Verify: Even AI-generated rules should be reviewed. Understand each rule before applying to production'
  );

  return points;
}
