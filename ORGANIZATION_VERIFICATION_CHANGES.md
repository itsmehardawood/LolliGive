# Organization Verification API Integration - Changes Summary

## Overview
This document outlines the changes made to integrate the new organization verification API endpoint that uses `org_key_id` for checking business approval status.

## New API Endpoint
```
GET /organization-profile/get-by-org-key-id?org_key_id={org_key_id}
```

### API Response Structure
```json
{
  "status": true,
  "data": [
    {
      "id": 2,
      "user_id": 5,
      "organization_name": "Nobel4",
      "organization_registration_number": "123456789",
      "street": "51 A",
      "city": "Lahore",
      "state": "punjab",
      "email": "dawood@gmail.com",
      "account_holder_first_name": "Bilal",
      "account_holder_last_name": "Khan",
      "user": {
        "id": 5,
        "org_key_id": "034509C39S308453",
        "email": "dawood@gmail.com",
        "organization_verified": "PENDING",
        "role": "BUSINESS_USER"
      }
    }
  ]
}
```

## Key Changes

### 1. Login/Signup Pages - Store `org_key_id`

#### Files Modified:
- `src/app/login/page.js`
- `src/app/signup/page.js`
- `src/app/test-login/page.js`

#### Changes:
- Extract and store `org_key_id` from login/signup API response in localStorage
- Handle both nested structure (`data.user.org_key_id`) and flat structure (`data.org_key_id`)

```javascript
// Store org_key_id separately for easy access
const orgKeyId = data.user?.org_key_id || data.org_key_id;
if (orgKeyId) {
  localStorage.setItem("org_key_id", orgKeyId);
  console.log("org_key_id stored:", orgKeyId);
}
```

### 2. Dashboard Page - Updated Verification Check

#### File Modified:
- `src/app/dashboard/page.js`

#### Changes:
- `checkBusinessVerificationStatus()` now uses `org_key_id` instead of `user_id`
- Reads `org_key_id` from localStorage or userData
- Handles array response structure from new API
- Maps `organization_verified` status to internal status states
- Updates both `organization_verified` and `business_verified` fields in localStorage for compatibility

```javascript
const checkBusinessVerificationStatus = async (userId) => {
  // Get org_key_id from localStorage or userData
  const storedOrgKeyId = localStorage.getItem("org_key_id");
  const userOrgKeyId = userData?.org_key_id;
  const orgKeyId = storedOrgKeyId || userOrgKeyId;
  
  if (!orgKeyId) {
    console.warn("No org_key_id found, cannot check verification status");
    return;
  }

  const response = await apiFetch(
    `/organization-profile/get-by-org-key-id?org_key_id=${orgKeyId}`
  );
  
  // Handle array response...
}
```

### 3. MainBusinessScreen Component

#### File Modified:
- `src/app/components/Dashboard-Screens/BusinessDataScreen/MainBusinessScreen.js`

#### Changes:
- Updated API call to use new endpoint with `org_key_id`
- Transforms array response to expected internal structure
- Properly extracts `organization_verified` from nested user object
- Handles both array and non-array responses

```javascript
// Transform array response to match expected structure
if (data.status && data.data && Array.isArray(data.data) && data.data.length > 0) {
  const transformedData = {
    status: data.status,
    data: {
      business_profile: data.data[0],
      business_verified: data.data[0].user?.organization_verified,
      verification_status: data.data[0].user?.organization_verified,
      verification_reason: data.data[0].user?.verification_reason,
      user_id: data.data[0].user_id
    }
  };
  setVerificationData(transformedData);
}
```

### 4. ApprovedScreen & PendingScreen Components

#### Files Modified:
- `src/app/components/Dashboard-Screens/BusinessDataScreen/ApprovedScreen.js`
- `src/app/components/Dashboard-Screens/BusinessDataScreen/PendingScreen.js`

#### Changes:
- Updated to handle both array and object response structures
- Properly extracts profile data from different response formats

```javascript
let profile;

if (Array.isArray(verificationData?.data)) {
  // New API structure: data is an array
  profile = verificationData?.data[0];
} else if (verificationData?.data?.business_profile) {
  // Old API structure: business_profile nested in data
  profile = verificationData?.data?.business_profile;
} else {
  // Direct data object
  profile = verificationData?.data;
}
```

## Status Mapping

The system maps the following statuses from the API to internal states:

### Organization Verified Status → Internal Status
- `"PENDING"` → `"pending"`
- `"APPROVED"` / `"VERIFIED"` / `"ACTIVE"` → `"approved"`
- `"INCOMPLETE"` → `"incomplete"`
- `null` / `undefined` / `""` → `"incomplete-profile"`
- `"REJECTED"` / `"DECLINED"` → `"rejected"`

### Component Rendering Based on Status
- **Approved/Verified/Active**: Shows `ApprovedStatus` component
- **Pending**: Shows `PendingStatus` component  
- **Incomplete/Incomplete-Profile**: Shows `BusinessForm` component

## Data Flow

1. **Login/Signup**
   - User logs in or signs up
   - API returns user data with `org_key_id`
   - `org_key_id` stored in localStorage
   - User redirected to dashboard

2. **Dashboard Load**
   - Dashboard reads `org_key_id` from localStorage
   - Calls verification API with `org_key_id`
   - Receives organization data with verification status
   - Transforms array response to internal structure
   - Updates UI based on `organization_verified` status

3. **Periodic Status Check**
   - Every 30 seconds, dashboard re-checks verification status
   - Updates UI if status changes (e.g., from PENDING to APPROVED)

## Backward Compatibility

The code maintains backward compatibility by:
- Storing both `organization_verified` and `business_verified` in localStorage
- Checking both fields when determining status
- Handling both array and object response structures
- Supporting both old and new API response formats

## Testing Checklist

- [ ] Login stores `org_key_id` in localStorage
- [ ] Signup stores `org_key_id` in localStorage
- [ ] Dashboard loads with correct verification status
- [ ] PENDING status shows PendingStatus component
- [ ] APPROVED status shows ApprovedStatus component
- [ ] INCOMPLETE status shows BusinessForm component
- [ ] Status updates after form submission
- [ ] Periodic status checking works (30-second interval)
- [ ] Manual status refresh works
- [ ] Data displays correctly in all status screens

## Important Notes

1. **org_key_id is Required**: The new API requires `org_key_id` to function. Ensure it's stored during login/signup.

2. **Array Response**: The new API returns data as an array. The code takes the first item from the array.

3. **Status Field**: The verification status is now in `user.organization_verified` within the response.

4. **Profile Data**: Organization details are now at the root level of the array item, not nested in `business_profile`.

## Troubleshooting

### Issue: "No org_key_id found" warning
**Solution**: Ensure user logs in again to store the `org_key_id` in localStorage.

### Issue: Status not updating
**Solution**: Check browser console for API errors. Verify `org_key_id` is valid.

### Issue: Wrong status displayed
**Solution**: Check `organization_verified` field in API response and verify status mapping in `getStatusFromBusinessVerified()` function.

### Issue: Data not displaying
**Solution**: Verify the response structure transformation in MainBusinessScreen.js is correctly extracting data from the array.

## Environment Configuration

No environment variables need to be changed. The API base URL remains the same:
```
http://54.167.124.195:8002
```

## Future Improvements

- Add error handling for invalid `org_key_id`
- Implement retry logic for failed API calls
- Add loading states during status checks
- Cache verification status to reduce API calls
- Add notification when status changes from PENDING to APPROVED
