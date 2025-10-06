# Testing Checklist for Organization Verification Integration

## Pre-Testing Setup
- [ ] Ensure backend API is running on `http://54.167.124.195:8002`
- [ ] Clear browser localStorage before testing
- [ ] Have test credentials ready

## 1. Login Flow Testing

### Test Case 1.1: New Login
1. [ ] Go to `/login` page
2. [ ] Enter valid credentials
3. [ ] Complete OTP verification
4. [ ] **Verify**: Check browser console for log: `"org_key_id stored: <value>"`
5. [ ] **Verify**: Open DevTools → Application → Local Storage → Check `org_key_id` is stored
6. [ ] **Verify**: Redirected to `/dashboard`

### Test Case 1.2: Check userData in localStorage
1. [ ] Open DevTools → Application → Local Storage
2. [ ] Check `userData` object
3. [ ] **Verify**: Contains `user.org_key_id` field
4. [ ] **Verify**: Contains `organization_verified` field
5. [ ] Copy the `org_key_id` value for manual API testing

## 2. Signup Flow Testing

### Test Case 2.1: New Signup
1. [ ] Go to `/signup` page
2. [ ] Fill in all required fields
3. [ ] Complete OTP verification
4. [ ] **Verify**: Check browser console for log: `"org_key_id stored: <value>"`
5. [ ] **Verify**: `org_key_id` is stored in localStorage
6. [ ] **Verify**: Redirected to `/dashboard`

## 3. Dashboard Loading Testing

### Test Case 3.1: Dashboard with Incomplete Profile
1. [ ] Login as a user with incomplete profile
2. [ ] **Verify**: Dashboard loads successfully
3. [ ] **Verify**: Console shows: `"Organization verification API response:"`
4. [ ] **Verify**: `BusinessForm` component is displayed
5. [ ] **Verify**: Form fields are visible

### Test Case 3.2: Dashboard with Pending Status
1. [ ] Login as a user with PENDING status
2. [ ] **Verify**: `PendingStatus` component is displayed
3. [ ] **Verify**: Shows "Application Under Review" message
4. [ ] **Verify**: Displays submitted information correctly
5. [ ] **Verify**: "Check Status" button is visible

### Test Case 3.3: Dashboard with Approved Status
1. [ ] Login as a user with APPROVED/VERIFIED status
2. [ ] **Verify**: `ApprovedStatus` component is displayed
3. [ ] **Verify**: Shows "Business Verified Successfully" message
4. [ ] **Verify**: All organization details are displayed correctly
5. [ ] **Verify**: Document links are clickable

## 4. API Response Testing

### Test Case 4.1: Manual API Call
1. [ ] Open browser DevTools → Console
2. [ ] Get `org_key_id` from localStorage: `localStorage.getItem('org_key_id')`
3. [ ] Make manual API call:
```javascript
fetch('http://54.167.124.195:8002/api/organization-profile/get-by-org-key-id?org_key_id=YOUR_ORG_KEY_ID', {
  headers: {
    'Authorization': 'Bearer ' + JSON.parse(localStorage.getItem('userData')).token
  }
})
.then(r => r.json())
.then(d => console.log(d))
```
4. [ ] **Verify**: Response has `status: true`
5. [ ] **Verify**: Response has `data` array with at least one item
6. [ ] **Verify**: First item has `user.organization_verified` field

## 5. Status Transformation Testing

### Test Case 5.1: Check Status Mapping
1. [ ] Open browser console on dashboard
2. [ ] Look for log: `"Current verification status:"`
3. [ ] **Verify**: Shows `fromUserData`, `fromAPI`, and `final` status
4. [ ] **Verify**: Status correctly mapped:
   - API "PENDING" → Internal "pending"
   - API "APPROVED" → Internal "approved"
   - API "INCOMPLETE" → Internal "incomplete"

### Test Case 5.2: Check Data Transformation
1. [ ] Look for console log: `"Transformed verification data:"`
2. [ ] **Verify**: Structure matches:
```javascript
{
  status: true,
  data: {
    business_profile: { /* org data */ },
    business_verified: "PENDING/APPROVED/etc",
    verification_status: "PENDING/APPROVED/etc",
    user_id: 5
  }
}
```

## 6. Form Submission Testing

### Test Case 6.1: Submit Incomplete Profile
1. [ ] Fill in all required fields in the form
2. [ ] Upload required documents
3. [ ] Click "Submit for Verification"
4. [ ] **Verify**: Success message appears
5. [ ] **Verify**: Page refreshes showing new status
6. [ ] **Verify**: Status changes to PENDING

### Test Case 6.2: Auto-fill on Incomplete Status
1. [ ] Login with INCOMPLETE status
2. [ ] **Verify**: Form fields are pre-filled with existing data
3. [ ] **Verify**: Email field shows correct email
4. [ ] **Verify**: All previously submitted data is visible

