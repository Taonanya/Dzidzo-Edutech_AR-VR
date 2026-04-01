$ErrorActionPreference = "Stop"

param(
  [string]$ApiBaseUrl = "http://localhost:4000",
  [string]$Role = "student"
)

function Write-Step($message) {
  Write-Host ""
  Write-Host "==> $message" -ForegroundColor Cyan
}

function Fail($message) {
  Write-Host ""
  Write-Host "FAILED: $message" -ForegroundColor Red
  exit 1
}

$timestamp = Get-Date -Format "yyyyMMddHHmmss"
$testEmail = "dzidzo-smoke-$timestamp@example.com"
$testPassword = "Password123!"
$testName = "Dzidzo Smoke Test"

Write-Step "Checking backend health at $ApiBaseUrl/api/health"

try {
  $health = Invoke-RestMethod -Method Get -Uri "$ApiBaseUrl/api/health"
  $health | ConvertTo-Json -Depth 5
} catch {
  Fail "Health check failed. Confirm the backend is running and the URL is correct."
}

if ($health.status -ne "ok") {
  Fail "Health endpoint responded, but status was not ok."
}

Write-Step "Testing signup with $testEmail"

$signupBody = @{
  full_name = $testName
  email = $testEmail
  role = $Role
  password = $testPassword
} | ConvertTo-Json

try {
  $signup = Invoke-RestMethod `
    -Method Post `
    -Uri "$ApiBaseUrl/api/auth/signup" `
    -ContentType "application/json" `
    -Body $signupBody
  $signup | ConvertTo-Json -Depth 5
} catch {
  Fail "Signup failed. Check backend logs for validation, database, or route errors."
}

if (-not $signup.token) {
  Fail "Signup succeeded without returning a token."
}

Write-Step "Testing signin with the created account"

$signinBody = @{
  email = $testEmail
  password = $testPassword
} | ConvertTo-Json

try {
  $signin = Invoke-RestMethod `
    -Method Post `
    -Uri "$ApiBaseUrl/api/auth/signin" `
    -ContentType "application/json" `
    -Body $signinBody
  $signin | ConvertTo-Json -Depth 5
} catch {
  Fail "Signin failed. Check backend logs for auth or database errors."
}

if (-not $signin.token) {
  Fail "Signin succeeded without returning a token."
}

Write-Step "Testing protected route /api/me"

try {
  $me = Invoke-RestMethod `
    -Method Get `
    -Uri "$ApiBaseUrl/api/me" `
    -Headers @{ Authorization = "Bearer $($signin.token)" }
  $me | ConvertTo-Json -Depth 5
} catch {
  Fail "Protected route test failed. Token auth may be broken."
}

Write-Host ""
Write-Host "PASSED: backend health, signup, signin, and /api/me all worked." -ForegroundColor Green
