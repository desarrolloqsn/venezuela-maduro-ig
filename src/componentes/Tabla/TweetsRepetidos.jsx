import { Table, Tag } from 'antd';
import React, { useEffect } from 'react';
import perfil from './../../imagenes/user.webp';
import './Carta.css'
import { useSelector } from 'react-redux';
import { Rate } from 'antd';
import { useLocation } from 'react-router';
import {HiDocumentDownload} from 'react-icons/hi'
import { saveAs } from 'file-saver';
import * as XLSX from 'xlsx';
import { Button, Tooltip } from 'antd';

export default function TablaTweetsRepetidos(){
  const dataTweets = useSelector((state) => state.datosFiltrados);
  const location = useLocation();
  const currentUrl = location.pathname;
  const subUrl = currentUrl.startsWith('/dashboard/') ? currentUrl.substring('/dashboard/'.length) : '';
  const modeloSinEspacios = decodeURIComponent(subUrl.replace(/\+/g, " "));

  const tweetsFiltrados = dataTweets.filter(tweet => {
    const propiedadModelo = tweet[modeloSinEspacios];
    return Array.isArray(propiedadModelo) && propiedadModelo.length > 0;
  });


  const decodeText = (text) => {
    try {
      return decodeURIComponent(text);
    } catch (error) {
      return text;
    }
  };


  const textosUnicos = {};

  for (const tweet of dataTweets) {
    const texto = tweet.texto;
    
    if (texto.trim() !== '') { // Verificar si el texto no está vacío
      if (!textosUnicos.hasOwnProperty(texto)) {
        textosUnicos[texto] = {
          repeticiones: 1,
          tweets: [tweet],
        };
      } else {
        textosUnicos[texto].repeticiones++;
        textosUnicos[texto].tweets.push(tweet);
      }
    }
  }
  
  const textosOrdenados = Object.entries(textosUnicos)
    .sort((a, b) => b[1].repeticiones - a[1].repeticiones);
  
  const tweetsMasRepetidos = textosOrdenados.map(([texto, data]) => ({
    tweet: texto,
    repeticiones: data.repeticiones,
    tweets: data.tweets,
  }));
  
  
  const primeros100TweetsMasRepetidos = [];
  
  for (const objeto of tweetsMasRepetidos) {
    const primerTweet = { ...objeto.tweets[0], repeticiones: objeto.repeticiones };
    primeros100TweetsMasRepetidos.push(primerTweet);
  
    if (primeros100TweetsMasRepetidos.length === 100) {
      break; // Salir del bucle después de encontrar los primeros 100 tweets más repetidos
    }
  }
  
  // console.log(primeros100TweetsMasRepetidos);
  
  const top10MasRetwitteados = primeros100TweetsMasRepetidos.slice(0, 100);
  // console.log(top10MasRetwitteados);
const data = [
  {
    key: '1',
    Tweets: 'Some tweet',
  },
  // ...otros datos
];


const columns = [
  {
    title: 'Eventos',
    dataIndex: 'Tweets',
    width: '50%',
  


    render: (_, record) => (
      top10MasRetwitteados.map((item, index) => (
        <div key={index}>
          
          <div className='contendor-tweets'>
            {/* CONTENEDOR GENERAL */}
            <div className='user-twitter'>{item.fecha}</div>    
            <br></br>
            <div className='foto-texto-perfil'>
              {/* CONTENEDOR foto y texto vertical */}
              {/* <div className='contenedor-perfil'>
                CONTENEDOR FOTO PERFIL
                <img
                  src={item.profileImage || perfil}
                  className='fotoperfil'
                  alt='Foto de perfil'
                />
              </div> */}
              
              <div className='contenedor-publicacion'>
                {/* CONTENEDOR TEXTO */}
                <div className='contenedor-tituloSubtitulo'>
                  {/* <div className='titulo-tweet'>{item.name}</div> */}
                  {/* Título */}
                  <div className='user-twitter'>{item.usuarioOriginal}</div>
                         
                  
                  </div>
                  {/* Mapeo de usuarios categorizadores */}
                  {item.usuarioCategorizador_Comments.length > 0 && (
                    <div>
                      <div>Replying to</div>
                      <div className='replyingto'>
                        {item.usuarioCategorizador_Comments.map((usuario, index) => `${usuario}`).join(' ')}
                      </div>
                    </div>
                  )}
                 <div>{decodeText(item.texto)}</div>
                {/* Texto */}
                {/* {item.imagen_tweet !== null ? 
                 <div>
                 
                  <img src={item.imagen_tweet} className='publicacion' alt='Imagen de la publicación' />
                  
                </div> 
                : null
              } */}
                {/* Imagen */}
                <div className='tags'> 
                  {/* CONTENEDOR tags */}
                  <Tag
                    key={index}
                    style={{marginBottom:"0.5rem"}}
                    color={
                      item.sentimiento === 'neutro'
                        ? 'grey'
                        : item.sentimiento === 'positivo'
                        ? '#008300'
                        : '#ff2323'
                    }
                  >
                    {item.sentimiento.toUpperCase()}
                  </Tag>
                   {/* {item.tags.map((tag, index) => (
                    <Tag style={{marginBottom:"0.5rem"}} key={index} color='blue'>{tag}</Tag>
                  ))} */}
                  {modeloSinEspacios !== null ? null :
                  <div>
                  {item[modeloSinEspacios].map((tag, index) => (
                    <Tag style={{marginBottom:"0.5rem"}} key={index} color='blue'>{tag}</Tag>
                  ))}
                  </div>
                }
                  
                  
                  
                 
                

                </div>
                <div>Repeticiones:{item.repeticiones}</div>
                 {/* <div className='retweets'>{item.retweets} retweets</div>  */}
              </div>
            </div>
          </div>
        </div>
      ))
    )
  }
];

const convertirArraysACadenas = (data) => {
  const newData = { ...data };
  for (const key in newData) {
    if (Array.isArray(newData[key])) {
      newData[key] = newData[key].join(', ');
    }
  }
  return newData;
};
const handleDownloadExcel = () => {
  const datosConvertidos = top10MasRetwitteados.map(convertirArraysACadenas);
  const worksheet = XLSX.utils.json_to_sheet(datosConvertidos, { header: Object.keys(datosConvertidos[0]) });
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');
  const excelBuffer = XLSX.write(workbook, { bookType: 'xlsx', type:'array' });
  const data = new Blob([excelBuffer], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });

  // Obtener la fecha actual
  const today = new Date();
  const date = today.toISOString().split('T')[0]; // Formato YYYY-MM-DD

  // Nombre del archivo con la fecha actual
  const fileName = `EventosRepetidos_${date}.xlsx`;

  saveAs(data, fileName);
};




  return(
    <div>
    <div className='titulo-carta'>Eventos</div>
   
    <div className='subtitulo-carta'>
        <div>Eventos repetidos</div>
        <Tooltip title="Descargar Excel">
        <Button onClick={handleDownloadExcel} type="primary" shape="circle"  className='subtitulo-boton'><HiDocumentDownload/></Button>
        </Tooltip>
      </div>
    <div className='carta'>
      <Table columns={columns} dataSource={data} scroll={{ y: 348 }} pagination={false}/>
    </div>
    </div>
  )
}
 

