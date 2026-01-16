// Enhanced profile loading
async function loadProfile() {
    try {
        const data = await apiCall('/profile');
        
        // Update profile fields
        if (document.getElementById('userMobile')) {
            document.getElementById('userMobile').textContent = data.mobile;
        }
        
        if (document.getElementById('walletBalance')) {
            document.getElementById('walletBalance').textContent = `₹${data.wallet || 0}`;
        }
        
        if (document.getElementById('totalWagered')) {
            document.getElementById('totalWagered').textContent = `₹${data.totalWagered || 0}`;
        }
        
        // Additional fields if they exist
        if (document.getElementById('bonusBalance')) {
            document.getElementById('bonusBalance').textContent = `₹${data.bonus || 0}`;
        }
        
        if (document.getElementById('depositedStatus')) {
            document.getElementById('depositedStatus').textContent = 
                data.deposited ? '✅ Yes' : '❌ No';
        }
        
        return data;
        
    } catch (error) {
        console.error('Load profile error:', error);
        
        // If session expired, logout
        if (error.message.includes('Session expired')) {
            logout();
        }
        
        return null;
    }
}

// Enhanced logout
function logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('adminToken');
    window.location.href = 'index.html';
}

// Auto-load profile on page load
document.addEventListener('DOMContentLoaded', function() {
    if (document.getElementById('userMobile')) {
        loadProfile();
    }
});

// Expose functions globally
window.loadProfile = loadProfile;
window.logout = logout;
