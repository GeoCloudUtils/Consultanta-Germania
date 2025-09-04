// reveal on scroll for .services cards + set year
(function(){
  const y = document.getElementById('year');
  if (y) y.textContent = new Date().getFullYear();
  const cards = document.querySelectorAll('.services .card');
  if (!('IntersectionObserver' in window)) { cards.forEach(c=>c.classList.add('in')); return; }
  const io = new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target);} });
  }, {threshold:.15});
  cards.forEach(c=>io.observe(c));
})();