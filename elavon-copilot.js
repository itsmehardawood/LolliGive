/* COPILOT PROMPT START
Refactor the Next.js API routes `/api/elavon/get-token` and `/api/elavon/hpp-callback` to be fully production-ready and secure according to Converge (Elavon) documentation:

Requirements:
1. All Converge credentials (ssl_account_id, ssl_user_id, ssl_pin) must be used only server-side. Never expose them to the client.
2. All communication with Converge must use HTTPS POST with content type application/x-www-form-urlencoded.
3. `get-token` route:
   - Accepts JSON POST body from the frontend with `amount`.
   - Uses server-side credentials to request a transaction token from Converge.
   - Returns only the token to the frontend.
   - Handles invalid or missing JSON safely.
4. `hpp-callback` route:
   - Accepts POST from Converge HPP (Content-Type: application/x-www-form-urlencoded).
   - Parses the payload into JSON safely.
   - Logs full response for debugging.
   - Checks if payment approved (`ssl_result === "0"`) and can be extended to update database.
   - Returns a JSON acknowledgment quickly.
5. Include console logs for debugging both routes.
6. Use `runtime = "nodejs"` and `dynamic = "force-dynamic"` for both routes.
7. Ensure no Server Actions errors with `x-forwarded-host` and `origin`.
8. The client should never see Converge credentials; only receive the transaction token.
9. Ensure all POST requests to Converge are done server-side securely.
Generate complete Next.js App Router route code for both APIs.
COPILOT PROMPT END */
