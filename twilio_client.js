/**
 * Twilio Client Helper for Node.js (Zero external dependencies)
 * Supports SMS, Calls, Account Info, and Message Logs.
 */

const https = require('https');
const fs = require('fs');
const path = require('path');

// Load .env if present
const envPath = path.join(__dirname, '.env');
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, 'utf8');
  envContent.split('\n').forEach((line) => {
    const trimmed = line.trim();
    if (trimmed && !trimmed.startsWith('#') && trimmed.includes('=')) {
      const idx = trimmed.indexOf('=');
      const key = trimmed.substring(0, idx).trim();
      let val = trimmed.substring(idx + 1).trim();
      if ((val.startsWith('"') && val.endsWith('"')) || (val.startsWith("'") && val.endsWith("'"))) {
        val = val.slice(1, -1);
      }
      process.env[key] = val;
    }
  });
}

const ACCOUNT_SID = process.env.TWILIO_ACCOUNT_SID || '';
const AUTH_TOKEN = process.env.TWILIO_AUTH_TOKEN || '';
const PHONE_NUMBER = process.env.TWILIO_PHONE_NUMBER || '';
const VERIFIED_CALLER_ID = process.env.TWILIO_VERIFIED_CALLER_ID || '';

const authHeader = 'Basic ' + Buffer.from(`${ACCOUNT_SID}:${AUTH_TOKEN}`).toString('base64');

function twilioRequest(pathname, method = 'GET', postData = null) {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'api.twilio.com',
      port: 443,
      path: pathname,
      method: method,
      headers: {
        'Authorization': authHeader,
        'Accept': 'application/json'
      }
    };

    let bodyString = null;
    if (postData && (method === 'POST' || method === 'PUT')) {
      const params = new URLSearchParams();
      for (const [k, v] of Object.entries(postData)) {
        if (v !== undefined && v !== null) {
          params.append(k, String(v));
        }
      }
      bodyString = params.toString();
      options.headers['Content-Type'] = 'application/x-www-form-urlencoded';
      options.headers['Content-Length'] = Buffer.byteLength(bodyString);
    }

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(json);
          } else {
            reject(new Error(`Twilio API Error (${res.statusCode}): ${json.message || data}`));
          }
        } catch (e) {
          if (res.statusCode >= 200 && res.statusCode < 300) {
            resolve(data);
          } else {
            reject(new Error(`HTTP Error (${res.statusCode}): ${data}`));
          }
        }
      });
    });

    req.on('error', reject);
    if (bodyString) {
      req.write(bodyString);
    }
    req.end();
  });
}

/**
 * Get account summary including balance
 */
async function getAccountInfo() {
  const account = await twilioRequest(`/2010-04-01/Accounts/${ACCOUNT_SID}.json`);
  const balance = await twilioRequest(`/2010-04-01/Accounts/${ACCOUNT_SID}/Balance.json`);
  return {
    accountSid: account.sid,
    friendlyName: account.friendly_name,
    status: account.status,
    type: account.type,
    balance: balance.balance,
    currency: balance.currency
  };
}

/**
 * Send an SMS message
 * @param {string} to - Destination phone number (defaults to verified number in trial mode)
 * @param {string} body - SMS message text
 */
async function sendSms(to = VERIFIED_CALLER_ID, body) {
  if (!body) {
    throw new Error('Message body is required');
  }
  return twilioRequest(`/2010-04-01/Accounts/${ACCOUNT_SID}/Messages.json`, 'POST', {
    From: PHONE_NUMBER,
    To: to,
    Body: body
  });
}

/**
 * Make an outbound voice call with text-to-speech
 * @param {string} to - Destination phone number
 * @param {string} sayMessage - Text to speak
 */
async function makeCall(to = VERIFIED_CALLER_ID, sayMessage) {
  if (!sayMessage) {
    throw new Error('Speech text is required');
  }
  const twiml = `<Response><Say voice="alice">${sayMessage}</Say></Response>`;
  return twilioRequest(`/2010-04-01/Accounts/${ACCOUNT_SID}/Calls.json`, 'POST', {
    From: PHONE_NUMBER,
    To: to,
    Twiml: twiml
  });
}

/**
 * List recent messages
 */
async function getRecentMessages(limit = 10) {
  const res = await twilioRequest(`/2010-04-01/Accounts/${ACCOUNT_SID}/Messages.json?PageSize=${limit}`);
  return res.messages || [];
}

/**
 * List recent calls
 */
async function getRecentCalls(limit = 10) {
  const res = await twilioRequest(`/2010-04-01/Accounts/${ACCOUNT_SID}/Calls.json?PageSize=${limit}`);
  return res.calls || [];
}

module.exports = {
  getAccountInfo,
  sendSms,
  makeCall,
  getRecentMessages,
  getRecentCalls,
  ACCOUNT_SID,
  PHONE_NUMBER,
  VERIFIED_CALLER_ID
};

// CLI Execution Example: node twilio_client.js
if (require.main === module) {
  (async () => {
    try {
      console.log('Fetching account info...');
      const info = await getAccountInfo();
      console.log('Account Info:', info);
    } catch (err) {
      console.error('Error:', err.message);
    }
  })();
}
