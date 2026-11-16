// Vercel Serverless Function: cria checkout no Mercado Pago.
const PRICES = require("./pricing");
module.exports = async (req, res) => {
  res.setHeader("Access-Control-Allow-Origin", process.env.ALLOWED_ORIGIN || "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type");
  if (req.method === "OPTIONS") return res.status(200).end();
  if (req.method !== "POST") return res.status(405).json({error:"Método não permitido."});
  if (!process.env.MP_ACCESS_TOKEN) return res.status(500).json({error:"Mercado Pago não configurado no servidor."});
  try {
    const {serviceId, addonIds = [], booking = {}} = req.body || {};
    const service = PRICES.services[serviceId];
    if (!service || !Number.isFinite(service.price) || service.price <= 0) return res.status(400).json({error:"Serviço sem preço cadastrado. Solicite orçamento."});
    const addons = addonIds.map(id => PRICES.addons[id]).filter(Boolean);
    if (addons.length !== addonIds.length) return res.status(400).json({error:"Adicional inválido."});
    const total = service.price + addons.reduce((sum,a)=>sum+a.price,0);
    if (!booking.name || !booking.phone || !booking.address || !booking.date || !booking.time) return res.status(400).json({error:"Preencha todos os dados obrigatórios."});
    const origin = process.env.SITE_URL;
    if (!origin) return res.status(500).json({error:"Configure SITE_URL nas variáveis do servidor."});
    const payload = {
      items: [{title:`Dona Faxina - ${service.name}`, quantity:1, currency_id:"BRL", unit_price:Number(total.toFixed(2))}],
      payer: {name:String(booking.name).slice(0,100)},
      external_reference: `DF-${Date.now()}`,
      statement_descriptor: "DONA FAXINA",
      payment_methods: {excluded_payment_types:[{id:"ticket"}]},
      back_urls: {success:`${origin}/?pagamento=sucesso`, pending:`${origin}/?pagamento=pendente`, failure:`${origin}/?pagamento=falhou`},
      auto_return:"approved",
      notification_url: process.env.MP_WEBHOOK_URL || undefined,
      metadata: {service_id:serviceId, addons:addonIds, booking_date:booking.date, booking_time:booking.time, customer_phone:String(booking.phone).slice(0,30)}
    };
    const response = await fetch("https://api.mercadopago.com/checkout/preferences", {
      method:"POST",
      headers:{"Authorization":`Bearer ${process.env.MP_ACCESS_TOKEN}`,"Content-Type":"application/json"},
      body:JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok) return res.status(502).json({error:"Mercado Pago não aceitou a solicitação.", detail:data.message || data.error});
    return res.status(200).json({init_point:data.init_point, preference_id:data.id});
  } catch (e) {
    return res.status(500).json({error:"Erro ao iniciar o pagamento."});
  }
};
