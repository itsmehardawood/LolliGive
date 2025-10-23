# Elavon Payment Integration - Complete Guide

## 📋 Overview

This document explains the complete Elavon payment integration for the LolliGive donation system. It includes what needs to be implemented on both frontend (Next.js) and backend (Laravel), along with the complete user flow.

---

## 🎯 What We're Building

**Goal**: Allow users to make secure donations through Elavon's hosted payment page
**Current Status**: Frontend ready, needs Laravel backend integration
**Payment Flow**: User fills form → Transaction created → Redirected to Elavon → Payment processed → Status updated

---

## 🏗️ Backend Requirements (Laravel Developer)

### **Environment Configuration**

Add these variables to Laravel's `.env` file:

```env
# Payment Environment (demo/production)
ELAVON_ENVIRONMENT=demo

# Demo/Testing Credentials (safe for testing)
ELAVON_DEMO_MERCHANT_ID=demo
ELAVON_DEMO_USER_ID=demo
ELAVON_DEMO_PIN=demo
ELAVON_DEMO_HOSTED_URL=https://demo.myvirtualmerchant.com/VirtualMerchantDemo/process.do

# Production Credentials (real payments)
ELAVON_MERCHANT_ID=2693813
ELAVON_USER_ID=8045256156web
ELAVON_PIN=WVVN6XVVOOF92M73QP4GPV2CJRVMON907KCR3Z2NUZCEEG4PDIR7TJEGNR9VL4VW
ELAVON_PRODUCTION_HOSTED_URL=https://www.myvirtualmerchant.com/VirtualMerchant/process.do
```

### **Required API Endpoints**

#### **1. Payment URL Generation** (Required)
```php
// Route: POST /api/elavon/payment-url
// Purpose: Generate Elavon payment form data and URL

public function generatePaymentUrl(Request $request)
{
    $request->validate([
        'amount' => 'required|numeric|min:1',
        'name' => 'required|string',
        'purpose' => 'required|string',
        'orgId' => 'required|string',
        'invoiceNumber' => 'required|string'
    ]);

    $isDemo = env('ELAVON_ENVIRONMENT', 'demo') === 'demo';
    
    $config = $isDemo ? [
        'merchantId' => env('ELAVON_DEMO_MERCHANT_ID'),
        'userId' => env('ELAVON_DEMO_USER_ID'),
        'pin' => env('ELAVON_DEMO_PIN'),
        'hostedUrl' => env('ELAVON_DEMO_HOSTED_URL'),
    ] : [
        'merchantId' => env('ELAVON_MERCHANT_ID'),
        'userId' => env('ELAVON_USER_ID'),
        'pin' => env('ELAVON_PIN'),
        'hostedUrl' => env('ELAVON_PRODUCTION_HOSTED_URL'),
    ];

    if (!$config['merchantId'] || !$config['userId'] || !$config['pin']) {
        return response()->json([
            'success' => false,
            'message' => 'Payment system not configured'
        ], 500);
    }

    $description = $request->purpose . ' - ' . ($request->comment ?? 'Donation');

    return response()->json([
        'success' => true,
        'hostedUrl' => $config['hostedUrl'],
        'formData' => [
            'ssl_merchant_id' => $config['merchantId'],
            'ssl_user_id' => $config['userId'],
            'ssl_pin' => $config['pin'],
            'ssl_transaction_type' => 'ccsale',
            'ssl_amount' => number_format($request->amount, 2, '.', ''),
            'ssl_first_name' => explode(' ', $request->name)[0] ?? $request->name,
            'ssl_last_name' => implode(' ', array_slice(explode(' ', $request->name), 1)) ?: '',
            'ssl_invoice_number' => $request->invoiceNumber,
            'ssl_description' => $description,
            'ssl_customer_code' => $request->orgId,
            'ssl_show_form' => 'true'
        ]
    ]);
}
```

#### **2. Transaction Status Management** (Optional but Recommended)

