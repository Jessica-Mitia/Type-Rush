// Make sidebar navigation items interactive
document.querySelectorAll('.nav-item').forEach(item => {
    item.addEventListener('click', function() {
        // If it's in the same group as another active item, deactivate that one
        const isInTestModeGroup = this.parentElement.querySelector('.sidebar-title').textContent.includes('Test Mode');
        const isInLeaderboardGroup = this.parentElement.querySelector('.sidebar-title').textContent.includes('Leaderboards');
        
        if (isInTestModeGroup) {
            document.querySelectorAll('.sidebar-group').forEach(group => {
                if (group.querySelector('.sidebar-title').textContent.includes('Test Mode')) {
                    group.querySelectorAll('.nav-item').forEach(navItem => {
                        navItem.classList.remove('active');
                    });
                }
            });
        } else if (isInLeaderboardGroup) {
            document.querySelectorAll('.sidebar-group').forEach(group => {
                if (group.querySelector('.sidebar-title').textContent.includes('Leaderboards')) {
                    group.querySelectorAll('.nav-item').forEach(navItem => {
                        navItem.classList.remove('active');
                    });
                }
            });
        }
        
        this.classList.add('active');
    });
});

// Add interactions for toolbar buttons
document.querySelectorAll('.action-btn').forEach(btn => {
    btn.addEventListener('click', function() {
        // Simulate some action feedback
        this.style.backgroundColor = 'rgba(255, 255, 255, 0.1)';
        setTimeout(() => {
            this.style.backgroundColor = '';
        }, 300);
    });
});

// Add hover effect to table rows
document.querySelectorAll('.leaderboard-table tbody tr').forEach(row => {
    row.addEventListener('mouseenter', function() {
        this.style.backgroundColor = 'rgba(255, 255, 255, 0.05)';
    });
    
    row.addEventListener('mouseleave', function() {
        this.style.backgroundColor = '';
    });
});
