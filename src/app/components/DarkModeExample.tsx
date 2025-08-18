export default function DarkModeExample() {
   return (
      <div className="min-h-screen bg-background text-foreground transition-colors">
         {/* Header */}
         <header className="bg-card border-b border-border p-4">
            <h1 className="text-2xl font-bold text-foreground">
               Mi Aplicación con Modo Oscuro
            </h1>
         </header>

         {/* Main content */}
         <main className="container mx-auto p-4 space-y-6">
            {/* Card example */}
            <div className="bg-card text-card-foreground p-6 rounded-lg border border-border shadow-sm">
               <h2 className="text-xl font-semibold mb-4">Ejemplo de Card</h2>
               <p className="text-muted-foreground mb-4">
                  Este texto se adapta automáticamente al modo oscuro según las
                  preferencias del sistema.
               </p>

               {/* Buttons */}
               <div className="flex gap-4">
                  <button className="bg-primary text-primary-foreground px-4 py-2 rounded-md hover:bg-primary/90 transition-colors">
                     Botón Primario
                  </button>
                  <button className="bg-secondary text-secondary-foreground px-4 py-2 rounded-md hover:bg-secondary/80 transition-colors">
                     Botón Secundario
                  </button>
               </div>
            </div>

            {/* Input example */}
            <div className="bg-card text-card-foreground p-6 rounded-lg border border-border">
               <h3 className="text-lg font-semibold mb-4">
                  Formulario de Ejemplo
               </h3>
               <div className="space-y-4">
                  <input
                     type="text"
                     placeholder="Escribe algo aquí..."
                     className="w-full px-3 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
                  />
                  <textarea
                     placeholder="Descripción..."
                     rows={4}
                     className="w-full px-3 py-2 bg-input border border-border rounded-md focus:outline-none focus:ring-2 focus:ring-ring text-foreground placeholder:text-muted-foreground"
                  />
               </div>
            </div>

            {/* Status indicator */}
            <div className="bg-card text-card-foreground p-4 rounded-lg border border-border">
               <p className="text-sm text-muted-foreground">
                  💡 <strong>Tip:</strong> Cambia las preferencias de tu sistema
                  operativo para ver el modo oscuro en acción. En Windows:
                  Configuración → Personalización → Colores → Elegir el modo
               </p>
            </div>
         </main>
      </div>
   );
}
