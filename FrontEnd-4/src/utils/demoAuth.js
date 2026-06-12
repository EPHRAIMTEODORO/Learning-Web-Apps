const ACCOUNTS_KEY = 'frontend4_demo_accounts'
const PASSWORD_HASH_ALGORITHM = 'SHA-256'

function getStoredAccounts() {
  const accounts = localStorage.getItem(ACCOUNTS_KEY)

  return accounts ? JSON.parse(accounts) : []
}

function saveAccounts(accounts) {
  localStorage.setItem(ACCOUNTS_KEY, JSON.stringify(accounts))
}

function base64UrlEncodeBytes(bytes) {
  return btoa(String.fromCharCode(...bytes))
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '')
}

function base64UrlEncode(value) {
  return btoa(JSON.stringify(value))
    .replaceAll('+', '-')
    .replaceAll('/', '_')
    .replaceAll('=', '')
}

function createPasswordSalt() {
  const salt = new Uint8Array(16)
  crypto.getRandomValues(salt)

  return base64UrlEncodeBytes(salt)
}

async function hashPassword(password, salt) {
  const passwordBytes = new TextEncoder().encode(`${salt}:${password}`)
  const passwordHash = await crypto.subtle.digest(PASSWORD_HASH_ALGORITHM, passwordBytes)

  return base64UrlEncodeBytes(new Uint8Array(passwordHash))
}

export function createDemoToken(user) {
  const issuedAt = Math.floor(Date.now() / 1000)
  const expiresAt = issuedAt + 60 * 60

  const header = {
    alg: 'HS256',
    typ: 'JWT',
  }

  const payload = {
    sub: user.username,
    email: user.email,
    iat: issuedAt,
    exp: expiresAt,
  }

  return `${base64UrlEncode(header)}.${base64UrlEncode(payload)}.demo-signature`
}

export async function createDemoAccount({ email, username, password }) {
  const accounts = getStoredAccounts()
  const normalizedEmail = email.trim().toLowerCase()
  const normalizedUsername = username.trim()
  const existingAccount = accounts.find(
    (account) =>
      account.email === normalizedEmail ||
      account.username.toLowerCase() === normalizedUsername.toLowerCase(),
  )

  if (existingAccount) {
    throw new Error('That email or username already exists.')
  }

  const user = {
    email: normalizedEmail,
    username: normalizedUsername,
  }

  const passwordSalt = createPasswordSalt()
  const passwordHash = await hashPassword(password, passwordSalt)

  saveAccounts([...accounts, { ...user, passwordHash, passwordSalt }])

  return user
}

export async function validateDemoLogin(loginId, password) {
  const normalizedLoginId = loginId.trim().toLowerCase()
  const account = getStoredAccounts().find(
    (storedAccount) =>
      storedAccount.email === normalizedLoginId ||
      storedAccount.username.toLowerCase() === normalizedLoginId,
  )

  if (!account) {
    throw new Error('Invalid email/username or password.')
  }

  const passwordHash = await hashPassword(password, account.passwordSalt)

  if (passwordHash !== account.passwordHash) {
    throw new Error('Invalid email/username or password.')
  }

  return {
    email: account.email,
    username: account.username,
  }
}
