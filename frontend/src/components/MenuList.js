import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import '../styles/MenuList.css'; // Asegúrate de que el archivo CSS esté en la misma carpeta o ajusta la ruta según sea necesario
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPlus } from '@fortawesome/free-solid-svg-icons';
import { CartContext } from '../context/CartContext';
import CustomizationModal from './CustomizationModal';

function MenuList() {
  const [menuItems, setMenuItems] = useState([]); // Array vacío
  const [categorias, setCategorias] = useState([]); // Array vacío
  const [error, setError] = useState(null);
  const [customizingItem, setCustomizingItem] = useState(null);
  const [open, setOpen] = useState(false);
  const { addToCart } = useContext(CartContext);


  // Hook useEffect para ejecutar fetchMenu cuando el componente se monta  
  useEffect(() => {
    // Función para obtener el menú desde el backend
    async function fetchMenu() { // Función asíncrona
      try {
        const response = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/menu`);
        const responseCategorias = await axios.get(`${process.env.REACT_APP_BACKEND_URL}/api/categorias`);

        // Ordenar las categorías por el campo 'orden'
        const categoriasOrdenadas = responseCategorias.data.sort((a, b) => a.orden - b.orden);

        setMenuItems(response.data); // Actualiza el estado con los datos del menú
        setCategorias(categoriasOrdenadas); // Actualiza el estado con las categorías ordenadas
      } catch (error) {
        console.error('Error al obtener el menú:', error);
        setError('Hubo un problema al obtener el menú. Por favor, espera 1 minuto e intenta nuevamente.');
      }
    }

    // Llama a la función para obtener el menú al cargar el componente
    fetchMenu();
  }, []); // El segundo argumento [] asegura que useEffect solo se ejecute una vez al montar el componente

  // Clasificar por categorías
  const groupedMenuItems = menuItems.reduce((acc, item) => {
    if (!acc[item.tipo_id]) {
      acc[item.tipo_id] = [];
    }
    acc[item.tipo_id].push(item);
    return acc;
  }, {});

  // Función para manejar la personalización y agregar al carrito
  const handleAddToCart = (item) => {
    if (item.tipo_combinacion !== 4 && item.tipo_combinacion !== null) {
      setCustomizingItem(item);
    } else {
      addToCart(item);
    }
  };

  const handleCloseModal = () => {
    setCustomizingItem(null);
  };


  return (
    <div className="menu-list">
      <h1>Menú</h1>
      {error && <p>{error}</p>}
      <div className="menu-categoria-container">
        {categorias.map(categoria => (
          <div key={categoria.id} className="menu-categoria">
            <h2 className="menu-categoria-title">{categoria.nombre}</h2>
            <div className="menu-items-container">
              {groupedMenuItems[categoria.id] && groupedMenuItems[categoria.id].map(item => (
                <div key={item.id} className="menu-item">
                  <h3>{item.nombre}</h3>
                  <img src={item.image_url} alt={item.nombre} className="menu-item-image" />
                  <p className="menu-item-descripcion">{item.descripcion}</p>
                  <span className="menu-item-price">${item.precio}</span>
                  <button className="menu-item-button" onClick={() => handleAddToCart(item)}>
                    {item.tipo_combinacion !== 4 && item.tipo_combinacion !== null  ? 'Personalizar' : 'Agregar'}
                  </button>
                </div>
              ))}
            </div>
          </div>
        ))}
        {customizingItem && (
          <CustomizationModal
            item={customizingItem}
            onClose={handleCloseModal}
          />
        )}
      </div>

    </div>
  );
}

export default MenuList;
