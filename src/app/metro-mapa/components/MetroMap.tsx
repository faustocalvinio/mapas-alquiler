"use client";

import { useEffect, useState } from "react";
import { MapContainer, TileLayer, GeoJSON } from "react-leaflet";
import { FeatureCollection, Point, LineString } from "geojson";
import { processGTFSData } from "../../../utils/gtfsProcessor";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import Link from "next/link";

export default function MetroMap() {
   const [metroData, setMetroData] =
      useState<FeatureCollection<LineString> | null>(null);
   const [stopsData, setStopsData] = useState<FeatureCollection<Point> | null>(
      null
   );
   const [loading, setLoading] = useState(true);
   const [error, setError] = useState<string | null>(null);

   useEffect(() => {
      const loadMetroData = async () => {
         setLoading(true);
         setError(null);

         try {
            // Cargar datos del Metro Ligero (M10) y Metro (M4)
            const [m10Data, m4Data] = await Promise.all([
               processGTFSData("google_transit_M10"),
               processGTFSData("google_transit_M4"),
            ]);

            // Combinar los datos de rutas
            const combinedRoutes: FeatureCollection<LineString> = {
               type: "FeatureCollection",
               features: [
                  ...m10Data.routesGeoJSON.features,
                  ...m4Data.routesGeoJSON.features,
               ],
            };

            // Combinar los datos de paradas
            const combinedStops: FeatureCollection<Point> = {
               type: "FeatureCollection",
               features: [
                  ...m10Data.stopsGeoJSON.features,
                  ...m4Data.stopsGeoJSON.features,
               ],
            };

            setMetroData(combinedRoutes);
            setStopsData(combinedStops);
         } catch (err) {
            setError("Error al cargar los datos del metro");
            console.error(err);
         } finally {
            setLoading(false);
         }
      };

      loadMetroData();
   }, []);

   const getLineColor = (properties: any) => {
      // Si tiene color de ruta en las propiedades, usarlo
      if (properties?.route_color) {
         return properties.route_color;
      }

      // Colores por línea de metro ligero - más vibrantes y visibles
      const lineColors: { [key: string]: string } = {
         ML1: "#2E5BBA", // Azul más intenso
         ML2: "#C41E3A", // Rosa/rojo más intenso
         ML3: "#E63946", // Rojo más vibrante
         ML4: "#52B69A", // Verde más vibrante
         // Fallbacks para otras líneas de metro tradicional
         "1": "#1E90FF",
         "2": "#DC143C",
         "3": "#FFD700",
         "4": "#8B4513",
         "5": "#32CD32",
         "6": "#00CED1",
         "7": "#FF8C00",
         "8": "#FF69B4",
         "9": "#9932CC",
         "10": "#A0522D",
         "11": "#228B22",
         "12": "#DAA520",
      };

      const lineNumber =
         properties?.route_short_name ||
         properties?.line ||
         properties?.LINEA ||
         properties?.LINE;
      return lineColors[lineNumber] || "#2E5BBA";
   };

   if (loading) {
      return (
         <div className="w-full h-screen flex items-center justify-center bg-gray-100">
            <div className="text-center">
               <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full mx-auto mb-4"></div>
               <p className="text-gray-600">
                  Cargando mapa del metro de Madrid...
               </p>
            </div>
         </div>
      );
   }

   if (error) {
      return (
         <div className="w-full h-screen flex items-center justify-center bg-gray-100">
            <div className="text-center text-red-600">
               <p className="text-xl mb-2">⚠️ Error</p>
               <p>{error}</p>
               <button
                  onClick={() => window.location.reload()}
                  className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
               >
                  Reintentar
               </button>
            </div>
         </div>
      );
   }

   return (
    <div className="w-full h-screen">
      <nav className="bg-white dark:bg-gray-800 shadow-md p-4">
         <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-xl font-bold text-gray-800 dark:text-gray-100">
               Mapa del Metro de Madrid
            </h1>
            <div className="flex space-x-4">
               <Link
                  href="/"
                  className="text-blue-600 hover:underline dark:text-blue-300"
               >
                  Volver al inicio
               </Link>
            </div>
          </div>
          </nav>
      <MapContainer
         center={[40.4168, -3.7038]}
         zoom={12}
         style={{ width: "100%", height: "100vh" }}
         className="z-0"
      >
         <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
         />

         {/* Líneas de Metro y Metro Ligero */}
         {metroData && (
            <GeoJSON
               data={metroData}
               style={(_feature) => {
                  const props = _feature?.properties;
                  const lineType = props?.route_short_name;
                  const isMetroLigero = lineType?.startsWith("ML");

                  return {
                     color: getLineColor(props),
                     weight: isMetroLigero ? 6 : 4, // Metro ligero más grueso
                     opacity: isMetroLigero ? 0.9 : 0.8, // Metro ligero más opaco
                     // Línea sólida para ambos tipos
                     dashArray: undefined,
                     // Añadir un borde más oscuro para el metro ligero
                     ...(isMetroLigero && {
                        lineCap: "round",
                        lineJoin: "round",
                     }),
                  };
               }}
               onEachFeature={(feature, layer) => {
                  const props = feature.properties;
                  const routeName =
                     props?.route_long_name ||
                     props?.route_short_name ||
                     "Línea de Metro";
                  const shortName = props?.route_short_name || "N/A";
                  const isMetroLigero = shortName?.startsWith("ML");

                  layer.bindPopup(`
                     <div style="font-family: Arial, sans-serif;">
                        <h3 style="margin: 0 0 5px 0; color: #333;"><b>${routeName}</b></h3>
                        <p style="margin: 0; color: #666;">Línea: ${shortName}</p>
                        <p style="margin: 0; color: #666; font-weight: bold;">${
                           isMetroLigero ? "🚊 Metro Ligero" : "🚇 Metro"
                        }</p>
                        ${
                           props?.route_color
                              ? `<p style="margin: 0; color: #666;">Color: ${props.route_color}</p>`
                              : ""
                        }
                     </div>
                  `);
               }}
            />
         )}

         {/* Paradas de Metro */}
         {stopsData && (
            <GeoJSON
               data={stopsData}
               pointToLayer={(feature, latlng) => {
                  return L.circleMarker(latlng, {
                     radius: 6,
                     fillColor: "#fff",
                     color: "#333",
                     weight: 2,
                     opacity: 1,
                     fillOpacity: 0.8,
                  });
               }}
               onEachFeature={(feature, layer) => {
                  const props = feature.properties;
                  const name = props?.name || "Parada";
                  const code = props?.code || "N/A";
                  const zone = props?.zone || "N/A";

                  layer.bindPopup(`
                     <div style="font-family: Arial, sans-serif;">
                        <h3 style="margin: 0 0 5px 0; color: #333;"><b>${name}</b></h3>
                        <p style="margin: 0; color: #666;">Código: ${code}</p>
                        <p style="margin: 0; color: #666;">Zona: ${zone}</p>
                        ${
                           props?.wheelchair_boarding
                              ? '<p style="margin: 0; color: #666;">♿ Accesible</p>'
                              : ""
                        }
                     </div>
                  `);
               }}
            />
         )}
      </MapContainer>
    </div>
   );
}
