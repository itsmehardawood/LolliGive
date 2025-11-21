# Payment Flow Test & Verification Guide

## Overview
This document explains how to test and verify that the payment flow is secure and runs in the correct environments.

## Architecture Summary

```
┌──────────────────────────────────────────────────────────────────────┐
│                          SECURE PAYMENT FLOW                          │
└──────────────────────────────────────────────────────────────────────┘

1. BROWSER (Client Side)
   ├── DonationSection.js runs here
   ├── User enters donation amount
   ├── NO access to environment variables
   ├── NO access to credentials
   └── Calls: POST /api/elavon/get-token with { amount }

2. SERVER (Next.js API Route)
   ├── /api/elavon/get-token/route.js runs here
   ├── HAS access to process.env
   ├── Reads: ELAVON_SSL_ACCOUNT_ID, ELAVON_SSL_USER_ID, ELAVON_SSL_PIN
   ├── Calls Converge API with credentials
   └── Returns: { token } (NO credentials returned)

3. BROWSER (Client Side Again)
   ├── Receives token from server
   ├── Opens popup to Converge payment page
   └── User completes payment on Converge's site

4. CONVERGE (External)
   └── Handles payment processing securely
```

## Security Verification

### ✅ What SHOULD happen:
- ✅ Environment variables are ONLY accessed on the server
- ✅ Client sends ONLY the amount to the server
- ✅ Server sends credentials to Converge (not exposed to client)
- ✅ Client receives ONLY a token (no credentials)
- ✅ Token is used to open Converge payment page

### ❌ What should NOT happen:
- ❌ Client should NEVER see credentials
- ❌ Credentials should NEVER be in client-side code
- ❌ Credentials should NEVER be sent to the browser

## Testing Instructions

### Step 1: Set up environment variables
Make sure your `.env.local` file contains:
```env
ELAVON_SSL_ACCOUNT_ID=your_account_id
ELAVON_SSL_USER_ID=your_user_id
ELAVON_SSL_PIN=your_pin
```

### Step 2: Start the development server
```bash
npm run dev
```

### Step 3: Open Browser Developer Tools
1. Open your browser (Chrome/Edge recommended)
2. Press F12 to open Developer Tools
3. Go to the "Console" tab
4. Keep it open while testing

### Step 4: Navigate to a donation page
Go to any organization page with a donation section, for example:
```
http://localhost:3000/org/your-organization-slug
```

### Step 5: Fill out donation form
1. Enter a donation amount (e.g., $50)
2. Enter your name
3. Select a donation purpose
4. Click "Proceed to Payment"
5. Click "Complete Payment"

### Step 6: Monitor the Console Logs

#### You should see logs in the BROWSER console (🔵 CLIENT):
```
🔵 [CLIENT] handleFinalSubmit called - RUNNING IN BROWSER
🔵 [CLIENT] This code runs in the browser and has NO access to server env variables
🔵 [CLIENT] Preparing to call server API route: /api/elavon/get-token
🔵 [CLIENT] Sending amount: 50
🔵 [CLIENT] NOTE: Credentials are NOT sent from client - they are only on the server
🔵 [CLIENT] Received response from server API
🔵 [CLIENT] Response status: 200
🔵 [CLIENT] Successfully received token from server
🔵 [CLIENT] Token preview: 1234567890123456789...
🔵 [CLIENT] Client received ONLY the token - no credentials exposed
🔵 [CLIENT] Opening Converge payment page in popup window
🔵 [CLIENT] Payment URL (with token): https://api.convergepay.com/hosted-payments/?ssl_txn_auth_token=...
🔵 [CLIENT] Opening popup with dimensions: {width: 500, height: 600, ...}
🔵 [CLIENT] Popup opened successfully
🔵 [CLIENT] Payment flow initiated successfully
```

#### You should see logs in the SERVER console (🟢 SERVER):
Check your terminal where `npm run dev` is running:
```
🟢 [SERVER] get-token API route called - RUNNING ON SERVER SIDE
🟢 [SERVER] This code has access to process.env
🟢 [SERVER] Received amount from client: 50
🟢 [SERVER] Environment variables loaded: {
  ssl_account_id_exists: true,
  ssl_user_id_exists: true,
  ssl_pin_exists: true,
  ssl_account_id_preview: 'abc...',
  ssl_user_id_preview: 'xyz...'
}
🟢 [SERVER] All credentials verified - proceeding to create token request
🟢 [SERVER] Prepared request body for Converge (credentials HIDDEN from client)
🟢 [SERVER] Request details: {
  ssl_transaction_type: 'ccsale',
  ssl_amount: '50.00',
  ssl_get_token: 'Y',
  credentials_included: true
}
🟢 [SERVER] Calling Converge API at: https://api.convergepay.com/hosted-payments/transaction_token
🟢 [SERVER] Converge API response received
🟢 [SERVER] Response status: 200
🟢 [SERVER] Response text (token): 1234567890123456789...
🟢 [SERVER] Successfully generated token - sending to client
🟢 [SERVER] Client will ONLY receive the token, NOT credentials
```

## Verification Checklist

Use this checklist to confirm everything is working correctly:

- [ ] **Browser console shows 🔵 [CLIENT] messages** (confirms client-side execution)
- [ ] **Terminal shows 🟢 [SERVER] messages** (confirms server-side execution)
- [ ] **Server logs show environment variables loaded** (confirms server has access to .env)
- [ ] **Client logs say "NO access to server env variables"** (confirms client isolation)
- [ ] **Client sends ONLY amount to server** (check the fetch body)
- [ ] **Server logs show credentials_included: true** (confirms server uses credentials)
- [ ] **Client receives ONLY token** (no credentials in browser response)
- [ ] **Popup window opens to Converge** (confirms token works)
- [ ] **No credentials visible in Network tab** (check browser DevTools > Network)

## Network Tab Verification

### Additional Security Check:
1. In Browser DevTools, go to **Network** tab
2. Click on the `/api/elavon/get-token` request
3. Check the **Request Payload**: Should only contain `{ "amount": "50" }`
4. Check the **Response**: Should only contain `{ "token": "..." }`
5. **IMPORTANT**: You should NOT see any credentials in Request or Response

## Common Issues & Troubleshooting

### Issue: Missing credentials error
**Symptom**: Server logs show `ssl_account_id_exists: false`
**Solution**: Check your `.env.local` file and restart the dev server

### Issue: No server logs appearing
**Symptom**: Only client logs in browser, no terminal logs
**Solution**: API route might not be running. Check if Next.js dev server is running properly

### Issue: Popup blocked
**Symptom**: Client logs show "Popup was blocked by browser"
**Solution**: Allow popups for localhost in your browser settings

## Expected Flow Summary

```
User enters amount ($50)
        ↓
CLIENT: Calls /api/elavon/get-token with { amount: 50 }
        ↓
SERVER: Receives request
SERVER: Loads credentials from process.env
SERVER: Calls Converge API with credentials + amount
SERVER: Receives token from Converge
SERVER: Returns { token } to client
        ↓
CLIENT: Receives { token }
CLIENT: Opens popup to Converge with token
        ↓
USER: Completes payment on Converge site
```

## Conclusion

If all the above checks pass, you have confirmed:
1. ✅ API route runs on the server
2. ✅ Environment variables are accessed server-side only
3. ✅ Credentials are never exposed to the client
4. ✅ Client correctly calls the server API
5. ✅ Secure flow: Browser → Server → Converge

---

**Last Updated**: November 20, 2025
