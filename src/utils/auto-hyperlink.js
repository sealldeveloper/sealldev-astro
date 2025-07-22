/**
 * auto-hyperlink.js - Fixed version
 * Utility for automatically hyperlinking technical terms in writeup content 
 * and showing tool modals for specific tools
 */

// Dictionary of cybersecurity terms and their corresponding URLs
export const autoHyperlinkTerms = {
  // Web Security
  XSS: "https://owasp.org/www-community/attacks/xss/",
  CSRF: "https://owasp.org/www-community/attacks/csrf/",
  SQLi: "https://owasp.org/www-community/attacks/SQL_Injection",
  "SQL injection": "https://owasp.org/www-community/attacks/SQL_Injection",
  SSRF: "https://owasp.org/www-community/attacks/Server_Side_Request_Forgery",
  XXE: "https://owasp.org/www-community/vulnerabilities/XML_External_Entity_(XXE)_Processing",
  RCE: "https://owasp.org/www-community/attacks/rce/",
  SSTI: "https://portswigger.net/web-security/server-side-template-injection",
  CRLF: "https://www.invicti.com/learn/crlf-injection/",
  "DOM clobbering": "https://portswigger.net/web-security/dom-based/dom-clobbering",
  "Prototype pollution": "https://portswigger.net/web-security/prototype-pollution",
  "Open redirect": "https://learn.snyk.io/lesson/open-redirect/",
  "web cache poisoning": "https://portswigger.net/web-security/web-cache-poisoning",
  
  // Binary Exploitation
  "Buffer Overflow":
    "https://owasp.org/www-community/vulnerabilities/Buffer_Overflow",
  ROP: "https://en.wikipedia.org/wiki/Return-oriented_programming",
  "Heap Exploitation": "https://en.wikipedia.org/wiki/Heap_overflow",

  // Cryptography
  RSA: "https://en.wikipedia.org/wiki/RSA_(cryptosystem)",
  AES: "https://en.wikipedia.org/wiki/Advanced_Encryption_Standard",
  ECB: "https://en.wikipedia.org/wiki/Block_cipher_mode_of_operation#Electronic_codebook_(ECB)",
  CBC: "https://en.wikipedia.org/wiki/Block_cipher_mode_of_operation#Cipher_block_chaining_(CBC)",

  // Reverse Engineering
  Ghidra: "TOOL:ghidra",
  IDA: "TOOL:idapro",
  Radare2: "TOOL:radare2",

  // Networking
  Wireshark: "TOOL:wireshark",
  Nmap: "TOOL:nmap",
  DNS: "https://en.wikipedia.org/wiki/Domain_Name_System",

  // CTF Categories
  Pwn: "https://ctf101.org/binary-exploitation/overview/",
  "Binary Exploitation": "https://ctf101.org/binary-exploitation/overview/",
  Crypto: "https://ctf101.org/cryptography/overview/",
  Cryptography: "https://ctf101.org/cryptography/overview/",
  Rev: "https://ctf101.org/reverse-engineering/overview/",
  "Reverse Engineering": "https://ctf101.org/reverse-engineering/overview/",
  Web: "https://ctf101.org/web-exploitation/overview/",
  Forensics: "https://ctf101.org/forensics/overview/",
  Forens: "https://ctf101.org/forensics/overview/",
  OSINT: "https://en.wikipedia.org/wiki/Open-source_intelligence",
  Steganography: "https://en.wikipedia.org/wiki/Steganography",
  pyjail: "https://lbarman.ch/blog/pyjail/",

  // Ciphers
  "Caeser Cipher": "https://www.dcode.fr/caesar-cipher",
  "ROT Cipher": "https://www.dcode.fr/rot-cipher",
  ROT8000: "https://www.dcode.fr/rot8000-cipher",

  //Windows
  DPAPI: "https://en.wikipedia.org/wiki/Data_Protection_API",
  "leakedhandlesfinder": "TOOL:leakedhandlesfinder",
  "evil-winrm": "TOOL:evil-winrm",
  "impacket": "TOOL:impacket",
  "kerbrute": "TOOL:kerbrute",
  "ldapsearch": "TOOL:ldapsearch",
  "username-anarchy": "TOOL:username-anarchy",
  
  /* TOOLS - These will use the modal instead of external links */
  /* These are marked with a special prefix 'TOOL:' */
  // forens
  Autopsy: "TOOL:autopsy",
  Wireshark: "TOOL:wireshark",
  exiftool: "TOOL:exiftool",
  tshark: "TOOL:tshark",
  MemProcFS: "TOOL:memprocfs",
  "volatility 2": "TOOL:volatility2",
  "vol2": "TOOL:volatility2",
  vol3: "TOOL:volatility3",
  volatility: "TOOL:volatility3",
  volatility3: "TOOL:volatility3",
  oletools: "TOOL:oletools",
  ericzimmerman: "https://ericzimmerman.github.io/#!index.md",
  firemaster: "TOOL:firemaster",
  firefox_decrypt: "TOOL:firefoxdecrypt",
  firefoxdecrypt: "TOOL:firefoxdecrypt",
  evtxecmd: "TOOL:evtxecmd",
  "bittorrent-traffic-analyzer": "TOOL:bittorrent-traffic-analyzer",
  memprocfs: "TOOL:memprocfs",
  regcool: "TOOL:regcool",
  pecmd: "TOOL:pecmd",
  gittools: "TOOL:gittools",
  "ftk imager": "TOOL:ftkimager",
  "usb detective": "TOOL:usbdetective",
  "hindsight": "TOOL:hindsight",
  "slack-parser": "TOOL:slack-parser",
  "drivefs-sleuth": "TOOL:drivefs-sleuth",
  "securityquestionsview": "TOOL:securityquestionsview",
  "FontForge": "TOOL:fontforge",

  //crypto
  CyberChef: "TOOL:cyberchef",
  "Dcode.fr": "TOOL:dcode",
  Dcode: "TOOL:dcode",

  //general
  PayloadAllTheThings: "TOOL:payloadallthethings",
  SecLists: "TOOL:seclists",
  "webhook.site": "TOOL:webhooksite",
  netcat: "TOOL:netcat",
  ncat: "TOOL:netcat",
  nc: "TOOL:netcat",
  hacktricks: "TOOL:hacktricks",
  "awesome-unicode": "TOOL:awesomeunicode",
  awesomeunicode: "TOOL:awesomeunicode",
  cellmapper: "TOOL:cellmapper",
  revshells: "TOOL:revshells",
  "unicode confusables": "TOOL:unicodeconfusables",
  unicodeconfusables: "TOOL:unicodeconfusables",

  //stego
  stegsnow: "TOOL:stegsnow",
  stegseek: "TOOL:stegseek",
  steghide: "TOOL:steghide",
  zsteg: "TOOL:zsteg",
  silenteye: "TOOL:silenteye",
  deepsound: "TOOL:deepsound",
  aperisolve: "TOOL:aperisolve",
  stegcloak: "TOOL:stegcloak",


  //hachcrack
  hashcat: "TOOL:hashcat",
  johntheripper: "TOOL:johntheripper",
  
  //pwn
  DetectItEasy: "TOOL:detectiteasy",
  gdb: "TOOL:gdb",
  pwntools: "TOOL:pwntools",
  ROPgadget: "TOOL:ROPgadget",
  
  //rev
  dogbolt: "TOOL:dogbolt",

  //fullpwn/windows/stuff
  SQLCipher: "https://github.com/sqlcipher/sqlcipher",
  mimikatz: "TOOL:mimikatz",

  //web
  wappalyzer: "TOOL:wappalyzer",
  pwnfox: "TOOL:pwnfox",
  "burp suite": "TOOL:burpsuite",
  burpsuite: "TOOL:burpsuite",
  "jwt.io": "TOOL:jwtio",
  editthiscookie2: "TOOL:editthiscookie2",
  jwt_tool: "TOOL:jwt_tool",
  nikto: "TOOL:nikto",
  ffuf: "TOOL:ffuf",
  dirstalk: "TOOL:dirstalk",
  shortscan: "TOOL:shortscan",
  "jwt-key-recovery": "TOOL:jwt-key-recovery",
  "SAML Raider": "TOOL:saml-raider",

  //osint
  gitfive: "TOOL:gitfive",
  ghunt: "TOOL:ghunt",
  epieos: "TOOL:epieos",
  wigle: "TOOL:wigle",

  // People
  sealldev: "https://seall.dev/",

  //mobile
  "jadx-gui": "TOOL:jadx",
  "jadxgui": "TOOL:jadx",
  "jadx": "TOOL:jadx",

  //privesc
  "gtfobins": "TOOL:gtfobins",
  linpeas: "TOOL:linpeas",
  winpeas: "TOOL:winpeas"

  // Add more terms as needed
};

