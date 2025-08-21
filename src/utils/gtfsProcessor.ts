import { Feature, Point, LineString, FeatureCollection } from 'geojson';

// Interfaces para los datos GTFS
interface GTFSStop {
    stop_id: string;
    stop_code: string;
    stop_name: string;
    stop_desc: string;
    stop_lat: number;
    stop_lon: number;
    zone_id: string;
    stop_url: string;
    location_type: number;
    parent_station: string;
    stop_timezone: string;
    wheelchair_boarding: number;
}

interface GTFSRoute {
    route_id: string;
    agency_id: string;
    route_short_name: string;
    route_long_name: string;
    route_desc: string;
    route_type: number;
    route_url: string;
    route_color: string;
    route_text_color: string;
}

interface GTFSShape {
    shape_id: string;
    shape_pt_lat: number;
    shape_pt_lon: number;
    shape_pt_sequence: number;
    shape_dist_traveled: number;
}

// Función para parsear CSV
function parseCSV<T>(csvText: string, transform: (row: any) => T): T[] {
    const lines = csvText.trim().split('\n');
    const headers = lines[0].split(',');

    return lines.slice(1).map(line => {
        const values = line.split(',');
        const row: any = {};

        headers.forEach((header, index) => {
            row[header.trim()] = values[index]?.trim() || '';
        });

        return transform(row);
    });
}

// Transformadores para cada tipo de datos
const transformStop = (row: any): GTFSStop => ({
    stop_id: row.stop_id,
    stop_code: row.stop_code,
    stop_name: row.stop_name,
    stop_desc: row.stop_desc,
    stop_lat: parseFloat(row.stop_lat),
    stop_lon: parseFloat(row.stop_lon),
    zone_id: row.zone_id,
    stop_url: row.stop_url,
    location_type: parseInt(row.location_type) || 0,
    parent_station: row.parent_station,
    stop_timezone: row.stop_timezone,
    wheelchair_boarding: parseInt(row.wheelchair_boarding) || 0,
});

const transformRoute = (row: any): GTFSRoute => ({
    route_id: row.route_id,
    agency_id: row.agency_id,
    route_short_name: row.route_short_name,
    route_long_name: row.route_long_name,
    route_desc: row.route_desc,
    route_type: parseInt(row.route_type) || 0,
    route_url: row.route_url,
    route_color: row.route_color,
    route_text_color: row.route_text_color,
});

const transformShape = (row: any): GTFSShape => ({
    shape_id: row.shape_id,
    shape_pt_lat: parseFloat(row.shape_pt_lat),
    shape_pt_lon: parseFloat(row.shape_pt_lon),
    shape_pt_sequence: parseInt(row.shape_pt_sequence),
    shape_dist_traveled: parseFloat(row.shape_dist_traveled) || 0,
});

// Función principal para procesar los datos GTFS
export async function processGTFSData(dataFolder: string): Promise<{
    stopsGeoJSON: FeatureCollection<Point>;
    routesGeoJSON: FeatureCollection<LineString>;
}> {
    try {
        // Cargar archivos CSV
        const [stopsResponse, routesResponse, shapesResponse] = await Promise.all([
            fetch(`/data/${dataFolder}/stops.txt`),
            fetch(`/data/${dataFolder}/routes.txt`),
            fetch(`/data/${dataFolder}/shapes.txt`),
        ]);

        const [stopsText, routesText, shapesText] = await Promise.all([
            stopsResponse.text(),
            routesResponse.text(),
            shapesResponse.text(),
        ]);

        // Parsear datos
        const stops = parseCSV(stopsText, transformStop);
        const routes = parseCSV(routesText, transformRoute);
        const shapes = parseCSV(shapesText, transformShape);

        // Crear GeoJSON para paradas
        const stopsFeatures: Feature<Point>[] = stops
            .filter(stop => stop.location_type === 0) // Solo paradas principales
            .map(stop => ({
                type: 'Feature',
                properties: {
                    id: stop.stop_id,
                    name: stop.stop_name,
                    code: stop.stop_code,
                    description: stop.stop_desc,
                    wheelchair_boarding: stop.wheelchair_boarding,
                    zone: stop.zone_id,
                },
                geometry: {
                    type: 'Point',
                    coordinates: [stop.stop_lon, stop.stop_lat],
                },
            }));

        // Agrupar shapes por shape_id y crear líneas
        const shapeGroups = shapes.reduce((groups, shape) => {
            if (!groups[shape.shape_id]) {
                groups[shape.shape_id] = [];
            }
            groups[shape.shape_id].push(shape);
            return groups;
        }, {} as Record<string, GTFSShape[]>);

        // Crear GeoJSON para rutas
        const routesFeatures: Feature<LineString>[] = [];

        routes.forEach(route => {
            // Buscar shapes relacionadas con esta ruta
            const relatedShapes = Object.entries(shapeGroups).filter(([shapeId]) =>
                shapeId.includes(route.route_short_name) || shapeId.includes(route.route_id)
            );

            relatedShapes.forEach(([shapeId, shapePoints]) => {
                // Ordenar puntos por secuencia
                const sortedPoints = shapePoints.sort((a, b) => a.shape_pt_sequence - b.shape_pt_sequence);

                // Crear coordenadas para LineString
                const coordinates: [number, number][] = sortedPoints.map(point => [
                    point.shape_pt_lon,
                    point.shape_pt_lat,
                ]);

                if (coordinates.length > 1) {
                    routesFeatures.push({
                        type: 'Feature',
                        properties: {
                            route_id: route.route_id,
                            route_short_name: route.route_short_name,
                            route_long_name: route.route_long_name,
                            route_color: `#${route.route_color}`,
                            route_text_color: `#${route.route_text_color}`,
                            shape_id: shapeId,
                        },
                        geometry: {
                            type: 'LineString',
                            coordinates,
                        },
                    });
                }
            });
        });

        const stopsGeoJSON: FeatureCollection<Point> = {
            type: 'FeatureCollection',
            features: stopsFeatures,
        };

        const routesGeoJSON: FeatureCollection<LineString> = {
            type: 'FeatureCollection',
            features: routesFeatures,
        };

        return {
            stopsGeoJSON,
            routesGeoJSON,
        };
    } catch (error) {
        console.error('Error procesando datos GTFS:', error);
        throw error;
    }
}
