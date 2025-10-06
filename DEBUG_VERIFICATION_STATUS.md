# Debug Guide: Why organization_verified is not showing

## Problem
You're not seeing the verification status in the console log:
```javascript
{
    "fromUserData": "PENDING",
    "final": "PENDING"
}
```

Instead you might be seeing:
```javascript
{
    "fromUserData": undefined,
    "fromAPI": "PENDING",
    "final": "PENDING"
}
```

## Root Cause
The `organization_verified` field is not in your localStorage because you logged in **before** we updated the login/signup code to store it.

## Solution Steps

### Step 1: Check Current localStorage
Open browser DevTools Console and run:
```javascript
// Check what's currently stored
const userData = JSON.parse(localStorage.getItem('userData'));
console.log('Current userData:', userData);
console.log('Has organization_verified?', userData?.user?.organization_verified);
console.log('Has business_verified?', userData?.user?.business_verified);
```

### Step 2: Clear localStorage and Re-login
```javascript
// Clear all data
localStorage.clear();

// Or selectively clear
localStorage.removeItem('userData');
localStorage.removeItem('org_key_id');
```

Then **logout and login again** using the updated login page.

### Step 3: Verify Data After Re-login
After logging in again, check:
```javascript
const userData = JSON.parse(localStorage.getItem('userData'));
console.log('After re-login:', {
  orgKeyId: localStorage.getItem('org_key_id'),
  organizationVerified: userData?.user?.organization_verified,
  structure: userData
});
```

You should now see:
```javascript
{
  orgKeyId: "034509C39S308453",
  organizationVerified: "PENDING", // or "APPROVED", etc.
  structure: {
    user: {
      id: 5,
      org_key_id: "034509C39S308453",
      organization_verified: "PENDING",
      email: "...",
      // ... other fields
    },
    expiry: 1234567890
  }
}
```

### Step 4: Verify API Response Updates localStorage
The updated code now automatically updates localStorage with the latest verification status from the API. Check console for:
```
"Updated localStorage with verification status: PENDING"
```

## What the Fix Does

### 1. Enhanced User Data Extraction
The code now checks **multiple possible locations** for the verification status:
```javascript
const orgVerified = userObj.organization_verified || 
                   userObj.business_verified || 
                   parsedUser.organization_verified ||
                   parsedUser.business_verified;
```

### 2. Auto-Update from API
When the API returns data, it automatically updates localStorage:
```javascript
const updatedStorage = {
  ...parsedUser,
  user: {
    ...(parsedUser.user || parsedUser),
    organization_verified: latestOrgVerified,
    business_verified: latestOrgVerified
  }
};
localStorage.setItem("userData", JSON.stringify(updatedStorage));
```

### 3. Better Console Logging
Added more detailed logging to help debug:
```javascript
console.log("Current verification status:", {
  fromUserData: organizationVerified,
  fromAPI: verificationStatus,
  final: currentStatus,
  userDataKeys: userData ? Object.keys(userData) : 'no userData'
});
```

## Expected Console Output After Fix

When everything is working correctly, you should see:

1. **On Login:**
```
org_key_id stored: 034509C39S308453
```

2. **On Dashboard Load:**
```
User data found in localStorage: { user: {...}, expiry: ... }
Enhanced userData set: { id: 5, organization_verified: "PENDING", ... }
Organization verification API response: { status: true, data: [...] }
Transformed verification data: { ... }
Updated localStorage with verification status: PENDING
```

3. **Verification Status Check:**
```
Current verification status: {
  fromUserData: "PENDING",
  fromAPI: "PENDING", 
  final: "PENDING",
  userDataKeys: ["id", "email", "organization_verified", "business_verified", ...]
}
```

## Quick Fix Script

If you want to manually add the verification status without re-logging in (temporary fix):

```javascript
// Run this in browser console
(function() {
  const userData = JSON.parse(localStorage.getItem('userData'));
  if (userData && userData.user) {
    // Add organization_verified to user object
    userData.user.organization_verified = "PENDING"; // Change to your actual status
    userData.user.business_verified = "PENDING";
    localStorage.setItem('userData', JSON.stringify(userData));
    console.log('✅ Manually added verification status');
    location.reload();
  } else {
    console.log('❌ userData not found or invalid structure');
  }
})();
```

## Testing Different Statuses

To test how the UI looks for different statuses, you can temporarily modify localStorage:

```javascript
// Test PENDING status
const userData = JSON.parse(localStorage.getItem('userData'));
userData.user.organization_verified = "PENDING";
localStorage.setItem('userData', JSON.stringify(userData));
location.reload();

// Test APPROVED status
const userData = JSON.parse(localStorage.getItem('userData'));
userData.user.organization_verified = "APPROVED";
localStorage.setItem('userData', JSON.stringify(userData));
location.reload();

// Test INCOMPLETE status
const userData = JSON.parse(localStorage.getItem('userData'));
userData.user.organization_verified = "INCOMPLETE";
localStorage.setItem('userData', JSON.stringify(userData));
location.reload();
```

## Common Issues and Solutions

### Issue 1: Still seeing `fromUserData: undefined`
**Solution:** Re-login or use the Quick Fix Script above

### Issue 2: `fromAPI` is undefined
**Solution:** Check that `org_key_id` is stored and valid:
```javascript
console.log('org_key_id:', localStorage.getItem('org_key_id'));
```

### Issue 3: Wrong status displayed
**Solution:** Clear cache and localStorage, then re-login:
```javascript
localStorage.clear();
sessionStorage.clear();
location.reload();
```

### Issue 4: API call failing
**Solution:** Check network tab for API response. Verify `org_key_id` is correct.

## Verification Checklist

- [ ] Logged out completely
- [ ] Cleared localStorage
- [ ] Logged in again with updated code
- [ ] Verified `org_key_id` is stored
- [ ] Verified `organization_verified` is in userData
- [ ] Console shows "fromUserData: PENDING" (or other status)
- [ ] Console shows "fromAPI: PENDING"
- [ ] Console shows "final: PENDING"
- [ ] Correct UI component is displayed (Pending/Approved/Form)

## Final Notes

The code now has **triple redundancy** for getting the verification status:

1. **From localStorage** (`userData.organization_verified` or `userData.business_verified`)
2. **From API response** (`verificationData.data.business_verified`)
3. **Auto-update** (API response updates localStorage for next time)

This means even if localStorage is missing the status initially, the API call will fetch it and update localStorage automatically.
