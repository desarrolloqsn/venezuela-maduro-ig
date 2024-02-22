import React, { useEffect, useRef, useState } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useSelector } from "react-redux";
import { Select } from "antd";
import { HiDocumentDownload } from 'react-icons/hi'
import { saveAs } from 'file-saver';
import { write, utils } from 'xlsx';
import { Button, Tooltip } from 'antd';

import './Graficos.css';
import './../Tabla/Carta.css';

const { Option } = Select;

const Mapa = () => {
  const datos = useSelector((state) => state.datosFiltrados);
  const mapRef = useRef(null);
  const [selectedEstados, setSelectedEstados] = useState(["Venezuela"]); 

  const estados = [...new Set(datos.map((dato) => dato.ESTADO))].filter(estado => estado !== "");

  // Ordenar estados alfabéticamente
  estados.sort((a, b) => a.localeCompare(b));
  const [filteredDatos,setFilteredDatos] = useState(datos);
  useEffect(() => {
    if (!mapRef.current) {
      const map = L.map("map").setView([6.4238, -66.5897], 5);
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
        attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
      }).addTo(map);

      mapRef.current = map;
      
      L.marker([23.634501, -102.552784]).addTo(map);
    }
  }, []);

  useEffect(() => {
    if (datos.length > 0 && mapRef.current) {
      mapRef.current.eachLayer((layer) => {
        if (layer instanceof L.Marker || layer instanceof L.Circle) {
          mapRef.current.removeLayer(layer);
        }
      });
  
      // Resto del código para filtrar y mostrar marcadores
    }
  }, [datos, selectedEstados]);

  // Función para manejar el cambio de estados seleccionados
  const handleEstadosChange = (value) => {
    setSelectedEstados(value);
  };

  const handleDownloadExcel = () => {
    // Resto del código para descargar los datos en Excel
  }

  return (
    <div>
      <div className='titulo-carta'>Mapa polaridad</div>
      <div className='subtitulo-carta'>
        <div>Polaridad por locación</div>
        
        <Select
          value={selectedEstados}
          style={{ width: 300 }}
          onChange={handleEstadosChange}
          mode="multiple" 
          allowClear={false}
        >
          {estados.map((estado) => (
            <Option key={estado} value={estado} allowClear={false}>
              {estado}
            </Option>
          ))}
        </Select>
        <Tooltip title="Descargar Excel">
          <Button onClick={handleDownloadExcel} type="primary" shape="circle" className='subtitulo-boton'><HiDocumentDownload /></Button>
        </Tooltip>
      </div>
      <div id="map" className="mapa carta" style={{ height: "500px" }}></div>
    </div>
  );
};

export default Mapa;
