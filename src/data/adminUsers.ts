export interface AdminUser {
  id: string;
  name: string; // Vasu | Harry | ZAZU | Atharva
  password: string; // Vasu: 877988, Harry: 770948, ZAZU: 937032, Atharva: 810469
  role: string;
  badge: 'Super Admin' | 'Senior Admin' | 'Technical Admin' | 'Executive Admin';
  email: string;
  phone: string;
  department: string;
}

export const AUTHORIZED_ADMINS: AdminUser[] = [
  {
    id: 'admin-1',
    name: 'Vasu',
    password: '877988',
    role: 'Lead ESG & EU CBAM Chief Auditor',
    badge: 'Super Admin',
    email: 'vasu.auditor@carbonbridge.gov.in',
    phone: '+91 98110 87798',
    department: 'Bureau of Energy Efficiency & EU CBAM Cell',
  },
  {
    id: 'admin-2',
    name: 'Harry',
    password: '770948',
    role: 'Principal Industrial Verification Officer',
    badge: 'Senior Admin',
    email: 'harry.auditor@carbonbridge.gov.in',
    phone: '+91 98220 77094',
    department: 'National MSME Decarbonization Wing',
  },
  {
    id: 'admin-3',
    name: 'ZAZU',
    password: '937032',
    role: 'Metallurgy & Sectoral Emission Specialist',
    badge: 'Technical Admin',
    email: 'zazu.specialist@carbonbridge.gov.in',
    phone: '+91 98330 93703',
    department: 'Heavy Industry Carbon Accounting Bureau',
  },
  {
    id: 'admin-4',
    name: 'Atharva',
    password: '810469',
    role: 'Regulatory Compliance & Verification Director',
    badge: 'Executive Admin',
    email: 'atharva.director@carbonbridge.gov.in',
    phone: '+91 98440 81046',
    department: 'Ministry of Commerce & Export Oversight',
  },
];

const ADMIN_SESSION_STORAGE_KEY = 'carbonbridge_active_admin_session';

export interface AdminSession {
  admin: AdminUser;
  loginTime: string;
  token: string;
}

/**
 * Check if the provided username/email and password match any authorized admin.
 * Supports usernames: "Vasu", "Harry", "ZAZU", "Atharva" (case-insensitive).
 */
export function checkIsAdminCredentials(
  identifier: string,
  passwordInput: string,
  emailInput?: string
): AdminUser | null {
  const trimmedId = (identifier || '').trim().toLowerCase();
  const trimmedPass = (passwordInput || '').trim();
  const trimmedEmail = emailInput ? emailInput.trim().toLowerCase() : '';

  if (!trimmedPass) return null;

  return (
    AUTHORIZED_ADMINS.find((a) => {
      const matchPass = a.password === trimmedPass;
      if (!matchPass) return false;

      const aNameLower = (a.name || '').toLowerCase();
      const aEmailLower = (a.email || '').toLowerCase();

      // Check username match (Vasu, Harry, ZAZU, Atharva)
      const nameMatch = trimmedId === aNameLower;
      // Or identifier matches the admin's email or starts with admin's name
      const idMatch = nameMatch || trimmedId === aEmailLower || (aNameLower && trimmedId.startsWith(aNameLower));
      // Or provided email matches or contains admin name
      const emailMatch = trimmedEmail ? (aNameLower && trimmedEmail.includes(aNameLower)) || trimmedEmail === aEmailLower : false;

      return idMatch || (nameMatch && (!trimmedEmail || Boolean(trimmedEmail))) || emailMatch;
    }) || null
  );
}

/**
 * Authenticates an admin by username, password, and optional email ID.
 */
export function authenticateAdmin(
  nameOrEmailInput: string,
  passwordInput: string,
  emailInput?: string
): { success: boolean; admin?: AdminUser; error?: string } {
  const trimmedInput = (nameOrEmailInput || '').trim();
  const trimmedPass = (passwordInput || '').trim();
  const trimmedEmail = emailInput ? emailInput.trim() : '';

  if (!trimmedInput || !trimmedPass) {
    return { success: false, error: 'Please enter both Username / Identifier and Password.' };
  }

  // 1. Direct match on username or email
  const matched = checkIsAdminCredentials(trimmedInput, trimmedPass, trimmedEmail);

  if (matched) {
    // If user provided a specific email, retain it in the admin profile
    const activeAdmin: AdminUser = {
      ...matched,
      email: trimmedEmail || (trimmedInput.includes('@') ? trimmedInput : matched.email),
    };

    const session: AdminSession = {
      admin: activeAdmin,
      loginTime: new Date().toISOString(),
      token: `adm-token-${matched.id}-${Date.now()}`,
    };
    try {
      localStorage.setItem(ADMIN_SESSION_STORAGE_KEY, JSON.stringify(session));
    } catch {
      // ignore
    }
    return { success: true, admin: activeAdmin };
  }

  // Check if name is recognized but password is incorrect
  const inputLower = trimmedInput.toLowerCase();
  const nameExists = AUTHORIZED_ADMINS.some(
    (a) => (a.name || '').toLowerCase() === inputLower || (a.email || '').toLowerCase() === inputLower
  );
  if (nameExists) {
    return { success: false, error: 'Invalid security password for this Admin identifier.' };
  }

  return { success: false, error: 'Credentials not recognized in the Bureau Admin registry.' };
}

export function getActiveAdminSession(): AdminSession | null {
  try {
    const raw = localStorage.getItem(ADMIN_SESSION_STORAGE_KEY);
    if (!raw) return null;
    const session = JSON.parse(raw) as AdminSession;
    if (session && session.admin && session.admin.id) {
      return session;
    }
    return null;
  } catch {
    return null;
  }
}

export function clearAdminSession(): void {
  try {
    localStorage.removeItem(ADMIN_SESSION_STORAGE_KEY);
  } catch {
    // ignore
  }
}