## 7. Periodic Status Check Testing

### Test Case 7.1: Status Update Check
1. [ ] Login to dashboard with PENDING status
2. [ ] Have admin approve the organization in backend
3. [ ] Wait 30 seconds (automatic check interval)
4. [ ] **Verify**: Status automatically updates to APPROVED
5. [ ] **Verify**: UI switches to ApprovedStatus component

### Test Case 7.2: Manual Status Check
1. [ ] On dashboard with PENDING status
2. [ ] Click "Check Status" button
3. [ ] **Verify**: Console shows: `"Organization verification API response:"`
4. [ ] **Verify**: UI updates if status changed

## 8. Business Name Display Testing

### Test Case 8.1: Header Shows Business Name
1. [ ] Login with APPROVED status
2. [ ] **Verify**: Dashboard header shows "Welcome [Business Name]"
3. [ ] **Verify**: Business name matches organization_name from API

## 9. Error Handling Testing

### Test Case 9.1: Missing org_key_id
1. [ ] Manually remove `org_key_id` from localStorage
2. [ ] Refresh dashboard
3. [ ] **Verify**: Console shows warning: `"No org_key_id found"`
4. [ ] **Verify**: Page doesn't crash

### Test Case 9.2: API Failure
1. [ ] Disconnect internet or use invalid org_key_id
2. [ ] Refresh dashboard
3. [ ] **Verify**: Error message displayed
4. [ ] **Verify**: "Retry" button appears and works

### Test Case 9.3: Invalid Response Structure
1. [ ] Check console for any errors during normal flow
2. [ ] **Verify**: No unhandled errors
3. [ ] **Verify**: Fallback to localStorage data if API fails

## 10. Cross-Page Navigation Testing

### Test Case 10.1: Navigation Persists org_key_id
1. [ ] Login and go to dashboard
2. [ ] Navigate to different tabs (Home, Subscriptions, etc.)
3. [ ] Refresh page
4. [ ] **Verify**: `org_key_id` still in localStorage
5. [ ] **Verify**: Verification status still displayed correctly

## 11. Logout and Re-login Testing

### Test Case 11.1: Logout Clears Data
1. [ ] Click Logout button
2. [ ] **Verify**: `userData` removed from localStorage
3. [ ] **Verify**: `org_key_id` removed from localStorage
4. [ ] **Verify**: Redirected to login page

### Test Case 11.2: Re-login Restores Data
1. [ ] Login again with same credentials
2. [ ] **Verify**: `org_key_id` stored again
3. [ ] **Verify**: Verification status fetched correctly
4. [ ] **Verify**: UI matches current organization status

## 12. Multi-Browser Testing

### Test Case 12.1: Chrome
- [ ] All above tests pass in Chrome

### Test Case 12.2: Firefox
- [ ] All above tests pass in Firefox

### Test Case 12.3: Edge
- [ ] All above tests pass in Edge

## 13. Console Log Verification

During testing, verify these console logs appear:
- [ ] `"org_key_id stored: <value>"` (during login/signup)
- [ ] `"Organization verification API response:"` (on dashboard load)
- [ ] `"Transformed verification data:"` (after API response)
- [ ] `"Organization verified status: <status>"` (status extraction)
- [ ] `"Organization name: <name>"` (business name extraction)
- [ ] `"Mapped status: <status>"` (status mapping)
- [ ] `"Current verification status:"` (final status check)

## 14. Bug Tracking

Document any issues found:

| Issue # | Description | Severity | Status |
|---------|-------------|----------|--------|
| 1       |             | High/Medium/Low | Open/Fixed |
| 2       |             | High/Medium/Low | Open/Fixed |

## Test Results Summary

- **Total Test Cases**: 40+
- **Passed**: ___
- **Failed**: ___
- **Skipped**: ___
- **Date Tested**: ___________
- **Tester Name**: ___________
- **Browser/Version**: ___________

## Notes

Add any additional observations or notes here:

---

## Quick Debug Commands

Run these in browser console for quick debugging:

```javascript
// Check org_key_id
console.log('org_key_id:', localStorage.getItem('org_key_id'));

// Check full userData
console.log('userData:', JSON.parse(localStorage.getItem('userData')));

// Check verification status
const userData = JSON.parse(localStorage.getItem('userData'));
console.log('Verification Status:', userData?.user?.organization_verified);

// Manual API test
const orgKeyId = localStorage.getItem('org_key_id');
fetch(`http://54.167.124.195:8002/api/organization-profile/get-by-org-key-id?org_key_id=${orgKeyId}`)
  .then(r => r.json())
  .then(d => console.log('API Response:', d));
```
