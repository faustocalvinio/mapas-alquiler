"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import "leaflet-draw";
import "leaflet-draw/dist/leaflet.draw.css";
import html2canvas from "html2canvas";

// Fix para los iconos de Leaflet en Next.js
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
   iconRetinaUrl: "/leaflet/marker-icon-2x.png",
   iconUrl: "/leaflet/marker-icon.png",
   shadowUrl: "/leaflet/marker-shadow.png",
});

interface Apartment {
   id: string;
   title?: string;
   address: string;
   price: number;
   zone?: string;
   notes?: string;
   link?: string;
   lat: number;
   lng: number;
   status: string;
   iconColor: string;
   createdBy?: string;
   userId?: string;
   user?: {
      name?: string;
      email?: string;
   };
   createdAt: string;
}

interface SelectableMapViewProps {
   apartments: Apartment[];
   isDrawingMode: boolean;
   onDrawingModeChange: (isDrawing: boolean) => void;
}

export default function SelectableMapView({
   apartments,
   isDrawingMode,
   onDrawingModeChange,
}: SelectableMapViewProps) {
   const mapRef = useRef<L.Map | null>(null);
   const mapContainerRef = useRef<HTMLDivElement>(null);
   const drawnLayerRef = useRef<L.LayerGroup | null>(null);
   const drawControlRef = useRef<L.Control.Draw | null>(null);
   const markersLayerRef = useRef<L.LayerGroup | null>(null);
   const [selectedArea, setSelectedArea] = useState<L.Layer | null>(null);
   const [isCapturing, setIsCapturing] = useState(false);
   const [showSuccessPopup, setShowSuccessPopup] = useState(false);

   // Inicializar el mapa
   useEffect(() => {
      if (!mapContainerRef.current || mapRef.current) return;

      // Crear el mapa centrado en Madrid
      const map = L.map(mapContainerRef.current, {
         center: [40.4168, -3.7038],
         zoom: 12,
         zoomControl: true,
      });

      // Añadir capa base
      L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
         attribution: "© OpenStreetMap contributors",
         maxZoom: 19,
      }).addTo(map);

      // Crear grupos de capas
      const drawnItems = new L.FeatureGroup();
      const markersLayer = new L.LayerGroup();

      map.addLayer(drawnItems);
      map.addLayer(markersLayer);

      // Crear controles de dibujo
      const drawControl = new L.Control.Draw({
         position: "topright",
         draw: {
            polygon: {
               allowIntersection: false,
               drawError: {
                  color: "#e1e100",
                  message:
                     "<strong>Error:</strong> Las líneas no pueden cruzarse!",
               },
               shapeOptions: {
                  color: "#3388ff",
                  fillOpacity: 0.1,
                  weight: 2,
               },
            },
            rectangle: {
               shapeOptions: {
                  color: "#3388ff",
                  fillOpacity: 0.1,
                  weight: 2,
               },
            },
            circle: {
               shapeOptions: {
                  color: "#3388ff",
                  fillOpacity: 0.1,
                  weight: 2,
               },
            },
            polyline: false,
            marker: false,
            circlemarker: false,
         },
         edit: {
            featureGroup: drawnItems,
            remove: true,
         },
      });

      // Eventos de dibujo
      map.on(L.Draw.Event.CREATED, (e: any) => {
         const { layer } = e;
         drawnItems.addLayer(layer);
         setSelectedArea(layer);

         // Mostrar popup de éxito temporalmente
         setShowSuccessPopup(true);
         setTimeout(() => {
            setShowSuccessPopup(false);
         }, 1000);

         // Crear botón de descarga personalizado
         const downloadButton = new L.Control({ position: "bottomright" });
         downloadButton.onAdd = () => {
            const div = L.DomUtil.create(
               "div",
               "leaflet-bar leaflet-control leaflet-control-custom"
            );
            div.style.backgroundColor = "#3B82F6";
            div.style.backgroundImage = "none";
            div.style.width = "auto";
            div.style.height = "auto";
            div.style.padding = "8px 12px";
            div.style.cursor = "pointer";
            div.style.color = "white";
            div.style.fontWeight = "bold";
            div.style.fontSize = "12px";
            div.innerHTML = "📸 Descargar Selección";

            div.onclick = () => {
               captureSelectedArea(layer);
            };

            return div;
         };
         downloadButton.addTo(map);
      });

      map.on(L.Draw.Event.DELETED, () => {
         setSelectedArea(null);
         setShowSuccessPopup(false);
         // Remover botón de descarga si existe
         map.eachLayer((layer: any) => {
            if (
               layer.getContainer &&
               layer.getContainer().innerHTML === "📸 Descargar Selección"
            ) {
               map.removeControl(layer);
            }
         });
      });

      mapRef.current = map;
      drawnLayerRef.current = drawnItems;
      markersLayerRef.current = markersLayer;
      drawControlRef.current = drawControl;

      return () => {
         if (mapRef.current) {
            mapRef.current.remove();
            mapRef.current = null;
         }
      };
   }, []);

   // Manejar modo de dibujo
   useEffect(() => {
      if (!mapRef.current || !drawControlRef.current) return;

      if (isDrawingMode) {
         mapRef.current.addControl(drawControlRef.current);
      } else {
         mapRef.current.removeControl(drawControlRef.current);
      }
   }, [isDrawingMode]);

   // Actualizar marcadores de apartamentos
   useEffect(() => {
      if (!mapRef.current || !markersLayerRef.current) return;

      // Limpiar marcadores existentes
      markersLayerRef.current.clearLayers();

      // Añadir nuevos marcadores
      apartments.forEach((apartment) => {
         const icon = L.divIcon({
            html: `<div style="background-color: ${apartment.iconColor}; width: 20px; height: 20px; border-radius: 50%; border: 2px solid white; box-shadow: 0 1px 3px rgba(0,0,0,0.3);"></div>`,
            className: "custom-div-icon",
            iconSize: [20, 20],
            iconAnchor: [10, 10],
         });

         const marker = L.marker([apartment.lat, apartment.lng], { icon });

         const statusIcon = apartment.status === "available" ? "🟢" : "🔴";
         const statusText =
            apartment.status === "available" ? "Disponible" : "Alquilado";

         marker.bindPopup(`
            <div style="min-width: 200px;">
               <h3 style="margin: 0 0 8px 0; font-size: 14px; font-weight: bold;">
                  ${apartment.title || "Apartamento"}
               </h3>
               <p style="margin: 4px 0; font-size: 12px;"><strong>📍 Dirección:</strong> ${
                  apartment.address
               }</p>
               <p style="margin: 4px 0; font-size: 12px;"><strong>💰 Precio:</strong> ${
                  apartment.price
               }€/mes</p>
               ${
                  apartment.zone
                     ? `<p style="margin: 4px 0; font-size: 12px;"><strong>🏘️ Zona:</strong> ${apartment.zone}</p>`
                     : ""
               }
               <p style="margin: 4px 0; font-size: 12px;"><strong>📊 Estado:</strong> ${statusIcon} ${statusText}</p>
               ${
                  apartment.notes
                     ? `<p style="margin: 4px 0; font-size: 12px;"><strong>📝 Notas:</strong> ${apartment.notes}</p>`
                     : ""
               }
               ${
                  apartment.link
                     ? `<p style="margin: 4px 0; font-size: 12px;"><strong>🔗 Link:</strong> <a href="${apartment.link}" target="_blank" rel="noopener noreferrer" style="color: #3B82F6; text-decoration: underline;">${apartment.link}</a></p>`
                     : ""
               }
            </div>
         `);

         markersLayerRef.current?.addLayer(marker);
      });
   }, [apartments]);

   // Función para capturar el área seleccionada
   const captureSelectedArea = async (selectedLayer: L.Layer) => {
      if (!mapRef.current || !mapContainerRef.current) return;

      setIsCapturing(true);

      try {
         // Obtener los bounds de la forma seleccionada
         let bounds: L.LatLngBounds;

         if (
            selectedLayer instanceof L.Rectangle ||
            selectedLayer instanceof L.Polygon
         ) {
            bounds = (selectedLayer as any).getBounds();
         } else if (selectedLayer instanceof L.Circle) {
            bounds = (selectedLayer as any).getBounds();
         } else {
            throw new Error("Tipo de selección no soportado");
         }

         // Ajustar la vista del mapa al área seleccionada
         mapRef.current.fitBounds(bounds, { padding: [20, 20] });

         // Esperar a que se renderice
         await new Promise((resolve) => setTimeout(resolve, 500));

         // Capturar la imagen
         const canvas = await html2canvas(mapContainerRef.current, {
            allowTaint: true,
            useCORS: true,
            scale: 2, // Mejor calidad
            width: mapContainerRef.current.offsetWidth,
            height: mapContainerRef.current.offsetHeight,
         });

         // Crear enlace de descarga
         const link = document.createElement("a");
         link.download = `mapa-seleccion-${new Date()
            .toISOString()
            .slice(0, 10)}.png`;
         link.href = canvas.toDataURL();
         link.click();
      } catch (error) {
         console.error("Error al capturar la imagen:", error);
         alert("Error al generar la captura. Por favor, inténtalo de nuevo.");
      } finally {
         setIsCapturing(false);
      }
   };

   return (
      <div className="relative w-full h-full">
         <div
            ref={mapContainerRef}
            className="w-full h-full"
            style={{ zIndex: 0 }}
         />

         {/* Overlay de carga durante captura */}
         {isCapturing && (
            <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[1000]">
               <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg text-center">
                  <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
                  <p className="text-gray-700 dark:text-gray-300">
                     Generando captura de pantalla...
                  </p>
               </div>
            </div>
         )}

         {/* Instrucciones flotantes */}
         {isDrawingMode && !selectedArea && (
            <div className="absolute top-4 left-4 bg-white dark:bg-gray-800 p-4 rounded-lg shadow-lg max-w-sm z-[1000]">
               <h3 className="font-semibold text-gray-800 dark:text-gray-200 mb-2">
                  Herramientas de Selección
               </h3>
               <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  <li>
                     📦 <strong>Rectángulo:</strong> Selección rectangular
                  </li>
                  <li>
                     🔵 <strong>Círculo:</strong> Selección circular
                  </li>
                  <li>
                     📐 <strong>Polígono:</strong> Selección personalizada
                  </li>
                  <li>
                     ✏️ <strong>Editar:</strong> Modificar selección
                  </li>
                  <li>
                     🗑️ <strong>Borrar:</strong> Eliminar selección
                  </li>
               </ul>
            </div>
         )}

         {/* Popup temporal de área seleccionada */}
         {showSuccessPopup && (
            <div className="absolute top-20 left-1/2 transform -translate-x-1/2 bg-green-50 dark:bg-green-900 border border-green-200 dark:border-green-700 p-4 rounded-lg shadow-lg z-[1001] animate-pulse">
               <div className="flex items-center space-x-2">
                  <span className="text-green-600 dark:text-green-400 text-lg">
                     ✅
                  </span>
                  <h3 className="font-semibold text-green-800 dark:text-green-200">
                     Área Seleccionada
                  </h3>
               </div>
               <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                  Usa el botón azul en la esquina inferior derecha para
                  descargar
               </p>
            </div>
         )}

         {/* Botón permanente de descarga cuando hay área seleccionada */}
         {selectedArea && !showSuccessPopup && (
            <div className="absolute bottom-20 right-4 bg-blue-50 dark:bg-blue-900 border border-blue-200 dark:border-blue-700 p-3 rounded-lg shadow-lg z-[1000]">
               <button
                  onClick={() => captureSelectedArea(selectedArea)}
                  disabled={isCapturing}
                  className="bg-blue-600 hover:bg-blue-700 disabled:bg-blue-400 text-white font-medium py-2 px-4 rounded-md transition-colors duration-200 flex items-center space-x-2"
               >
                  <span>{isCapturing ? "🔄" : "📸"}</span>
                  <span>{isCapturing ? "Generando..." : "Descargar PNG"}</span>
               </button>
            </div>
         )}
      </div>
   );
}
