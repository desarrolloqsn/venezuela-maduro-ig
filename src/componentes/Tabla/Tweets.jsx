/** @format */

import { Table, Tag } from "antd";
import React, { useEffect, useState } from "react";
import perfil from "./../../imagenes/user.webp";
import "./Carta.css";
import { useSelector } from "react-redux";
import { Rate } from "antd";
import { useLocation } from "react-router";
import { HiDocumentDownload } from "react-icons/hi";
import { saveAs } from "file-saver";
import * as XLSX from "xlsx";
import { Button, Tooltip } from "antd";
import { Link } from "react-router-dom";
import axios from "axios";
import { Spin } from 'antd';

export default function TablaTweets() {
  const datatweets = useSelector((state) => state.datosFiltrados);
  const location = useLocation();
  const [Top10MasRetwitteadosConBases64,setTop10MasRetwitteadosConBases64] = useState([])
  const [cargandoImagenes, setCargandoImagenes] = useState(true);
  const currentUrl = location.pathname;
  const subUrl = currentUrl.startsWith("/dashboard/")
    ? currentUrl.substring("/dashboard/".length)
    : "";
  const modeloSinEspacios = decodeURIComponent(subUrl.replace(/\+/g, " "));

  const tweetsFiltrados = datatweets.filter((tweet) => {
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

  // Paso 1: Iterar sobre cada objeto en el array
  datatweets.forEach((tweet) => {
    // Paso 2: Sumar las propiedades "citas", "retweets", "likes", "comentarios" y "vistas"
    const { citas, retweets, likes, comentarios } = tweet;
    const totalInteracciones = citas + retweets + likes + comentarios;

    // Paso 3: Almacenar la suma en una nueva propiedad del objeto
    tweet.totalInteracciones = totalInteracciones;
  });

  // Paso 4: Ordenar el array de objetos en base a la propiedad "totalInteracciones" de forma descendente
  const tweetsNuevo = datatweets.sort(
    (a, b) => b.totalInteracciones - a.totalInteracciones
  );
  const top10MasRetwitteados = tweetsNuevo.slice(0,20);

  //  console.log("TWEETS",tweetsNuevo.slice(0,100));

  const data = [
    {
      key: "1",
      Tweets: "Some tweet",
    },
    // ...otros datos
  ];

  // const obtenerImagenes = async (url) => {
  //   try {
  //     const response = await axios.post(`http://192.168.1.75:3002/generateBase64`, {
  //       url: url
  //     });
  //     return response.data.bases64;
  //   } catch (error) {
  //     console.error(error);
  //     return [];
  //   }
  // }



  // // Cambia tu render a un useEffect para hacer las solicitudes antes del renderizado
  // useEffect(() => {
  //   const obtenerImagenesParaTopRetweets = async () => {
  //     try {
  //       const nuevasTopRetweets = await Promise.all(
  //         top10MasRetwitteados.map(async (item) => {
  //           const bases64 =
  //             item.imagen_tweet !== null
  //               ? await obtenerImagenes(item.imagen_tweet)
  //               : null;
  //           return { ...item, bases64 };
  //         })
  //       );
    
  //       setTop10MasRetwitteadosConBases64(nuevasTopRetweets);
  //       setCargandoImagenes(false); // Indicamos que las imágenes han terminado de cargar
  //     } catch (error) {
  //       console.error(error);
  //       setCargandoImagenes(false); // Manejo de errores: indicamos que las imágenes han terminado de cargar
  //     }
  //   };
  //   obtenerImagenesParaTopRetweets()
  // }, []);

  const [loading, setLoading] = useState(false);

  const [imagenesCargadas, setImagenesCargadas] = useState({});
  const obtenerImagenes = (url) => {
    // console.log(url)
    return new Promise(async (resolve, reject) => {
      try {
        const response = await axios.post(`https://vps-3578916-x.dattaweb.com/generateBase64`, {
          url:url
        });
        resolve(response.data.msj);
      } catch (error) {
        console.error(error);
        reject(error);
      }
    });
  }

  useEffect(() => {
    top10MasRetwitteados.forEach(async (item) => {
      await handleLazyLoad(item);
    });
  }, []);
  const handleLazyLoad = async (item) => {
    // console.log(item)
    if (item.imagen_tweet && !imagenesCargadas[item.imagen_tweet]) {
      
      try {
        setLoading(true); // Indicar que la imagen está cargando
        const bases64 = await obtenerImagenes(item.imagen_tweet);
        // console.log(bases64)
        setImagenesCargadas(prev => ({
          ...prev,
          [item.imagen_tweet]: bases64
        }));
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); // Indicar que la carga ha terminado
      }
    }
  }


  const columns = [
    {
      title: "Eventos",
      dataIndex: "Tweets",
      width: "50%",

      render: (_, record) =>
      top10MasRetwitteados.map((item, index) => {
          const bases64 = item.bases64;
          // console.log(imagenesCargadas)


        
            return (
              <Link to={item.link} target="_blank" key={index}>
                <div  key={index}
                className="lazyload-container"
                style={{ minHeight: "200px" }} // Ajusta la altura mínima según tu diseño
>
                  <div className="contendor-tweets">
                    {/* CONTENEDOR GENERAL */}
                    <div className="user-twitter">{item.fecha}</div>
                    <br></br>
                    <div className="foto-texto-perfil">
                      {/* CONTENEDOR foto y texto vertical */}
                      {/* <div className='contenedor-perfil'>
                 CONTENEDOR FOTO PERFIL 
                <img
                  src={item.profileImage || perfil}
                  className='fotoperfil'
                  alt='Foto de perfil'
                />
              </div>*/}

                      <div className="contenedor-publicacion">
                        {/* CONTENEDOR TEXTO */}
                        <div className="contenedor-tituloSubtitulo">
                          {/* <div className='titulo-tweet'>{item.name}</div> */}
                          {/* Título */}
                          <div className="user-twitter">
                            {item.usuarioOriginal}
                          </div>
                        </div>
                        {/* Mapeo de usuarios categorizadores */}
                        {item.usuarioCategorizador_Comments.length > 0 && (
                          <div>
                            <div>Replying to</div>
                            <div className="replyingto">
                              {item.usuarioCategorizador_Comments
                                .map((usuario, index) => `${usuario}`)
                                .join(" ")}
                            </div>
                          </div>
                        )}
                        <div>{decodeText(item.texto)}</div>
                        {/* Texto */}
                        {item.imagen_tweet &&
                              item.imagen_tweet.map((url, idx) => {
                                const bases64 = imagenesCargadas[url];

                                // Aquí está la lógica del temporizador
                                let timer;
                                if (!bases64 && loading) {
                                  timer = setTimeout(() => {
                                    setLoading(false); // Desactivar la carga después de 30 segundos
                                  }, 30000); // 30 segundos en milisegundos
                                }

                              return (
                                <div key={idx} className="imagen-container">
                                  { !bases64 || loading  && <Spin className="spin-base64"/>} {/* Indicador de carga */}
                                  {bases64 &&
                                    bases64.map((data, idx2) => {
                                      if (data.Url.includes(".mp4")) {
                                        return (
                                          <video
                                            key={idx2}
                                            src={`data:video/mp4;base64,${data.Base64}`}
                                            className="publicacion"
                                            controls
                                            crossOrigin="anonymous"
                                          />
                                        );
                                      } else {
                                        return (
                                          <img
                                            key={idx2}
                                            src={`data:image/jpeg;base64,${data.Base64}`}
                                            className="publicacion"
                                            alt="Imagen de la publicación"
                                            crossOrigin="anonymous"
                                          />
                                        );
                                      }
                                    })}
                                </div>
                              );
                            })}

                         <div className="tags">
                          {/* CONTENEDOR tags */}
                          <Tag
                            key={index}
                            style={{ marginBottom: "0.5rem" }}
                            color={
                              item.sentimiento === "neutro"
                                ? "grey"
                                : item.sentimiento === "positivo"
                                ? "#008300"
                                : "#ff2323"
                            }
                          >
                            {item.sentimiento.toUpperCase()}
                          </Tag>
                          {/* {item.tags.map((tag, index) => (
                    <Tag style={{marginBottom:"0.5rem"}} key={index} color='blue'>{tag}</Tag>
                  ))} */}
                          {modeloSinEspacios !== null ? null : (
                            <div>
                              {item[modeloSinEspacios].map((tag, index) => (
                                <Tag
                                  style={{ marginBottom: "0.5rem" }}
                                  key={index}
                                  color="blue"
                                >
                                  {tag}
                                </Tag>
                              ))}
                            </div>
                          )}
                        </div>
                        <Rate
                          allowHalf
                          disabled
                          defaultValue={
                            (item.totalInteracciones /
                              top10MasRetwitteados[0].totalInteracciones) *
                            5
                          }
                          character={
                            <span style={{ fontSize: "18px" }}>★</span>
                          }
                        />
                        {/* <div className='retweets'>{item.retweets} retweets</div>  */}
                      </div>
                    </div>
                  </div>
                </div>
              </Link>
            );
        }),
    },
  ];

  const convertirArraysACadenas = (data) => {
    const newData = { ...data };
    for (const key in newData) {
      if (Array.isArray(newData[key])) {
        newData[key] = newData[key].join(", ");
      }
    }
    return newData;
  };
  const handleDownloadExcel = () => {
    const datosConvertidos = datatweets.map(convertirArraysACadenas);
    const worksheet = XLSX.utils.json_to_sheet(datosConvertidos, {
      header: Object.keys(datosConvertidos[0]),
    });
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Datos");
    const excelBuffer = XLSX.write(workbook, {
      bookType: "xlsx",
      type: "array",
    });
    const data = new Blob([excelBuffer], {
      type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
    });

    // Obtener la fecha actual
    const today = new Date();
    const date = today.toISOString().split("T")[0]; // Formato YYYY-MM-DD

    // Nombre del archivo con la fecha actual
    const fileName = `Eventos_${date}.xlsx`;

    saveAs(data, fileName);
  };

  return (
    <div>
      <div className="titulo-carta">Categorización</div>

      <div className="subtitulo-carta">
        <div>Eventos con más engagements</div>
        <Tooltip title="Descargar Excel">
          <Button
            onClick={handleDownloadExcel}
            type="primary"
            shape="circle"
            className="subtitulo-boton"
          >
            <HiDocumentDownload />
          </Button>
        </Tooltip>
      </div>
      <div className="carta">
      <Table
        columns={columns}
        dataSource={data}
        scroll={{ y: 348 }}
        pagination={false}
      />
  </div>
    </div>
  );
}
