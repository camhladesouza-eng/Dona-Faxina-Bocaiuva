(() => {
  const cfg = window.DONA_CONFIG;
  const $ = (s) => document.querySelector(s);
  const money = (v) => v == null ? "Sob orçamento" : Number(v).toLocaleString("pt-BR",{style:"currency",currency:"BRL"});
  const serviceCards = $("#serviceCards");
  const select = $("#serviceSelect");
  let lastQuote = null;

  $("#year").textContent = new Date().getFullYear();
  const today = new Date(); today.setMinutes(today.getMinutes()-today.getTimezoneOffset());
  $("#bookingDate").min = today.toISOString().slice(0,10);

  cfg.services.forEach((s,i) => {
    const card = document.createElement("article");
    card.className = "service-card";
    card.innerHTML = `<div class="service-visual visual-${i%4}"><span>${["✧","⌂","✦","◈"][i%4]}</span><small>${s.tag}</small></div><div class="service-card-body"><h3>${s.name}</h3><p>${s.description}</p><div class="service-bottom"><strong>${s.price == null ? "Orçamento especial" : s.price === 0 ? "Preço a configurar" : money(s.price)}</strong><button type="button" data-service="${s.id}" aria-label="Selecionar ${s.name}">Escolher →</button></div></div>`;
    serviceCards.appendChild(card);
    const opt = document.createElement("option"); opt.value=s.id; opt.textContent=s.name; select.appendChild(opt);
  });
  cfg.addons.forEach(a => {
    const label=document.createElement("label"); label.className="addon";
    label.innerHTML=`<input type="checkbox" value="${a.id}"><span>${a.name}</span><b>${a.price ? "+ "+money(a.price) : "valor a configurar"}</b>`;
    $("#addonList").appendChild(label);
  });

  function quote() {
    const s=cfg.services.find(x=>x.id===select.value);
    const selected=[...$("#addonList").querySelectorAll("input:checked")].map(x=>cfg.addons.find(a=>a.id===x.value));
    if(!s){$("#quotePrice").textContent="Selecione um serviço";return null;}
    if(s.price==null){$("#quotePrice").textContent="Orçamento especial";$("#quoteDuration").textContent="A equipe avaliará sua solicitação";$("#quoteDisclaimer").textContent="Este serviço exige avaliação e orçamento individual. Nenhum pagamento será solicitado nesta etapa.";return {service:s,addons:selected,total:null};}
    if(s.price===0 || selected.some(a=>a.price===0)){ $("#quotePrice").textContent="Preço a configurar"; $("#quoteDuration").textContent=s.duration ? `${s.duration} horas estimadas` : "Duração a confirmar"; $("#quoteDisclaimer").textContent="A empresa precisa cadastrar os preços dos serviços e adicionais antes de receber pedidos com cobrança online."; return {service:s,addons:selected,total:null};}
    const total=s.price+selected.reduce((sum,a)=>sum+a.price,0);
    $("#quotePrice").textContent=money(total);$("#quoteDuration").textContent=`${s.duration} horas estimadas`;
    $("#quoteDisclaimer").textContent="Estimativa sujeita à confirmação de disponibilidade e escopo do serviço.";
    return {service:s,addons:selected,total};
  }
  select.addEventListener("change",quote);$("#addonList").addEventListener("change",quote);
  serviceCards.addEventListener("click",e=>{const b=e.target.closest("[data-service]");if(!b)return;select.value=b.dataset.service;quote();$("#agendar").scrollIntoView({behavior:"smooth"});});
  $("#bookingForm").addEventListener("submit",async e=>{
    e.preventDefault(); const q=quote(); const feedback=$("#bookingFeedback");
    if(!q){feedback.textContent="Escolha um serviço.";return;}
    const date=$("#bookingDate").value;
    if(!date || date<today.toISOString().slice(0,10)){feedback.textContent="Escolha uma data válida.";return;}
    const booking={id:"DF-"+Date.now(),createdAt:new Date().toISOString(),service:q.service.name,serviceId:q.service.id,addons:q.addons.map(a=>a.name),total:q.total,date,time:$("#bookingTime").value,name:$("#customerName").value.trim(),phone:$("#customerPhone").value.trim(),address:$("#customerAddress").value.trim(),notes:$("#customerNotes").value.trim(),status:"Solicitação recebida"};
    if(!booking.time){feedback.textContent="Escolha o horário desejado.";return;}
    if(!booking.address.toLowerCase().includes("bocaiúva") && !booking.address.toLowerCase().includes("bocaiuva")){feedback.textContent="Por enquanto, informe um endereço dentro de Bocaiúva – MG.";return;}
    if(q.service.price==null || q.total==null){
      saveLocal(booking); feedback.textContent="Solicitação registrada neste navegador como demonstração. A equipe deverá avaliar e confirmar o orçamento.";
      alert("Solicitação de orçamento registrada nesta demonstração. Ainda não foi enviada para a equipe.");
      return;
    }
    if(!cfg.apiBaseUrl){saveLocal(booking);feedback.textContent="Demonstração: o preço está configurado, mas falta conectar o backend seguro e o Mercado Pago. Nenhuma cobrança foi realizada.";alert("Pedido salvo somente neste navegador. Configure o backend antes de receber pagamentos.");return;}
    try{
      feedback.textContent="Preparando pagamento seguro…";
      const res=await fetch(cfg.apiBaseUrl.replace(/\/$/,"")+"/api/create-preference",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify({serviceId:q.service.id,addonIds:q.addons.map(a=>a.id),booking})});
      const data=await res.json();if(!res.ok)throw new Error(data.error||"Não foi possível iniciar o pagamento.");
      saveLocal(booking);window.location.href=data.init_point;
    }catch(err){feedback.textContent=err.message;}
  });
  function saveLocal(b){const arr=JSON.parse(localStorage.getItem("donaFaxinaDemoBookings")||"[]");arr.unshift(b);localStorage.setItem("donaFaxinaDemoBookings",JSON.stringify(arr));}
  $("#loginOpen").addEventListener("click",()=>$("#loginModal").hidden=false);
  $("#loginClose").addEventListener("click",()=>$("#loginModal").hidden=true);
  $("#loginModal").addEventListener("click",e=>{if(e.target.id==="loginModal")$("#loginModal").hidden=true;});
  $("#menuToggle").addEventListener("click",()=>document.querySelector(".desktop-nav").classList.toggle("nav-open"));
  quote();
})();
