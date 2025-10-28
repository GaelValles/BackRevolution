import Carros from "../models/carros.model.js";
import Admin from "../models/admin.model.js";

export const agregarCarro = async (req, res) => {
    try {
        // 1. Añade 'tipo' a la desestructuración
        const { marca, modelo, año, placas, color, tipo } = req.body;
        
        const nuevoCarro = new Carros({
            marca,
            modelo,
            año,
            placas,
            color,
            tipo, // 2. Añade 'tipo' al nuevo objeto
            propietario: req.admin.id // 3. El propietario se toma del token
        });

        const carroGuardado = await nuevoCarro.save();

        // Actualizar el array de carros del cliente
        await Admin.findByIdAndUpdate(
            req.admin.id,
            { $push: { carros: carroGuardado._id } }
        );

        res.json(carroGuardado);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const eliminarCarro = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Verificar que el carro pertenezca al usuario autenticado
        const carro = await Carros.findOne({ _id: id, propietario: req.admin.id });
        if (!carro) return res.status(404).json({ message: "Carro no encontrado" });

        // Eliminar el carro
        await Carros.findByIdAndDelete(id);

        // Eliminar la referencia del carro en el array del cliente
        await Admin.findByIdAndUpdate(
            req.admin.id,
            { $pull: { carros: id } }
        );

        res.json({ message: "Carro eliminado correctamente" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const actualizarCarro = async (req, res) => {
    try {
        const { id } = req.params;
        const { marca, modelo, año, placas, color, tipo } = req.body;

        // Verificar que el carro pertenezca al usuario autenticado
        const carro = await Carros.findOne({ _id: id, propietario: req.admin.id });
        if (!carro) return res.status(404).json({ message: "Carro no encontrado" });

        const carroActualizado = await Carros.findByIdAndUpdate(
            id,
            { marca, modelo, año, placas, color, tipo },
            { new: true }
        );

        res.json(carroActualizado);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const obtenerCarros = async (req, res) => {
    try {
        const carros = await Carros.find({ propietario: req.admin.id });
        res.json(carros);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const obtenerCarro = async (req, res) => {
    try {
        const { id } = req.params;
        const carro = await Carros.findById(id)
            .populate('propietario', 'nombre correo telefono')
            .select('-__v')
            .lean();
        
        if (!carro) return res.status(404).json({ message: "Carro no encontrado" });
        
        res.json(carro);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const obtenerCarroPorPropietario = async (req, res) => {
    try {
        const { id } = req.params;
        
        // Obtener carros con información completa
        const carros = await Carros.find({ propietario: id })
            .populate('propietario', 'nombre correo telefono')
            .select('-__v')
            .lean();
        
        if (!carros || carros.length === 0) {
            return res.json([]);
        }

        res.json(carros);
    } catch (error) {
        res.status(500).json({ 
            message: "Error al obtener los carros", 
            error: error.message 
        });
    }
};