```php
// Route: GET /api/transaction/{invoiceNumber}/status
// Purpose: Check current status of a transaction

public function checkStatus($invoiceNumber)
{
    $transaction = Transaction::where('invoice_number', $invoiceNumber)->first();
    
    if (!$transaction) {
        return response()->json(['error' => 'Transaction not found'], 404);
    }
    
    return response()->json([
        'status' => $transaction->status,
        'amount' => $transaction->amount,
        'name' => $transaction->name,
        'created_at' => $transaction->created_at
    ]);
}

// Route: PUT /api/transaction/{invoiceNumber}/complete
// Purpose: Manually mark transaction as completed

public function markComplete($invoiceNumber)
{
    $updated = Transaction::where('invoice_number', $invoiceNumber)
        ->update([
            'status' => 'completed', 
            'updated_at' => now()
        ]);
    
    if (!$updated) {
        return response()->json(['error' => 'Transaction not found'], 404);
    }
    
    return response()->json(['success' => true, 'message' => 'Transaction marked as completed']);
}
```

#### **3. Webhook Handler** (Future Enhancement)

```php
// Route: POST /api/elavon/webhook
// Purpose: Automatically update transaction status when Elavon sends payment result

public function handleWebhook(Request $request)
{
    // Log the incoming webhook for debugging
    \Log::info('Elavon Webhook Received', $request->all());
    
    $invoiceNumber = $request->ssl_invoice_number;
    $result = $request->ssl_result; // "0" = success, others = failure
    $transactionId = $request->ssl_txn_id;
    
    if (!$invoiceNumber) {
        return response('Missing invoice number', 400);
    }
    
    $status = $result === '0' ? 'completed' : 'failed';
    
    Transaction::where('invoice_number', $invoiceNumber)
        ->update([
            'status' => $status,
            'elavon_transaction_id' => $transactionId,
            'payment_result_code' => $result,
            'updated_at' => now()
        ]);
    
    return response('OK', 200);
}
```

### **Existing Transaction Endpoint** (Keep As Is)

Your existing `/api/transaction/create` endpoint should remain unchanged. It's already working perfectly for storing transaction records with `status: 'pending'`.

---

## 🎨 Frontend Implementation (Next.js)

### **Required Changes**

#### **1. Update API Base URL**
Make sure your `.env` points to Laravel:
```env
NEXT_PUBLIC_API_BASE_URL=https://api.lolligive.com/api
```

#### **2. Update Payment URL Call**
In `DonationSection.js`, line 248, change:
```javascript
// From:
const paymentUrlResponse = await fetch('/api/elavon/payment-url', {

// To:
const paymentUrlResponse = await fetch('https://api.lolligive.com/api/elavon/payment-url', {
```

#### **3. Add Manual Status Update** (Optional)
Add this function for manual payment confirmation:

