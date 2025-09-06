export function extraerValoresPorAtributo(escenarios, atributo) {
    if (!Array.isArray(escenarios) || escenarios.length === 0) {
      return [];
    }
  
    return escenarios
      .map(escenario => escenario[atributo])
      .filter(valor => typeof valor === 'number');
  }