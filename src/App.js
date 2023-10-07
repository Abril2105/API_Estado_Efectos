import React, { useEffect, useState } from 'react';
import { useAppContext, actionTypes } from './AppContext';
var sanitizeUrl = require("@braintree/sanitize-url").sanitizeUrl;

function App() {
  const { state, dispatch } = useAppContext();
  const [totalProducts, setTotalProducts] = useState(0);
  const [cart, setCart] = useState([]);
  const [showCart, setShowCart] = useState(false);
  const [cartVisible, setCartVisible] = useState(false);
  const [userInitials, setUserInitials] = useState("");

  useEffect(() => {
    fetch("https://fakestoreapi.com/users/8")
      .then((res) => res.json())
      .then((userData) => {
        const name = userData.name;
        const firstName = userData.name.firstname;
        const lastName = userData.name.lastname;
        const initials = firstName.charAt(0) + lastName.charAt(0);
        setUserInitials(initials);
        // Esto establecerá las iniciales en userInitials
      })
      .catch((error) => {
        console.error('Error al cargar el usuario:', error);
      });
  }, []);


  useEffect(() => {
    fetch(`https://fakestoreapi.com/products?limit=10`)
      .then((res) => res.json())
      .then((data) => {
        setTotalProducts(data.length);
        dispatch({ type: actionTypes.SET_PRODUCTS, payload: data });
        dispatch({ type: actionTypes.SET_FILTERED_PRODUCTS, payload: data.slice(0, 6) });
      });
  }, [dispatch]);

  const addToCart = (product) => {
    setCart([...cart, product]);
  };

  const loadMoreProducts = () => {
    const startIndex = state.filteredProducts.length;
    let endIndex = startIndex + 10;

    if (endIndex > totalProducts) {
      endIndex = totalProducts;
    }

    const additionalProducts = state.products.slice(startIndex, endIndex);
    dispatch({ type: actionTypes.SET_FILTERED_PRODUCTS, payload: [...state.filteredProducts, ...additionalProducts] });
  };

  const toggleShowProducts = () => {
    if (state.showAllProducts) {
      console.log('Mostrar menos');
      dispatch({ type: actionTypes.SET_SHOW_ALL_PRODUCTS, payload: false });
    } else {
      console.log('Mostrar más');
      dispatch({ type: actionTypes.SET_SHOW_ALL_PRODUCTS, payload: true });
    }
  };


  const handleCategoryChange = (event) => {
    const selectedCategory = event.target.value;
    dispatch({ type: actionTypes.SET_CATEGORY, payload: selectedCategory });
  };

  const handleCategoryFilter = () => {
    if (state.filterCategory === '') {
      dispatch({ type: actionTypes.SET_FILTERED_PRODUCTS, payload: state.products });
    } else {
      const categoryUrls = {
        electronics: 'https://fakestoreapi.com/products/category/electronics',
        jewelery: 'https://fakestoreapi.com/products/category/jewelery',
        "mem's clothing": sanitizeUrl("https://example.com"),
        "men's clothing": 'https://fakestoreapi.com/products/category/men%27s%20clothing',
      };

      fetch(categoryUrls[state.filterCategory])
        .then((res) => res.json())
        .then((data) => {
          setTotalProducts(data.length);
          dispatch({ type: actionTypes.SET_FILTERED_PRODUCTS, payload: data });
          dispatch({ type: actionTypes.SET_CATEGORY, payload: state.filterCategory });
          dispatch({ type: actionTypes.SET_SHOW_ALL_PRODUCTS, payload: false });
        })
        .catch((error) => {
          console.error('Error al cargar productos de la categoría:', error);
        });
    }
  };

  const toggleCart = () => {
    setCartVisible(!cartVisible);
  };


  const renderCart = () => {
    return (
      <div className="cart">
        <h2>Carrito de Compras</h2>
        {cart.length === 0 ? (
          <p>El carrito está vacío</p>
        ) : (
          <ul>
            {cart.map((item) => (
              <li key={item.id}>
                {item.title} - ${item.price}
              </li>
            ))}
          </ul>
        )}
      </div>
    );
  };

  return (
    <div>
      <div style={{ position: 'absolute', top: '10px', right: '10px' }}>
        <button id='cart-button' onClick={toggleCart}>Carrito ({cart.length})</button>
      </div>

      {cartVisible && (
        <div className="cart">
          <button onClick={toggleCart} className="close-cart-button">
            Cerrar carrito
          </button>
          <h2>Carrito de Compras</h2>
          {cart.length === 0 ? (
            <p>El carrito está vacío</p>
          ) : (
            <ul>
              {cart.map((item) => (
                <li key={item.id}>
                  {item.title} - ${item.price}
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
      <h1>Lista de Productos</h1>
      <div>
        <label htmlFor="category">Filtrar por categoría: </label>
        <select
          id="category"
          value={state.filterCategory}
          onChange={handleCategoryChange}
        >
          <option value="">Todas las categorías</option>
          <option value="electronics">Electrónicos</option>
          <option value="jewelery">Joyas</option>
          <option value="men's clothing">Ropa para Hombres</option>
        </select>
        <button onClick={handleCategoryFilter}>Filtrar</button>
      </div>
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between' }}>
        {state.filteredProducts.map((product) => (
          <div key={product.id} style={{ width: 'calc(33.33% - 20px)', marginBottom: '20px', border: '1px solid #ccc', padding: '10px', boxSizing: 'border-box' }}>
            <img src={product.image} alt={product.title} style={{ height: '100%', width: '30%', maxHeight: '150px' }} />
            <p>Nombre: {product.title}</p>
            <p>Precio: ${product.price}</p>
            <p>Categoría: {product.category}</p>
            <p>Descripción: {product.description}</p>
            <button onClick={() => addToCart(product)}>Agregar al carrito</button>
          </div>
        ))}
      </div>
      <div style={{ display: 'flex', justifyContent: 'center' }}>
        {!state.showAllProducts && (
          <button onClick={loadMoreProducts}>Ver Más</button>
        )}
        {state.showAllProducts && (
          <button onClick={toggleShowProducts}>Ver menos</button>
        )}
      </div>
      {showCart && renderCart()}
      <div className="user-circle">
        <p>{userInitials}</p>
      </div>
    </div>
  );
}

export default App;
