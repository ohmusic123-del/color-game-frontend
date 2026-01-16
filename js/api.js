const API = "https://color-game-backend1.onrender.com";

// Enhanced API wrapper with error handling
async function apiCall(endpoint, options = {}) {
    const token = localStorage.getItem('token');
    
    // Add Bearer token to headers
    const headers = {
        'Content-Type': 'application/json',
        ...options.headers
    };
    
    if (token) {
        headers['Authorization'] = `Bearer ${token}`;
    }
    
    try {
        const response = await fetch(`${API}${endpoint}`, {
            ...options,
            headers
        });
        
        // Handle 401 Unauthorized
        if (response.status === 401) {
            localStorage.removeItem('token');
            window.location.href = 'index.html';
            throw new Error('Session expired. Please login again.');
        }
        
        // Handle 404 Not Found
        if (response.status === 404) {
            throw new Error('Requested resource not found.');
        }
        
        const data = await response.json();
        
        if (!response.ok) {
            throw new Error(data.error || data.message || 'Something went wrong');
        }
        
        return data;
        
    } catch (error) {
        console.error(`API Error [${endpoint}]:`, error.message);
        
        // Show user-friendly error
        if (error.message.includes('Failed to fetch')) {
            alert('Network error. Please check your internet connection.');
        } else {
            alert(error.message);
        }
        
        throw error;
    }
}

// Admin API wrapper
async function adminApiCall(endpoint, options = {}) {
    const token = localStorage.getItem('adminToken');
    
    if (!token) {
        window.location.href = 'admin-login.html';
        throw new Error('Admin session expired');
    }
    
    const headers = {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers
    };
    
    return apiCall(endpoint, { ...options, headers });
}

// Expose for global use
window.API = API;
window.apiCall = apiCall;
window.adminApiCall = adminApiCall;
