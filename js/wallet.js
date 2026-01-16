// Fixed wallet.js or inline script in wallet.html

async function loadWalletData() {
  try {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = 'index.html';
      return;
    }

    // Fetch wallet info
    const res = await fetch(`${API}/wallet`, {
      headers: { 'Authorization': `Bearer ${token}` }
    });

    if (!res.ok) {
      throw new Error('Failed to fetch wallet data');
    }

    const data = await res.json();

    // Update UI with proper formatting
    document.getElementById('walletBalance').textContent = 
      `₹ ${parseFloat(data.wallet || 0).toFixed(2)}`;
    
    document.getElementById('bonusBalance').textContent = 
      `₹ ${parseFloat(data.bonus || 0).toFixed(2)}`;
    
    document.getElementById('totalWagered').textContent = 
      `₹ ${parseFloat(data.totalWagered || 0).toFixed(2)}`;
    
    // Show deposit status
    const depositedText = data.deposited ? 'Yes' : 'No';
    document.getElementById('deposited').textContent = depositedText;

    // Calculate wagering progress if needed
    if (!data.deposited) {
      document.getElementById('wageringProgress').textContent = 
        'Complete your first deposit to unlock withdrawals';
    } else {
      const required = (data.depositAmount || 0) + (data.bonus || 0);
      const progress = Math.min(100, ((data.totalWagered || 0) / required) * 100);
      
      document.getElementById('wageringProgress').textContent = 
        `Wagering: ₹${data.totalWagered.toFixed(2)} / ₹${required.toFixed(2)} (${progress.toFixed(0)}%)`;
    }

  } catch (err) {
    console.error('Wallet load error:', err);
    alert('Failed to load wallet data. Please refresh the page.');
  }
}

// Call on page load
document.addEventListener('DOMContentLoaded', loadWalletData);

// Also update the /wallet endpoint in server.js to ensure it returns all fields
// Add this to your server.js:

app.get('/wallet', authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ mobile: req.user.mobile });
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      wallet: parseFloat(user.wallet || 0).toFixed(2),
      bonus: parseFloat(user.bonus || 0).toFixed(2),
      totalWagered: parseFloat(user.totalWagered || 0).toFixed(2),
      deposited: user.deposited || false,
      depositAmount: parseFloat(user.depositAmount || 0).toFixed(2)
    });

  } catch (err) {
    console.error('Wallet fetch error:', err);
    res.status(500).json({ message: 'Error fetching wallet data' });
  }
});
