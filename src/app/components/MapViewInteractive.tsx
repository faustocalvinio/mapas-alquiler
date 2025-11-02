"use client";

import { useEffect, useRef, useState } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Apartment } from "@/utils/apartments";

interface MapViewInteractiveProps {
   apartments: Apartment[];
   onMapClick?: (lat: number, lng: number) => void;
   selectedLocation?: { lat: number; lng: number } | null;
}

// Centro de Palermo, Buenos Aires
const PALERMO_CENTER: [number, number] = [-34.5875, -58.42];
const DEFAULT_ZOOM = 13;

export default function MapViewInteractive({
   apartments,
   onMapClick,
   selectedLocation,
}: MapViewInteractiveProps) {
   const mapRef = useRef<L.Map | null>(null);
   const markersRef = useRef<L.Marker[]>([]);
   const tempMarkerRef = useRef<L.Marker | null>(null);
   const [mapReady, setMapReady] = useState(false);

   useEffect(() => {
      // Inicializar el mapa solo una vez
      if (!mapRef.current) {
         mapRef.current = L.map("map-interactive").setView(
            PALERMO_CENTER,
            DEFAULT_ZOOM
         );

         // Agregar capa de OpenStreetMap
         L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution:
               '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19,
         }).addTo(mapRef.current);

         // Si hay callback de click, agregar evento
         if (onMapClick) {
            mapRef.current.on("click", (e: L.LeafletMouseEvent) => {
               onMapClick(e.latlng.lat, e.latlng.lng);
            });
         }

         setMapReady(true);
      }

      return () => {
         // Cleanup al desmontar
         if (tempMarkerRef.current) {
            try {
               // Cerrar popup si está abierto
               if (tempMarkerRef.current.getPopup()) {
                  tempMarkerRef.current.closePopup();
               }
               if (
                  mapRef.current &&
                  mapRef.current.hasLayer(tempMarkerRef.current)
               ) {
                  mapRef.current.removeLayer(tempMarkerRef.current);
               }
            } catch (error) {
               console.warn("Error al limpiar marcador temporal:", error);
            }
            tempMarkerRef.current = null;
         }

         markersRef.current.forEach((marker) => {
            try {
               // Cerrar popup si está abierto
               if (marker.getPopup()) {
                  marker.closePopup();
               }
               if (mapRef.current && mapRef.current.hasLayer(marker)) {
                  mapRef.current.removeLayer(marker);
               }
            } catch (error) {
               console.warn("Error al limpiar marcador:", error);
            }
         });
         markersRef.current = [];

         if (mapRef.current) {
            try {
               // Cerrar todos los popups abiertos
               mapRef.current.closePopup();
               mapRef.current.remove();
            } catch (error) {
               console.warn("Error al remover mapa:", error);
            }
            mapRef.current = null;
         }
      };
   }, [onMapClick]);

   // Actualizar marcador temporal de selección
   useEffect(() => {
      if (!mapRef.current || !mapReady) return;

      // Remover marcador temporal anterior de forma segura
      if (tempMarkerRef.current) {
         try {
            // Cerrar popup si está abierto
            if (tempMarkerRef.current.getPopup()) {
               tempMarkerRef.current.closePopup();
            }
            // Remover del mapa
            if (
               mapRef.current &&
               mapRef.current.hasLayer(tempMarkerRef.current)
            ) {
               mapRef.current.removeLayer(tempMarkerRef.current);
            }
         } catch (error) {
            console.warn("Error al remover marcador temporal:", error);
         }
         tempMarkerRef.current = null;
      }

      // Agregar nuevo marcador temporal si hay ubicación seleccionada
      if (selectedLocation) {
         const icon = L.divIcon({
            html: `
          <div style="
            position: relative;
            display: flex;
            align-items: center;
            justify-content: center;
            animation: bounce 0.5s;
          ">
            <div style="
              width: 40px;
              height: 40px;
              background-color: #EF4444;
              border: 3px solid white;
              border-radius: 50% 50% 50% 0;
              transform: rotate(-45deg);
              box-shadow: 0 4px 12px rgba(239, 68, 68, 0.5);
            "></div>
            <div style="
              position: absolute;
              font-size: 20px;
              transform: rotate(0deg);
            ">📍</div>
          </div>
          <style>
            @keyframes bounce {
              0%, 100% { transform: translateY(0); }
              50% { transform: translateY(-10px); }
            }
          </style>
        `,
            className: "temp-marker",
            iconSize: [40, 40],
            iconAnchor: [20, 40],
         });

         tempMarkerRef.current = L.marker(
            [selectedLocation.lat, selectedLocation.lng],
            { icon }
         )
            .addTo(mapRef.current)
            .bindPopup("📍 Nueva ubicación seleccionada");

         // Centrar el mapa en la nueva ubicación
         mapRef.current.setView(
            [selectedLocation.lat, selectedLocation.lng],
            16
         );
      }
   }, [selectedLocation, mapReady]);

   // Actualizar marcadores de apartamentos
   useEffect(() => {
      if (!mapRef.current || !mapReady) return;

      // Limpiar marcadores anteriores de forma segura
      markersRef.current.forEach((marker) => {
         try {
            // Cerrar popup si está abierto
            if (marker.getPopup()) {
               marker.closePopup();
            }
            // Remover del mapa
            if (mapRef.current && mapRef.current.hasLayer(marker)) {
               mapRef.current.removeLayer(marker);
            }
         } catch (error) {
            console.warn("Error al remover marcador:", error);
         }
      });
      markersRef.current = [];

      // Agregar nuevos marcadores para cada apartamento
      apartments.forEach((apartment) => {
         if (!mapRef.current) return;

         const iconHtml = getIconHtml(apartment);

         const customIcon = L.divIcon({
            html: iconHtml,
            className: "custom-marker",
            iconSize: [40, 40],
            iconAnchor: [20, 40],
            popupAnchor: [0, -40],
         });

         const marker = L.marker([apartment.lat, apartment.lng], {
            icon: customIcon,
         });

         const popupContent = createPopupContent(apartment);
         marker.bindPopup(popupContent, {
            maxWidth: 300,
            className: "apartment-popup",
         });

         marker.addTo(mapRef.current);
         markersRef.current.push(marker);
      });

      // Ajustar el mapa para mostrar todos los marcadores si no hay selección
      if (apartments.length > 0 && !selectedLocation && mapRef.current) {
         const bounds = L.latLngBounds(
            apartments.map((apt) => [apt.lat, apt.lng])
         );
         mapRef.current.fitBounds(bounds, {
            padding: [50, 50],
            maxZoom: 15,
         });
      }
   }, [apartments, mapReady, selectedLocation]);

   return (
      <>
         <div id="map-interactive" className="w-full h-full" />
         <style jsx global>{`
            .custom-marker {
               background: none;
               border: none;
            }

            .temp-marker {
               background: none;
               border: none;
               z-index: 1000 !important;
            }

            .apartment-popup .leaflet-popup-content-wrapper {
               border-radius: 8px;
               padding: 0;
            }

            .apartment-popup .leaflet-popup-content {
               margin: 0;
               width: 280px !important;
            }

            .leaflet-container {
               cursor: crosshair;
            }

            .leaflet-marker-icon {
               transition: all 0.3s ease;
            }

            .leaflet-marker-icon:hover {
               transform: scale(1.1);
            }
         `}</style>
      </>
   );
}

