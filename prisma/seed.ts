import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Define activity types to match the enum in the schema
type ActivityType = 'QUIZ' | 'CODE_CHALLENGE' | 'LAB' | 'SIMULATION' | 'READING';

async function main() {
  console.log('Starting seeding...');
  
  // Create the 10 levels
  const levels = [
    {
      name: 'Security Fundamentals',
      description: 'Learn the CIA triad and basic security principles that form the foundation of cybersecurity.',
      order: 1,
      minPointsToPass: 100
    },
    {
      name: 'Network Security',
      description: 'Explore network protocols, firewalls, and packet analysis techniques.',
      order: 2,
      minPointsToPass: 120
    },
    {
      name: 'Web Security',
      description: 'Understand the OWASP Top 10 vulnerabilities and learn about injection attacks.',
      order: 3,
      minPointsToPass: 150
    },
    {
      name: 'Cryptography',
      description: 'Learn about encryption, hashing, and digital signatures.',
      order: 4,
      minPointsToPass: 150
    },
    {
      name: 'Authentication & Authorization',
      description: 'Explore access control mechanisms and multi-factor authentication.',
      order: 5,
      minPointsToPass: 180
    },
    {
      name: 'Social Engineering',
      description: 'Identify phishing attacks and other social engineering techniques.',
      order: 6,
      minPointsToPass: 180
    },
    {
      name: 'Malware Analysis',
      description: 'Analyze malware samples in a safe, controlled environment.',
      order: 7,
      minPointsToPass: 200
    },
    {
      name: 'Digital Forensics',
      description: 'Learn evidence collection and analysis techniques used in digital forensics.',
      order: 8,
      minPointsToPass: 200
    },
    {
      name: 'Incident Response',
      description: 'Study incident response frameworks and participate in simulated security incidents.',
      order: 9,
      minPointsToPass: 220
    },
    {
      name: 'Advanced Persistent Threats',
      description: 'Understand complex, sophisticated attacks and defense strategies.',
      order: 10,
      minPointsToPass: 250
    }
  ];

  // Insert all levels
  for (const level of levels) {
    await prisma.level.upsert({
      where: { order: level.order },
      update: level,
      create: level
    });
    console.log(`Level ${level.order}: ${level.name} created/updated`);
  }

  // Sample activities for Level 1
  const level1Activities = [
    {
      levelId: 1,
      name: 'CIA Triad Quiz',
      description: 'Test your knowledge of the Confidentiality, Integrity, and Availability triad.',
      type: 'QUIZ' as ActivityType,
      content: {
        questions: [
          {
            question: 'Which component of the CIA triad ensures that data can only be accessed by authorized individuals?',
            options: ['Confidentiality', 'Integrity', 'Availability', 'Authenticity'],
            correctAnswer: 'Confidentiality'
          },
          {
            question: 'Which component of the CIA triad ensures that data remains unchanged during storage or transmission?',
            options: ['Confidentiality', 'Integrity', 'Availability', 'Accountability'],
            correctAnswer: 'Integrity'
          },
          {
            question: 'Which component of the CIA triad ensures that systems and data are accessible when needed?',
            options: ['Confidentiality', 'Integrity', 'Availability', 'Non-repudiation'],
            correctAnswer: 'Availability'
          }
        ]
      },
      points: 30,
      order: 1,
      isRequired: true
    },
    {
      levelId: 1,
      name: 'Security Principles Reading',
      description: 'Learn about the key principles that guide secure system design.',
      type: 'READING' as ActivityType,
      content: {
        sections: [
          {
            title: 'Defense in Depth',
            content: 'Defense in depth involves implementing multiple layers of security controls throughout an IT system...'
          },
          {
            title: 'Principle of Least Privilege',
            content: 'The principle of least privilege states that users should only have access to the resources they need...'
          },
          {
            title: 'Separation of Duties',
            content: 'Separation of duties is a principle that ensures no single individual has control over all parts of a critical process...'
          }
        ]
      },
      points: 20,
      order: 2,
      isRequired: true
    },
    {
      levelId: 1,
      name: 'Security Detective: CIA Triad in Action',
      description: 'Identify security issues in everyday scenarios and classify them according to the CIA triad.',
      type: 'LAB' as ActivityType,
      content: JSON.stringify({
        title: 'Security Detective: CIA Triad in Action',
        description: 'Examine everyday workplace scenarios to identify security issues related to the CIA triad.',
        instructions: '<p>Your job as a Security Detective is to investigate the virtual office environment, identify security issues, and implement appropriate solutions based on the CIA triad principles (Confidentiality, Integrity, and Availability).</p><p>For each object in the office:</p><ol><li>Click on the object to examine it</li><li>Review the security issues found</li><li>Understand the impact of each issue on the organization</li><li>Implement the appropriate solution</li></ol>',
        setupGuide: '<p>No special setup is required. Click on objects in the virtual office to begin your investigation.</p>',
        officeObjects: [
          {
            id: "computer1",
            name: "Employee Workstation",
            type: "computer",
            position: { x: 100, y: 100 },
            image: "/images/labs/level1/computer.svg",
            isInteractable: true,
            securityIssues: [
              {
                id: "issue1",
                type: "confidentiality",
                description: "Computer is left unlocked with sensitive data visible",
                impact: "Unauthorized access to sensitive information",
                solution: "Implement automatic screen locking after inactivity",
                isFixed: false
              }
            ]
          },
          {
            id: "document1",
            name: "Confidential Report",
            type: "document",
            position: { x: 200, y: 150 },
            image: "/images/labs/level1/document.svg",
            isInteractable: true,
            securityIssues: [
              {
                id: "issue2",
                type: "integrity",
                description: "Document is not properly secured and can be modified",
                impact: "Unauthorized modifications to sensitive data",
                solution: "Implement document version control and access restrictions",
                isFixed: false
              }
            ]
          },
          {
            id: "cabinet1",
            name: "Filing Cabinet",
            type: "cabinet",
            position: { x: 300, y: 200 },
            image: "/images/labs/level1/cabinet.svg",
            isInteractable: true,
            securityIssues: [
              {
                id: "issue3",
                type: "confidentiality",
                description: "Physical documents are not properly secured",
                impact: "Unauthorized physical access to sensitive documents",
                solution: "Implement physical security controls and access logs",
                isFixed: false
              }
            ]
          },
          {
            id: "printer1",
            name: "Network Printer",
            type: "printer",
            position: { x: 400, y: 250 },
            image: "/images/labs/level1/printer.svg",
            isInteractable: true,
            securityIssues: [
              {
                id: "issue4",
                type: "availability",
                description: "Printer lacks proper security controls",
                impact: "Potential for denial of service attacks",
                solution: "Implement printer access controls and monitoring",
                isFixed: false
              }
            ]
          }
        ],
        resources: [
          {
            name: "CIA Triad Explanation",
            url: "https://www.cisecurity.org/insights/blog/the-cia-triad"
          },
          {
            name: "Common Security Risks in the Workplace",
            url: "https://www.sans.org/security-awareness-training/resources/security-awareness-planning-toolkit"
          }
        ]
      }),
      points: 50,
      order: 3,
      isRequired: true
    }
  ];

  // Level 2 activities - Network Security
  const level2Activities = [
    {
      levelId: 2,
      name: 'Network Protocols Quiz',
      description: 'Test your knowledge of common network protocols and their security implications.',
      type: 'QUIZ' as ActivityType,
      content: {
        questions: [
          {
            id: "q1",
            question: 'Which protocol is considered more secure for remote administration than Telnet?',
            options: ['FTP', 'SSH', 'HTTP', 'SMTP'],
            correctAnswer: 'SSH'
          },
          {
            id: "q2",
            question: 'Which protocol encrypts web traffic between a browser and a server?',
            options: ['HTTP', 'HTTPS', 'FTP', 'SMTP'],
            correctAnswer: 'HTTPS'
          },
          {
            id: "q3",
            question: 'Which network layer protocol is responsible for routing packets across networks?',
            options: ['TCP', 'UDP', 'IP', 'ARP'],
            correctAnswer: 'IP'
          },
          {
            id: "q4",
            question: 'What is the primary security concern with the FTP protocol?',
            options: [
              'It transmits data too slowly',
              'It uses too much bandwidth',
              'It transmits credentials and data in plaintext',
              'It only works on local networks'
            ],
            correctAnswer: 'It transmits credentials and data in plaintext'
          },
          {
            id: "q5",
            question: 'Which protocol is used to automatically assign IP addresses to devices on a network?',
            options: ['DNS', 'DHCP', 'ICMP', 'SNMP'],
            correctAnswer: 'DHCP'
          }
        ]
      },
      points: 40,
      order: 1,
      isRequired: true
    },
    {
      levelId: 2,
      name: 'Firewall Fundamentals',
      description: 'Learn about different types of firewalls and how they protect networks.',
      type: 'READING' as ActivityType,
      content: {
        sections: [
          {
            heading: 'Introduction to Firewalls',
            content: '<p>A firewall is a network security device that monitors and filters incoming and outgoing network traffic based on an organization\'s previously established security policies. At its most basic, a firewall is essentially the barrier that sits between a private internal network and the public Internet.</p><p>The primary purpose of a firewall is to allow non-threatening traffic in and to keep dangerous traffic out. Firewalls can be implemented as hardware, software, or a combination of both.</p>'
          },
          {
            heading: 'Types of Firewalls',
            content: '<p><strong>Packet Filtering Firewalls</strong>: The most basic type of firewall that examines data packets and prohibits them from passing through if they don\'t match an established security rule set. This type of firewall checks the packet\'s source and destination IP addresses. If packets match those of an "allowed" rule on the firewall, then it is trusted to enter the network.</p><p><strong>Stateful Inspection Firewalls</strong>: These keep track of the state of active connections and use this information to determine which network packets to allow through the firewall. They examine not just the header information but also the contents of the packet up through the application layer.</p><p><strong>Proxy Firewalls</strong>: Also known as application-level gateways, proxy firewalls filter network traffic at the application level. Unlike basic firewalls, the proxy acts as an intermediary between two end systems. The client must send a request to the firewall, where it is evaluated against a set of security rules and then permitted or blocked.</p><p><strong>Next-Generation Firewalls (NGFW)</strong>: These combine traditional firewall technology with additional functionality, such as encrypted traffic inspection, intrusion prevention systems, anti-virus, and more. NGFWs include deep packet inspection (DPI) functionality that enables them to identify and block malicious applications or content that might use a trusted port.</p>'
          },
          {
            heading: 'Firewall Rules and Policies',
            content: '<p>Firewall rules are configured to filter traffic based on:</p><ul><li><strong>IP addresses</strong>: Source and destination addresses can be allowed or blocked</li><li><strong>Domain names</strong>: Specific domain names can be allowed or blocked</li><li><strong>Protocols</strong>: Specific protocols like HTTP, FTP, or SMTP can be allowed or blocked</li><li><strong>Ports</strong>: Traffic on specific ports can be allowed or blocked</li><li><strong>Keywords</strong>: Traffic containing specific keywords can be blocked</li></ul><p>Most firewalls use a "default deny" policy, which means that anything not explicitly allowed is automatically blocked.</p>'
          },
          {
            heading: 'Firewall Deployment Architectures',
            content: '<p><strong>Network-level Firewalls</strong>: Deployed at the boundary between networks, such as between the internet and a private network.</p><p><strong>Host-based Firewalls</strong>: Software applications installed on individual computers to protect them from external threats.</p><p><strong>DMZ (Demilitarized Zone)</strong>: A network architecture where publicly accessible servers are placed in a separate network segment, protected by firewalls both from the internet and from the internal network.</p><p><strong>Multi-layered Firewall Architecture</strong>: Uses multiple firewalls to create several layers of security, often with different types of firewalls at each layer.</p>'
          },
          {
            heading: 'Firewall Limitations',
            content: '<p>While firewalls are essential for network security, they have limitations:</p><ul><li>They cannot protect against attacks that don\'t go through the firewall</li><li>They cannot protect against internal threats</li><li>They cannot protect against new or unknown threats without regular updates</li><li>They cannot protect against malware downloaded by users who are allowed through the firewall</li><li>They cannot protect against tunneling attacks that use allowed protocols</li></ul><p>For comprehensive security, firewalls should be used as part of a defense-in-depth strategy, combined with other security measures like intrusion detection systems, anti-malware software, and security awareness training.</p>'
          }
        ]
      },
      points: 30,
      order: 2,
      isRequired: true
    },
    {
      levelId: 2,
      name: 'Firewall Rule Configuration Simulator',
      description: 'Practice configuring firewall rules to protect networks from malicious traffic.',
      type: 'LAB' as ActivityType,
      content: {
        title: 'Firewall Rule Configuration Simulator',
        description: 'Learn to create effective firewall rules to block malicious traffic while allowing legitimate traffic.',
        instructions: `<p>In this lab, you will configure firewall rules to protect different network environments from various threats.</p>
        <p>Each scenario presents a different network configuration with specific security requirements. Your task is to create firewall rules that:</p>
        <ul>
          <li>Block malicious traffic that could harm your network</li>
          <li>Allow legitimate traffic that users and services need</li>
          <li>Follow the principle of least privilege by being as specific as possible with your rules</li>
        </ul>
        <p>Use wildcards (*) to match all IP addresses or ports, and "any" to match all protocols when necessary, but remember that more specific rules provide better security.</p>`,
        setupGuide: `<p>The simulator is ready to use. No additional setup is required.</p>
        <p>Each rule contains these elements:</p>
        <ul>
          <li><strong>Source IP</strong>: Where the traffic is coming from (use * for any source)</li>
          <li><strong>Destination IP</strong>: Where the traffic is going to (use * for any destination)</li>
          <li><strong>Protocol</strong>: The protocol being used (tcp, udp, icmp, or any)</li>
          <li><strong>Port</strong>: The port number or range being used (use * for any port)</li>
          <li><strong>Action</strong>: Whether to allow or deny the matching traffic</li>
        </ul>
        <p>Rules are processed in order from top to bottom, with the first matching rule being applied. If no rule matches, traffic is allowed by default.</p>`,
        scenarios: [
          {
            id: "scenario1",
            name: "Basic Perimeter Security",
            description: "You're setting up a basic firewall for a small business network. The internal network uses addresses in the 192.168.1.0/24 range.",
            goal: "Block all incoming connections except web (HTTP/HTTPS) and email (SMTP/IMAP) traffic",
            hint: "Create rules to specifically allow web and email protocols on their standard ports, then add a rule to block all other incoming traffic.",
            solution: `<p>Here's an effective set of rules for this scenario:</p>
            <ol>
              <li><strong>Allow HTTP:</strong> Source IP: * | Destination IP: 192.168.1.0/24 | Protocol: tcp | Port: 80 | Action: allow</li>
              <li><strong>Allow HTTPS:</strong> Source IP: * | Destination IP: 192.168.1.0/24 | Protocol: tcp | Port: 443 | Action: allow</li>
              <li><strong>Allow SMTP:</strong> Source IP: * | Destination IP: 192.168.1.0/24 | Protocol: tcp | Port: 25 | Action: allow</li>
              <li><strong>Allow IMAP:</strong> Source IP: * | Destination IP: 192.168.1.0/24 | Protocol: tcp | Port: 143 | Action: allow</li>
              <li><strong>Block all other incoming:</strong> Source IP: * | Destination IP: 192.168.1.0/24 | Protocol: any | Port: * | Action: deny</li>
            </ol>
            <p>This configuration follows the principle of least privilege by only allowing specific necessary services and blocking everything else.</p>`,
            traffic: [
              {
                id: "p1",
                source_ip: "203.0.113.15",
                destination_ip: "192.168.1.10",
                protocol: "tcp",
                source_port: 49823,
                destination_port: 80,
                payload: "GET /index.html HTTP/1.1",
                is_malicious: false,
                description: "Legitimate HTTP request"
              },
              {
                id: "p2",
                source_ip: "203.0.113.27",
                destination_ip: "192.168.1.10",
                protocol: "tcp",
                source_port: 52147,
                destination_port: 443,
                payload: "Client Hello",
                is_malicious: false,
                description: "Legitimate HTTPS request"
              },
              {
                id: "p3",
                source_ip: "198.51.100.75",
                destination_ip: "192.168.1.25",
                protocol: "tcp",
                source_port: 33218,
                destination_port: 25,
                payload: "EHLO mail.example.com",
                is_malicious: false,
                description: "Legitimate SMTP connection"
              },
              {
                id: "p4",
                source_ip: "198.51.100.80",
                destination_ip: "192.168.1.25",
                protocol: "tcp",
                source_port: 58741,
                destination_port: 143,
                payload: "A1 LOGIN user password",
                is_malicious: false,
                description: "Legitimate IMAP connection"
              },
              {
                id: "p5",
                source_ip: "45.33.22.156",
                destination_ip: "192.168.1.10",
                protocol: "tcp",
                source_port: 55872,
                destination_port: 22,
                payload: "SSH-2.0-OpenSSH_7.9",
                is_malicious: true,
                description: "Unauthorized SSH access attempt"
              },
              {
                id: "p6",
                source_ip: "192.168.1.105",
                destination_ip: "8.8.8.8",
                protocol: "udp",
                source_port: 53124,
                destination_port: 53,
                payload: "DNS Query: example.com",
                is_malicious: false,
                description: "Legitimate outgoing DNS query"
              },
              {
                id: "p7",
                source_ip: "91.234.56.17",
                destination_ip: "192.168.1.15",
                protocol: "tcp",
                source_port: 47125,
                destination_port: 3389,
                payload: "RDP Connection Request",
                is_malicious: true,
                description: "Unauthorized RDP access attempt"
              }
            ]
          },
          {
            id: "scenario2",
            name: "Web Server Protection",
            description: "Your company hosts a web server that needs to be accessible to the public, but you want to protect it from common attacks.",
            goal: "Allow HTTP(S) access while blocking known attack patterns and unauthorized services",
            hint: "Create rules to specifically block high-port scanning, database access attempts, and known malicious IPs, while allowing legitimate web traffic.",
            solution: `<p>Here's an effective set of rules for securing the web server:</p>
            <ol>
              <li><strong>Block known malicious IP:</strong> Source IP: 195.54.160.21 | Destination IP: 10.0.1.10 | Protocol: any | Port: * | Action: deny</li>
              <li><strong>Block SSH access:</strong> Source IP: * | Destination IP: 10.0.1.10 | Protocol: tcp | Port: 22 | Action: deny</li>
              <li><strong>Block database access:</strong> Source IP: * | Destination IP: 10.0.1.10 | Protocol: tcp | Port: 3306 | Action: deny</li>
              <li><strong>Allow HTTP:</strong> Source IP: * | Destination IP: 10.0.1.10 | Protocol: tcp | Port: 80 | Action: allow</li>
              <li><strong>Allow HTTPS:</strong> Source IP: * | Destination IP: 10.0.1.10 | Protocol: tcp | Port: 443 | Action: allow</li>
            </ol>
            <p>This configuration provides targeted protection by blocking specific threats while allowing legitimate web traffic. Blocking the specific malicious IP first prevents any traffic from that source from reaching the server.</p>`,
            traffic: [
              {
                id: "p1",
                source_ip: "203.0.113.15",
                destination_ip: "10.0.1.10",
                protocol: "tcp",
                source_port: 49823,
                destination_port: 80,
                payload: "GET /index.html HTTP/1.1",
                is_malicious: false,
                description: "Legitimate HTTP request"
              },
              {
                id: "p2",
                source_ip: "203.0.113.27",
                destination_ip: "10.0.1.10",
                protocol: "tcp",
                source_port: 52147,
                destination_port: 443,
                payload: "Client Hello",
                is_malicious: false,
                description: "Legitimate HTTPS request"
              },
              {
                id: "p3",
                source_ip: "195.54.160.21",
                destination_ip: "10.0.1.10",
                protocol: "tcp",
                source_port: 55321,
                destination_port: 80,
                payload: "GET /wp-login.php HTTP/1.1",
                is_malicious: true,
                description: "WordPress login brute force attempt"
              },
              {
                id: "p4",
                source_ip: "91.234.56.17",
                destination_ip: "10.0.1.10",
                protocol: "tcp",
                source_port: 57412,
                destination_port: 22,
                payload: "SSH-2.0-OpenSSH_7.9",
                is_malicious: true,
                description: "Unauthorized SSH access attempt"
              },
              {
                id: "p5",
                source_ip: "195.54.160.21",
                destination_ip: "10.0.1.10",
                protocol: "tcp",
                source_port: 55329,
                destination_port: 3306,
                payload: "MySQL Connection Request",
                is_malicious: true,
                description: "Database access attempt from outside"
              },
              {
                id: "p6",
                source_ip: "88.22.15.77",
                destination_ip: "10.0.1.10",
                protocol: "tcp",
                source_port: 33567,
                destination_port: 443,
                payload: "POST /api/v1/login HTTP/1.1",
                is_malicious: false,
                description: "Legitimate API login request"
              }
            ]
          },
          {
            id: "scenario3",
            name: "Internal Network Segmentation",
            description: "You need to segment an internal network to separate the accounting department (10.0.2.0/24) from general staff (10.0.1.0/24), while both need access to the file server (10.0.3.10).",
            goal: "Allow specific cross-department traffic while maintaining security boundaries",
            hint: "Create rules to allow only necessary traffic between departments, focusing on specific protocols and ports needed for each department's functions.",
            solution: `<p>Here's an effective set of rules for network segmentation:</p>
            <ol>
              <li><strong>Allow general staff to file server:</strong> Source IP: 10.0.1.0/24 | Destination IP: 10.0.3.10 | Protocol: tcp | Port: 445 | Action: allow</li>
              <li><strong>Allow accounting to file server:</strong> Source IP: 10.0.2.0/24 | Destination IP: 10.0.3.10 | Protocol: tcp | Port: 445 | Action: allow</li>
              <li><strong>Allow accounting to database:</strong> Source IP: 10.0.2.0/24 | Destination IP: 10.0.3.15 | Protocol: tcp | Port: 1433 | Action: allow</li>
              <li><strong>Block accounting to general staff:</strong> Source IP: 10.0.2.0/24 | Destination IP: 10.0.1.0/24 | Protocol: any | Port: * | Action: deny</li>
              <li><strong>Block general staff to accounting:</strong> Source IP: 10.0.1.0/24 | Destination IP: 10.0.2.0/24 | Protocol: any | Port: * | Action: deny</li>
              <li><strong>Block database access from general staff:</strong> Source IP: 10.0.1.0/24 | Destination IP: 10.0.3.15 | Protocol: tcp | Port: 1433 | Action: deny</li>
            </ol>
            <p>This configuration creates proper network segmentation while still allowing necessary access to shared resources. The accounting department can access their specialized database, while both departments can access the file server.</p>`,
            traffic: [
              {
                id: "p1",
                source_ip: "10.0.1.25",
                destination_ip: "10.0.3.10",
                protocol: "tcp",
                source_port: 49823,
                destination_port: 445,
                payload: "SMB File Access Request",
                is_malicious: false,
                description: "General staff accessing file server"
              },
              {
                id: "p2",
                source_ip: "10.0.2.15",
                destination_ip: "10.0.3.10",
                protocol: "tcp",
                source_port: 52147,
                destination_port: 445,
                payload: "SMB File Access Request",
                is_malicious: false,
                description: "Accounting staff accessing file server"
              },
              {
                id: "p3",
                source_ip: "10.0.2.15",
                destination_ip: "10.0.1.30",
                protocol: "tcp",
                source_port: 55321,
                destination_port: 445,
                payload: "SMB File Access Request",
                is_malicious: true,
                description: "Accounting attempting to access general staff's files"
              },
              {
                id: "p4",
                source_ip: "10.0.1.30",
                destination_ip: "10.0.2.15",
                protocol: "tcp",
                source_port: 57412,
                destination_port: 445,
                payload: "SMB File Access Request",
                is_malicious: true,
                description: "General staff attempting to access accounting files"
              },
              {
                id: "p5",
                source_ip: "10.0.1.45",
                destination_ip: "10.0.3.20",
                protocol: "tcp",
                source_port: 55329,
                destination_port: 1433,
                payload: "SQL Server Connection Request",
                is_malicious: true,
                description: "Unauthorized database access attempt"
              },
              {
                id: "p6",
                source_ip: "10.0.2.20",
                destination_ip: "10.0.3.15",
                protocol: "tcp",
                source_port: 33567,
                destination_port: 1433,
                payload: "SQL Server Connection Request",
                is_malicious: false,
                description: "Legitimate accounting database access"
              }
            ]
          }
        ],
        resources: [
          {
            name: "Firewall Rules Best Practices",
            url: "https://www.cisco.com/c/en/us/support/docs/security/ios-firewall/23602-confaccesslists.html"
          },
          {
            name: "Common Firewall Configurations",
            url: "https://www.paloaltonetworks.com/cyberpedia/what-is-a-firewall"
          }
        ]
      },
      points: 50,
      order: 3,
      isRequired: true
    }
  ];

  // Create activities for Level 1
  for (const activity of level1Activities) {
    await prisma.activity.upsert({
      where: {
        levelId_order: {
          levelId: activity.levelId,
          order: activity.order
        }
      },
      update: activity,
      create: activity
    });
    console.log(`Activity "${activity.name}" for Level ${activity.levelId} created/updated`);
  }

  // Create activities for Level 2
  for (const activity of level2Activities) {
    await prisma.activity.upsert({
      where: {
        levelId_order: {
          levelId: activity.levelId,
          order: activity.order
        }
      },
      update: activity,
      create: activity
    });
    console.log(`Activity "${activity.name}" for Level ${activity.levelId} created/updated`);
  }

  // Define Level 3 activities (Web Security)
  const level3Activities = [
    {
      levelId: 3,
      name: 'Web Security Fundamentals',
      description: 'Learn about the OWASP Top 10 vulnerabilities and web security basics.',
      type: 'READING' as ActivityType,
      content: {
        sections: [
          {
            heading: 'Introduction to Web Security',
            content: '<p>Web security involves protecting websites and web applications from various security threats. As the web becomes increasingly complex, with applications handling sensitive data and business operations, security has become a critical concern.</p><p>The Open Web Application Security Project (OWASP) maintains a list of the top 10 most critical web application security risks, which serves as a valuable reference for web developers and security professionals.</p>'
          },
          {
            heading: 'OWASP Top 10 Overview',
            content: '<p>The OWASP Top 10 is a standard awareness document that represents the most critical security risks to web applications. Here are the current top security risks:</p><ol><li><strong>Injection Flaws</strong>: SQL, NoSQL, OS, and LDAP injection occur when untrusted data is sent to an interpreter as part of a command or query.</li><li><strong>Broken Authentication</strong>: Authentication and session management functions are often implemented incorrectly, allowing attackers to compromise passwords, keys, or session tokens.</li><li><strong>Sensitive Data Exposure</strong>: Many web applications do not properly protect sensitive data, such as financial, healthcare, or personally identifiable information.</li><li><strong>XML External Entities (XXE)</strong>: Older or poorly configured XML processors evaluate external entity references within XML documents.</li><li><strong>Broken Access Control</strong>: Restrictions on what authenticated users are allowed to do are often not properly enforced.</li><li><strong>Security Misconfiguration</strong>: Security settings are defined, implemented, and maintained improperly.</li><li><strong>Cross-Site Scripting (XSS)</strong>: XSS occurs when an application includes untrusted data in a new web page without proper validation.</li><li><strong>Insecure Deserialization</strong>: This can lead to remote code execution, which is one of the most serious attacks possible.</li><li><strong>Using Components with Known Vulnerabilities</strong>: Components such as libraries, frameworks, and other software modules run with the same privileges as the application.</li><li><strong>Insufficient Logging & Monitoring</strong>: Lack of logging and monitoring, coupled with inadequate incident response, allows attackers to further attack systems and maintain persistence.</li></ol>'
          },
          {
            heading: 'SQL Injection Explained',
            content: '<p>SQL Injection is one of the most common web application vulnerabilities. It allows attackers to inject malicious SQL code into queries that an application sends to its database.</p><p>Successful SQL injection attacks can:</p><ul><li>Read sensitive data from the database</li><li>Modify database data (Insert/Update/Delete)</li><li>Execute administration operations on the database</li><li>Recover the content of a given file on the database server</li><li>In some cases, issue commands to the operating system</li></ul><p>Common signs of SQL Injection vulnerabilities include:</p><ul><li>User-supplied data in web forms, query parameters, or input fields is directly used in SQL queries</li><li>The application does not validate or sanitize user inputs</li><li>The application uses dynamic SQL with user-supplied input</li></ul><p>To protect against SQL Injection, always:</p><ul><li>Use parameterized queries (prepared statements)</li><li>Use stored procedures</li><li>Validate all user inputs</li><li>Escape special characters</li><li>Implement the principle of least privilege for database accounts</li></ul>'
          },
          {
            heading: 'Cross-Site Scripting (XSS)',
            content: '<p>Cross-Site Scripting (XSS) allows attackers to inject client-side scripts into web pages viewed by users. When successful, XSS can be used to hijack user sessions, deface websites, redirect users to malicious sites, or steal sensitive information.</p><p>There are three main types of XSS attacks:</p><ol><li><strong>Reflected XSS</strong>: The malicious script comes from the current HTTP request and is not stored.</li><li><strong>Stored XSS</strong>: The malicious script is stored on the target server (e.g., in a database, message forum, visitor log, etc.) and is later retrieved by victims when they visit the vulnerable page.</li><li><strong>DOM-based XSS</strong>: The vulnerability exists in client-side code rather than server-side code.</li></ol><p>To protect against XSS attacks:</p><ul><li>Escape output data based on the context (HTML, JavaScript, CSS, URL)</li><li>Use Content Security Policy (CSP) headers</li><li>Implement input validation</li><li>Use modern frameworks that automatically escape content</li><li>Keep all libraries and frameworks updated</li></ul>'
          }
        ]
      },
      points: 40,
      order: 1,
      isRequired: true
    },
    {
      levelId: 3,
      name: 'OWASP Top 10 Quiz',
      description: 'Test your knowledge of the OWASP Top 10 web security vulnerabilities.',
      type: 'QUIZ' as ActivityType,
      content: {
        questions: [
          {
            question: 'Which OWASP Top 10 vulnerability involves sending untrusted data to an interpreter as part of a command or query?',
            options: ['Cross-Site Scripting', 'Injection', 'Broken Authentication', 'Insecure Deserialization'],
            correctAnswer: 'Injection'
          },
          {
            question: 'What is the best protection against SQL Injection attacks?',
            options: ['Using client-side validation', 'Using parameterized queries', 'Disabling error messages', 'Encrypting the database'],
            correctAnswer: 'Using parameterized queries'
          },
          {
            question: 'Which type of XSS attack occurs when malicious scripts are stored on the target server?',
            options: ['Reflected XSS', 'Stored XSS', 'DOM-based XSS', 'Persistent XSS'],
            correctAnswer: 'Stored XSS'
          },
          {
            question: 'What does the "A" in CSRF stand for?',
            options: ['Application', 'Authentication', 'Authorization', 'Attack'],
            correctAnswer: 'Application'
          },
          {
            question: 'Which security measure helps prevent Cross-Site Scripting attacks?',
            options: ['Using HTTP-only cookies', 'Content Security Policy (CSP)', 'SSL/TLS encryption', 'Database encryption'],
            correctAnswer: 'Content Security Policy (CSP)'
          }
        ]
      },
      points: 50,
      order: 2,
      isRequired: true
    },
    {
      levelId: 3,
      name: 'SQL Injection Lab',
      description: 'Practice identifying and exploiting SQL injection vulnerabilities in a safe environment.',
      type: 'LAB' as ActivityType,
      content: {
        title: 'SQL Injection Lab',
        description: 'Learn how SQL injection attacks work and how to protect against them.',
        instructions: '<p>In this lab, you will explore SQL injection vulnerabilities through a simulated website. You\'ll learn how attackers can exploit poorly secured web applications and how to identify and prevent these attacks.</p><p>The lab includes a mock login form, a search form, and a user profile page, each with different levels of vulnerability to SQL injection.</p><p>Your tasks are to:</p><ol><li>Successfully exploit the SQL injection vulnerabilities</li><li>Extract information from the database</li><li>Understand the underlying SQL queries that are vulnerable</li><li>Learn how to fix these vulnerabilities using proper security techniques</li></ol>',
        setupGuide: '<p>This lab is ready to use in your browser. No special setup is required.</p><p>Use the simulated web application interfaces provided in the lab environment to practice SQL injection techniques.</p><p>Remember that in a real-world scenario, these techniques should only be used on systems you have permission to test.</p>',
        scenarios: [
          {
            id: "login-bypass",
            name: "Authentication Bypass",
            description: "The login form is vulnerable to SQL injection. Try to bypass the authentication without knowing a valid username or password.",
            hint: "Think about how the SQL query might be structured and how you can manipulate it to always return true.",
            vulnerability: "The application directly concatenates user input into the SQL query without proper sanitization.",
            difficulty: "Easy",
            sqlQuery: "SELECT * FROM users WHERE username = '[INPUT_USERNAME]' AND password = '[INPUT_PASSWORD]'",
            solution: `<p><strong>Solution:</strong></p>
            <ol>
              <li>In the username field, enter: <code>admin' --</code></li>
              <li>In the password field, enter anything (it will be ignored)</li>
            </ol>
            <p><strong>Explanation:</strong></p>
            <p>The SQL query becomes:</p>
            <pre>SELECT * FROM users WHERE username = 'admin' --' AND password = 'anything'</pre>
            <p>The <code>--</code> is a SQL comment that causes the rest of the query to be ignored, so the password check is bypassed.</p>
            <p><strong>Alternative solution:</strong></p>
            <ol>
              <li>Username: <code>' OR '1'='1</code></li>
              <li>Password: <code>' OR '1'='1</code></li>
            </ol>
            <p>This makes the query:</p>
            <pre>SELECT * FROM users WHERE username = '' OR '1'='1' AND password = '' OR '1'='1'</pre>
            <p>Since <code>'1'='1'</code> is always true, this returns all users, and the first one is typically used for authentication.</p>
            <p><strong>How to fix:</strong></p>
            <p>Use parameterized queries instead of string concatenation:</p>
            <pre>const query = "SELECT * FROM users WHERE username = ? AND password = ?";
db.query(query, [username, password]);</pre>`
          },
          {
            id: "data-extraction",
            name: "Data Extraction",
            description: "The product search feature is vulnerable to SQL injection. Extract information about the database schema and other tables in the database.",
            hint: "Use UNION SELECT statements to extract metadata from the database system tables.",
            vulnerability: "The search function doesn't properly sanitize user input before using it in a SQL query.",
            difficulty: "Medium",
            sqlQuery: "SELECT id, name, description, price FROM products WHERE name LIKE '%[INPUT_SEARCH]%' OR description LIKE '%[INPUT_SEARCH]%'",
            solution: `<p><strong>Solution to extract table names:</strong></p>
            <p>Enter in the search field:</p>
            <pre>' UNION SELECT 1, table_name, table_schema, 4 FROM information_schema.tables WHERE table_schema != 'information_schema' AND table_schema != 'mysql' --</pre>
            <p><strong>Explanation:</strong></p>
            <p>This query uses UNION SELECT to combine the original query results with a query that extracts table names from the database metadata (information_schema.tables). The numbers 1 and 4 are placeholders to match the column count of the original query.</p>
            <p><strong>Solution to extract column names:</strong></p>
            <p>Once you know a table name (e.g., 'users'), enter:</p>
            <pre>' UNION SELECT 1, column_name, data_type, 4 FROM information_schema.columns WHERE table_name = 'users' --</pre>
            <p><strong>Solution to extract user data:</strong></p>
            <p>After finding column names (e.g., username, password), enter:</p>
            <pre>' UNION SELECT id, username, password, email FROM users --</pre>
            <p><strong>How to fix:</strong></p>
            <p>Use parameterized queries and input validation:</p>
            <pre>const query = "SELECT id, name, description, price FROM products WHERE name LIKE ? OR description LIKE ?";
const searchParam = "%" + search + "%";
db.query(query, [searchParam, searchParam]);</pre>`
          },
          {
            id: "blind-injection",
            name: "Blind SQL Injection",
            description: "The profile page is vulnerable to blind SQL injection. The page doesn't display database data directly, but behaves differently based on SQL query results.",
            hint: "Use boolean conditions and observe the page behavior to extract information character by character.",
            vulnerability: "The application uses user input in SQL queries without proper validation, but doesn't display the results directly.",
            difficulty: "Hard",
            sqlQuery: "SELECT * FROM users WHERE id = [INPUT_ID]",
            solution: `<p><strong>Solution for detecting vulnerability:</strong></p>
            <p>Try changing the user ID parameter in the URL:</p>
            <ol>
              <li>Normal request: <code>/profile?id=1</code> (shows a profile)</li>
              <li>Test boolean condition: <code>/profile?id=1 AND 1=1</code> (should still show the profile)</li>
              <li>Test false condition: <code>/profile?id=1 AND 1=2</code> (should show "User not found" or behave differently)</li>
            </ol>
            <p>If the page responds differently to these conditions, it's vulnerable to blind SQL injection.</p>
            <p><strong>Solution for extracting data:</strong></p>
            <p>To extract the admin username character by character:</p>
            <pre>/profile?id=1 AND SUBSTRING((SELECT password FROM users WHERE username='admin'), 1, 1) = 'a'</pre>
            <p>If the page loads normally, the first character is 'a'. Otherwise, try another character. Continue with the second character:</p>
            <pre>/profile?id=1 AND SUBSTRING((SELECT password FROM users WHERE username='admin'), 2, 1) = 'b'</pre>
            <p>This is tedious manually, but can be automated with a script.</p>
            <p><strong>Time-based technique:</strong></p>
            <p>If the page doesn't show different output for true/false conditions, try time-based injection:</p>
            <pre>/profile?id=1 AND IF(SUBSTRING((SELECT password FROM users WHERE username='admin'), 1, 1) = 'a', SLEEP(3), 0)</pre>
            <p>If the request takes at least 3 seconds to respond, the condition is true.</p>
            <p><strong>How to fix:</strong></p>
            <ol>
              <li>Use parameterized queries</li>
              <li>Validate that the id parameter is a number</li>
              <li>Use an ORM (Object-Relational Mapping) library</li>
              <li>Implement proper error handling that doesn't reveal database information</li>
            </ol>
            <pre>// Validation
if(!Number.isInteger(parseInt(id))) {
  return res.status(400).send("Invalid ID format");
}

// Parameterized query
const query = "SELECT * FROM users WHERE id = ?";
db.query(query, [id]);</pre>`
          }
        ],
        summary: `<p><strong>Comprehensive SQL Injection Prevention:</strong></p>
        <ol>
          <li><strong>Use Parameterized Queries</strong>: Always use prepared statements with parameterized queries. This is the most effective way to prevent SQL injection.</li>
          <li><strong>Input Validation</strong>: Validate and sanitize all user inputs. For IDs, ensure they're integers; for strings, filter out dangerous characters.</li>
          <li><strong>Use ORMs</strong>: Object-Relational Mapping libraries typically include protection against SQL injection.</li>
          <li><strong>Principle of Least Privilege</strong>: Database accounts used by applications should have minimal privileges needed for their function.</li>
          <li><strong>Error Handling</strong>: Implement custom error pages that don't reveal database information or SQL syntax.</li>
          <li><strong>Web Application Firewall</strong>: Use a WAF to provide an additional layer of protection against common web attacks.</li>
          <li><strong>Regular Updates</strong>: Keep database systems and application frameworks updated with security patches.</li>
          <li><strong>Security Testing</strong>: Regularly test applications for SQL injection vulnerabilities using tools like SQLmap or manual penetration testing.</li>
        </ol>
        <p>By implementing these measures, you can effectively protect your applications against SQL injection attacks, one of the most common and dangerous web vulnerabilities.</p>`,
        resources: [
          {
            name: 'OWASP SQL Injection Guide',
            url: 'https://owasp.org/www-community/attacks/SQL_Injection'
          },
          {
            name: 'SQL Injection Prevention Cheat Sheet',
            url: 'https://cheatsheetseries.owasp.org/cheatsheets/SQL_Injection_Prevention_Cheat_Sheet.html'
          },
          {
            name: 'SQL Injection Interactive Tutorial',
            url: 'https://www.hacksplaining.com/exercises/sql-injection'
          }
        ]
      },
      points: 60,
      order: 3,
      isRequired: true
    }
  ];

  // Create activities for Level 3
  for (const activity of level3Activities) {
    await prisma.activity.upsert({
      where: {
        levelId_order: {
          levelId: activity.levelId,
          order: activity.order
        }
      },
      update: activity,
      create: activity
    });
    console.log(`Activity "${activity.name}" for Level ${activity.levelId} created/updated`);
  }

  // Define Level 4 activities (Cryptography)
  const level4Activities = [
    {
      levelId: 4,
      name: 'Cryptography Fundamentals',
      description: 'Learn the basics of encryption, hashing, and cryptographic protocols.',
      type: 'READING' as ActivityType,
      content: {
        sections: [
          {
            heading: 'Introduction to Cryptography',
            content: '<p>Cryptography is the practice of securing communication and data through the use of codes and ciphers. Modern cryptography is based on mathematical theory and computer science principles. It is essential for providing:</p><ul><li>Confidentiality: Keeping information secret from unauthorized parties</li><li>Integrity: Ensuring information is not altered during storage or transmission</li><li>Authentication: Verifying the identity of users or systems</li><li>Non-repudiation: Preventing users from denying their actions</li></ul>'
          },
          {
            heading: 'Symmetric vs. Asymmetric Encryption',
            content: '<p><strong>Symmetric Encryption</strong> uses the same key for both encryption and decryption. It\'s fast and efficient but requires a secure method to share the key.</p><p>Common symmetric algorithms include:</p><ul><li>AES (Advanced Encryption Standard)</li><li>DES (Data Encryption Standard) - now considered insecure</li><li>3DES (Triple DES)</li><li>Blowfish</li></ul><p><strong>Asymmetric Encryption</strong> uses a pair of mathematically related keys: a public key for encryption and a private key for decryption. This solves the key distribution problem but is computationally more intensive.</p><p>Common asymmetric algorithms include:</p><ul><li>RSA (Rivest-Shamir-Adleman)</li><li>ECC (Elliptic Curve Cryptography)</li><li>Diffie-Hellman key exchange</li><li>DSA (Digital Signature Algorithm)</li></ul>'
          },
          {
            heading: 'Cryptographic Hashing',
            content: '<p>A hash function converts data of any size into a fixed-size output (hash) that uniquely represents the original data. Key properties of cryptographic hash functions include:</p><ul><li>One-way: It\'s computationally infeasible to reverse the process</li><li>Deterministic: The same input always produces the same output</li><li>Avalanche effect: A small change in input creates a significantly different hash</li><li>Collision resistance: It should be extremely difficult to find two different inputs that produce the same hash</li></ul><p>Common hashing algorithms include:</p><ul><li>MD5 (considered insecure)</li><li>SHA-1 (considered insecure)</li><li>SHA-256</li><li>SHA-3</li><li>BLAKE2</li></ul><p>Hashing is commonly used for password storage, file integrity verification, and digital signatures.</p>'
          },
          {
            heading: 'Digital Signatures',
            content: '<p>Digital signatures combine asymmetric encryption and hashing to provide authentication, non-repudiation, and integrity. The process works as follows:</p><ol><li>The sender creates a hash of the message</li><li>The sender encrypts the hash with their private key</li><li>The encrypted hash (digital signature) is attached to the message</li><li>The receiver decrypts the signature using the sender\'s public key</li><li>The receiver hashes the received message and compares it to the decrypted hash</li><li>If they match, the message is authentic and unaltered</li></ol><p>Digital signatures are widely used in secure email, software distribution, financial transactions, and blockchain technology.</p>'
          },
          {
            heading: 'Public Key Infrastructure (PKI)',
            content: '<p>PKI is a framework for managing digital certificates and public key encryption. It consists of:</p><ul><li>Certificate Authority (CA): Issues and verifies digital certificates</li><li>Registration Authority (RA): Verifies user identities before certificate issuance</li><li>Certificate Repository: Stores and distributes certificates</li><li>Certificate Revocation System: Maintains and distributes lists of revoked certificates</li></ul><p>Digital certificates bind a public key to an entity\'s identity, containing information such as:</p><ul><li>Public key</li><li>Identity information (name, organization)</li><li>Issuing CA information</li><li>Validity period</li><li>Digital signature of the issuing CA</li></ul><p>PKI enables secure web browsing (HTTPS), secure email, and other applications requiring trusted authentication.</p>'
          }
        ]
      },
      points: 40,
      order: 1,
      isRequired: true
    },
    {
      levelId: 4,
      name: 'Encryption Algorithms Quiz',
      description: 'Test your knowledge of common encryption algorithms and their applications.',
      type: 'QUIZ' as ActivityType,
      content: {
        questions: [
          {
            question: 'Which of the following is an asymmetric encryption algorithm?',
            options: ['AES', 'Blowfish', 'RSA', 'Triple DES'],
            correctAnswer: 'RSA'
          },
          {
            question: 'What is the main advantage of asymmetric encryption over symmetric encryption?',
            options: [
              'It\'s faster and more efficient',
              'It uses shorter keys',
              'It doesn\'t require secure key distribution beforehand',
              'It can encrypt larger amounts of data'
            ],
            correctAnswer: 'It doesn\'t require secure key distribution beforehand'
          },
          {
            question: 'Which of these hash algorithms is considered the most secure for current use?',
            options: ['MD5', 'SHA-1', 'SHA-256', 'DES'],
            correctAnswer: 'SHA-256'
          },
          {
            question: 'What is the primary purpose of a digital signature?',
            options: [
              'To encrypt data',
              'To authenticate the sender and ensure message integrity',
              'To compress data for faster transmission',
              'To enable faster encryption'
            ],
            correctAnswer: 'To authenticate the sender and ensure message integrity'
          },
          {
            question: 'Which statement about cryptographic hash functions is FALSE?',
            options: [
              'They produce fixed-length output regardless of input size',
              'They should be collision-resistant',
              'They can be easily reversed to find the original input',
              'The same input always produces the same output'
            ],
            correctAnswer: 'They can be easily reversed to find the original input'
          }
        ]
      },
      points: 50,
      order: 2,
      isRequired: true
    },
    {
      levelId: 4,
      name: 'Cryptography & Hashing Lab',
      description: 'Explore encryption and hashing techniques through hands-on exercises.',
      type: 'LAB' as ActivityType,
      content: {
        title: 'Cryptography & Hashing Lab',
        description: 'Hands-on exercises with encryption, decryption, and hashing algorithms.',
        instructions: '<p>In this lab, you will explore various cryptographic techniques through interactive exercises. You\'ll learn how different algorithms work and how they\'re applied in real-world security scenarios.</p><p>The lab consists of three main sections:</p><ol><li>Symmetric Encryption: Encrypt and decrypt messages using AES</li><li>Public Key Cryptography: Understand key pairs and practice encryption/decryption</li><li>Hashing and Verification: Generate hashes and verify file integrity</li></ol>',
        setupGuide: '<p>This lab runs in your browser and doesn\'t require any additional setup. Simply select an exercise to begin.</p>',
        scenarios: [
          {
            id: "symmetric-encryption",
            name: "Symmetric Key Encryption",
            description: "Encrypt and decrypt messages using AES-256 algorithm with a shared key",
            difficulty: "Easy",
            solution: `<p><strong>Solution Guide:</strong></p>
            <p>1. First generate a secure random key or use the provided one.</p>
            <p>2. To encrypt a message:</p>
            <ul>
              <li>Enter your message in the plaintext field</li>
              <li>Enter your key in the key field</li>
              <li>Click "Encrypt" - the encrypted message (ciphertext) will be displayed in Base64 format</li>
            </ul>
            <p>3. To decrypt a message:</p>
            <ul>
              <li>Enter the ciphertext in the encrypted field</li>
              <li>Enter the same key used for encryption</li>
              <li>Click "Decrypt" - the original message should be displayed</li>
            </ul>
            <p><strong>Common Issues:</strong></p>
            <ul>
              <li>If decryption fails, verify you're using the exact same key that was used for encryption</li>
              <li>Ensure you're copying the entire ciphertext including any special characters</li>
              <li>Remember that encryption keys are case-sensitive</li>
            </ul>
            <p><strong>How It Works:</strong></p>
            <p>AES (Advanced Encryption Standard) is a symmetric block cipher that encrypts data in blocks of 128 bits. The key length (256 bits in this case) determines the number of transformation rounds applied to the data. A secure initialization vector (IV) is generated for each encryption operation to ensure that identical plaintext messages encrypt to different ciphertexts.</p>`
          },
          {
            id: "asymmetric-encryption",
            name: "Public Key Cryptography",
            description: "Generate key pairs and practice encryption/decryption with RSA",
            difficulty: "Medium",
            solution: `<p><strong>Solution Guide:</strong></p>
            <p>1. Generate a key pair by clicking "Generate Key Pair"</p>
            <p>2. For encryption:</p>
            <ul>
              <li>Enter a message in the plaintext field</li>
              <li>Use the recipient's public key for encryption</li>
              <li>Click "Encrypt" to generate the ciphertext</li>
            </ul>
            <p>3. For decryption:</p>
            <ul>
              <li>Enter the ciphertext in the encrypted message field</li>
              <li>Use your private key for decryption</li>
              <li>Click "Decrypt" to reveal the original message</li>
            </ul>
            <p><strong>Challenge Exercise:</strong></p>
            <ol>
              <li>Generate a key pair for Alice and another for Bob</li>
              <li>Have Alice encrypt a message using Bob's public key</li>
              <li>Verify that only Bob can decrypt it using his private key</li>
              <li>Try to decrypt Alice's message with Alice's private key - it should fail</li>
            </ol>
            <p><strong>Security Note:</strong></p>
            <p>In real-world applications, RSA is typically not used to encrypt large messages directly due to performance limitations. Instead, hybrid encryption is used: a random symmetric key is generated and used to encrypt the message (using AES or similar), then the symmetric key is encrypted with RSA and sent alongside the encrypted message.</p>`
          },
          {
            id: "hashing-verification",
            name: "Hashing and Integrity",
            description: "Generate cryptographic hashes and verify file integrity",
            difficulty: "Easy",
            solution: `<p><strong>Solution Guide:</strong></p>
            <p>1. Generating a hash:</p>
            <ul>
              <li>Enter text in the input field</li>
              <li>Select a hashing algorithm (SHA-256 recommended)</li>
              <li>Click "Generate Hash"</li>
              <li>The resulting hash will be displayed</li>
            </ul>
            <p>2. Verifying integrity:</p>
            <ul>
              <li>Upload a file or enter text</li>
              <li>Generate the hash and save it</li>
              <li>Make a change to the file/text</li>
              <li>Generate a new hash and compare - even tiny changes will produce a completely different hash</li>
            </ul>
            <p><strong>Password Hashing:</strong></p>
            <p>For the password hashing exercise:</p>
            <ol>
              <li>Enter a password in the field</li>
              <li>Click "Hash Password" - notice it uses a slow algorithm (bcrypt) with a salt</li>
              <li>To verify, enter the same password and the stored hash, then click "Verify"</li>
              <li>Try different passwords to see that verification fails</li>
            </ol>
            <p><strong>Important Concepts:</strong></p>
            <ul>
              <li>Cryptographic hashes are one-way functions - you cannot retrieve the original input from the hash</li>
              <li>Password hashing uses special algorithms (bcrypt, Argon2, etc.) that are deliberately slow to prevent brute force attacks</li>
              <li>Password hashing also uses "salts" (random data added to the password) to prevent rainbow table attacks</li>
              <li>Hash functions are used for integrity verification, not confidentiality - the data is not encrypted</li>
            </ul>`
          }
        ],
        resources: [
          {
            name: 'NIST Cryptographic Standards and Guidelines',
            url: 'https://csrc.nist.gov/Projects/Cryptographic-Standards-and-Guidelines'
          },
          {
            name: 'Interactive Cryptography Tutorials',
            url: 'https://www.cryptool.org/en/'
          },
          {
            name: 'Password Security: Hashing & Salting Explained',
            url: 'https://auth0.com/blog/hashing-passwords-one-way-road-to-security/'
          }
        ]
      },
      points: 60,
      order: 3,
      isRequired: true
    }
  ];

  // Define Level 5 activities (Authentication & Authorization)
  const level5Activities = [
    {
      levelId: 5,
      name: 'Authentication & Authorization Concepts',
      description: 'Learn the fundamentals of identity verification and access control mechanisms.',
      type: 'READING' as ActivityType,
      content: {
        sections: [
          {
            heading: 'Authentication vs. Authorization',
            content: '<p><strong>Authentication</strong> is the process of verifying who someone is. It answers the question: "Are you who you say you are?"</p><p><strong>Authorization</strong> is the process of verifying what specific applications, files, and data a user has access to. It answers the question: "What are you allowed to do?"</p><p>These related but distinct security processes work together to protect systems and data:</p><ul><li>Authentication occurs first, establishing identity</li><li>Authorization follows, granting appropriate access based on that identity</li><li>Both processes are crucial for a comprehensive security strategy</li></ul>'
          },
          {
            heading: 'Authentication Factors',
            content: '<p>Authentication factors are categorized into:</p><ol><li><strong>Knowledge factors</strong>: Something you know (passwords, PINs, security questions)</li><li><strong>Possession factors</strong>: Something you have (security tokens, smartphones, smart cards)</li><li><strong>Inherence factors</strong>: Something you are (biometrics like fingerprints, retina scans, voice recognition)</li><li><strong>Location factors</strong>: Somewhere you are (GPS location, network location)</li><li><strong>Behavior factors</strong>: Something you do (typing patterns, gesture patterns)</li></ol><p>The strength of authentication increases with the number of factors used:</p><ul><li><strong>Single-factor authentication (SFA)</strong>: Uses one factor, typically a password</li><li><strong>Two-factor authentication (2FA)</strong>: Combines two different factors</li><li><strong>Multi-factor authentication (MFA)</strong>: Uses two or more different factors</li></ul>'
          },
          {
            heading: 'Password Security',
            content: '<p>Despite their limitations, passwords remain the most common authentication method. Best practices include:</p><ul><li>Use long, complex passwords (at least 12 characters)</li><li>Avoid common words, phrases, or personal information</li><li>Use a unique password for each account</li><li>Change passwords periodically</li><li>Use password managers to generate and store strong passwords</li><li>Implement account lockout policies after failed attempts</li><li>Store passwords securely using strong hashing algorithms with salting</li></ul><p>Common password vulnerabilities include:</p><ul><li>Weak or default passwords</li><li>Password reuse across multiple accounts</li><li>Social engineering to obtain passwords</li><li>Brute force and dictionary attacks</li><li>Password database breaches</li></ul>'
          },
          {
            heading: 'Access Control Models',
            content: '<p>Access control models govern how users are authorized to access resources:</p><ul><li><strong>Discretionary Access Control (DAC)</strong>: The owner of a resource determines who can access it and what privileges they have. Common in operating systems like Windows.</li><li><strong>Mandatory Access Control (MAC)</strong>: Access decisions are made by a central authority based on security policies. Often used in highly secure environments and military systems.</li><li><strong>Role-Based Access Control (RBAC)</strong>: Access decisions are based on the roles assigned to users within an organization. Users acquire permissions through their assigned roles.</li><li><strong>Attribute-Based Access Control (ABAC)</strong>: Access decisions are based on attributes (user attributes, resource attributes, environmental conditions). Provides fine-grained control but can be complex to implement.</li></ul>'
          },
          {
            heading: 'Modern Authentication Systems',
            content: '<p>Modern authentication systems often employ:</p><ul><li><strong>Single Sign-On (SSO)</strong>: Allows users to authenticate once and access multiple applications without re-authenticating</li><li><strong>OAuth 2.0</strong>: An authorization framework that enables third-party applications to access resources without sharing credentials</li><li><strong>OpenID Connect</strong>: An identity layer built on top of OAuth 2.0 that adds authentication capabilities</li><li><strong>SAML</strong>: An XML-based framework for communicating identity information across domains</li><li><strong>JWT (JSON Web Tokens)</strong>: Compact, self-contained tokens for securely transmitting information between parties</li><li><strong>Passwordless Authentication</strong>: Methods like email magic links, one-time codes, or biometrics that eliminate traditional passwords</li></ul>'
          }
        ]
      },
      points: 50,
      order: 1,
      isRequired: true
    },
    {
      levelId: 5,
      name: 'Access Control Models Quiz',
      description: 'Test your knowledge of different access control models and their applications.',
      type: 'QUIZ' as ActivityType,
      content: {
        questions: [
          {
            question: 'Which access control model assigns permissions based on job functions within an organization?',
            options: ['Discretionary Access Control (DAC)', 'Mandatory Access Control (MAC)', 'Role-Based Access Control (RBAC)', 'Attribute-Based Access Control (ABAC)'],
            correctAnswer: 'Role-Based Access Control (RBAC)'
          },
          {
            question: 'In which authentication factor category does a fingerprint scan belong?',
            options: ['Knowledge factor', 'Possession factor', 'Inherence factor', 'Location factor'],
            correctAnswer: 'Inherence factor'
          },
          {
            question: 'What is the main difference between authentication and authorization?',
            options: [
              'Authentication is automatic while authorization requires manual approval',
              'Authentication verifies who someone is while authorization determines what they can access',
              'Authentication applies to systems while authorization applies to data',
              'Authentication happens once while authorization happens continuously'
            ],
            correctAnswer: 'Authentication verifies who someone is while authorization determines what they can access'
          },
          {
            question: 'Which of the following is NOT a common component of multi-factor authentication?',
            options: [
              'Something you know (password)',
              'Something you have (security token)',
              'Something you are (biometrics)',
              'Someone you know (social verification)'
            ],
            correctAnswer: 'Someone you know (social verification)'
          },
          {
            question: 'Which protocol is designed specifically for authorization rather than authentication?',
            options: ['SAML', 'OAuth 2.0', 'Kerberos', 'LDAP'],
            correctAnswer: 'OAuth 2.0'
          }
        ]
      },
      points: 60,
      order: 2,
      isRequired: true
    },
    {
      levelId: 5,
      name: 'Multi-Factor Authentication Demo',
      description: 'Explore different MFA methods and implementation strategies.',
      type: 'LAB' as ActivityType,
      content: {
        title: 'Multi-Factor Authentication Demo',
        description: 'Learn how MFA protects systems even when passwords are compromised.',
        instructions: '<p>In this lab, you\'ll explore different multi-factor authentication methods and see how they protect systems even when passwords are compromised. You\'ll also learn about the strengths and weaknesses of various MFA approaches.</p><p>The lab consists of:</p><ol><li>A simulated login system with various MFA options</li><li>Attack scenarios demonstrating password vulnerabilities</li><li>Interactive examples of different MFA implementation methods</li></ol>',
        setupGuide: '<p>This lab runs in your browser and simulates various authentication processes. No additional setup is required.</p>',
        scenarios: [
          {
            id: "password-compromise",
            name: "Password Compromise Scenario",
            description: "See what happens when a password is stolen and how MFA prevents unauthorized access",
            difficulty: "Easy",
            solution: `<p><strong>Solution Guide:</strong></p>
            <p>In this scenario, you witnessed how a password compromise leads to account takeover when only single-factor authentication is used.</p>
            <p><strong>Key observations:</strong></p>
            <ol>
              <li>The attacker obtained the user's password through a phishing attack</li>
              <li>With single-factor authentication, the attacker gained full account access</li>
              <li>With MFA enabled, the attacker was blocked because they could not provide the second factor</li>
            </ol>
            <p><strong>Security lessons:</strong></p>
            <ul>
              <li>Even strong passwords can be compromised through social engineering, keyloggers, or data breaches</li>
              <li>MFA creates a significant barrier for attackers because they would need to compromise multiple factors</li>
              <li>The most effective MFA implementations use factors from different categories (something you know, have, and are)</li>
            </ul>
            <p><strong>Real-world example:</strong></p>
            <p>Many major data breaches could have been prevented if MFA had been implemented. For instance, the 2020 Twitter hack that compromised high-profile accounts was partially possible because some Twitter employees did not have MFA enabled.</p>`
          },
          {
            id: "totp-authentication",
            name: "Time-based One-Time Password (TOTP)",
            description: "Implement and test TOTP authentication using an authenticator app",
            difficulty: "Medium",
            solution: `<p><strong>Solution Guide:</strong></p>
            <p>TOTP is a common form of MFA that generates temporary codes based on a shared secret and the current time.</p>
            <p><strong>Implementation steps:</strong></p>
            <ol>
              <li>During setup, the server generates a secret key</li>
              <li>The secret is shared with the user (usually via QR code scanned by an authenticator app)</li>
              <li>The authenticator app generates 6-digit codes that change every 30 seconds</li>
              <li>During login, after entering a password, the user enters the current code from their app</li>
              <li>The server independently calculates what the correct code should be based on the shared secret and current time</li>
              <li>If the codes match, authentication succeeds</li>
            </ol>
            <p><strong>Security characteristics:</strong></p>
            <ul>
              <li>TOTP requires no internet connection for the second factor - the app generates codes locally</li>
              <li>The time-limited nature of codes means stolen codes are only useful for a short period</li>
              <li>The shared secret must be protected - if compromised, an attacker could generate valid codes</li>
              <li>Device clock synchronization is important, as time drift can cause authentication failures</li>
            </ul>
            <p><strong>Best practices:</strong></p>
            <ul>
              <li>Provide backup codes for users who lose access to their authenticator app</li>
              <li>Allow a small window of acceptance for adjacent codes to account for slight time differences</li>
              <li>Implement rate limiting to prevent brute force attacks guessing the 6-digit code</li>
            </ul>`
          },
          {
            id: "access-control-matrix",
            name: "Access Control Matrix Simulation",
            description: "Configure and test role-based access control for a simulated application",
            difficulty: "Hard",
            solution: `<p><strong>Solution Guide:</strong></p>
            <p>The access control matrix exercise demonstrates how to implement proper authorization after successful authentication.</p>
            <p><strong>Implementation steps:</strong></p>
            <ol>
              <li>Define resources that need protection (files, actions, data)</li>
              <li>Create roles that represent different user types (admin, manager, user)</li>
              <li>Create an access control matrix mapping roles to permissions for each resource</li>
              <li>Assign users to appropriate roles</li>
              <li>Enforce permission checks before allowing access to protected resources</li>
            </ol>
            <p><strong>Example matrix solution:</strong></p>
            <table>
              <tr>
                <th>Role</th>
                <th>View Reports</th>
                <th>Edit Reports</th>
                <th>Delete Reports</th>
                <th>Manage Users</th>
                <th>System Settings</th>
              </tr>
              <tr>
                <td>Admin</td>
                <td>Allow</td>
                <td>Allow</td>
                <td>Allow</td>
                <td>Allow</td>
                <td>Allow</td>
              </tr>
              <tr>
                <td>Manager</td>
                <td>Allow</td>
                <td>Allow</td>
                <td>Deny</td>
                <td>Allow</td>
                <td>Deny</td>
              </tr>
              <tr>
                <td>User</td>
                <td>Allow</td>
                <td>Allow (own)</td>
                <td>Deny</td>
                <td>Deny</td>
                <td>Deny</td>
              </tr>
              <tr>
                <td>Guest</td>
                <td>Allow (public)</td>
                <td>Deny</td>
                <td>Deny</td>
                <td>Deny</td>
                <td>Deny</td>
              </tr>
            </table>
            <p><strong>Security considerations:</strong></p>
            <ul>
              <li>Follow the principle of least privilege - assign only the permissions necessary for each role</li>
              <li>Consider implementing attribute-based rules for more granular control (e.g., users can edit their own reports)</li>
              <li>Regularly audit and review access permissions</li>
              <li>Implement proper session management to prevent session hijacking</li>
              <li>Log all access attempts, especially failed ones and permission violations</li>
            </ul>`
          }
        ],
        resources: [
          {
            name: 'NIST Digital Identity Guidelines',
            url: 'https://pages.nist.gov/800-63-3/'
          },
          {
            name: 'OWASP Authentication Cheat Sheet',
            url: 'https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html'
          },
          {
            name: 'Role-Based Access Control (RBAC) Design Guide',
            url: 'https://csrc.nist.gov/publications/detail/conference-paper/2020/04/14/a-role-based-access-control-rbac-system-design-guide/draft'
          }
        ]
      },
      points: 70,
      order: 3,
      isRequired: true
    }
  ];

  // Create activities for Level 4
  for (const activity of level4Activities) {
    await prisma.activity.upsert({
      where: {
        levelId_order: {
          levelId: activity.levelId,
          order: activity.order
        }
      },
      update: activity,
      create: activity
    });
    console.log(`Activity "${activity.name}" for Level ${activity.levelId} created/updated`);
  }

  // Create activities for Level 5
  for (const activity of level5Activities) {
    await prisma.activity.upsert({
      where: {
        levelId_order: {
          levelId: activity.levelId,
          order: activity.order
        }
      },
      update: activity,
      create: activity
    });
    console.log(`Activity "${activity.name}" for Level ${activity.levelId} created/updated`);
  }

  // Create achievements
  const achievements = [
    {
      name: 'Security Fundamentals Master',
      description: 'Completed all activities in Level 1 with a perfect score',
      imageUrl: '/images/achievements/level1-master.png',
      type: 'LEVEL_COMPLETION',
      levelId: 1,
      criteria: 'Complete all Level 1 activities with 100% score',
      pointsValue: 50
    },
    {
      name: 'First Steps',
      description: 'Completed your first cybersecurity challenge',
      imageUrl: '/images/achievements/first-steps.png',
      type: 'FIRST_COMPLETION',
      criteria: 'Complete any activity',
      pointsValue: 10
    },
    {
      name: 'Perfect Quiz',
      description: 'Completed a quiz with no mistakes on the first try',
      imageUrl: '/images/achievements/perfect-quiz.png',
      type: 'PERFECT_QUIZ',
      criteria: 'Get a perfect score on any quiz on your first attempt',
      pointsValue: 25
    }
  ];

  // Create the achievements
  for (const achievement of achievements) {
    await prisma.achievement.upsert({
      where: {
        id: 0 // This will always fail, forcing an insert
      },
      update: achievement,
      create: achievement
    });
    console.log(`Achievement "${achievement.name}" created`);
  }

  // Level 6 activities - Social Engineering
  const level6Activities = [
    {
      levelId: 6,
      name: 'Social Engineering Fundamentals',
      description: 'Learn about different types of social engineering attacks and how they work.',
      type: 'READING' as ActivityType,
      content: {
        sections: [
          {
            title: 'What is Social Engineering?',
            content: 'Social engineering is the psychological manipulation of people into performing actions or divulging confidential information. It relies on human error rather than technical hacking techniques to gain access to systems, networks, or physical locations. Social engineering attacks exploit human psychology and natural tendencies such as trust, fear, greed, and the desire to be helpful. Unlike technical exploits that target system vulnerabilities, social engineering targets the human element of security—often considered the weakest link in any security system. These attacks can occur in-person, over the phone, through email, social media, or any channel where human interaction takes place. Understanding how social engineers operate is critical to building effective defenses against these psychological attacks.'
          },
          {
            title: 'Common Social Engineering Techniques',
            content: `<p><strong>Phishing:</strong> Sending deceptive emails that appear to come from legitimate sources to trick recipients into revealing sensitive information, clicking malicious links, or opening infected attachments. Variants include:</p>
            <ul>
              <li><strong>Spear Phishing:</strong> Highly targeted phishing attacks customized for specific individuals or organizations</li>
              <li><strong>Whaling:</strong> Phishing attacks specifically targeting high-value individuals like executives or high-ranking officials</li>
              <li><strong>Smishing:</strong> Phishing conducted via SMS text messages</li>
              <li><strong>Vishing:</strong> Voice phishing conducted over phone calls</li>
            </ul>
            <p><strong>Pretexting:</strong> Creating a fabricated scenario (pretext) to engage a victim and gain their trust, typically by impersonating someone with authority or right to access information (like IT support, bank representatives, or coworkers).</p>
            <p><strong>Baiting:</strong> Offering something enticing to victims (free downloads, gift cards, music, movies) to entice them into a trap that steals information or installs malware.</p>
            <p><strong>Quid Pro Quo:</strong> Offering a service or benefit in exchange for information or access (similar to baiting but presenting as a fair exchange).</p>
            <p><strong>Tailgating/Piggybacking:</strong> Following an authorized person into a secured area or system without proper authentication.</p>
            <p><strong>Water Holing:</strong> Compromising websites frequently visited by the target to deliver malware.</p>
            <p><strong>Scareware:</strong> Tricking users into thinking their system is infected with malware to convince them to install malicious software or pay for fake solutions.</p>
            <p><strong>Deepfakes:</strong> Using AI to create convincing but fake video or audio to impersonate trusted individuals.</p>`
          },
          {
            title: 'Social Engineering Attack Lifecycle',
            content: `<p>Most social engineering attacks follow a predictable pattern:</p>
            <ol>
              <li><strong>Information Gathering:</strong> Researching targets using public information from social media, corporate websites, and other sources</li>
              <li><strong>Relationship Development:</strong> Establishing rapport and credibility with targets through various channels</li>
              <li><strong>Exploitation:</strong> Manipulating targets into providing access, information, or taking harmful actions</li>
              <li><strong>Execution:</strong> Achieving the primary goal such as data theft, system access, or financial fraud</li>
              <li><strong>Exit:</strong> Covering tracks and leaving with minimal detection</li>
            </ol>
            <p>Understanding this lifecycle helps security teams develop appropriate detection and intervention strategies at each stage.</p>`
          },
          {
            title: 'Psychological Principles Exploited',
            content: `<p>Social engineers exploit several human psychological tendencies:</p>
            <ul>
              <li><strong>Authority:</strong> People tend to comply with requests from authority figures</li>
              <li><strong>Urgency/Scarcity:</strong> Time pressure or limited availability pushes people to act quickly without careful consideration</li>
              <li><strong>Social Proof:</strong> People tend to follow what others are doing, especially in unfamiliar situations</li>
              <li><strong>Liking:</strong> People are more likely to comply with requests from someone they like or find attractive</li>
              <li><strong>Reciprocity:</strong> People feel obligated to return favors</li>
              <li><strong>Commitment/Consistency:</strong> Once people take a stand, they feel pressure to behave consistently with that position</li>
              <li><strong>Fear:</strong> Strong emotional responses can override rational thinking</li>
            </ul>`
          },
          {
            title: 'Preventing Social Engineering Attacks',
            content: `<p><strong>Organizational Controls:</strong></p>
            <ul>
              <li>Implementing comprehensive security awareness training for all employees</li>
              <li>Establishing clear security policies and procedures for handling sensitive information</li>
              <li>Creating verification procedures for requests involving sensitive information or system access</li>
              <li>Implementing multi-factor authentication across all systems and applications</li>
              <li>Conducting regular simulated phishing exercises to test employee awareness</li>
              <li>Developing incident response plans specifically for social engineering attacks</li>
              <li>Implementing technical controls like email filtering, web filtering, and endpoint protection</li>
            </ul>
            <p><strong>Individual Best Practices:</strong></p>
            <ul>
              <li>Verify requests for sensitive information through secondary channels</li>
              <li>Be skeptical of unsolicited communications, especially those creating urgency</li>
              <li>Never provide credentials or sensitive information in response to unsolicited requests</li>
              <li>Check email sender addresses carefully and hover over links before clicking</li>
              <li>Keep personal information private on social media and professional networking sites</li>
              <li>Report suspicious activities or communications immediately</li>
            </ul>
            <p>Remember that even security-conscious organizations can fall victim to sophisticated social engineering attacks. Maintaining a culture of security awareness and healthy skepticism is the best defense.</p>`
          }
        ]
      },
      points: 50,
      order: 1,
      isRequired: true
    }
  ];

  // Level 7 activities - Malware Analysis
  const level7Activities = [
    {
      levelId: 7,
      name: 'Malware Types and Analysis',
      description: 'Learn about different types of malware and basic analysis techniques.',
      type: 'READING' as ActivityType,
      content: {
        sections: [
          {
            title: 'Common Malware Types',
            content: `<p>Malware (malicious software) comes in many forms, each with unique characteristics and behaviors:</p>
            <ul>
              <li><strong>Viruses:</strong> Malicious code that attaches to legitimate programs and requires user action to spread. They self-replicate by infecting other files when the infected program runs.</li>
              <li><strong>Worms:</strong> Self-replicating malware that spreads across networks without requiring user interaction. Unlike viruses, worms don't need to attach to existing programs.</li>
              <li><strong>Trojans:</strong> Malware disguised as legitimate software that performs malicious actions once installed. Unlike viruses, trojans don't self-replicate but can create backdoors for other malware.</li>
              <li><strong>Ransomware:</strong> Encrypts victims' files and demands payment (ransom) for the decryption key. Advanced variants like double-extortion ransomware also steal data before encryption and threaten to publish it.</li>
              <li><strong>Spyware:</strong> Covertly monitors user activity, collecting sensitive information like browsing habits, credentials, or financial data without user consent.</li>
              <li><strong>Adware:</strong> Displays unwanted advertisements, often by tracking user browsing habits to deliver targeted ads. While less malicious than other types, it can still compromise privacy.</li>
              <li><strong>Keyloggers:</strong> Records keystrokes to capture passwords, credit card numbers, and other sensitive information typed by users.</li>
              <li><strong>Rootkits:</strong> Sophisticated tools designed to gain and maintain privileged access to systems while actively hiding their presence from users, security software, and the operating system.</li>
              <li><strong>Botnets:</strong> Networks of compromised computers controlled remotely by attackers, often used for distributed denial-of-service (DDoS) attacks, spam distribution, or cryptocurrency mining.</li>
              <li><strong>Fileless Malware:</strong> Operates in memory without writing files to disk, making it difficult to detect using traditional signature-based methods.</li>
              <li><strong>Polymorphic Malware:</strong> Constantly changes its code to evade detection by signature-based security solutions.</li>
            </ul>`
          },
          {
            title: 'Malware Infection Vectors',
            content: `<p>Malware can infiltrate systems through numerous channels:</p>
            <ul>
              <li><strong>Phishing and Social Engineering:</strong> Tricking users into downloading malware through deceptive emails, messages, or websites. Often the entry point for high-profile attacks.</li>
              <li><strong>Drive-by Downloads:</strong> Malware that installs automatically when visiting compromised or malicious websites, often exploiting browser or plugin vulnerabilities without user awareness.</li>
              <li><strong>Infected Removable Media:</strong> USB drives, external hard drives, or other removable storage containing malware that activates when connected.</li>
              <li><strong>Software Vulnerabilities:</strong> Exploiting unpatched security flaws in operating systems, applications, or firmware to gain unauthorized access.</li>
              <li><strong>Malvertising:</strong> Malicious code embedded within online advertisements that can infect systems even on legitimate websites.</li>
              <li><strong>Compromised Software Downloads:</strong> Legitimate software that has been tampered with to include malware, including unofficial software from untrusted sources.</li>
              <li><strong>Supply Chain Attacks:</strong> Compromising trusted software vendors to distribute malware through legitimate update channels.</li>
              <li><strong>Remote Desktop Protocol (RDP) Exploitation:</strong> Brute-forcing or exploiting vulnerabilities in remote access services.</li>
              <li><strong>Watering Hole Attacks:</strong> Compromising specific websites frequently visited by the target group.</li>
            </ul>
            <p>Understanding infection vectors is crucial for implementing effective preventative security measures and conducting proper incident response.</p>`
          },
          {
            title: 'Malware Behavior Analysis',
            content: `<p>Analyzing malware behavior involves several complementary techniques:</p>
            <ul>
              <li><strong>Static Analysis:</strong> Examining malware without executing it, including:
                <ul>
                  <li>File format analysis</li>
                  <li>String extraction to find embedded URLs, IP addresses, or commands</li>
                  <li>Disassembly to review assembly code</li>
                  <li>Header analysis to identify compilation information</li>
                  <li>Hash calculation for identification</li>
                </ul>
              </li>
              <li><strong>Dynamic Analysis:</strong> Observing malware behavior during execution in isolated environments:
                <ul>
                  <li><strong>Sandboxing:</strong> Running malware in controlled environments to observe behavior safely</li>
                  <li><strong>API Call Monitoring:</strong> Tracking system and library function calls made by the malware</li>
                  <li><strong>Network Traffic Analysis:</strong> Monitoring communications to identify command and control servers or data exfiltration</li>
                  <li><strong>Memory Forensics:</strong> Analyzing runtime memory to detect hidden processes, code injection, and other stealth techniques</li>
                  <li><strong>Registry Modifications:</strong> Tracking changes to the system registry</li>
                </ul>
              </li>
            </ul>`
          },
          {
            title: 'Advanced Malware Evasion Techniques',
            content: `<p>Modern malware employs sophisticated techniques to avoid detection:</p>
            <ul>
              <li><strong>Anti-VM and Anti-Sandbox:</strong> Detecting virtualized or sandbox environments and changing behavior or refusing to execute</li>
              <li><strong>Obfuscation:</strong> Encoding or encrypting code to make static analysis difficult</li>
              <li><strong>Polymorphism:</strong> Continuously changing code signatures while maintaining functionality</li>
              <li><strong>Metamorphism:</strong> Completely rewriting code while maintaining the same functionality</li>
              <li><strong>Fileless Techniques:</strong> Operating entirely in memory without writing to disk</li>
              <li><strong>Living-off-the-Land:</strong> Using legitimate system tools and processes to blend in with normal activity</li>
              <li><strong>Timestomping:</strong> Modifying file metadata to avoid detection based on creation or modification times</li>
              <li><strong>Process Injection:</strong> Inserting malicious code into legitimate running processes</li>
            </ul>
            <p>Understanding these evasion techniques is essential for developing effective detection strategies.</p>`
          },
          {
            title: 'Malware Analysis Tools and Platforms',
            content: `<p>A variety of specialized tools support malware analysis:</p>
            <ul>
              <li><strong>Automated Analysis Platforms:</strong>
                <ul>
                  <li>VirusTotal - Multi-engine scanning and preliminary analysis</li>
                  <li>ANY.RUN - Interactive malware analysis service</li>
                  <li>Cuckoo Sandbox - Open source automated analysis system</li>
                  <li>Joe Sandbox - Advanced malware analysis platform</li>
                </ul>
              </li>
              <li><strong>Disassemblers and Decompilers:</strong>
                <ul>
                  <li>IDA Pro - Interactive disassembler for software analysis</li>
                  <li>Ghidra - NSA-developed software reverse engineering tool</li>
                  <li>Radare2 - Open source disassembler and analyzer</li>
                </ul>
              </li>
              <li><strong>Debugging Tools:</strong>
                <ul>
                  <li>OllyDbg - x86 debugger for Windows</li>
                  <li>WinDbg - Windows debugger</li>
                  <li>GDB - GNU Project debugger</li>
                </ul>
              </li>
              <li><strong>Network Analysis:</strong>
                <ul>
                  <li>Wireshark - Network protocol analyzer</li>
                  <li>NetworkMiner - Network forensic analysis tool</li>
                </ul>
              </li>
              <li><strong>Memory Analysis:</strong>
                <ul>
                  <li>Volatility - Memory forensics framework</li>
                  <li>Rekall - Memory analysis framework</li>
                </ul>
              </li>
            </ul>
            <p>Effective malware analysis requires a combination of tools and methodologies tailored to the specific sample being investigated.</p>`
          }
        ]
      },
      points: 60,
      order: 1,
      isRequired: true
    },
    {
      levelId: 7,
      name: 'Malware Detection Quiz',
      description: 'Test your knowledge of malware indicators and detection methods.',
      type: 'QUIZ' as ActivityType,
      content: {
        questions: [
          {
            question: 'Which of the following is NOT a common indicator of malware infection?',
            options: [
              'Slow computer performance',
              'Unexpected pop-up advertisements',
              'High CPU usage from unknown processes',
              'Regular system updates being installed'
            ],
            correctAnswer: 'Regular system updates being installed'
          },
          {
            question: 'What type of malware encrypts files and demands payment for the decryption key?',
            options: [
              'Worm',
              'Trojan',
              'Ransomware',
              'Adware'
            ],
            correctAnswer: 'Ransomware'
          },
          {
            question: 'Which malware type is designed to hide the existence of certain processes or programs from normal detection methods?',
            options: [
              'Spyware',
              'Rootkit',
              'Logic bomb',
              'Keylogger'
            ],
            correctAnswer: 'Rootkit'
          }
        ]
      },
      points: 70,
      order: 2,
      isRequired: true
    },
    {
      levelId: 7,
      name: 'Malware Analysis Lab',
      description: 'Practice analyzing malware behavior in a safe environment.',
      type: 'LAB' as ActivityType,
      content: {
        title: 'Malware Analysis Lab',
        description: 'Practice malware analysis techniques by examining sample behaviors and classifying the threats.',
        malwareSamples: [
          {
            id: "sample1",
            name: "Suspicious File: invoice.exe",
            description: "This sample was found attached to an email claiming to be an invoice from a major supplier.",
            behavior: {
              fileSystem: [
                "C:\\Windows\\System32\\svchost.exe (spawned child process)",
                "C:\\Users\\[username]\\AppData\\Roaming\\update.exe (created)",
                "C:\\Users\\[username]\\AppData\\Roaming\\Microsoft\\Windows\\Start Menu\\Programs\\Startup\\update.lnk (created)"
              ],
              registry: [
                "HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\CurrentVersion\\Run\\UpdateCheck (created)",
                "HKEY_CURRENT_USER\\Software\\Microsoft\\Windows\\CurrentVersion\\Explorer\\Advanced\\Hidden (modified to 1)"
              ],
              network: [
                "Connection to 185.25.51.198:443 (C2 server)",
                "DNS request for updateserver.ddns.net",
                "HTTP POST containing system information"
              ],
              processes: [
                "svchost.exe (spawned with unusual parameters)",
                "powershell.exe (execution of encoded command)",
                "vssadmin.exe delete shadows /all /quiet (attempt to delete shadow copies)"
              ]
            },
            classification: {
              type: "ransomware",
              family: "ryuk",
              severity: "critical"
            },
            indicators: [
              "Attempts to delete shadow copies (typical ransomware behavior)",
              "Persistence via startup folder and registry run key",
              "Communication with known malicious command & control server",
              "Encoded PowerShell execution"
            ]
          },
          {
            id: "sample2",
            name: "Browser Extension: adblock_plus_premium.xpi",
            description: "This sample was downloaded from a third-party browser extension site claiming to be a premium version of a popular ad blocker.",
            behavior: {
              fileSystem: [
                "C:\\Users\\[username]\\AppData\\Local\\Google\\Chrome\\User Data\\Default\\Extensions\\[random_id]\\ (created multiple files)",
                "C:\\Users\\[username]\\AppData\\Local\\Temp\\tracker.js (created)"
              ],
              registry: [
                "HKEY_CURRENT_USER\\Software\\Google\\Chrome\\Extensions (modified)"
              ],
              network: [
                "Connections to multiple advertising networks",
                "HTTP POST requests containing browsing history",
                "Periodic connections to stats-collector.com"
              ],
              processes: [
                "chrome.exe (extension runs within browser process)",
                "No additional processes created"
              ]
            },
            classification: {
              type: "spyware",
              family: "adware",
              severity: "medium"
            },
            indicators: [
              "Collection and transmission of browsing history",
              "Connections to known advertising networks",
              "Masquerading as legitimate software",
              "No visible indication to user of data collection"
            ]
          }
        ]
      },
      points: 70,
      order: 3,
      isRequired: true
    }
  ];

  // Create achievements
  for (const activity of level6Activities) {
    await prisma.activity.upsert({
      where: {
        levelId_order: {
          levelId: activity.levelId,
          order: activity.order
        }
      },
      update: activity,
      create: activity
    });
    console.log(`Activity "${activity.name}" for Level ${activity.levelId} created/updated`);
  }

  for (const activity of level7Activities) {
    await prisma.activity.upsert({
      where: {
        levelId_order: {
          levelId: activity.levelId,
          order: activity.order
        }
      },
      update: activity,
      create: activity
    });
    console.log(`Activity "${activity.name}" for Level ${activity.levelId} created/updated`);
  }

  // Level 8 activities - Digital Forensics
  const level8Activities = [
    {
      levelId: 8,
      name: 'Digital Forensics Fundamentals',
      description: 'Learn about digital forensics principles, tools, and methodologies.',
      type: 'READING' as ActivityType,
      content: {
        sections: [
          {
            title: 'Digital Forensics Process',
            content: 'Overview of the forensics process including identification, preservation, collection, examination, analysis, and reporting.'
          },
          {
            title: 'Evidence Handling',
            content: 'Best practices for handling digital evidence to maintain chain of custody and ensure admissibility.'
          },
          {
            title: 'Forensic Tools and Techniques',
            content: 'Introduction to common tools and techniques used in digital forensics investigations.'
          }
        ]
      },
      points: 60,
      order: 1,
      isRequired: true
    },
    {
      levelId: 8,
      name: 'Evidence Collection Quiz',
      description: 'Test your knowledge of proper evidence collection and preservation techniques.',
      type: 'QUIZ' as ActivityType,
      content: {
        questions: [
          {
            question: 'Which of the following is NOT a common digital forensics tool?',
            options: ['Wireshark', 'FTK', 'EnCase', 'Cellebrite'],
            correctAnswer: 'Cellebrite'
          },
          {
            question: 'What is the primary purpose of a forensic image?',
            options: [
              'To save storage space',
              'To preserve the original evidence in an unaltered state',
              'To speed up the investigation process',
              'To encrypt the evidence for security'
            ],
            correctAnswer: 'To preserve the original evidence in an unaltered state'
          },
          {
            question: 'Which of the following is NOT typically a part of volatile memory forensics?',
            options: [
              'Capturing running processes',
              'Recovering deleted files from a hard drive',
              'Analyzing network connections',
              'Examining clipboard contents'
            ],
            correctAnswer: 'Recovering deleted files from a hard drive'
          }
        ]
      },
      points: 70,
      order: 2,
      isRequired: true
    },
    {
      levelId: 8,
      name: 'Digital Evidence Analysis Lab',
      description: 'Practice analyzing digital evidence to reconstruct events and identify perpetrators.',
      type: 'LAB' as ActivityType,
      content: {
        title: 'Digital Evidence Analysis Lab',
        description: 'Practice digital forensics techniques and evidence collection.'
      },
      points: 70,
      order: 3,
      isRequired: true
    }
  ];

  // Level 9 activities - Incident Response
  const level9Activities = [
    {
      levelId: 9,
      name: 'Incident Response Fundamentals',
      description: 'Learn about incident response frameworks and strategies for managing security incidents.',
      type: 'READING' as ActivityType,
      content: {
        sections: [
          {
            title: 'Incident Response Lifecycle',
            content: `<p>The incident response lifecycle is a structured approach to handling security incidents effectively:</p>
            <ol>
              <li><strong>Preparation:</strong> Establishing an incident response team, developing policies and procedures, implementing necessary tools, and conducting training and exercises. Key elements include:
                <ul>
                  <li>Creating an incident response plan with clear roles and responsibilities</li>
                  <li>Developing communication protocols for internal and external stakeholders</li>
                  <li>Implementing security monitoring and logging capabilities</li>
                  <li>Conducting regular tabletop exercises and simulations</li>
                  <li>Establishing relationships with law enforcement, legal counsel, and PR teams</li>
                </ul>
              </li>
              <li><strong>Detection and Analysis:</strong> Identifying and investigating potential security incidents to determine their scope, impact, and root cause. Activities include:
                <ul>
                  <li>Monitoring security alerts from SIEM, IDS/IPS, EDR, and other security tools</li>
                  <li>Analyzing logs and network traffic for signs of compromise</li>
                  <li>Performing forensic analysis of affected systems</li>
                  <li>Creating and testing hypotheses about attack vectors and techniques</li>
                  <li>Establishing a timeline of events and identifying affected assets</li>
                </ul>
              </li>
              <li><strong>Containment:</strong> Implementing short-term and long-term measures to limit the damage and prevent further spread of the incident. Strategies include:
                <ul>
                  <li>Short-term containment: Immediate actions to prevent further damage (network isolation, account lockdowns)</li>
                  <li>System backup: Preserving evidence for later analysis</li>
                  <li>Long-term containment: Implementing temporary fixes to allow systems to be used in production while rebuilding clean systems</li>
                </ul>
              </li>
              <li><strong>Eradication:</strong> Removing the cause of the incident and securing systems against similar attacks. Activities include:
                <ul>
                  <li>Removing malware and compromised accounts</li>
                  <li>Patching vulnerabilities that were exploited</li>
                  <li>Implementing additional security controls</li>
                  <li>Conducting vulnerability scans and penetration tests</li>
                </ul>
              </li>
              <li><strong>Recovery:</strong> Restoring affected systems to normal operation and validating their security. Steps include:
                <ul>
                  <li>Restoring systems from clean backups</li>
                  <li>Rebuilding systems from scratch when necessary</li>
                  <li>Implementing additional monitoring</li>
                  <li>Performing verification testing to ensure security</li>
                  <li>Gradually returning systems to production with careful monitoring</li>
                </ul>
              </li>
              <li><strong>Post-Incident Activity:</strong> Learning from the incident and improving future response capabilities. Activities include:
                <ul>
                  <li>Conducting a detailed post-mortem analysis</li>
                  <li>Documenting lessons learned</li>
                  <li>Updating incident response procedures based on findings</li>
                  <li>Implementing additional security controls to prevent similar incidents</li>
                  <li>Sharing relevant information with the security community when appropriate</li>
                </ul>
              </li>
            </ol>
            <p>This cyclical process ensures continuous improvement of security posture and incident response capabilities.</p>`
          },
          {
            title: 'Incident Response Planning',
            content: `<p><strong>Components of an Effective Incident Response Plan:</strong></p>
            <ul>
              <li><strong>Incident Response Team Structure:</strong> Define team members, roles, responsibilities, and escalation paths</li>
              <li><strong>Communication Protocols:</strong> Establish internal and external communication procedures, including:
                <ul>
                  <li>Who to notify and when (executives, legal, PR, customers, regulators)</li>
                  <li>Templates for different types of notifications</li>
                  <li>Secure communication channels</li>
                  <li>Single point of contact to avoid conflicting messages</li>
                </ul>
              </li>
              <li><strong>Incident Severity Matrix:</strong> Define criteria for classifying incidents by severity and impact</li>
              <li><strong>Response Procedures:</strong> Detailed step-by-step procedures for different types of incidents:
                <ul>
                  <li>Malware infections</li>
                  <li>Data breaches</li>
                  <li>Ransomware attacks</li>
                  <li>DDoS attacks</li>
                  <li>Insider threats</li>
                </ul>
              </li>
              <li><strong>Documentation Requirements:</strong> Templates and procedures for incident documentation</li>
              <li><strong>Legal and Regulatory Considerations:</strong> Guidelines for compliance with:
                <ul>
                  <li>Data breach notification laws</li>
                  <li>Industry-specific regulations</li>
                  <li>Chain of custody procedures for evidence</li>
                </ul>
              </li>
              <li><strong>Disaster Recovery Integration:</strong> Coordination with business continuity and disaster recovery plans</li>
            </ul>
            <p><strong>Testing and Updating:</strong></p>
            <ul>
              <li><strong>Tabletop Exercises:</strong> Discussion-based simulations of incident scenarios</li>
              <li><strong>Functional Exercises:</strong> Testing specific components of the plan in controlled environments</li>
              <li><strong>Full-Scale Simulations:</strong> Comprehensive exercises that test the entire incident response process</li>
              <li><strong>Regular Reviews:</strong> Scheduled updates based on:
                <ul>
                  <li>Lessons learned from incidents and exercises</li>
                  <li>Changes in the organization's IT infrastructure</li>
                  <li>Emerging threats and vulnerabilities</li>
                  <li>Regulatory changes</li>
                </ul>
              </li>
            </ul>
            <p>An effective incident response plan is not a static document but a living framework that evolves with the organization's security needs and threat landscape.</p>`
          },
          {
            title: 'Incident Classification',
            content: `<p>Proper classification helps prioritize response efforts and allocate resources effectively:</p>
            <p><strong>By Type:</strong></p>
            <ul>
              <li><strong>Network Intrusions:</strong> Unauthorized access to systems or networks</li>
              <li><strong>Malware Infections:</strong> Viruses, worms, trojans, ransomware, etc.</li>
              <li><strong>Denial of Service:</strong> Attacks that disrupt service availability</li>
              <li><strong>Unauthorized Access:</strong> Credential compromise or privilege escalation</li>
              <li><strong>Data Breaches:</strong> Unauthorized disclosure of sensitive information</li>
              <li><strong>Social Engineering:</strong> Phishing, pretexting, and other manipulation tactics</li>
              <li><strong>Insider Threats:</strong> Malicious or negligent actions by authorized users</li>
              <li><strong>Physical Security:</strong> Unauthorized physical access to facilities or assets</li>
            </ul>
            <p><strong>By Severity:</strong></p>
            <table border="1" style="border-collapse: collapse; width: 100%;">
              <tr>
                <th>Level</th>
                <th>Description</th>
                <th>Example</th>
                <th>Response Time</th>
              </tr>
              <tr>
                <td>Critical</td>
                <td>Significant impact on critical systems or sensitive data with imminent risk of harm</td>
                <td>Active ransomware attack encrypting production systems</td>
                <td>Immediate (minutes)</td>
              </tr>
              <tr>
                <td>High</td>
                <td>Significant impact or potential for harm to important systems or data</td>
                <td>Confirmed compromise of privileged user account</td>
                <td>Urgent (within hours)</td>
              </tr>
              <tr>
                <td>Medium</td>
                <td>Limited impact or contained threat with potential to escalate</td>
                <td>Malware detected and quarantined on a single non-critical system</td>
                <td>Priority (within 24 hours)</td>
              </tr>
              <tr>
                <td>Low</td>
                <td>Minimal impact with little potential for harm</td>
                <td>Suspicious email reported but not clicked</td>
                <td>Scheduled (within days)</td>
              </tr>
            </table>
            <p><strong>By Impact:</strong></p>
            <ul>
              <li><strong>Operational Impact:</strong> Effect on business operations and processes</li>
              <li><strong>Financial Impact:</strong> Direct costs and potential financial losses</li>
              <li><strong>Reputational Impact:</strong> Damage to brand and customer trust</li>
              <li><strong>Regulatory Impact:</strong> Potential compliance violations and legal consequences</li>
              <li><strong>Data Impact:</strong> Type and amount of data affected (PII, PHI, financial, etc.)</li>
            </ul>
            <p>Effective incident classification should be documented in a matrix that guides the incident response team in assessing and prioritizing incidents consistently.</p>`
          },
          {
            title: 'Incident Response Tools and Technologies',
            content: `<p>Modern incident response relies on various specialized tools and technologies:</p>
            <ul>
              <li><strong>Security Information and Event Management (SIEM):</strong> Centralized logging and correlation of security events</li>
              <li><strong>Endpoint Detection and Response (EDR):</strong> Advanced endpoint monitoring and threat detection</li>
              <li><strong>Network Traffic Analysis (NTA):</strong> Monitoring and analyzing network traffic for suspicious patterns</li>
              <li><strong>Digital Forensics Tools:</strong>
                <ul>
                  <li>Disk imaging and analysis software</li>
                  <li>Memory forensics tools</li>
                  <li>Log analysis utilities</li>
                  <li>Forensic file recovery</li>
                </ul>
              </li>
              <li><strong>Threat Intelligence Platforms:</strong> Integration of external threat data with internal security monitoring</li>
              <li><strong>Security Orchestration, Automation, and Response (SOAR):</strong> Automation of incident response workflows</li>
              <li><strong>Incident Management Systems:</strong> Tracking and documentation of incident response activities</li>
              <li><strong>Communication Tools:</strong> Secure messaging and collaboration platforms for the incident response team</li>
            </ul>
            <p>Effective incident response requires not just the right tools but also skilled personnel who know how to use them appropriately during an incident.</p>`
          },
          {
            title: 'Incident Response Frameworks and Standards',
            content: `<p>Several established frameworks provide guidance for incident response:</p>
            <ul>
              <li><strong>NIST SP 800-61:</strong> Computer Security Incident Handling Guide - Comprehensive framework from the National Institute of Standards and Technology</li>
              <li><strong>SANS Incident Handler's Handbook:</strong> Practical guide for incident response planning and execution</li>
              <li><strong>ISO/IEC 27035:</strong> International standard for information security incident management</li>
              <li><strong>FIRST CSIRT Framework:</strong> Common framework for Computer Security Incident Response Teams</li>
              <li><strong>MITRE ATT&CK Framework:</strong> Knowledge base of adversary tactics and techniques to inform detection and response</li>
            </ul>
            <p>These frameworks provide proven methodologies and best practices that organizations can adapt to their specific needs and resources.</p>`
          }
        ]
      },
      points: 70,
      order: 1,
      isRequired: true
    },
    {
      levelId: 9,
      name: 'Incident Classification Quiz',
      description: 'Test your knowledge of incident types, severity levels, and appropriate response actions.',
      type: 'QUIZ' as ActivityType,
      content: {
        questions: [
          {
            question: 'Which phase of the incident response lifecycle focuses on removing the threat from the environment?',
            options: [
              'Preparation',
              'Detection and Analysis',
              'Containment',
              'Eradication'
            ],
            correctAnswer: 'Eradication'
          },
          {
            question: 'What is the primary goal of the containment phase?',
            options: [
              'To identify how the incident occurred',
              'To prevent further damage from the incident',
              'To restore systems to normal operation',
              'To document lessons learned'
            ],
            correctAnswer: 'To prevent further damage from the incident'
          },
          {
            question: 'Which of the following should be established before an incident occurs?',
            options: [
              'Root cause of the incident',
              'Breach notification procedures',
              'Timeline of the attack',
              'Identity of the attacker'
            ],
            correctAnswer: 'Breach notification procedures'
          }
        ]
      },
      points: 70,
      order: 2,
      isRequired: true
    },
    {
      levelId: 9,
      name: 'Incident Response Simulation',
      description: 'Practice responding to simulated security incidents using industry-standard frameworks.',
      type: 'SIMULATION' as ActivityType,
      content: {
        title: 'Incident Response Simulation',
        description: 'Simulate a real-world incident response scenario to test your incident response team\'s effectiveness.',
        instructions: '<p>In this simulation, you will be placed in a situation where a security incident has occurred. Your task is to:</p><ol><li>Identify the incident type and severity</li><li>Determine the appropriate response actions</li><li>Implement the response actions</li><li>Document the incident and lessons learned</li></ol>',
        setupGuide: '<p>This simulation is based on a real-world scenario. You will receive a scenario description and a set of instructions. Your team will have 24 hours to respond to the incident.</p>',
        scenarios: [
          {
            id: "scenario1",
            name: "Ransomware Attack",
            description: "Your organization has been hit by a ransomware attack. Files are being encrypted, and the malware is attempting to spread to network shares.",
            difficulty: "Medium",
            solution: `<p><strong>Solution Guide:</strong></p>
            <ol>
              <li>Isolate the infected systems immediately</li>
              <li>Run anti-virus scans on all systems</li>
              <li>Identify and block the source of the attack</li>
              <li>Restore encrypted files using a backup</li>
              <li>Implement network segmentation to prevent further spread</li>
              <li>Notify affected parties and stakeholders</li>
              <li>Document the incident and lessons learned</li>
            </ol>
            <p><strong>Key Observations:</strong></p>
            <ul>
              <li>The ransomware is encrypting files on multiple systems</li>
              <li>The attacker is using a known encryption algorithm</li>
              <li>The ransom note is left on the desktop of affected systems</li>
              <li>The attacker is using a command and control server to communicate</li>
            </ul>
            <p><strong>Security Lessons:</strong></p>
            <ul>
              <li>Regularly test your incident response plan</li>
              <li>Have a clear communication plan for affected parties</li>
              <li>Implement network segmentation to limit the impact of an attack</li>
              <li>Use encryption to protect sensitive data</li>
              <li>Regularly update your security tools and software</li>
            </ul>
            <p><strong>Real-world Example:</strong></p>
            <p>In 2017, the WannaCry ransomware attack affected hundreds of thousands of systems worldwide. The attackers used a vulnerability in Microsoft Windows to spread the ransomware, and the attack was stopped after a few days when a patch was released.</p>`
          },
          {
            id: "scenario2",
            name: "Data Breach",
            description: "Your organization's database has been breached. Sensitive data has been stolen, and the attackers have left a ransom note demanding a large sum of money for the decryption key.",
            difficulty: "Hard",
            solution: `<p><strong>Solution Guide:</strong></p>
            <ol>
              <li>Contain the breach immediately</li>
              <li>Identify the compromised data and its sensitivity</li>
              <li>Notify affected individuals and authorities</li>
              <li>Implement a data breach response plan</li>
              <li>Investigate the breach and identify the attacker</li>
              <li>Secure the compromised systems and data</li>
              <li>Notify stakeholders and customers</li>
              <li>Document the incident and lessons learned</li>
            </ol>
            <p><strong>Key Observations:</strong></p>
            <ul>
              <li>The attackers have stolen sensitive data from multiple systems</li>
              <li>The data includes financial information, personal data, and intellectual property</li>
              <li>The attackers have left a ransom note demanding a large sum of money</li>
              <li>The attackers have used a known encryption algorithm to encrypt the data</li>
            </ul>
            <p><strong>Security Lessons:</strong></p>
            <ul>
              <li>Regularly test your incident response plan</li>
              <li>Have a clear communication plan for affected parties</li>
              <li>Implement network segmentation to limit the impact of an attack</li>
              <li>Use encryption to protect sensitive data</li>
              <li>Regularly update your security tools and software</li>
            </ul>
            <p><strong>Real-world Example:</strong></p>
            <p>In 2013, the Target Corporation suffered a data breach that affected 110 million customers. The attackers gained access to the company's point-of-sale systems through a third-party vendor's network, and the breach was not discovered for several weeks.</p>`
          }
        ]
      },
      points: 80,
      order: 3,
      isRequired: true
    }
  ];

  // Level 10 activities - Advanced Persistent Threats
  const level10Activities = [
    {
      levelId: 10,
      name: 'Advanced Persistent Threats',
      description: 'Learn about sophisticated threat actors, their techniques, and long-term attack strategies.',
      type: 'READING' as ActivityType,
      content: {
        sections: [
          {
            title: 'APT Lifecycle',
            content: `<p>Advanced Persistent Threats (APTs) are sophisticated, sustained cyber attacks that follow a structured attack lifecycle:</p>
            <ol>
              <li><strong>Initial Reconnaissance:</strong> Gathering information about the target organization:
                <ul>
                  <li>Identifying high-value targets and entry points</li>
                  <li>Mapping organizational structure and relationships</li>
                  <li>Discovering technical infrastructure and security controls</li>
                  <li>Open-source intelligence (OSINT) gathering</li>
                  <li>Social media analysis of key personnel</li>
                </ul>
              </li>
              <li><strong>Initial Compromise:</strong> Gaining initial access to the target environment:
                <ul>
                  <li>Spear phishing with malicious attachments or links</li>
                  <li>Watering hole attacks (compromising websites frequented by targets)</li>
                  <li>Supply chain compromises</li>
                  <li>Zero-day exploits against vulnerable systems</li>
                  <li>Social engineering and physical access methods</li>
                </ul>
              </li>
              <li><strong>Establish Foothold:</strong> Securing reliable access to the compromised system:
                <ul>
                  <li>Installing backdoors or remote access trojans (RATs)</li>
                  <li>Setting up command & control (C2) channels</li>
                  <li>Ensuring persistence mechanisms survive system reboots</li>
                  <li>Deploying multiple access methods as contingencies</li>
                </ul>
              </li>
              <li><strong>Privilege Escalation:</strong> Gaining higher-level permissions:
                <ul>
                  <li>Exploiting local vulnerabilities</li>
                  <li>Password harvesting and credential theft</li>
                  <li>Access token manipulation</li>
                  <li>Abusing misconfigurations or overly permissive access rights</li>
                </ul>
              </li>
              <li><strong>Internal Reconnaissance:</strong> Mapping the internal network:
                <ul>
                  <li>Network scanning and enumeration</li>
                  <li>Active Directory environment mapping</li>
                  <li>Identifying high-value assets and data repositories</li>
                  <li>Understanding security controls and monitoring solutions</li>
                </ul>
              </li>
              <li><strong>Lateral Movement:</strong> Expanding access across the environment:
                <ul>
                  <li>Pass-the-hash/pass-the-ticket techniques</li>
                  <li>Remote service exploitation</li>
                  <li>Use of legitimate administrative tools (living off the land)</li>
                  <li>Trusted relationship exploitation</li>
                </ul>
              </li>
              <li><strong>Data Collection:</strong> Identifying and gathering target data:
                <ul>
                  <li>Locating valuable intellectual property, business plans, or sensitive data</li>
                  <li>Database queries and file system scanning</li>
                  <li>Email archive access</li>
                  <li>Screen captures and keylogging</li>
                </ul>
              </li>
              <li><strong>Data Exfiltration:</strong> Transferring stolen data outside the network:
                <ul>
                  <li>Encrypted tunnels and covert channels</li>
                  <li>Steganography to hide data within legitimate traffic</li>
                  <li>Using legitimate cloud services for exfiltration</li>
                  <li>Timing operations during periods of reduced monitoring</li>
                </ul>
              </li>
              <li><strong>Maintaining Presence:</strong> Ensuring long-term access:
                <ul>
                  <li>Establishing multiple persistence mechanisms</li>
                  <li>Regularly rotating infrastructure and communication channels</li>
                  <li>Adapting tactics to evade detection</li>
                  <li>Implementing dormant backdoors that activate periodically</li>
                </ul>
              </li>
            </ol>
            <p>Unlike opportunistic attacks, APTs follow this methodical approach to achieve specific objectives while maintaining a low profile over an extended period—sometimes months or years.</p>`
          },
          {
            title: 'APT Threat Actors and Motivations',
            content: `<p>APT attacks are conducted by sophisticated threat actors with specific objectives:</p>
            <p><strong>State-Sponsored Groups:</strong></p>
            <ul>
              <li><strong>Motivations:</strong>
                <ul>
                  <li>Espionage and intelligence gathering</li>
                  <li>Intellectual property theft for economic advantage</li>
                  <li>Critical infrastructure compromise for potential sabotage</li>
                  <li>Political advantage and influence operations</li>
                </ul>
              </li>
              <li><strong>Characteristics:</strong>
                <ul>
                  <li>Extensive resources and funding</li>
                  <li>Advanced technical capabilities</li>
                  <li>Sophisticated operational security</li>
                  <li>Long-term strategic objectives</li>
                </ul>
              </li>
            </ul>
            <p><strong>Organized Criminal Groups:</strong></p>
            <ul>
              <li><strong>Motivations:</strong>
                <ul>
                  <li>Financial gain through theft or extortion</li>
                  <li>Ransomware deployment targeting high-value organizations</li>
                  <li>Banking fraud and cryptocurrency theft</li>
                  <li>Theft of financial data or personal information for resale</li>
                </ul>
              </li>
              <li><strong>Characteristics:</strong>
                <ul>
                  <li>Business-like operational structure</li>
                  <li>Focus on monetization and return on investment</li>
                  <li>Increasingly sophisticated technical capabilities</li>
                  <li>May collaborate with other criminal entities or state actors</li>
                </ul>
              </li>
            </ul>
            <p><strong>Hacktivists and Ideologically Motivated Groups:</strong></p>
            <ul>
              <li><strong>Motivations:</strong>
                <ul>
                  <li>Political or ideological objectives</li>
                  <li>Bringing attention to specific causes</li>
                  <li>Embarrassing targeted organizations</li>
                </ul>
              </li>
              <li><strong>Characteristics:</strong>
                <ul>
                  <li>Variable technical capabilities</li>
                  <li>Often more interested in publicity than stealth</li>
                  <li>May be less persistent than state-sponsored actors</li>
                </ul>
              </li>
            </ul>
            <p><strong>Insider Threats:</strong></p>
            <ul>
              <li><strong>Motivations:</strong>
                <ul>
                  <li>Financial gain</li>
                  <li>Revenge or grievances</li>
                  <li>Ideological reasons</li>
                  <li>Coercion by external actors</li>
                </ul>
              </li>
              <li><strong>Characteristics:</strong>
                <ul>
                  <li>Legitimate access to systems and data</li>
                  <li>Detailed knowledge of internal security controls</li>
                  <li>May operate over extended periods</li>
                </ul>
              </li>
            </ul>
            <p>Understanding the threat actors behind APTs helps organizations anticipate their tactics, techniques, and procedures (TTPs) and prioritize defensive measures.</p>`
          },
          {
            title: 'Attribution Challenges',
            content: `<p>Attributing APT attacks to specific threat actors presents numerous challenges:</p>
            <ul>
              <li><strong>Technical Obfuscation:</strong>
                <ul>
                  <li>Use of proxies, VPNs, and compromised infrastructure</li>
                  <li>Tor network and other anonymizing technologies</li>
                  <li>Time zone manipulation to confuse analysis</li>
                  <li>Code reuse and sharing between different groups</li>
                </ul>
              </li>
              <li><strong>False Flag Operations:</strong>
                <ul>
                  <li>Deliberate use of another group's tools, techniques, or infrastructure</li>
                  <li>Planting misleading artifacts or language indicators</li>
                  <li>Mimicking the operational patterns of other known threat actors</li>
                </ul>
              </li>
              <li><strong>Operational Security:</strong>
                <ul>
                  <li>Careful infrastructure management to avoid patterns</li>
                  <li>Use of legitimate tools that blend with normal activity</li>
                  <li>Custom malware developed for specific operations</li>
                  <li>Strict compartmentalization of operations</li>
                </ul>
              </li>
              <li><strong>Attribution Methodology Challenges:</strong>
                <ul>
                  <li>Over-reliance on technical indicators that can be falsified</li>
                  <li>Confirmation bias in analysis</li>
                  <li>Incomplete visibility into attack infrastructure</li>
                  <li>Political pressure to attribute to specific actors</li>
                </ul>
              </li>
              <li><strong>Legal and Policy Implications:</strong>
                <ul>
                  <li>High standard of proof required for formal attribution</li>
                  <li>Diplomatic sensitivities and international relations</li>
                  <li>Reluctance to reveal intelligence sources and methods</li>
                </ul>
              </li>
            </ul>
            <p><strong>The Diamond Model for Attribution:</strong></p>
            <p>A structured approach to attribution that considers four key elements:</p>
            <ul>
              <li><strong>Adversary:</strong> The threat actor behind the attack</li>
              <li><strong>Capability:</strong> Tools, techniques, and procedures used</li>
              <li><strong>Infrastructure:</strong> Systems and networks used to conduct the attack</li>
              <li><strong>Victim:</strong> The targeted organization and assets</li>
            </ul>
            <p>Effective attribution often requires collaboration between technical analysts, intelligence services, and law enforcement agencies, combining technical evidence with human intelligence and geopolitical context.</p>`
          },
          {
            title: 'Defense Strategies',
            content: `<p>Defending against APTs requires a comprehensive, layered approach focused on detection, prevention, and resilience:</p>
            <p><strong>Threat Intelligence Integration:</strong></p>
            <ul>
              <li>Consuming and operationalizing tactical, operational, and strategic threat intelligence</li>
              <li>Tracking known APT group TTPs using frameworks like MITRE ATT&CK</li>
              <li>Participating in information sharing communities and ISACs</li>
              <li>Developing industry-specific intelligence relevant to your organization</li>
            </ul>
            <p><strong>Advanced Detection Capabilities:</strong></p>
            <ul>
              <li><strong>Behavioral Analytics:</strong> Identifying anomalous patterns that may indicate APT activity</li>
              <li><strong>Network Traffic Analysis:</strong> Detecting unusual communication patterns and data transfers</li>
              <li><strong>Endpoint Detection and Response (EDR):</strong> Monitoring endpoint behavior for signs of compromise</li>
              <li><strong>Deception Technology:</strong> Deploying honeypots, honeyfiles, and decoy credentials to detect lateral movement</li>
              <li><strong>User and Entity Behavior Analytics (UEBA):</strong> Identifying unusual user behaviors that may indicate account compromise</li>
            </ul>
            <p><strong>Threat Hunting:</strong></p>
            <ul>
              <li>Proactive searching for indicators of compromise based on threat intelligence</li>
              <li>Regular hypothesis-driven hunting exercises targeting specific APT techniques</li>
              <li>Retrospective analysis of historical data to identify previously undetected compromises</li>
              <li>Using automated hunting tools to scale manual hunting capabilities</li>
            </ul>
            <p><strong>Defensive Architecture:</strong></p>
            <ul>
              <li><strong>Network Segmentation:</strong> Limiting lateral movement opportunities</li>
              <li><strong>Zero Trust Architecture:</strong> Verifying every access request regardless of source</li>
              <li><strong>Privileged Access Management:</strong> Strictly controlling admin-level privileges</li>
              <li><strong>Micro-segmentation:</strong> Implementing fine-grained access controls between workloads</li>
              <li><strong>Data-Centric Security:</strong> Protecting sensitive data through encryption and access controls</li>
            </ul>
            <p><strong>Incident Response for APTs:</strong></p>
            <ul>
              <li>Developing specialized playbooks for APT incidents</li>
              <li>Establishing relationships with external incident response experts</li>
              <li>Conducting regular exercises simulating APT scenarios</li>
              <li>Maintaining offline backups and restoration capabilities</li>
              <li>Planning for complete network rebuilds if necessary</li>
            </ul>
            <p><strong>Strategic Defenses:</strong></p>
            <ul>
              <li><strong>Supply Chain Security:</strong> Vetting vendors and monitoring third-party access</li>
              <li><strong>Insider Threat Programs:</strong> Detecting and preventing internal compromises</li>
              <li><strong>Security Awareness:</strong> Training employees to recognize spear phishing and social engineering</li>
              <li><strong>Regular Red Team Exercises:</strong> Testing defenses against realistic APT scenarios</li>
              <li><strong>Cyber Intelligence:</strong> Monitoring for targeting by specific threat actors</li>
            </ul>
            <p>Effective APT defense requires a mindset shift from prevention-only to assumption of compromise, focusing on rapid detection and response to minimize impact.</p>`
          },
          {
            title: 'Case Studies of Notable APT Campaigns',
            content: `<p>Examining real-world APT campaigns provides valuable insights into their sophistication and impact:</p>
            <p><strong>Operation Aurora (2009-2010)</strong></p>
            <ul>
              <li><strong>Actors:</strong> APT group linked to China's People's Liberation Army</li>
              <li><strong>Targets:</strong> Google, Adobe, Juniper Networks, and dozens of other technology companies</li>
              <li><strong>Techniques:</strong> Zero-day vulnerability in Internet Explorer, advanced backdoors, source code theft</li>
              <li><strong>Impact:</strong> Theft of intellectual property and access to Gmail accounts of Chinese human rights activists</li>
              <li><strong>Significance:</strong> One of the first publicly disclosed APT campaigns targeting private sector organizations</li>
            </ul>
            <p><strong>Stuxnet (Discovered 2010)</strong></p>
            <ul>
              <li><strong>Actors:</strong> Believed to be a collaboration between US and Israeli intelligence</li>
              <li><strong>Target:</strong> Iranian nuclear enrichment facilities</li>
              <li><strong>Techniques:</strong> Multiple zero-day vulnerabilities, compromised digital certificates, air-gap jumping, PLC tampering</li>
              <li><strong>Impact:</strong> Physical damage to uranium centrifuges, delaying Iran's nuclear program</li>
              <li><strong>Significance:</strong> First known cyber attack to cause physical damage to critical infrastructure</li>
            </ul>
            <p><strong>APT29 (Cozy Bear) SolarWinds Operation (2020)</strong></p>
            <ul>
              <li><strong>Actors:</strong> APT29, associated with Russia's Foreign Intelligence Service (SVR)</li>
              <li><strong>Targets:</strong> US government agencies, critical infrastructure, and private companies</li>
              <li><strong>Techniques:</strong> Supply chain compromise of SolarWinds Orion software, stealthy backdoor (SUNBURST), careful operational security</li>
              <li><strong>Impact:</strong> Unprecedented access to thousands of organizations, including sensitive government networks</li>
              <li><strong>Significance:</strong> Demonstrated the catastrophic potential of supply chain attacks</li>
            </ul>
            <p><strong>APT41 (Double Dragon)</strong></p>
            <ul>
              <li><strong>Actors:</strong> China-linked group with both espionage and financial motivations</li>
              <li><strong>Targets:</strong> Healthcare, high-tech, telecommunications, video game companies across 14+ countries</li>
              <li><strong>Techniques:</strong> Spear-phishing, supply chain compromises, zero-days, living-off-the-land techniques</li>
              <li><strong>Impact:</strong> Theft of intellectual property and customer data, deployment of ransomware</li>
              <li><strong>Significance:</strong> Blurs the line between state-sponsored espionage and financial cybercrime</li>
            </ul>
            <p>These case studies highlight the evolution of APT capabilities and the need for organizations to understand the specific threat actors that may target their industry or region.</p>`
          }
        ]
      },
      points: 80,
      order: 1,
      isRequired: true
    },
    {
      levelId: 10,
      name: 'APT Tactics Quiz',
      description: 'Test your knowledge of APT tactics, techniques, and procedures.',
      type: 'QUIZ' as ActivityType,
      content: {
        questions: [
          {
            question: 'Which of the following is NOT typically a characteristic of an APT attack?',
            options: [
              'Targeted attack against specific organizations',
              'Long-term persistence in compromised networks',
              'Loud, noticeable system disruptions',
              'Use of zero-day vulnerabilities'
            ],
            correctAnswer: 'Loud, noticeable system disruptions'
          },
          {
            question: 'What technique do APT actors often use to maintain access even if initial access methods are discovered?',
            options: [
              'Distributed denial of service attacks',
              'Multiple backdoors and persistence mechanisms',
              'Ransomware deployment',
              'Frequent scanning of target networks'
            ],
            correctAnswer: 'Multiple backdoors and persistence mechanisms'
          },
          {
            question: 'Which defense strategy is most effective against APTs?',
            options: [
              'Traditional signature-based antivirus',
              'Simple firewall rules',
              'Defense in depth with multiple security controls',
              'Changing passwords monthly'
            ],
            correctAnswer: 'Defense in depth with multiple security controls'
          }
        ]
      },
      points: 80,
      order: 2,
      isRequired: true
    },
    {
      levelId: 10,
      name: 'Advanced Security Simulation',
      description: 'Defend against a simulated APT attack through multiple stages of the cyber kill chain.',
      type: 'SIMULATION' as ActivityType,
      content: {
        title: 'Advanced Security Simulation',
        description: 'Simulate a real-world APT attack scenario to test your security team\'s ability to defend against sophisticated threats.',
        instructions: '<p>In this simulation, you will be placed in a situation where a sophisticated threat actor is attempting to breach your organization\'s security. Your task is to:</p><ol><li>Identify the initial access methods used by the attacker</li><li>Determine the appropriate defensive actions for each stage of the attack</li><li>Implement the defensive actions</li><li>Document the attack and lessons learned</li></ol>',
        setupGuide: '<p>This simulation is based on a real-world scenario. You will receive a scenario description and a set of instructions. Your team will have 24 hours to respond to the attack.</p>',
        scenarios: [
          {
            id: "scenario1",
            name: "Initial Access",
            description: "The attacker has gained initial access to your network through a phishing email. They are now trying to move laterally within the network.",
            difficulty: "Medium",
            solution: `<p><strong>Solution Guide:</strong></p>
            <ol>
              <li>Block suspicious email domains and senders</li>
              <li>Implement multi-factor authentication for all users</li>
              <li>Monitor network traffic for unusual activity</li>
              <li>Implement network segmentation to limit lateral movement</li>
              <li>Implement user behavior analytics to detect suspicious activity</li>
              <li>Implement a security information and event management (SIEM) system</li>
            </ol>
            <p><strong>Key Observations:</strong></p>
            <ul>
              <li>The attacker is using a known phishing technique to gain initial access</li>
              <li>The attacker is moving laterally within the network</li>
              <li>The attacker is using legitimate user accounts to move laterally</li>
              <li>The attacker is trying to gain access to sensitive data</li>
            </ul>
            <p><strong>Security Lessons:</strong></p>
            <ul>
              <li>Regularly test your security tools and software</li>
              <li>Implement a security information and event management (SIEM) system</li>
              <li>Implement user behavior analytics to detect suspicious activity</li>
              <li>Implement network segmentation to limit lateral movement</li>
              <li>Regularly update your security tools and software</li>
            </ul>
            <p><strong>Real-world Example:</strong></p>
            <p>In 2018, the NotPetya APT attack affected hundreds of thousands of systems worldwide. The attackers used a zero-day vulnerability in the software used by the Ukrainian government to spread the ransomware, and the attack was stopped after a few days when a patch was released.</p>`
          },
          {
            id: "scenario2",
            name: "Privilege Escalation",
            description: "The attacker has gained access to sensitive data and is now trying to escalate their privileges to gain control over critical systems.",
            difficulty: "Hard",
            solution: `<p><strong>Solution Guide:</strong></p>
            <ol>
              <li>Implement least privilege access controls for all users</li>
              <li>Implement multi-factor authentication for all users</li>
              <li>Monitor system logs for unusual activity</li>
              <li>Implement a security information and event management (SIEM) system</li>
              <li>Implement user behavior analytics to detect suspicious activity</li>
              <li>Implement a change management process to review and audit changes to critical systems</li>
            </ol>
            <p><strong>Key Observations:</strong></p>
            <ul>
              <li>The attacker has gained access to sensitive data</li>
              <li>The attacker is trying to escalate their privileges to gain control over critical systems</li>
              <li>The attacker is using legitimate user accounts to gain access to critical systems</li>
              <li>The attacker is trying to gain access to sensitive data</li>
            </ul>
            <p><strong>Security Lessons:</strong></p>
            <ul>
              <li>Regularly test your security tools and software</li>
              <li>Implement a security information and event management (SIEM) system</li>
              <li>Implement user behavior analytics to detect suspicious activity</li>
              <li>Implement a change management process to review and audit changes to critical systems</li>
              <li>Regularly update your security tools and software</li>
            </ul>
            <p><strong>Real-world Example:</strong></p>
            <p>In 2017, the Equifax data breach occurred when attackers gained access to the company's systems through a phishing attack. The attackers were able to access sensitive data, including Social Security numbers and credit scores, because the company's security controls were not effective.</p>`
          }
        ]
      },
      points: 90,
      order: 3,
      isRequired: true
    }
  ];

  // Create activities for Level 8
  for (const activity of level8Activities) {
    await prisma.activity.upsert({
      where: {
        levelId_order: {
          levelId: activity.levelId,
          order: activity.order
        }
      },
      update: activity,
      create: activity
    });
    console.log(`Activity "${activity.name}" for Level ${activity.levelId} created/updated`);
  }

  // Create activities for Level 9
  for (const activity of level9Activities) {
    await prisma.activity.upsert({
      where: {
        levelId_order: {
          levelId: activity.levelId,
          order: activity.order
        }
      },
      update: activity,
      create: activity
    });
    console.log(`Activity "${activity.name}" for Level ${activity.levelId} created/updated`);
  }

  // Create activities for Level 10
  for (const activity of level10Activities) {
    await prisma.activity.upsert({
      where: {
        levelId_order: {
          levelId: activity.levelId,
          order: activity.order
        }
      },
      update: activity,
      create: activity
    });
    console.log(`Activity "${activity.name}" for Level ${activity.levelId} created/updated`);
  }

  console.log('Seeding completed!');
}

main()
  .catch((e) => {
    console.error('Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  }); 