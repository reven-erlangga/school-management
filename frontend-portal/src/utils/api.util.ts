const API_URL = import.meta.env.API_URL || import.meta.env.PUBLIC_API_URL || 'http://localhost:3001';

interface RequestOptions extends RequestInit {
  params?: Record<string, string | number | boolean>;
  _retry?: boolean;
}

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

async function request<T>(endpoint: string, options: RequestOptions = {}): Promise<T> {
  const { params, ...fetchOptions } = options;
  
  let url = `${API_URL}${endpoint}`;
  
  if (params) {
    const searchParams = new URLSearchParams();
    Object.entries(params).forEach(([key, value]) => {
      if (value !== undefined && value !== null) {
        searchParams.append(key, String(value));
      }
    });
    const queryString = searchParams.toString();
    if (queryString) {
      url += `?${queryString}`;
    }
  }

  const defaultHeaders: Record<string, string> = {
    'Content-Type': 'application/json',
  };

  if (fetchOptions.body instanceof FormData) {
    delete defaultHeaders['Content-Type'];
  }

  const headers = {
    ...defaultHeaders,
    ...fetchOptions.headers,
  } as HeadersInit;

  // Add Authorization header if token exists
  if (typeof window !== 'undefined') {
    const token = localStorage.getItem('access_token');
    if (token) {
      (headers as any)['Authorization'] = `Bearer ${token}`;
    }
  }

  let response;
  try {
    response = await fetch(url, {
      ...fetchOptions,
      headers,
    });
  } catch (error) {
    console.error('API Request Error:', error);
    throw new Error('Gagal terhubung ke server. Pastikan backend sedang berjalan.');
  }

  if (response.status === 503) {
    if (typeof window !== 'undefined' && window.location.pathname !== '/setup') {
        window.location.href = '/setup';
    }
    throw new Error('Service Unavailable');
  }

  const data = await response.json();

  if (!response.ok) {
    // Handle 401 Unauthorized - Token Refresh
    if (response.status === 401 && !options._retry && endpoint !== '/auth/refresh') {
      if (isRefreshing) {
        return new Promise(function(resolve, reject) {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          return request<T>(endpoint, options);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      options._retry = true;
      isRefreshing = true;
      const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refresh_token') : null;

      if (refreshToken) {
        try {
          const refreshResponse = await fetch(`${API_URL}/auth/refresh`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ refreshToken })
          });

          const refreshData = await refreshResponse.json();

          if (refreshResponse.ok && refreshData.data) {
             const data = refreshData.data;
             const accessToken = data.accessToken || data.access_token;
             const refreshToken = data.refreshToken || data.refresh_token;
             
             if (accessToken) {
                 localStorage.setItem('access_token', accessToken);
             }
             
             if (refreshToken) {
               localStorage.setItem('refresh_token', refreshToken);
             }
             
             processQueue(null, accessToken);
             isRefreshing = false;
             
             return request<T>(endpoint, options);
          } else {
             throw new Error('Session expired');
          }
        } catch (refreshError) {
          processQueue(refreshError, null);
          isRefreshing = false;
          // Clear auth and redirect
          if (typeof window !== 'undefined') {
            localStorage.removeItem('access_token');
            localStorage.removeItem('refresh_token');
            localStorage.removeItem('admin_user');
            window.location.href = '/login';
          }
          throw refreshError;
        }
      } else {
         // No refresh token available
         if (typeof window !== 'undefined') {
            localStorage.removeItem('access_token');
            localStorage.removeItem('admin_user');
            window.location.href = '/login';
         }
      }
    }

    let errorMessage = 'API Error';
    
    // Check for JSON:API error structure
    if (data.errors && Array.isArray(data.errors) && data.errors.length > 0) {
       const firstError = data.errors[0];
       errorMessage = firstError.detail || firstError.title || errorMessage;
    } else if (data.message) {
       errorMessage = data.message;
    }
    
    throw new Error(errorMessage);
  }

  return data;
}

export const api = {
  get: <T>(endpoint: string, options?: RequestOptions) => request<T>(endpoint, { ...options, method: 'GET' }),
  post: <T>(endpoint: string, body: any, options?: RequestOptions) => {
    const isFormData = body instanceof FormData;
    return request<T>(endpoint, { 
      ...options, 
      method: 'POST', 
      body: isFormData ? body : JSON.stringify(body) 
    });
  },
  put: <T>(endpoint: string, body: any, options?: RequestOptions) => {
    const isFormData = body instanceof FormData;
    return request<T>(endpoint, { 
      ...options, 
      method: 'PUT', 
      body: isFormData ? body : JSON.stringify(body) 
    });
  },
  patch: <T>(endpoint: string, body: any, options?: RequestOptions) => {
    const isFormData = body instanceof FormData;
    return request<T>(endpoint, { 
      ...options, 
      method: 'PATCH', 
      body: isFormData ? body : JSON.stringify(body) 
    });
  },
  delete: <T>(endpoint: string, options?: RequestOptions) => request<T>(endpoint, { ...options, method: 'DELETE' }),
};
