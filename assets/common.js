(function(){
  var m=document.querySelector('details.menu');
  if(!m)return;
  m.addEventListener('click',function(ev){if(ev.target.closest('a'))m.removeAttribute('open');});
  document.addEventListener('keydown',function(ev){if(ev.key==='Escape')m.removeAttribute('open');});
})();
