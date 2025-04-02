import React from 'react';

// Image imports assume these files exist in the same directory as AmazonHome.tsx
import amazonLogo from './amazon-logo.png';
import heroBanner from './hero-banner.jpg';
import categoryElectronics from './category-electronics.png';
import categoryFashion from './category-fashion.png';
import categoryHomeKitchen from './category-home-kitchen.png';
import categoryBooks from './category-books.png';
import featuredProduct1 from './featured-product1.png';
import featuredProduct2 from './featured-product2.png';
import featuredProduct3 from './featured-product3.png';
import dealItem1 from './deal-item1.png';
import dealItem2 from './deal-item2.png';
import dealItem3 from './deal-item3.png';
import giftCard1 from './gift-card1.png';
import giftCard2 from './gift-card2.png';
import giftCard3 from './gift-card3.png';

// Extend React.FC with a craft property to satisfy Craft.js (if you're using Craft.js)
type AmazonHomeType = React.FC & {
  craft?: {
    displayName: string;
    rules?: Record<string, unknown>;
  };
};

const AmazonHome: AmazonHomeType = () => {
  return (
    <div
      style={{
        fontFamily: 'Arial, sans-serif',
        backgroundColor: '#fafafa',
        maxWidth: '1200px', // limit layout width
        margin: '0 auto',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ================= Header ================= */}
      <header
        style={{
          display: 'flex',
          alignItems: 'center',
          background: 'linear-gradient(45deg, #232F3E, #414E5A)',
          color: '#fff',
          padding: '14px 20px',
        }}
      >
        <img
          src={amazonLogo}
          alt="AI Prompt: 'Minimal Amazon-style company logo, dark text on a bright rectangle'"
          style={{ marginRight: '20px', height: '40px' }}
        />
        <h1
          style={{
            fontSize: '1.75rem',
            margin: 0,
            fontWeight: 'bold',
          }}
        >
          Amazon
        </h1>
      </header>

      {/* ================= Search / Navigation Area ================= */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '10px 20px',
          backgroundColor: '#f3f3f3',
        }}
      >
        <input
          type="text"
          placeholder="Search..."
          style={{
            width: '400px',
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ccc',
            fontSize: '1rem',
          }}
        />
        <button
          type="button"
          style={{
            marginLeft: '8px',
            backgroundColor: '#febd69',
            border: '1px solid #f3a847',
            borderRadius: '4px',
            padding: '8px 16px',
            cursor: 'pointer',
            fontWeight: 'bold',
            color: '#333',
            fontSize: '1rem',
          }}
        >
          Search
        </button>
      </div>

      {/* ================= Main Content ================= */}
      <div
        style={{ padding: '20px', display: 'flex', flexDirection: 'column' }}
      >
        {/* Hero Banner */}
        <section
          style={{
            marginBottom: '20px',
            textAlign: 'center',
            border: '1px solid #ddd',
            borderRadius: '6px',
            padding: '10px',
            background: '#ffffff',
          }}
        >
          <h2
            style={{
              margin: '10px 0',
              color: '#232F3E',
              fontSize: '1.5rem',
              fontWeight: 'bold',
              textAlign: 'center',
            }}
          >
            Big Sale
          </h2>
          <img
            src={heroBanner}
            alt="AI Prompt: 'A wide, vibrant e-commerce hero banner with special deals, minimal Amazon style, bright color palette, 3D product shapes'"
            style={{ width: '100%', maxWidth: '1200px', height: 'auto' }}
          />
        </section>

        {/* Categories */}
        <section
          style={{
            marginBottom: '20px',
            border: '1px solid #ddd',
            borderRadius: '6px',
            padding: '10px',
            background: 'linear-gradient(45deg, #ffe6e6, #ffd1dc)',
            textAlign: 'center',
          }}
        >
          <h2
            style={{
              marginBottom: '10px',
              color: '#232F3E',
              fontSize: '1.4rem',
              fontWeight: 'bold',
              textAlign: 'center',
            }}
          >
            Shop by Category
          </h2>
          <p
            style={{
              margin: '0 0 10px',
              color: '#444',
              fontSize: '1rem',
              textAlign: 'center',
            }}
          >
            Browse an extensive range of products organized by category. Whether
            you're looking for the latest tech, fashionable outfits, cozy home
            essentials, or captivating books, we have you covered.
          </p>
          <div
            style={{
              display: 'flex',
              gap: '20px',
              flexWrap: 'wrap',
              justifyContent: 'center',
              alignItems: 'center',
            }}
          >
            {/* Category: Electronics */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '180px',
                textAlign: 'center',
              }}
            >
              <img
                src={categoryElectronics}
                alt="AI Prompt: 'Iconic electronics category illustration with tech gadgets and circuit patterns'"
                style={{
                  width: '180px',
                  height: '180px',
                  objectFit: 'contain',
                }}
              />
              <p style={{ marginTop: '10px', fontWeight: 500 }}>Electronics</p>
            </div>
            {/* Category: Fashion */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '180px',
                textAlign: 'center',
              }}
            >
              <img
                src={categoryFashion}
                alt="AI Prompt: 'Fashion category illustration with trendy clothes, shoes, and bright pop colors'"
                style={{
                  width: '180px',
                  height: '180px',
                  objectFit: 'contain',
                }}
              />
              <p style={{ marginTop: '10px', fontWeight: 500 }}>Fashion</p>
            </div>
            {/* Category: Home & Kitchen */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '180px',
                textAlign: 'center',
              }}
            >
              <img
                src={categoryHomeKitchen}
                alt="AI Prompt: 'Home and kitchen category image with cozy living room decor and cookingware'"
                style={{
                  width: '180px',
                  height: '180px',
                  objectFit: 'contain',
                }}
              />
              <p style={{ marginTop: '10px', fontWeight: 500 }}>
                Home &amp; Kitchen
              </p>
            </div>
            {/* Category: Books */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                width: '180px',
                textAlign: 'center',
              }}
            >
              <img
                src={categoryBooks}
                alt="AI Prompt: 'Books category with stacked novels and floating pages, minimal line art style'"
                style={{
                  width: '180px',
                  height: '180px',
                  objectFit: 'contain',
                }}
              />
              <p style={{ marginTop: '10px', fontWeight: 500 }}>Books</p>
            </div>
          </div>
          <button
            type="button"
            style={{
              marginTop: '15px',
              backgroundColor: '#ff8ba7',
              border: 'none',
              borderRadius: '4px',
              padding: '8px 16px',
              cursor: 'pointer',
              color: '#fff',
              fontWeight: 'bold',
              fontSize: '1rem',
            }}
          >
            See All Categories
          </button>
        </section>

        {/* Featured Products */}
        <section
          style={{
            marginBottom: '20px',
            border: '1px solid #ddd',
            borderRadius: '6px',
            padding: '10px',
            background: 'linear-gradient(45deg, #f4f9ff, #e2eefc)',
            textAlign: 'center',
          }}
        >
          <h2
            style={{
              marginBottom: '10px',
              color: '#232F3E',
              fontSize: '1.4rem',
              fontWeight: 'bold',
              textAlign: 'center',
            }}
          >
            Featured Products
          </h2>
          <p
            style={{
              margin: '0 0 10px',
              color: '#444',
              fontSize: '1rem',
              textAlign: 'center',
            }}
          >
            Discover our curated selection of top-rated items and exciting new
            arrivals.
          </p>
          <div
            style={{
              display: 'flex',
              gap: '20px',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {/* Product 1 */}
            <div
              style={{
                border: '1px solid #ddd',
                borderRadius: '4px',
                width: '200px',
                padding: '10px',
                backgroundColor: '#fefefe',
                textAlign: 'center',
              }}
            >
              <img
                src={featuredProduct1}
                alt="AI Prompt: 'Minimal product shot of a sleek tech gadget on a white background, angled lighting'"
                style={{
                  width: '100%',
                  height: 'auto',
                }}
              />
              <p style={{ marginTop: '10px' }}>Product 1</p>
              <p
                style={{
                  fontWeight: 'bold',
                  color: '#444',
                  fontSize: '1.1rem',
                }}
              >
                $19.99
              </p>
              <button
                type="button"
                style={{
                  backgroundColor: '#febd69',
                  border: '1px solid #f3a847',
                  borderRadius: '4px',
                  padding: '6px 10px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  color: '#333',
                }}
              >
                Add to Cart
              </button>
            </div>
            {/* Product 2 */}
            <div
              style={{
                border: '1px solid #ddd',
                borderRadius: '4px',
                width: '200px',
                padding: '10px',
                backgroundColor: '#fefefe',
                textAlign: 'center',
              }}
            >
              <img
                src={featuredProduct2}
                alt="AI Prompt: 'Compact product arrangement for a wearable accessory, pastel background, styled lighting'"
                style={{
                  width: '100%',
                  height: 'auto',
                }}
              />
              <p style={{ marginTop: '10px' }}>Product 2</p>
              <p
                style={{
                  fontWeight: 'bold',
                  color: '#444',
                  fontSize: '1.1rem',
                }}
              >
                $29.99
              </p>
              <button
                type="button"
                style={{
                  backgroundColor: '#febd69',
                  border: '1px solid #f3a847',
                  borderRadius: '4px',
                  padding: '6px 10px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  color: '#333',
                }}
              >
                Add to Cart
              </button>
            </div>
            {/* Product 3 */}
            <div
              style={{
                border: '1px solid #ddd',
                borderRadius: '4px',
                width: '200px',
                padding: '10px',
                backgroundColor: '#fefefe',
                textAlign: 'center',
              }}
            >
              <img
                src={featuredProduct3}
                alt="AI Prompt: 'High-quality product photo of a household item with bright color pop, playful arrangement'"
                style={{
                  width: '100%',
                  height: 'auto',
                }}
              />
              <p style={{ marginTop: '10px' }}>Product 3</p>
              <p
                style={{
                  fontWeight: 'bold',
                  color: '#444',
                  fontSize: '1.1rem',
                }}
              >
                $39.99
              </p>
              <button
                type="button"
                style={{
                  backgroundColor: '#febd69',
                  border: '1px solid #f3a847',
                  borderRadius: '4px',
                  padding: '6px 10px',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                  color: '#333',
                }}
              >
                Add to Cart
              </button>
            </div>
          </div>
          <button
            type="button"
            style={{
              marginTop: '15px',
              backgroundColor: '#73bbff',
              border: 'none',
              borderRadius: '4px',
              padding: '8px 16px',
              cursor: 'pointer',
              color: '#fff',
              fontWeight: 'bold',
              fontSize: '1rem',
            }}
          >
            Browse More Products
          </button>
        </section>

        {/* Deals of the Day */}
        <section
          style={{
            marginBottom: '20px',
            border: '1px solid #ddd',
            borderRadius: '6px',
            padding: '10px',
            display: 'flex',
            flexDirection: 'column',
            gap: '10px',
            background: 'linear-gradient(45deg, #fff7e0, #ffe9c6)',
            textAlign: 'center',
          }}
        >
          <h2
            style={{
              color: '#232F3E',
              fontSize: '1.4rem',
              fontWeight: 'bold',
              margin: 0,
              textAlign: 'center',
            }}
          >
            Deals of the Day
          </h2>
          <p
            style={{
              margin: 0,
              color: '#444',
              fontSize: '1rem',
              textAlign: 'center',
            }}
          >
            Don’t miss these limited-time offers on must-have products. Grab
            them now before they’re gone!
          </p>
          <div
            style={{
              display: 'flex',
              gap: '20px',
              flexWrap: 'wrap',
              justifyContent: 'center',
            }}
          >
            {/* Deal 1 */}
            <div
              style={{
                border: '1px solid #ddd',
                borderRadius: '4px',
                width: '200px',
                padding: '10px',
                backgroundColor: '#fefefe',
              }}
            >
              <img
                src={dealItem1}
                alt="AI Prompt: 'An everyday household item with a bold discount label, bright red sale text'"
                style={{ width: '100%', height: 'auto' }}
              />
              <p style={{ marginTop: '10px' }}>Deal Item 1</p>
              <p
                style={{
                  color: 'red',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                }}
              >
                $9.99
              </p>
              <p
                style={{
                  textDecoration: 'line-through',
                  color: '#999',
                  fontSize: '0.9rem',
                  marginBottom: '8px',
                }}
              >
                $14.99
              </p>
            </div>
            {/* Deal 2 */}
            <div
              style={{
                border: '1px solid #ddd',
                borderRadius: '4px',
                width: '200px',
                padding: '10px',
                backgroundColor: '#fefefe',
              }}
            >
              <img
                src={dealItem2}
                alt="AI Prompt: 'Stylish tech accessory on sale, discount label with bright highlight colors'"
                style={{ width: '100%', height: 'auto' }}
              />
              <p style={{ marginTop: '10px' }}>Deal Item 2</p>
              <p
                style={{
                  color: 'red',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                }}
              >
                $19.99
              </p>
              <p
                style={{
                  textDecoration: 'line-through',
                  color: '#999',
                  fontSize: '0.9rem',
                  marginBottom: '8px',
                }}
              >
                $29.99
              </p>
            </div>
            {/* Deal 3 */}
            <div
              style={{
                border: '1px solid #ddd',
                borderRadius: '4px',
                width: '200px',
                padding: '10px',
                backgroundColor: '#fefefe',
              }}
            >
              <img
                src={dealItem3}
                alt="AI Prompt: 'Small but attractive item with a big clearance discount, cheerful background'"
                style={{ width: '100%', height: 'auto' }}
              />
              <p style={{ marginTop: '10px' }}>Deal Item 3</p>
              <p
                style={{
                  color: 'red',
                  fontWeight: 'bold',
                  fontSize: '1.1rem',
                }}
              >
                $4.99
              </p>
              <p
                style={{
                  textDecoration: 'line-through',
                  color: '#999',
                  fontSize: '0.9rem',
                  marginBottom: '8px',
                }}
              >
                $9.99
              </p>
            </div>
          </div>
          <button
            type="button"
            style={{
              marginTop: '10px',
              backgroundColor: '#ffab53',
              border: 'none',
              borderRadius: '4px',
              padding: '8px 16px',
              cursor: 'pointer',
              color: '#fff',
              fontWeight: 'bold',
              fontSize: '1rem',
              alignSelf: 'center',
            }}
          >
            See More Deals
          </button>
        </section>

        {/* Gift Cards */}
        <section
          style={{
            marginBottom: '20px',
            border: '1px solid #ddd',
            borderRadius: '6px',
            padding: '10px',
            display: 'flex',
            flexDirection: 'column',
            background: 'linear-gradient(45deg, #e0fff5, #c6ffea)',
            textAlign: 'center',
          }}
        >
          <h2
            style={{
              color: '#232F3E',
              fontSize: '1.4rem',
              fontWeight: 'bold',
              margin: 0,
              textAlign: 'center',
            }}
          >
            Gift Cards
          </h2>
          <p
            style={{
              margin: 0,
              color: '#444',
              fontSize: '1rem',
              textAlign: 'center',
            }}
          >
            Give the gift that’s always right. Our wide range of gift cards
            makes every occasion special.
          </p>
          <div
            style={{
              display: 'flex',
              gap: '20px',
              flexWrap: 'wrap',
              justifyContent: 'center',
              marginTop: '10px',
            }}
          >
            {/* Gift Card 1 */}
            <div
              style={{
                border: '1px solid #ddd',
                borderRadius: '4px',
                width: '180px',
                padding: '10px',
                textAlign: 'center',
                backgroundColor: '#fefefe',
              }}
            >
              <img
                src={giftCard1}
                alt="AI Prompt: 'Gift card design with minimal Amazon style, confetti, bright and cheerful layout'"
                style={{ width: '100%', height: 'auto' }}
              />
              <p style={{ marginTop: '10px' }}>Gift Card 1</p>
            </div>
            {/* Gift Card 2 */}
            <div
              style={{
                border: '1px solid #ddd',
                borderRadius: '4px',
                width: '180px',
                padding: '10px',
                textAlign: 'center',
                backgroundColor: '#fefefe',
              }}
            >
              <img
                src={giftCard2}
                alt="AI Prompt: 'Modern gift card featuring abstract shapes and bold Amazon color palette, gradient background'"
                style={{ width: '100%', height: 'auto' }}
              />
              <p style={{ marginTop: '10px' }}>Gift Card 2</p>
            </div>
            {/* Gift Card 3 */}
            <div
              style={{
                border: '1px solid #ddd',
                borderRadius: '4px',
                width: '180px',
                padding: '10px',
                textAlign: 'center',
                backgroundColor: '#fefefe',
              }}
            >
              <img
                src={giftCard3}
                alt="AI Prompt: 'Minimal line-art gift card with small Amazon logo, pastel background, celebratory ribbons'"
                style={{ width: '100%', height: 'auto' }}
              />
              <p style={{ marginTop: '10px' }}>Gift Card 3</p>
            </div>
          </div>
          <button
            type="button"
            style={{
              marginTop: '10px',
              backgroundColor: '#3ed598',
              border: 'none',
              borderRadius: '4px',
              padding: '8px 16px',
              cursor: 'pointer',
              color: '#fff',
              fontWeight: 'bold',
              fontSize: '1rem',
              alignSelf: 'center',
            }}
          >
            Explore More Gift Cards
          </button>
        </section>
      </div>

      {/* ================= Footer ================= */}
      <footer
        style={{
          background: 'linear-gradient(45deg, #232F3E, #2c4052)',
          color: '#fff',
          textAlign: 'center',
          padding: '20px',
          marginTop: '20px',
        }}
      >
        <p style={{ margin: 0, fontSize: '1rem', fontWeight: 'bold' }}>
          © 2025 Amazon
        </p>
      </footer>
    </div>
  );
};

// Register component for Craft.js (if needed)
AmazonHome.craft = {
  displayName: 'AmazonHome',
  // rules: {
  //   canMove: () => false,
  //   canDrag: () => false,
  // },
};

export default AmazonHome;
