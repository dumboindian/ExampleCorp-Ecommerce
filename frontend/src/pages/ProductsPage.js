import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faSearch, faFilter } from '@fortawesome/free-solid-svg-icons';
import './ProductsPage.css';

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [sortBy, setSortBy] = useState('name');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          'https://examplecorp-ecommerce.onrender.com/api/products'
        );

        const apiProducts = response.data?.data;

        if (!Array.isArray(apiProducts)) {
          throw new Error('The API response did not contain a product list.');
        }

        setProducts(apiProducts);
        setError(null);
      } catch (err) {
        console.error('Error fetching products:', err);
        setProducts([]);
        setError('Could not load products. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    const search = searchTerm.toLowerCase();

    const filtered = products.filter((product) =>
      product.name?.toLowerCase().includes(search)
    );

    filtered.sort((a, b) => {
      switch (sortBy) {
        case 'price-low':
          return a.price - b.price;
        case 'price-high':
          return b.price - a.price;
        case 'rating':
          return (b.rating || 0) - (a.rating || 0);
        case 'name':
        default:
          return (a.name || '').localeCompare(b.name || '');
      }
    });

    setFilteredProducts(filtered);
  }, [products, searchTerm, sortBy]);

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSortChange = (event) => {
    setSortBy(event.target.value);
  };

  return (
    <div className="products-page">
      <div className="container">
        <div className="page-header">
          <h1>Our Products</h1>
          <p>Discover our wide range of quality products</p>
        </div>

        <div className="products-controls">
          <div className="search-bar">
            <FontAwesomeIcon icon={faSearch} className="search-icon" />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>

          <div className="sort-dropdown">
            <FontAwesomeIcon icon={faFilter} className="filter-icon" />
            <select value={sortBy} onChange={handleSortChange}>
              <option value="name">Sort by Name</option>
              <option value="price-low">Price: Low to High</option>
              <option value="price-high">Price: High to Low</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        <div className="products-content">
          {loading ? (
            <div className="loading">Loading products...</div>
          ) : error ? (
            <div className="no-products">{error}</div>
          ) : filteredProducts.length === 0 ? (
            <div className="no-products">
              {searchTerm
                ? `No products found matching "${searchTerm}"`
                : 'No products available'}
            </div>
          ) : (
            <>
              <div className="products-count">
                Showing {filteredProducts.length} product
                {filteredProducts.length !== 1 ? 's' : ''}
              </div>

              <div className="products-grid">
                {filteredProducts.map((product) => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductsPage;