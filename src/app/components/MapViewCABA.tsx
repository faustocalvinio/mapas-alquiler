"use client";

import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { Apartment } from "@/utils/apartments";

interface MapViewCABAProps {
   apartments: Apartment[];
}

// Centro de Palermo, Buenos Aires
const PALERMO_CENTER: [number, number] = [-34.5875, -58.42];
const DEFAULT_ZOOM = 13;

export default function MapViewCABA({ apartments }: MapViewCABAProps) {
   const mapRef = useRef<L.Map | null>(null);
   const markersRef = useRef<L.Marker[]>([]);

   useEffect(() => {
      // Inicializar el mapa solo una vez
      if (!mapRef.current) {
         mapRef.current = L.map("map-caba").setView(
            PALERMO_CENTER,
            DEFAULT_ZOOM
         );

         // Agregar capa de OpenStreetMap
         L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
            attribution:
               '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors',
            maxZoom: 19,
         }).addTo(mapRef.current);
      }

      return () => {
         // Cleanup al desmontar
         if (mapRef.current) {
            mapRef.current.remove();
            mapRef.current = null;
         }
      };
   }, []);

   useEffect(() => {
      if (!mapRef.current) return;

      // Limpiar marcadores anteriores
      markersRef.current.forEach((marker) => marker.remove());
      markersRef.current = [];

      // Agregar nuevos marcadores para cada apartamento
      apartments.forEach((apartment) => {
         if (!mapRef.current) return;

         // Determinar el icono según el estado
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

         // Crear popup con información del apartamento
         const popupContent = createPopupContent(apartment);
         marker.bindPopup(popupContent, {
            maxWidth: 300,
            className: "apartment-popup",
         });

         marker.addTo(mapRef.current);
         markersRef.current.push(marker);
      });

      // Ajustar el mapa para mostrar todos los marcadores
      if (apartments.length > 0 && mapRef.current) {
         const bounds = L.latLngBounds(
            apartments.map((apt) => [apt.lat, apt.lng])
         );
         mapRef.current.fitBounds(bounds, {
            padding: [50, 50],
            maxZoom: 15,
         });
      }
   }, [apartments]);

   return (
      <>
         <div id="map-caba" className="w-full h-full" />
         <style jsx global>{`
            .custom-marker {
               background: none;
               border: none;
            }

            .apartment-popup .leaflet-popup-content-wrapper {
               border-radius: 8px;
               padding: 0;
            }

            .apartment-popup .leaflet-popup-content {
               margin: 0;
               width: 280px !important;
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
            ? `<p style="margin: 8px 0 0 0; padding-top: 8px; border-top: 1px solid #E5E7EB; font-size: 11px; color: #6B7280; font-style: italic;">📝 ${
                 apartment.notes.length > 100
                    ? apartment.notes.substring(0, 100) + "..."
                    : apartment.notes
              }</p>`
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
