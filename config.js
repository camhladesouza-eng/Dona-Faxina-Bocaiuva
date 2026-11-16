/* Edite os valores de exemplo antes de publicar.
   Preços em reais. Serviços especiais ficam como orçamento sob avaliação.
   Repita os mesmos valores no arquivo api/pricing.js para o checkout calcular no servidor. */
window.DONA_CONFIG = {
  city: "Bocaiúva",
  currency: "BRL",
  services: [
    {id:"express", name:"Faxina Express", duration:2, price:0, description:"Limpeza prática para manutenção do dia a dia.", tag:"2 horas", image:""},
    {id:"manutencao", name:"Faxina de manutenção", duration:3, price:0, description:"Cuidado regular para manter a casa em ordem.", tag:"3 horas", image:""},
    {id:"completa", name:"Faxina completa", duration:4, price:0, description:"Limpeza geral mais detalhada dos ambientes.", tag:"4 horas", image:""},
    {id:"tradicional", name:"Faxina tradicional", duration:null, price:null, description:"Limpeza geral da residência, conforme avaliação.", tag:"Sob consulta"},
    {id:"pesada", name:"Faxina pesada", duration:null, price:null, description:"Limpeza detalhada para ambientes que precisam de atenção extra.", tag:"Sob consulta"},
    {id:"mudanca", name:"Limpeza pré e pós-mudança", duration:null, price:null, description:"Preparação ou limpeza do imóvel após a mudança.", tag:"Sob consulta"},
    {id:"organizacao", name:"Organização residencial", duration:null, price:null, description:"Organização funcional dos espaços da casa.", tag:"Sob consulta"},
    {id:"quartos", name:"Organização de quartos e armários", duration:null, price:null, description:"Organização de roupas, armários e quartos.", tag:"Sob consulta"},
    {id:"pos-festa", name:"Limpeza pós-festa", duration:null, price:null, description:"Orçamento especial conforme tamanho do evento.", tag:"Orçamento especial"},
    {id:"pos-obra", name:"Limpeza pós-obra", duration:null, price:null, description:"Remoção de resíduos e limpeza após reforma ou obra.", tag:"Orçamento especial"}
  ],
  addons: [
    {id:"lavar-roupas", name:"Lavar roupas", price:0},
    {id:"lavar-loucas", name:"Lavar louças", price:0},
    {id:"passar-roupas", name:"Passar roupas", price:0}
  ],
  /* Deixe vazio até configurar uma API de backend HTTPS. */
  apiBaseUrl: ""
};
