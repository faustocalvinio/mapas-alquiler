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

interface Apartment {
   id: string;
   title?: string;
   address: string;
   price: number;
   zone?: string;
   notes?: string;
   lat: number;
   lng: number;
   createdAt: string;
}

interface MapViewProps {
   apartments: Apartment[];
}

export default function MapView({ apartments }: MapViewProps) {
   const mapRef = useRef<L.Map | null>(null);

   // Coordenadas de Madrid
   const madridCenter: [number, number] = [40.4168, -3.7038];

   return (
      <div className="relative h-[900px] w-full rounded-lg overflow-hidden border border-gray-300">
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
               >
                  <Popup>
                     <div className="p-2 min-w-48 max-w-64">
                        <h3 className="font-semibold text-lg">
                           {apartment.title || "Apartamento"}
                        </h3>
                        <p className="text-sm text-gray-600 mb-2">
                           {apartment.address}
                        </p>
                        <p className="text-lg font-bold text-blue-600 mb-2">
                           {apartment.price}€/mes
                        </p>
                        {apartment.zone && (
                           <p className="text-sm text-gray-500 mb-2">
                              Zona: {apartment.zone}
                           </p>
                        )}
                        {apartment.notes && (
                           <div className="mt-2 pt-2 border-t border-gray-200">
                              <p className="text-xs font-medium text-gray-700 mb-1">
                                 Notas:
                              </p>
                              <p className="text-sm text-gray-600 leading-relaxed">
                                 {apartment.notes}
                              </p>
                           </div>
                        )}
                     </div>
                  </Popup>
               </Marker>
            ))}
         </MapContainer>
      </div>
   );
}
