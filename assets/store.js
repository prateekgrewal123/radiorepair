
(function(){
const CK='rre_cart', UK='rre_user', OK='rre_orders';
const get=(k,d)=>{try{return JSON.parse(localStorage.getItem(k))||d}catch(e){return d}};
const put=(k,v)=>localStorage.setItem(k,JSON.stringify(v));
const cart=()=>get(CK,[]);
const money=n=>'$'+Number(n).toFixed(2);
function badge(){let n=cart().reduce((a,x)=>a+Number(x.qty||0),0);document.querySelectorAll('.cart-count').forEach(e=>{e.textContent=n;e.hidden=!n})}
function mobileMenu(){
 const b=document.getElementById('mobile-menu-btn'), p=document.getElementById('mobile-menu-panel');
 if(!b||!p)return;
 b.onclick=()=>{const open=p.classList.toggle('open');b.setAttribute('aria-expanded',open?'true':'false');b.textContent=open?'×':'☰'};
 p.querySelectorAll('a').forEach(a=>a.addEventListener('click',()=>{p.classList.remove('open');b.setAttribute('aria-expanded','false');b.textContent='☰'}));
}
function add(item){let c=cart(),x=c.find(a=>a.id===item.id);x?x.qty++:c.push({...item,qty:1});put(CK,c);badge();alert('Added to cart');}
function productButtons(){
 document.querySelectorAll('.product').forEach(card=>{
  let a=card.querySelector('a[href^="product-"]'),h=card.querySelector('h3'),p=card.querySelector('.price'),im=card.querySelector('img');
  if(!a||!h||!p||card.querySelector('.local-add'))return;
  let b=document.createElement('button');b.className='btn orange local-add';b.textContent='Add to Cart';
  b.onclick=()=>add({id:a.getAttribute('href'),title:h.textContent.trim(),price:parseFloat(p.textContent.replace(/[^0-9.]/g,'')),image:im?.src||''});
  a.parentNode.insertBefore(b,a);
 });
}
function cartPage(){
 let r=document.querySelector('#cart-root');if(!r)return;let c=cart();
 if(!c.length){r.innerHTML='<div class="empty-cart"><h2>Your cart is empty</h2><p>Browse our refurbished equipment.</p><a class="btn primary" href="shop.html">Shop Equipment</a></div>';return}
 r.innerHTML='<div class="cart-layout"><div>'+c.map(x=>`<article class="cart-item"><img src="${x.image}" alt=""><div><h3>${x.title}</h3><b>${money(x.price)}</b><div class="qty"><button data-m="${x.id}">−</button><input value="${x.qty}" data-q="${x.id}"><button data-p="${x.id}">+</button></div><button class="remove-item" data-r="${x.id}">Remove</button></div><strong>${money(x.price*x.qty)}</strong></article>`).join('')+'</div><aside class="cart-summary"><h2>Order Summary</h2><div class="summary-row"><span>Subtotal</span><strong>'+money(c.reduce((a,x)=>a+x.price*x.qty,0))+'</strong></div><p class="muted">Payment: Cash on Delivery</p><a class="btn primary full" href="checkout.html">Checkout</a></aside></div>';
 r.querySelectorAll('[data-r]').forEach(b=>b.onclick=()=>{put(CK,c.filter(x=>x.id!==b.dataset.r));cartPage();badge()});
 r.querySelectorAll('[data-p]').forEach(b=>b.onclick=()=>{let x=c.find(x=>x.id===b.dataset.p);x.qty++;put(CK,c);cartPage();badge()});
 r.querySelectorAll('[data-m]').forEach(b=>b.onclick=()=>{let x=c.find(x=>x.id===b.dataset.m);x.qty=Math.max(1,x.qty-1);put(CK,c);cartPage();badge()});
}
function account(){
 let r=document.querySelector('#account-root');if(!r)return;let u=get(UK,null),orders=get(OK,[]);
 if(!u){r.innerHTML='<div class="account-grid"><div class="auth-card"><h2>Create Customer Account</h2><form id="signup"><label>Name<input required name="name"></label><label>Email<input required type="email" name="email"></label><label>Password<input required minlength="6" type="password" name="password"></label><button class="btn primary" type="submit">Create Account</button></form></div></div>';r.querySelector('form').onsubmit=e=>{e.preventDefault();let f=new FormData(e.target);put(UK,{name:f.get('name'),email:f.get('email')});account()};return}
 r.innerHTML='<div class="account-head"><div><span class="tag">MY ACCOUNT</span><h2>Welcome, '+u.name+'</h2><p>'+u.email+'</p></div><button class="btn" id="logout">Log Out</button></div><div class="auth-card"><h3>Order History</h3>'+(orders.length?orders.map(o=>'<div class="order-row"><b>'+o.number+'</b><span>'+new Date(o.date).toLocaleDateString()+'</span><strong>'+money(o.total)+'</strong></div>').join(''):'<p class="muted">No orders yet.</p>')+'</div>';
 r.querySelector('#logout').onclick=()=>{localStorage.removeItem(UK);account()};
}
function checkout(){
 let r=document.querySelector('#checkout-root');if(!r)return;let c=cart();if(!c.length){r.innerHTML='<div class="empty-cart"><h2>Your cart is empty</h2><a class="btn primary" href="shop.html">Shop</a></div>';return}
 let total=c.reduce((a,x)=>a+x.price*x.qty,0);
 r.innerHTML='<div class="checkout-grid"><form id="order-form" class="auth-card"><span class="tag">CASH ON DELIVERY</span><h2>Delivery Details</h2><label>Full name<input required name="name"></label><label>Email<input required type="email" name="email"></label><label>Phone<input required name="phone"></label><label>Address<input required name="address"></label><label>City<input required name="city"></label><label>State<input required name="state"></label><label>ZIP<input required name="zip"></label><button class="btn primary full">Place COD Order</button></form><aside class="cart-summary"><h2>Your Order</h2>'+c.map(x=>'<div class="summary-row"><span>'+x.title+' × '+x.qty+'</span><strong>'+money(x.price*x.qty)+'</strong></div>').join('')+'<hr><div class="summary-row total"><span>Total</span><strong>'+money(total)+'</strong></div></aside></div>';
 r.querySelector('form').onsubmit=e=>{e.preventDefault();let f=new FormData(e.target),o={number:'RRE-'+Date.now().toString().slice(-8),date:new Date().toISOString(),total,items:c,customer:Object.fromEntries(f)};let os=get(OK,[]);os.unshift(o);put(OK,os);localStorage.removeItem(CK);location.href='order-success.html?order='+o.number};
}
document.addEventListener('DOMContentLoaded',()=>{badge();productButtons();cartPage();account();checkout();mobileMenu()});
})();
