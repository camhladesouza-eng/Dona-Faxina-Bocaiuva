// Os valores devem ser iguais aos de config.js. Configure antes de habilitar pagamentos.
module.exports = {
  services: {
    express: {name:"Faxina Express (2 horas)", price:0},
    manutencao: {name:"Faxina de manutenção (3 horas)", price:0},
    completa: {name:"Faxina completa (4 horas)", price:0}
  },
  addons: {
    "lavar-roupas": {name:"Lavar roupas", price:0},
    "lavar-loucas": {name:"Lavar louças", price:0},
    "passar-roupas": {name:"Passar roupas", price:0}
  }
};
