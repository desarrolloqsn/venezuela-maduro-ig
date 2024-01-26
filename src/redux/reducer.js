import datosGraficosBase from './../datos/datos_globales_graficos.json'
import Fechas from './../datos/rango_fechas.json'

const initialState = {
  clientes:[],
  usuarios:[],
  roles:[],
  
  datosGraficos: [datosGraficosBase],
 datosFiltrados:[...datosGraficosBase],
datosParaFiltros: [...datosGraficosBase],
  //  datosGraficos: [],
  // datosFiltrados:[],
  // datosParaFiltros: [],
  datosPeriodoActual: [],
  datosPeriodoAnterior:[],
  presenciaEnRedesSociales: {
   actores: 0,
   eventos: 0
 },
  rangoFechas:Fechas.fechas,

  fechaInicio: null,
  fechaFin: null,
  horaInicio: null,
  horaFin: null,
  user: null,
  error: '',
  filtros:[]
}



const rootReducer = (state = initialState, action) => {
    switch (action.type) {
        case "GET_CLIENTE":
            return {
                ...state,
                clientes: action.payload,

            }

            case 'GUARDAR_FECHAS':
      return {
        ...state,
        fechaInicio: action.fechaInicio,
        fechaFin: action.fechaFin,
      };
    case 'GUARDAR_HORAS':
      return {
        ...state,
        horaInicio: action.horaInicio,
        horaFin: action.horaFin,
      };
            case "GET_USUARIOS":
                return {
                    ...state,
                    usuarios: action.payload,
    
                }
                case "GET_ROLES":
                    return {
                        ...state,
                        roles: action.payload,
        
                    }
                    case "POST_CLIENTE":
                        return {
                            ...state,
                            clientes: action.payload,
            
                        }
                        case "POST_USUARIOS":
                            return {
                                ...state,
                                usuarios: action.payload,
                
                            }
                  

                                case "ACTUALIZAR_PRESENCIA_REDES_SOCIALES":
                                    
                                    return {
                                      ...state,
                                      presenciaEnRedesSociales: {
                                        ...state.presenciaEnRedesSociales,
                                        actores: action.payload.actores,
                                        eventos: action.payload.eventos,
                                    
                                      }
                                    };

                                    case 'FILTRAR_DATOS':
  const { filtros } = action;

  let datosFiltradosNuevo = []
  // console.log("DATOS",filtros.datos)
  if(filtros.datos.length !== state.datosGraficos.length){
   
     datosFiltradosNuevo = filtros.datos

  } else {
    datosFiltradosNuevo = state.datosGraficos;
  }

  if(filtros.palabra.length === 0 && filtros.sinpalabra.length === 0){
    // console.log("ESTOY EN ARRAY VACIO")
    datosFiltradosNuevo = state.datosParaFiltros;
  }
  

  if (filtros.palabra.length > 0 || filtros.sinpalabra.length > 0) {
    // console.log("FILTRO",filtros.palabra)
    // console.log("sinpalabra",filtros.sinpalabra)
    // console.log("datos",filtros.datos)
    let twitsFiltrados = [] 
    let twitsFiltrados2 =[]
    let twitsExcluidos = datosFiltradosNuevo
    let contador = 0

    
  
  
  
    for (let j = 0; j < filtros.palabra.length; j++) {
      // console.log(datosFiltradosNuevo)
      if(filtros.palabra.length === 1){
        // console.log("ESTOY ACA")
        twitsFiltrados = datosFiltradosNuevo
        twitsFiltrados2.push(twitsFiltrados);
       }
    contador = contador + filtros.palabra.length 
    let palabras = filtros.palabra[j].split(",").map(palabra => palabra.toLowerCase().trim());
    //  console.log("PALABRAS[0]",palabras)
     for (let i = 0; i < palabras.length; i++) {
      if (palabras[i].includes("-")) {
       contador = contador + 1
      }
     }
     
     twitsFiltrados = datosFiltradosNuevo.filter(twit => {
      let textoTwit = twit.texto.toLowerCase();
      return palabras.some(palabra => {
        if (palabra.includes("-")) {
          let bloques = palabra.split("-")        
          for (let i = 0; i < bloques.length; i++) {
            if (bloques[i].startsWith('@')) {
              const nombreUsuario = bloques[i].substring(1);
              let datosNuevosUsuarioOriginal = twit.usuarioOriginal.toLowerCase() === nombreUsuario || (filtros.anidados && twit.usuarioCategorizador.includes(nombreUsuario))
              datosFiltradosNuevo = datosNuevosUsuarioOriginal
              return twit.usuarioOriginal.toLowerCase() === nombreUsuario || (filtros.anidados && twit.usuarioCategorizador.includes(nombreUsuario));
            } 
          }
          return bloques.every(bloque => textoTwit.includes(bloque.trim()));
        } 
        else if (palabra.startsWith('@')){
            const nombreUsuario = palabra.substring(1);
            const categorizador = twit.usuarioCategorizador.map(palabra => palabra.toLowerCase().trim());
            return twit.usuarioOriginal.toLowerCase() === nombreUsuario || (filtros.anidados && categorizador.includes(nombreUsuario));
          } 
      else {
        return textoTwit.includes(palabra)
        }
      });
    });
    // console.log("twitsfiltrados",twitsFiltrados)
    twitsFiltrados2.push(twitsFiltrados);
    }
  
  
    for (let j = 0; j < filtros.sinpalabra.length; j++) {
      if(filtros.sinpalabra.length === 1){
        // console.log("ESTOY ACA")
        twitsExcluidos = datosFiltradosNuevo
        twitsFiltrados2.push(twitsExcluidos);
       }
       contador = contador + filtros.sinpalabra.length 
      let palabras = filtros.sinpalabra[j].split(",").map(palabra => palabra.toLowerCase().trim());
      //  console.log("PALABRAS[0]",palabras[0].length)
       for (let i = 0; i < palabras.length; i++) {
       if (palabras[i].includes("-")) {
        contador = contador + 1
       }
      }

       twitsExcluidos = datosFiltradosNuevo.filter(twit => {
        let textoTwit = twit.texto.toLowerCase();
        return !palabras.some(palabra => {
          if (palabra.includes("-")) {
            let bloques = palabra.split("-");           
            for (let i = 0; i < bloques.length; i++) {
              if (bloques[i].startsWith('@')) {
                const nombreUsuario = bloques[i].substring(1);
                let datosNuevosUsuarioOriginal = twit.usuarioOriginal.toLowerCase() === nombreUsuario || (filtros.anidados && twit.usuarioCategorizador.includes(nombreUsuario))
                datosFiltradosNuevo = datosNuevosUsuarioOriginal
                return twit.usuarioOriginal.toLowerCase() === nombreUsuario || (filtros.anidados && twit.usuarioCategorizador.includes(nombreUsuario));
              } 
            }
            return bloques.every(bloque => textoTwit.includes(bloque.trim()));
          } 
          else if (palabra.startsWith('@')){
              const nombreUsuario = palabra.substring(1);
              const categorizador = twit.usuarioCategorizador.map(palabra => palabra.toLowerCase().trim());
              return twit.usuarioOriginal.toLowerCase() === nombreUsuario || (filtros.anidados && categorizador.includes(nombreUsuario));
            } 
        else {
          return textoTwit.includes(palabra)
          }
        });
      });
      // console.log("twitsExcluidos",twitsExcluidos)
      twitsFiltrados2.push(twitsExcluidos);
      }
  
    // console.log(twitsFiltrados2); 
    let combinado = [].concat(...twitsFiltrados2);
    // console.log(combinado)
  
  
    let objetosRepetidos = combinado.filter((objeto, index) => {
      return combinado.some((obj, i) => i !== index && obj.id === objeto.id);
    });
    
    // console.log(contador)
     let objetosUnicos = objetosRepetidos.reduce((unique, objeto) => {
      if (!unique.some((uniqueObjeto) => uniqueObjeto.id === objeto.id)) {
        unique.push(objeto);
      }
      return unique;
    }, []);
    
    
    // console.log(objetosUnicos);
  
  
    datosFiltradosNuevo = objetosUnicos;
  }

    

  







 let datosFiltradosAnterior = []

  if (filtros.fechaInicio && filtros.fechaFin) {
    // Fecha de inicio y fin del período actual
      let fechaInicio = new Date(filtros.fechaInicio);
      let fechaFin = new Date(filtros.fechaFin);
         // console.log(filtros.fechaInicio, filtros.fechaFin)
      // Calcular la cantidad de días como la diferencia entre el día de inicio y el día de fin, más 1 para incluir ambos días
       const unDiaEnMs = 24 * 60 * 60 * 1000; // Un día en milisegundos
       const cantidadDias = Math.round((fechaFin.getTime() - fechaInicio.getTime()) / unDiaEnMs) + 1;

       // Restar la cantidad de días calculada a la fecha de inicio para obtener el inicio del período anterior
       const fechaInicioAnterior = new Date(fechaInicio.getTime() - cantidadDias * unDiaEnMs);

       // Sumar la cantidad de días calculada a la fecha de inicio anterior para obtener el fin del período anterior
       const fechaFinAnterior = new Date(fechaInicioAnterior.getTime() + cantidadDias * unDiaEnMs - unDiaEnMs);

       // Convertir las fechas al formato deseado ('yyyy-mm-dd')
       const fechaInicioAnteriorStr = fechaInicioAnterior.toISOString().split('T')[0];
       const fechaFinAnteriorStr = fechaFinAnterior.toISOString().split('T')[0];

       // Resultado
       // console.log('Fecha de inicio anterior:', fechaInicioAnteriorStr);
       // console.log('Fecha de fin anterior:', fechaFinAnteriorStr);


       datosFiltradosAnterior = state.datosParaFiltros.filter((dato) => {
       const fechaDato = dato.date;

       return fechaDato >= fechaInicioAnteriorStr && fechaDato <= fechaFinAnteriorStr;
     });
 
    }


  if (filtros.fechaInicio && filtros.fechaFin && filtros.horaInicio && filtros.horaFin) {
    const fechaInicio = new Date(`${filtros.fechaInicio}T${filtros.horaInicio}`);
    const fechaFin = new Date(`${filtros.fechaFin}T${filtros.horaFin}`);
    // console.log(fechaInicio,fechaFin)
    datosFiltradosNuevo = datosFiltradosNuevo.filter((dato) => {
      const fechaDato = new Date(dato.fecha);
      return fechaDato >= fechaInicio && fechaDato <= fechaFin;
    });
  }

  if (Array.isArray(filtros.modelo) && filtros.modelo.length === 1 && filtros.modelo[0] === "") {
    filtros.modelo = []; // Establecer `modelo` como un array vacío
  }
  
  // Aplicar el filtro por modelo si está presente
  if (Array.isArray(filtros.modelo) && filtros.modelo.length > 0) {
    // Filtrar por modelo
    const tweetsFiltradosModelo = datosFiltradosNuevo.filter((dato) => {
      return filtros.modelo.some((modelo) => dato[modelo]?.length > 0);
    });
  
    const tweetsFiltradosModeloAnterior = datosFiltradosAnterior.filter((dato) => {
      return filtros.modelo.some((modelo) => dato[modelo]?.length > 0);
    });
  
    // Verificar si se deben aplicar filtros adicionales por categorías
    if (filtros.categoria && filtros.categoria.length > 0) {
      // Filtrar por categorías
      datosFiltradosNuevo = tweetsFiltradosModelo.filter((dato) => {
        // Verificar si alguna categoría coincide con los tweets
        return filtros.categoria.some((categoria) => {
          // Verificar si la palabra está presente en el array dato[filtros.modelo]
          return filtros.modelo.some((modelo) => dato[modelo].includes(categoria));
        });
      });
  
      datosFiltradosAnterior = tweetsFiltradosModeloAnterior.filter((dato) => {
        // Verificar si alguna categoría coincide con los tweets
        return filtros.categoria.some((categoria) => {
          // Verificar si la palabra está presente en el array dato[filtros.modelo]
          return filtros.modelo.some((modelo) => dato[modelo].includes(categoria));
        });
      });
    } else {
      // No se especificaron categorías, mantener los tweets filtrados por modelo
      datosFiltradosNuevo = tweetsFiltradosModelo;
      datosFiltradosAnterior = tweetsFiltradosModeloAnterior;
    }
  }


  
// Aplicar los filtros de serie si está presente
if (Array.isArray(filtros.serie) && filtros.serie.length > 0) {
  datosFiltradosNuevo = datosFiltradosNuevo.filter((dato) => {
    // Verificar si se cumplen los filtros de fecha y palabras anteriores
    const fechaDato = dato.date;
    const regexPalabras = new RegExp(filtros.palabra?.join('|'), 'i');

    return (
      filtros.serie.includes(dato.seriesName) &&
      (!filtros.palabra || regexPalabras.test(dato.texto)) &&
      (!filtros.sinpalabra || !filtros.sinpalabra.some((sinpalabra) => new RegExp(sinpalabra, 'i').test(dato.texto))) &&
      (!filtros.fechaInicio || !filtros.fechaFin || (fechaDato >= filtros.fechaInicio && fechaDato <= filtros.fechaFin))
    );
  });

  datosFiltradosAnterior = datosFiltradosAnterior.filter((dato) => {
    // Verificar si se cumplen los filtros de fecha y palabras anteriores
    return filtros.serie.includes(dato.seriesName);
  });
}
 // Aplicar el filtro de polaridad si está presente
 if (Array.isArray(filtros.polaridad) && filtros.polaridad.length > 0) {
  datosFiltradosNuevo = datosFiltradosNuevo.filter((dato) => filtros.polaridad.includes(dato.sentimiento));
  datosFiltradosAnterior = datosFiltradosAnterior.filter((dato) => filtros.polaridad.includes(dato.sentimiento));
}
   

if (Array.isArray(filtros.subserie) && filtros.subserie.length > 0) {
  datosFiltradosNuevo = datosFiltradosNuevo.filter((dato) =>
    dato.subSeriesName.some((subserie) =>
      filtros.subserie.includes(subserie)
    )
  );

  datosFiltradosAnterior = datosFiltradosAnterior.filter((dato) =>
    dato.subSeriesName.some((subserie) =>
      filtros.subserie.includes(subserie)
    )
  );
}


  return {
    ...state,
    datosFiltrados: datosFiltradosNuevo,
    datosPeriodoActual: datosFiltradosNuevo,
    datosPeriodoAnterior: datosFiltradosAnterior,
    filtros: filtros
  };









  ///////////AUTH
  case 'LOGIN_SUCCESS':
    return {
      ...state,
      user: action.payload,
      error: null,
    };
  // case 'LOGIN_FAILURE':
  //   return {
  //     ...state,
  //     error: action.payload,
  //   };
  case 'LOGOUT':
    return {
      ...state,
      user: null,
      error: null,
    };

        default: return { ...state }
    }
}



export default rootReducer;