```javascript
const checkPaymentStatus = async (invoiceNumber) => {
  try {
    const response = await fetch(`https://api.lolligive.com/api/transaction/${invoiceNumber}/status`);
    const data = await response.json();
    
    if (data.status === 'completed') {
      setSubmitMessage('✅ Payment confirmed! Thank you for your donation.');
    } else {
      const confirmComplete = window.confirm('Did you complete the payment successfully?');
      if (confirmComplete) {
        await fetch(`https://api.lolligive.com/api/transaction/${invoiceNumber}/complete`, {
          method: 'PUT'
        });
        setSubmitMessage('✅ Payment marked as completed! Thank you for your donation.');
      }
    }
  } catch (error) {
    console.error('Error checking status:', error);
  }
};
```

### **Optional: Remove Demo Mode Logic**
If you want to simplify, you can remove:
- `isDemoMode` state and related logic
- Demo banner
- Demo mode checks
- `/api/elavon/config` calls

---

## 🔄 Complete User Flow

### **Step-by-Step Process**

1. **User Fills Donation Form**
   - Enters amount, name, purpose, optional comment
   - Clicks "Proceed to Payment"

2. **User Selects Payment Method**
   - Reviews donation summary
   - Selects "Debit Card"
   - Clicks "Complete Donation"

3. **Frontend Creates Transaction Record**
   ```javascript
   POST https://api.lolligive.com/api/transaction/create
   // Creates record with status: 'pending'
   ```

4. **Frontend Gets Payment URL**
   ```javascript
   POST https://api.lolligive.com/api/elavon/payment-url
   // Laravel returns Elavon URL and form data
   ```

5. **User Redirected to Elavon**
   - New browser window opens
   - User sees Elavon's secure payment page
   - Amount and name are pre-filled

6. **User Completes Payment**
   - Enters debit card details on Elavon's page
   - Clicks "Pay Now"
   - Elavon processes payment with bank

7. **Payment Result**
   - User sees success/failure on Elavon's page
   - User manually closes payment window
   - User returns to your donation page

8. **Status Update** (Manual for now)
   - User can click "I've completed payment" button
   - System marks transaction as completed
   - Future: Automatic via webhooks

---

## 🎯 Testing Process

### **Demo Mode Testing** (Safe)
1. Set `ELAVON_ENVIRONMENT=demo` in Laravel
2. All payments go to demo URLs
3. No real charges processed
4. Perfect for development and testing

### **Production Mode** (Real Money)
1. Set `ELAVON_ENVIRONMENT=production` in Laravel
2. Uses real Elavon credentials
3. Processes actual payments
4. Only use when ready for live transactions

---

## 🔧 Implementation Checklist

### **Backend Developer Tasks**
- [ ] Add environment variables to `.env`
- [ ] Create `ElavonController.php`
- [ ] Add route: `POST /api/elavon/payment-url`
- [ ] Add route: `GET /api/transaction/{invoice}/status` (optional)
- [ ] Add route: `PUT /api/transaction/{invoice}/complete` (optional)
- [ ] Test endpoints with Postman

### **Frontend Developer Tasks**
- [ ] Update payment URL call to use Laravel endpoint
- [ ] Test donation flow end-to-end
- [ ] Add manual status update button (optional)
- [ ] Remove demo mode logic (optional)

### **Testing Tasks**
- [ ] Test demo mode (safe, no real charges)
- [ ] Verify transaction creation in database
- [ ] Test payment redirection to Elavon
- [ ] Test manual status updates
- [ ] Switch to production for real testing (small amounts)

---

## 🚨 Important Notes

### **Security**
- Never commit real credentials to version control
- Use environment variables for all sensitive data
- Test in demo mode before production

### **Current Limitations**
- Manual status updates (until webhooks implemented)
- User must close payment window manually
- No automatic payment confirmation

### **Future Enhancements**
- Webhook integration for automatic status updates
- Return URL for seamless user experience
- Payment failure handling improvements

---

## 🆘 Troubleshooting

### **Common Issues**

**Payment URL returns 404**
- Check Laravel routes are registered
- Verify endpoint URL is correct
- Check Laravel logs for errors

**Transaction not created**
- Verify existing `/api/transaction/create` endpoint works
- Check database connection
- Review request payload format

**Elavon page shows error**
- Verify credentials are correct
- Check environment (demo vs production)
- Review Elavon form data format

### **Testing Commands**

Test Laravel endpoints:
```bash
# Test payment URL generation
curl -X POST https://api.lolligive.com/api/elavon/payment-url \
  -H "Content-Type: application/json" \
  -d '{"amount":25,"name":"Test User","purpose":"general","orgId":"123","invoiceNumber":"TEST-123"}'

# Test transaction status
curl -X GET https://api.lolligive.com/api/transaction/TEST-123/status

# Test manual completion
curl -X PUT https://api.lolligive.com/api/transaction/TEST-123/complete
```

---

## 📞 Support

If you need help during implementation:
1. Check Laravel logs for backend errors
2. Check browser console for frontend errors
3. Test with small amounts in production
4. Contact Elavon support for payment gateway issues

---

**Last Updated**: October 23, 2025
**Version**: 1.0
**Status**: Ready for Implementation