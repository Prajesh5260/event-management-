const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:5000/api';

export async function apiFetch(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;
  const token = localStorage.getItem('token');

  const headers = Object.assign({}, options.headers || {});
  if (token && !headers.Authorization) {
    headers.Authorization = `Bearer ${token}`;
  }

  const fetchOptions = Object.assign({}, options, { headers });

  try {
    const res = await fetch(url, fetchOptions);
    // Safely parse JSON if any
    let data = null;
    try {
      data = await res.json();
    } catch (err) {
      // no body
    }

    return { ok: res.ok, status: res.status, data };
  } catch (err) {
    // Network or CORS error
    throw new Error('Network error: Unable to reach API');
  }
}

export { API_BASE_URL };
