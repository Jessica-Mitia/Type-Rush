// JavaScript pour ajouter des interactions
document.addEventListener('DOMContentLoaded', function() {
  // Gestion des menus dropdown
  const dropdowns = document.querySelectorAll('.dropdown');
  
  dropdowns.forEach(dropdown => {
    const btn = dropdown.querySelector('.dropdown-btn');
    const menu = dropdown.querySelector('.dropdown-menu');
    const items = dropdown.querySelectorAll('.dropdown-item');
    
    btn.addEventListener('click', function() {
      // Fermer tous les autres menus ouverts
      dropdowns.forEach(d => {
        if (d !== dropdown) {
          d.querySelector('.dropdown-menu').classList.remove('show');
        }
      });
      
      // Basculer la visibilité du menu
      menu.classList.toggle('show');
    });
    
    // Fermer le menu si on clique ailleurs
    document.addEventListener('click', function(e) {
      if (!dropdown.contains(e.target)) {
        menu.classList.remove('show');
      }
    });
    
    // Gestion des items du menu
    items.forEach(item => {
      item.addEventListener('click', function() {
        // Mettre à jour le texte du bouton
        const itemText = this.querySelector('span:not(.dropdown-item-icon)').textContent;
        btn.querySelector('span').textContent = itemText.trim();
        
        // Mettre à jour l'élément actif
        items.forEach(i => i.classList.remove('active'));
        this.classList.add('active');
        
        // Fermer le menu
        menu.classList.remove('show');
      });
    });
  });
  
  // Animation des lignes du tableau
  const rows = document.querySelectorAll('.leaderboard tbody tr');
  rows.forEach(row => {
    row.addEventListener('mouseenter', function() {
      const rankElement = this.querySelector('.rank');
      if (rankElement) {
        rankElement.style.transform = 'scale(1.1)';
        rankElement.style.transition = 'transform 0.2s ease';
      }
    });
    
    row.addEventListener('mouseleave', function() {
      const rankElement = this.querySelector('.rank');
      if (rankElement) {
        rankElement.style.transform = 'scale(1)';
      }
    });
  });
  
  // Compteur pour la mise à jour
  let seconds = 500; // 8:20 en secondes
  const updateElement = document.querySelector('.update-info');
  
  function updateCounter() {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    updateElement.textContent = `Next update in: ${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
    
    if (seconds > 0) {
      seconds--;
      setTimeout(updateCounter, 1000);
    }
  }
  
  updateCounter();
});
