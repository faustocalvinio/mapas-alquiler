"use client";

import { useRef } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";

// Configurar iconos de Leaflet
delete (L.Icon.Default.prototype as Record<string, any>)._getIconUrl;
L.Icon.Default.mergeOptions({
   iconRetinaUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
   iconUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
   shadowUrl:
      "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

// Función para crear iconos personalizados con colores
const createCustomIcon = (color: string, status: string) => {
   const statusIcon = status === "rented" ? "🔴" : "🟢";

   return L.divIcon({
      html: `
         <div style="
            background-color: ${color};
            width: 30px;
            height: 30px;
            border-radius: 50% 50% 50% 0;
            border: 3px solid white;
            transform: rotate(-45deg);
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 3px 8px rgba(0,0,0,0.4);
         ">
            <span style="
               transform: rotate(45deg);
               font-size: 12px;
               color: white;
               text-shadow: 1px 1px 2px rgba(0,0,0,0.8);
            ">${statusIcon}</span>
         </div>
      `,
      className: "custom-marker-fullscreen",
      iconSize: [30, 30],
      iconAnchor: [15, 30],
      popupAnchor: [0, -30],
   });
};

// Función para crear iconos de ubicaciones personalizadas
const createLocationIcon = (color: string, type: string) => {
   const typeIcons: { [key: string]: string } = {
      work: "💼",
      metro: "🚇",
      poi: "📍",
      other: "📌",
   };

   const icon = typeIcons[type] || "📌";

   return L.divIcon({
      html: `
         <div style="
            background-color: ${color};
            width: 35px;
            height: 35px;
            border-radius: 50%;
            border: 3px solid white;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 3px 10px rgba(0,0,0,0.5);
         ">
            <span style="
               font-size: 16px;
               filter: drop-shadow(1px 1px 1px rgba(0,0,0,0.5));
            ">${icon}</span>
         </div>
      `,
      className: "custom-location-marker-fullscreen",
      iconSize: [35, 35],
      iconAnchor: [17, 17],
      popupAnchor: [0, -17],
   });
};

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

interface Location {
   id: string;
   name: string;
   address: string;
   type: string;
   description?: string;
   lat: number;
   lng: number;
   iconColor: string;
   createdAt: string;
}

interface FullScreenMapViewProps {
   apartments: Apartment[];
   locations?: Location[];
}

export default function FullScreenMapView({
   apartments,
   locations = [],
}: FullScreenMapViewProps) {
   const mapRef = useRef<L.Map | null>(null);

   // Coordenadas de Madrid
   const madridCenter: [number, number] = [40.4168, -3.7038];

   const getLocationTypeLabel = (type: string) => {
      const typeLabels: { [key: string]: string } = {
         work: "Trabajo",
         metro: "Metro/Transporte",
         poi: "Punto de Interés",
         other: "Otro",
      };
      return typeLabels[type] || "Otro";
   };

   return (
      <div className="h-full w-full">
         <MapContainer
            center={madridCenter}
            zoom={11}
            style={{ height: "100%", width: "100%" }}
            ref={mapRef}
         >
            <TileLayer
               attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
               url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />

            {apartments.map((apartment) => (
               <Marker
                  key={apartment.id}
                  position={[apartment.lat, apartment.lng]}
                  icon={createCustomIcon(apartment.iconColor, apartment.status)}
               >
                  <Popup>
                     <div className="p-3 min-w-60 max-w-80">
                        <div className="flex items-center justify-between mb-3">
                           <h3 className="font-semibold text-lg">
                              {apartment.title || "Apartamento"}
                           </h3>
                           <span
                              className={`px-2 py-1 rounded-full text-xs font-medium ${
                                 apartment.status === "rented"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-green-100 text-green-800"
                              }`}
                           >
                              {apartment.status === "rented"
                                 ? "🔴 Alquilado"
                                 : "🟢 Disponible"}
                           </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                           📍 {apartment.address}
                        </p>
                        <p className="text-xl font-bold text-blue-600 mb-3">
                           💰 {apartment.price}€/mes
                        </p>
                        {apartment.zone && (
                           <p className="text-sm text-gray-500 mb-2">
                              🏘️ Zona: {apartment.zone}
                           </p>
                        )}
                        {apartment.notes && (
                           <div className="mt-3 pt-3 border-t border-gray-200">
                              <p className="text-xs font-medium text-gray-700 mb-1">
                                 📝 Notas:
                              </p>
                              <p className="text-sm text-gray-600 leading-relaxed">
                                 {apartment.notes}
                              </p>
                           </div>
                        )}
                        {apartment.link && (
                           <div className="mt-3 pt-3 border-t border-gray-200">
                              <p className="text-xs font-medium text-gray-700 mb-1">
                                 🔗 Link:
                              </p>
                              <a
                                 href={apartment.link}
                                 target="_blank"
                                 rel="noopener noreferrer"
                                 className="inline-flex items-center gap-1 text-sm text-blue-600 hover:text-blue-800 underline break-all"
                              >
                                 <svg
                                    className="w-4 h-4 flex-shrink-0"
                                    fill="none"
                                    stroke="currentColor"
                                    viewBox="0 0 24 24"
                                 >
                                    <path
                                       strokeLinecap="round"
                                       strokeLinejoin="round"
                                       strokeWidth={2}
                                       d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-2M14 4h6m0 0v6m0-6L10 14"
                                    />
                                 </svg>
                                 {apartment.link}
                              </a>
                           </div>
                        )}
                        {apartment.createdBy && (
                           <div className="mt-3 pt-3 border-t border-gray-200">
                              <p className="text-xs text-gray-500">
                                 👤 Agregado por:{" "}
                                 <span className="font-medium text-blue-600">
                                    {apartment.createdBy}
                                 </span>
                              </p>
                           </div>
                        )}
                        <div className="mt-3 pt-3 border-t border-gray-200">
                           <p className="text-xs text-gray-400">
                              📅{" "}
                              {new Date(apartment.createdAt).toLocaleDateString(
                                 "es-ES"
                              )}
                           </p>
                        </div>
                     </div>
                  </Popup>
               </Marker>
            ))}

            {locations.map((location) => (
               <Marker
                  key={`location-${location.id}`}
                  position={[location.lat, location.lng]}
                  icon={createLocationIcon(location.iconColor, location.type)}
               >
                  <Popup>
                     <div className="p-3 min-w-56 max-w-72">
                        <div className="flex items-center justify-between mb-3">
                           <h3 className="font-semibold text-xl text-purple-700">
                              {location.name}
                           </h3>
                           <span className="px-2 py-1 rounded-full text-xs font-medium bg-purple-100 text-purple-800">
                              {getLocationTypeLabel(location.type)}
                           </span>
                        </div>
                        <p className="text-sm text-gray-600 mb-3">
                           📍 {location.address}
                        </p>
                        {location.description && (
                           <div className="mt-3 pt-3 border-t border-gray-200">
                              <p className="text-xs font-medium text-gray-700 mb-1">
                                 Descripción:
                              </p>
                              <p className="text-sm text-gray-600 leading-relaxed">
                                 {location.description}
                              </p>
                           </div>
                        )}
                        <div className="mt-3 pt-3 border-t border-gray-200">
                           <p className="text-xs text-gray-400">
                              📅 Agregado:{" "}
                              {new Date(location.createdAt).toLocaleDateString(
                                 "es-ES"
                              )}
                           </p>
                        </div>
                     </div>
                  </Popup>
               </Marker>
            ))}
         </MapContainer>
      </div>
   );
}
