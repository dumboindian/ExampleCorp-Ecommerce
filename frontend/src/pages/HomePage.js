import React, { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faShoppingBag,
  faTruck,
  faShieldAlt,
  faHeadset,
} from '@fortawesome/free-solid-svg-icons';
import './HomePage.css';

const HomePage = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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

  return (
    <div className="homepage">
      <section className="hero">
        <div className="hero-content">
          <h1>Welcome to ExampleCorp</h1>
          <p>Discover amazing products with unbeatable quality and prices</p>
          <button className="cta-button">Shop Now</button>
        </div>

        <div className="hero-image">
          <img
            src="https://via.placeholder.com/600x400?text=Hero+Image"
            alt="Hero"
          />
        </div>
      </section>

      <section className="features">
        <div className="container">
          <div className="features-grid">
            <div className="feature-item">
              <FontAwesomeIcon icon={faTruck} className="feature-icon" />
              <h3>Free Shipping</h3>
              <p>Free shipping on orders over $50</p>
            </div>

            <div className="feature-item">
              <FontAwesomeIcon icon={faShieldAlt} className="feature-icon" />
              <h3>Secure Payment</h3>
              <p>100% secure payment processing</p>
            </div>

            <div className="feature-item">
              <FontAwesomeIcon icon={faHeadset} className="feature-icon" />
              <h3>24/7 Support</h3>
              <p>Round-the-clock customer support</p>
            </div>

            <div className="feature-item">
              <FontAwesomeIcon icon={faShoppingBag} className="feature-icon" />
              <h3>Easy Returns</h3>
              <p>30-day return policy</p>
            </div>
          </div>
        </div>
      </section>

      <section className="featured-products">
        <div className="container">
          <h2>Featured Products</h2>

          {loading ? (
            <div className="loading">Loading products...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : products.length === 0 ? (
            <div className="error">No products available.</div>
          ) : (
            <div className="products-grid">
              {products.slice(0, 8).map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </section>

      <section className="newsletter">
        <div className="container">
          <div className="newsletter-content">
            <h2>Stay Updated</h2>
            <p>Subscribe to our newsletter for the latest products and offers</p>

            <div className="newsletter-form">
              <input
                type="email"
                placeholder="Enter your email address"
              />
              <button>Subscribe</button>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;