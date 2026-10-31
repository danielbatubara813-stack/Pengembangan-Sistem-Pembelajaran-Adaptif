const apiBaseUrl = (import.meta.env.VITE_LARAVEL_API_URL || '').replace(/\/+$/, '');
const apiUrl = (path: string): string => `${apiBaseUrl}${path.startsWith('/') ? path : `/${path}`}`;

const getCookie = (name: string): string | null => {
  if (typeof document === 'undefined') return null;
  const cookie = document.cookie
    .split('; ')
    .find((item) => item.startsWith(`${name}=`));

  return cookie ? cookie.slice(name.length + 1) : null;
};

export class ApiError extends Error {
  constructor(message: string, public readonly status: number) {
    super(message);
    this.name = 'ApiError';
  }
}

async function ensureCsrfCookie(forceRefresh = false): Promise<void> {
  if (!forceRefresh && getCookie('XSRF-TOKEN')) return;

  const response = await fetch(apiUrl('/sanctum/csrf-cookie'), {
    credentials: 'include',
    headers: { Accept: 'application/json' },
  });

  if (!response.ok) {
    throw new Error('Token keamanan sesi belum dapat dimuat.');
  }
}

export async function requestApi<T>(url: string, init: RequestInit = {}): Promise<T> {
  const method = (init.method || 'GET').toUpperCase();
  const headers = new Headers(init.headers);
  headers.set('Accept', 'application/json');

  const mutating = ['POST', 'PUT', 'PATCH', 'DELETE'].includes(method);
  if (mutating) {
    await ensureCsrfCookie();
    const xsrfToken = getCookie('XSRF-TOKEN');
    if (xsrfToken) headers.set('X-XSRF-TOKEN', decodeURIComponent(xsrfToken));
  }

  const request: RequestInit = {
    ...init,
    method,
    headers,
    credentials: 'include',
  };
  let response = await fetch(apiUrl(url), request);
  if (mutating && response.status === 419) {
    await ensureCsrfCookie(true);
    const refreshedToken = getCookie('XSRF-TOKEN');
    if (refreshedToken) headers.set('X-XSRF-TOKEN', decodeURIComponent(refreshedToken));
    response = await fetch(apiUrl(url), request);
  }
  const data: unknown = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = data && typeof data === 'object' && 'message' in data && typeof data.message === 'string'
      ? data.message
      : 'Tidak dapat menghubungi server.';
    throw new ApiError(message, response.status);
  }

  return data as T;
}
