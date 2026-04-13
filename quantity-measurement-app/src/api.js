var BASE_URL = 'http://localhost:8080';

// ── Login ────────────────────────────────────────────────────────
export async function loginApi(email, password) {
  var response = await fetch(BASE_URL + '/auth/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ email: email, password: password })
  });

  if (!response.ok) {
    var error = await response.json();
    throw new Error(error.message || 'Login failed');
  }

  var data = await response.json();
  return data; // { token, message }
}

// ── Register ─────────────────────────────────────────────────────
export async function registerApi(name, email, password, mobileNumber) {
  var response = await fetch(BASE_URL + '/auth/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      name: name,
      email: email,
      password: password,
      mobileNumber: mobileNumber
    })
  });

  if (!response.ok) {
    var error = await response.json();
    throw new Error(error.message || 'Registration failed');
  }

  var data = await response.text();
  return data; // "User registered successfully"
}

// ── Quantity APIs ────────────────────────────────────────────────
export async function compareApi(payload) {
  return quantityRequest('/api/v1/quantities/compare', payload);
}

export async function convertApi(payload) {
  return quantityRequest('/api/v1/quantities/convert', payload);
}

export async function addApi(payload) {
  return quantityRequest('/api/v1/quantities/add', payload);
}

export async function subtractApi(payload) {
  return quantityRequest('/api/v1/quantities/subtract', payload);
}

export async function multiplyApi(payload) {
  return quantityRequest('/api/v1/quantities/multiply', payload);
}

export async function divideApi(payload) {
  return quantityRequest('/api/v1/quantities/divide', payload);
}

// ── History API ──────────────────────────────────────────────────
export async function getHistoryApi() {
  var token = localStorage.getItem('qm_token');

  var response = await fetch(BASE_URL + '/api/v1/quantities/history/operation/compare', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + token
    }
  });

  if (!response.ok) {
    throw new Error('Failed to fetch history');
  }

  return await response.json();
}

// ── Helper: all quantity requests need JWT token ─────────────────
async function quantityRequest(endpoint, payload) {
  var token = localStorage.getItem('qm_token');

  var response = await fetch(BASE_URL + endpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': 'Bearer ' + token
    },
    body: JSON.stringify(payload)
  });

  if (!response.ok) {
    var error = await response.json();
    throw new Error(error.message || 'Request failed');
  }

  return await response.json();
}