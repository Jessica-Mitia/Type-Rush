// Basic JavaScript to handle tab switching
document.querySelectorAll('.tab-btn').forEach(button => {
    button.addEventListener('click', function() {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        this.classList.add('active');
    });
});

document.querySelectorAll('.filter-btn').forEach(button => {
    button.addEventListener('click', function() {
        const parent = this.parentElement;
        parent.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        this.classList.add('active');
    });
});