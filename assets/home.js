(function(){
  var g=document.getElementById('grid-demo');if(!g)return;
  var messy=[["ord#1023","shopify-store","9/2","duplicate"],["ORD_1023","Shopify Store","2024-09-02","duplicate"],["ord1024","shopify_store","09-02-24","(blank)"]];
  var clean=[["ORD-1023","Shopify Store","2024-09-02","Kept"],["ORD-1023","Shopify Store","2024-09-02","Archived"],["ORD-1024","Shopify Store","2024-09-02","Kept"]];
  var reduce=window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches;
  var d=0;
  messy.forEach(function(row,r){row.forEach(function(v,c){
    var cell=document.createElement('div');cell.className='cell messy';
    var o=document.createElement('span');o.className='swap-out';o.textContent=v;o.style.setProperty('--d',d+'s');
    var i=document.createElement('span');i.className='swap-in';i.textContent=clean[r][c];i.style.setProperty('--d',(d+.35)+'s');
    cell.appendChild(o);cell.appendChild(i);
    if(reduce)cell.className='cell clean';else setTimeout(function(){cell.classList.add('clean');},(d+.35)*1000);
    g.appendChild(cell);d+=.06;
  });});
})();