function getIconHtml(apartment: Apartment): string {
   const statusEmoji =
      {
         available: "🏠",
         reserved: "⏳",
         rented: "🔒",
      }[apartment.status] || "🏠";

   const color = apartment.iconColor || "#3B82F6";

   return `
    <div style="
      position: relative;
      display: flex;
      align-items: center;
      justify-content: center;
    ">
      <div style="
        width: 36px;
        height: 36px;
        background-color: ${color};
        border: 3px solid white;
        border-radius: 50% 50% 50% 0;
        transform: rotate(-45deg);
        box-shadow: 0 2px 8px rgba(0,0,0,0.3);
      "></div>
      <div style="
        position: absolute;
        font-size: 18px;
        transform: rotate(0deg);
      ">${statusEmoji}</div>
    </div>
  `;
}

function createPopupContent(apartment: Apartment): string {
   const priceUSD = apartment.priceUSD.toLocaleString("es-AR", {
      style: "currency",
      currency: "USD",
      minimumFractionDigits: 0,
   });

   const priceARS = (
      apartment.priceARS || apartment.priceUSD * 1500
   ).toLocaleString("es-AR", {
      style: "currency",
      currency: "ARS",
      minimumFractionDigits: 0,
   });

   const statusLabel =
      {
         available: "Disponible",
         reserved: "Reservado",
         rented: "Alquilado",
      }[apartment.status] || apartment.status;

   const statusColor =
      {
         available: "#10B981",
         reserved: "#F59E0B",
         rented: "#EF4444",
      }[apartment.status] || "#6B7280";

   let detailsHtml = "";
   if (apartment.rooms || apartment.bathrooms || apartment.squareMeters) {
      const details = [];
      if (apartment.rooms) details.push(`${apartment.rooms} amb.`);
      if (apartment.bathrooms)
         details.push(
            `${apartment.bathrooms} baño${apartment.bathrooms > 1 ? "s" : ""}`
         );
      if (apartment.squareMeters) details.push(`${apartment.squareMeters} m²`);
      detailsHtml = `<p style="margin: 8px 0; font-size: 12px; color: #6B7280;">${details.join(
         " • "
      )}</p>`;
   }

   return `
    <div style="padding: 12px;">
      ${
         apartment.title
            ? `<h3 style="margin: 0 0 8px 0; font-size: 16px; font-weight: 600; color: #111827;">${apartment.title}</h3>`
            : ""
      }
      <p style="margin: 0 0 8px 0; font-size: 13px; color: #374151;">📍 ${
         apartment.address
      }</p>
      ${
         apartment.zone
            ? `<p style="margin: 0 0 8px 0; font-size: 12px; color: #6B7280;">${
                 apartment.zone
              }${
                 apartment.neighborhood ? ` - ${apartment.neighborhood}` : ""
              }</p>`
            : ""
      }
      ${detailsHtml}
      <div style="margin: 8px 0; padding: 8px; background-color: #F3F4F6; border-radius: 6px;">
        <p style="margin: 0; font-size: 18px; font-weight: 700; color: #2563EB;">${priceUSD}</p>
        <p style="margin: 4px 0 0 0; font-size: 13px; color: #6B7280;">${priceARS}</p>
      </div>
      ${
         apartment.expenses
            ? `<p style="margin: 8px 0; font-size: 12px; color: #6B7280;">💰 Expensas: ${apartment.expenses.toLocaleString(
                 "es-AR",
                 {
                    style: "currency",
                    currency: "ARS",
                    minimumFractionDigits: 0,
                 }
              )}</p>`
            : ""
      }
      <div style="display: flex; align-items: center; justify-content: space-between; margin-top: 8px;">
        <span style="
          display: inline-block;
          padding: 4px 8px;
          background-color: ${statusColor}20;
          color: ${statusColor};
          border-radius: 4px;
          font-size: 11px;
          font-weight: 600;
        ">${statusLabel}</span>
        ${
           apartment.link
              ? `<a href="${apartment.link}" target="_blank" rel="noopener noreferrer" style="
          display: inline-block;
          padding: 4px 12px;
          background-color: #2563EB;
          color: white;
          border-radius: 4px;
          font-size: 11px;
          font-weight: 600;
          text-decoration: none;
        ">Ver más</a>`
              : ""
        }
      </div>
      ${
         apartment.notes
            ? `<p style="margin: 8px 0 0 0; padding-top: 8px; border-top: 1px solid #E5E7EB; font-size: 11px; color: #6B7280; font-style: italic;">📝 ${apartment.notes}</p>`
            : ""
      }
      ${
         apartment.createdBy
            ? `<p style="margin: 8px 0 0 0; font-size: 10px; color: #9CA3AF;">Agregado por: ${apartment.createdBy}</p>`
            : ""
      }
    </div>
  `;
}
