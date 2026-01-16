// Set quick amount
function setAmount(value) {
    document.getElementById("amount").value = value;
}

// Check if withdrawal method is set
async function checkWithdrawalMethod() {
    try {
        const profile = await apiCall('/profile');
        
        if (!profile.withdrawMethod || !profile.withdrawDetails) {
            alert('Please set your withdrawal method first!');
            window.location.href = 'withdrawal-method.html';
            return false;
        }
        
        return true;
    } catch (error) {
        console.error('Check withdrawal method error:', error);
        return false;
    }
}

// Enhanced withdraw function
async function withdraw() {
    try {
        const amount = Number(document.getElementById("amount").value);
        
        // Validation
        if (!amount || amount < 100) {
            alert("Minimum withdrawal is ₹100");
            return;
        }
        
        // Check withdrawal method
        const hasMethod = await checkWithdrawalMethod();
        if (!hasMethod) return;
        
        // Show loading
        const button = document.querySelector('button[onclick="withdraw()"]');
        const originalText = button.textContent;
        button.textContent = 'Processing...';
        button.disabled = true;
        
        // Make API call
        const result = await apiCall('/withdraw', {
            method: 'POST',
            body: JSON.stringify({ amount })
        });
        
        // Show success
        alert('Withdrawal request submitted successfully! It will be processed by admin.');
        
        // Clear input
        document.getElementById("amount").value = '';
        
        // Redirect to wallet
        window.location.href = 'wallet.html';
        
    } catch (error) {
        console.error('Withdraw error:', error);
        // Error already shown by apiCall wrapper
    } finally {
        // Restore button
        const button = document.querySelector('button[onclick="withdraw()"]');
        if (button) {
            button.textContent = 'Submit Withdrawal';
            button.disabled = false;
        }
    }
}

// Load withdrawal method on page load
async function loadWithdrawalMethod() {
    try {
        const profile = await apiCall('/profile');
        const methodStatus = document.getElementById('methodStatus');
        
        if (!methodStatus) return;
        
        if (profile.withdrawMethod && profile.withdrawDetails) {
            let details = '';
            if (profile.withdrawMethod === 'upi') {
                details = `UPI: ${profile.withdrawDetails.upiId}`;
            } else if (profile.withdrawMethod === 'bank') {
                details = `Bank: ${profile.withdrawDetails.accountNumber?.slice(-4)}`;
            }
            
            methodStatus.innerHTML = `<span style="color: #22c55e;">✅ ${details}</span>`;
        } else {
            methodStatus.innerHTML = '<span style="color: #f59e0b;">⚠️ No withdrawal method set</span>';
        }
    } catch (error) {
        console.error('Load withdrawal method error:', error);
    }
}

// Load withdrawal history
async function loadWithdrawHistory() {
    try {
        const data = await apiCall('/wallet/withdraw-history');
        
        const container = document.getElementById('withdrawHistory');
        if (!container) return;
        
        if (!data || data.length === 0) {
            container.innerHTML = '<p class="empty">No withdrawals found</p>';
            return;
        }
        
        container.innerHTML = data.map(withdrawal => {
            let statusClass = '';
            let statusText = withdrawal.status;
            
            switch(withdrawal.status) {
                case 'PENDING':
                    statusClass = 'pending';
                    statusText = '⏳ Pending';
                    break;
                case 'APPROVED':
                    statusClass = 'approved';
                    statusText = '✅ Approved';
                    break;
                case 'REJECTED':
                    statusClass = 'rejected';
                    statusText = '❌ Rejected';
                    break;
            }
            
            return `
                <div class="history-item">
                    <div>
                        <strong>Withdrawal</strong>
                        <div class="date">${new Date(withdrawal.createdAt).toLocaleString()}</div>
                    </div>
                    <div class="amount">
                        ₹${withdrawal.amount}
                        <div class="status ${statusClass}">${statusText}</div>
                    </div>
                </div>
            `;
        }).join('');
        
    } catch (error) {
        console.error('Load withdraw history error:', error);
        const container = document.getElementById('withdrawHistory');
        if (container) {
            container.innerHTML = '<p class="error">Failed to load withdrawal history</p>';
        }
    }
}

// Auto-load on page load
document.addEventListener('DOMContentLoaded', function() {
    loadWithdrawalMethod();
    if (document.getElementById('withdrawHistory')) {
        loadWithdrawHistory();
    }
});

// Expose functions globally
window.setAmount = setAmount;
window.withdraw = withdraw;