// Mapping for tool slugs to make sure we use the correct IDs
export const toolSlugMap = {};

/**
 * Process the content to add auto-hyperlinks and tool modals
 * This function is used in JavaScript to process content dynamically
 */
export function processAutoHyperlinks(content) {
  let processedContent = content;

  // Process each term in our dictionary
  for (const [term, url] of Object.entries(autoHyperlinkTerms)) {
    // Case insensitive replace with a word boundary check
    const regex = new RegExp(`\\b(${term})\\b`, "gi");
    
    // Check if this is a tool that should open a modal
    if (url.startsWith("TOOL:")) {
      const toolSlug = url.replace("TOOL:", "");
      processedContent = processedContent.replace(
        regex,
        `<span class="tool-modal-trigger cursor-pointer text-primary underline" data-tool-slug="${toolSlug}">$1</span>`
      );
    } else {
      // Regular hyperlink
      processedContent = processedContent.replace(
        regex,
        `<a href="${url}" class="auto-hyperlink" title="${term}">$1</a>`
      );
    }
  }

  return processedContent;
}

/**
 * Extract tags from content
 * Identifies potential tags in the content that aren't in the tags array yet
 */
export function extractTagSuggestions(content, existingTags = []) {
  // Define term groups that should map to the same tag
  const tagMappings = {
    // crypto
    xor: "xor",
    aes: "aes",
    vigenere: "vigenere-cipher",
    

    // languages
    python: "python",
    "\\.py": "python",

    php: "php",
    "\\.php": "php",

    rust: "rust",
    "\\.rs": "rust",

    "\\.cpp": "c++",
    "\\.cs": "csharp",

    "\\.js": "js",
    "javascript": "js",

    "\\.java": "java",

    "\\.go": "go",

    "\\.sh": "shell-script",

    "\\.rb": "ruby",
    "ruby": "ruby",




    // privesc
    "privesc": "privilege-escalation",
    "privilege escalation": "privilege-escalation",
    "priv esc": "privilege-escalation",
    //racecond
    "race condition":"race-condition",
    //hashcrack
    hashcat: "hash-cracking",
    johntheripper: "hash-cracking",
    // command inj
    "command injection": "command-injection",
    "cmd injection": "command-injection",
    // jadx
    "jadx": "jadx",
    "jadx-gui": "jadx",
    //cache poisoning
    "cache poisoning": "cache-poisoning",
    "poison cache": "cache-poisoning",
    "web cache deception": "cache-deception",
    "cache deception": "cache-poisoning",
    //auth bypass
    "authentication bypass": "authentication-bypass",
    //ssti
    ssti: "ssti",
    //protoptye
    "prototype pollution": "prototype-pollution",
    // Steganography variants
    stego: "steganography",
    steganography: "steganography",

    spectrogram: "spectrogram",

    // Buffer overflow variants
    bof: "buffer-overflow",
    "buffer overflow": "buffer-overflow",

    // Remote code execution
    rce: "remote-code-execution",
    "remote code execution": "remote-code-execution",

    // SQL injection
    sqli: "sql-injection",
    "sql injection": "sql-injection",

    // Cross-site scripting
    xss: "xss",
    "cross site scripting": "xss",

    // Dom clobber
    "dom clobbering": "dom-clobbering",

    // Cross-site request forgery
    csrf: "csrf",
    "cross site request forgery": "csrf",

    // XML External Entity
    xxe: "xxe",
    "xml external entity": "xxe",

    // Man in the middle
    mitm: "man-in-the-middle",
    "man in the middle": "man-in-the-middle",

    // Dictionary attack variations
    "dictionary attack": "dictionary-attack",
    wordlist: "dictionary-attack",

    // Shell-related
    revshell: "reverse-shell",
    "rev shell": "reverse-shell",
    "reverse shell": "reverse-shell",

    // Python jail
    pyjail: "python-jail",
    "python jail": "python-jail",
    "sandbox escape": "sandbox-escape",

    // Bash jail
    bashjail: "bash-jail",
    "bash jail": "bash-jail",
    "bash-jail": "bash-jail",

    // Deserialization
    deserialization: "deserialization",
    pickle: "deserialization",

    // Authentication
    jwt: "jwt",
    "json web token": "jwt",

    // csp
    "csp bypass": "csp-bypass",
    "csp-bypass": "csp-bypass",

    // Format string
    "format string": "format-string",

    // Advanced attacks
    "padding oracle": "padding-oracle",
    "timing attack": "timing-attack",
    "side channel": "side-channel",

    // Brute force
    bruteforce: "brute-force",
    "brute force": "brute-force",
    "rainbow table": "rainbow-table",

    // Social engineering
    phishing: "phishing",

    // Metadata
    exiftool: "exif",
    exif: "exif",

    // windows forens
    "registry hive": "windows-forensics", 

    //diskforens
    autopsy: "disk-forensics", 
    "ftk imager": "disk-forensics", 

    // Memory analysis
    "memory dump": "memory-forensics",
    "memory forensics": "memory-forensics",

    // Network analysis
    pcap: "network-forensics",
    pcapng: "network-forensics",
    wireshark: "network-forensics",

    // Tools
    ghidra: "ghidra",
    autopsy: "autopsy",
    cyberchef: "cyberchef",
    gdb: "gdb",
  };

  // List of all terms to search for
  const searchTerms = Object.keys(tagMappings);

  // Convert existingTags to lowercase for case-insensitive comparison
  const normalizedExistingTags = existingTags.map((tag) => tag.toLowerCase());

  // Store resolved tags
  const resolvedTags = new Set();

  // Check for each term in the content
  searchTerms.forEach((term) => {
    // Create regex with word boundaries
    const regex = new RegExp(`\\b${term}\\b`, "i");

    // If the term is found in the content
    if (regex.test(content)) {
      // Get the normalized tag for this term
      const normalizedTag = tagMappings[term.toLowerCase()];

      // Skip if the normalized tag is already in existing tags
      if (!normalizedExistingTags.includes(normalizedTag)) {
        resolvedTags.add(normalizedTag);
      }
    }
  });

  // Convert set to array
  return Array.from(resolvedTags);
}

// Export all functions directly to ensure they're available
export default {
  autoHyperlinkTerms,
  toolSlugMap,
  processAutoHyperlinks,
  extractTagSuggestions
};