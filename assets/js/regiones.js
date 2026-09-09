// Datos para los dos <select> encadenados del registro.
// El anexo dice que este arreglo viene con el material del docente; mientras no
// aparezca, usamos estas tres regiones con sus comunas reales. Si después llega
// el archivo oficial, se reemplaza este y el resto del código no cambia.

const REGIONES = [
	{
		nombre: "Región de Coquimbo",
		comunas: ["La Serena", "Coquimbo", "Ovalle", "Vicuña", "Andacollo", "Illapel", "Salamanca", "Monte Patria", "Los Vilos"]
	},
	{
		nombre: "Región de Valparaíso",
		comunas: ["Valparaíso", "Viña del Mar", "Quilpué", "Villa Alemana", "Quillota", "La Calera", "San Antonio", "Los Andes"]
	},
	{
		nombre: "Región Metropolitana de Santiago",
		comunas: ["Santiago", "Providencia", "Ñuñoa", "Las Condes", "Maipú", "La Florida", "Puente Alto", "Recoleta", "Quilicura"]
	}
];
