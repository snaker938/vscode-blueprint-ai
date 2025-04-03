import React from 'react';

// Single placeholder image
import placeholder from './PlaceholderImage.png';

// Extend React.FC with a craft property if you're using Craft.js
type AmazonHomeType = React.FC & {
  craft?: {
    displayName: string;
    rules?: Record<string, unknown>;
  };
};

/**
 * ImageWrapper: displays a single placeholder image,
 * and overlays the AI Prompt alt text in the bottom-left corner.
 */
const ImageWrapper: React.FC<{
  alt: string;
  containerStyle?: React.CSSProperties;
  objectFit?: React.CSSProperties['objectFit'];
}> = ({ alt, containerStyle, objectFit = 'cover' }) => {
  return (
    <div
      style={{
        position: 'relative',
        overflow: 'hidden',
        ...containerStyle,
      }}
    >
      <img
        src={placeholder}
        alt={alt}
        style={{
          width: '100%',
          height: '100%',
          objectFit,
          display: 'block',
        }}
      />
      {/* Overlay showing the AI prompt. */}
      <div
        style={{
          position: 'absolute',
          bottom: 0,
          left: 0,
          backgroundColor: 'rgba(0,0,0,0.7)',
          color: '#fff',
          fontSize: '0.8rem',
          padding: '4px 8px',
          borderTopRightRadius: '6px',
          maxWidth: '90%',
          wordBreak: 'break-word',
        }}
      >
        AI PROMPT: {alt}
      </div>
    </div>
  );
};

/**
 * AmazonHome component using placeholder images for all images,
 * with visible AI Prompt alt text overlaid on each image.
 */
const AmazonHome: AmazonHomeType = () => {
  return (
    <div
      style={{
        fontFamily: '"Helvetica Neue", Arial, sans-serif',
        backgroundColor: '#f3f3f3',
        color: '#111',
        display: 'flex',
        flexDirection: 'column',
        minHeight: '100vh',
      }}
    >
      {/* ================= HEADER ================= */}
      <header
        style={{
          backgroundColor: '#232F3E',
          padding: '1rem 2rem',
          display: 'flex',
          alignItems: 'center',
        }}
      >
        {/* Amazon Logo */}
        <div style={{ marginRight: '1rem' }}>
          <ImageWrapper
            alt="Simple Amazon text logo with an orange arrow underneath, white background"
            containerStyle={{ width: '80px', height: '40px' }}
            objectFit="contain"
          />
        </div>
        <h1 style={{ margin: 0, color: '#fff', fontSize: '1.5rem' }}>Amazon</h1>
      </header>

      {/* ================= NAV / SEARCH ================= */}
      <nav
        style={{
          backgroundColor: '#37475A',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          padding: '0.75rem 2rem',
        }}
      >
        <input
          type="text"
          placeholder="Search Amazon..."
          style={{
            width: '50%',
            padding: '0.5rem',
            borderRadius: '4px',
            border: '1px solid #ccc',
            marginRight: '0.5rem',
          }}
        />
        <button
          type="button"
          style={{
            backgroundColor: '#FFA41C',
            border: 'none',
            borderRadius: '4px',
            padding: '0.5rem 1rem',
            cursor: 'pointer',
            fontWeight: 'bold',
          }}
        >
          Search
        </button>
      </nav>

      {/* ================= MAIN CONTENT ================= */}
      <main style={{ flex: '1', display: 'flex', flexDirection: 'column' }}>
        {/* 1) HERO SECTION (stretched to fill container) */}
        <section
          style={{
            width: '100%',
            height: '250px',
            marginBottom: '1.5rem',
          }}
        >
          <div style={{ width: '100%', height: '100%', overflow: 'hidden' }}>
            <ImageWrapper
              alt="Large Amazon hero banner featuring new deals, bright orange CTA, mixture of product silhouettes"
              containerStyle={{ width: '100%', height: '100%' }}
              objectFit="cover"
            />
          </div>
        </section>

        {/* 2) ABOUT AMAZON */}
        <section
          style={{
            margin: '0 2rem 1.5rem',
            backgroundColor: '#fff',
            borderRadius: '6px',
            padding: '1rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            display: 'flex',
            gap: '1rem',
            alignItems: 'flex-start',
          }}
        >
          <div style={{ flex: '1' }}>
            <h3
              style={{
                fontSize: '1.25rem',
                color: '#232F3E',
                marginBottom: '0.75rem',
                borderBottom: '1px solid #ddd',
                paddingBottom: '0.5rem',
              }}
            >
              About Amazon
            </h3>
            <p style={{ margin: '0.5rem 0' }}>
              Amazon is a global e-commerce platform offering millions of
              products across categories such as electronics, fashion, home, and
              more. We’re dedicated to providing convenience, variety, and
              competitive pricing, aiming to be Earth’s most customer-centric
              company.
            </p>
            <p style={{ margin: '0.5rem 0' }}>
              From everyday essentials to the latest tech, you’ll find almost
              anything on Amazon. Our world-class logistics and innovation keep
              us at the forefront of online retail, ensuring a smooth and
              seamless shopping experience.
            </p>
          </div>
          <div style={{ flexShrink: 0 }}>
            <ImageWrapper
              alt="Corporate Amazon building or headquarters, daytime shot, large Amazon signage"
              containerStyle={{ width: '220px', height: '160px' }}
              objectFit="cover"
            />
          </div>
        </section>

        {/* 3) OUR SERVICES */}
        <section
          style={{
            margin: '0 2rem 1.5rem',
            backgroundColor: '#fff',
            borderRadius: '6px',
            padding: '1rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          <h3
            style={{
              fontSize: '1.25rem',
              color: '#232F3E',
              marginBottom: '0.75rem',
              borderBottom: '1px solid #ddd',
              paddingBottom: '0.5rem',
            }}
          >
            Our Services
          </h3>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
              gap: '1rem',
            }}
          >
            {/* Service 1 */}
            <div
              style={{
                backgroundColor: '#f3f3f3',
                borderRadius: '6px',
                padding: '1rem',
                textAlign: 'center',
              }}
            >
              <ImageWrapper
                alt="Icon representing Amazon Prime membership, with a small Amazon smile or arrow"
                containerStyle={{ width: '100%', height: '80px' }}
                objectFit="contain"
              />
              <h4 style={{ margin: '0.75rem 0 0.5rem', color: '#232F3E' }}>
                Amazon Prime
              </h4>
              <p style={{ fontSize: '0.9rem', margin: 0 }}>
                Fast shipping, streaming, exclusive deals, and more.
              </p>
            </div>
            {/* Service 2 */}
            <div
              style={{
                backgroundColor: '#f3f3f3',
                borderRadius: '6px',
                padding: '1rem',
                textAlign: 'center',
              }}
            >
              <ImageWrapper
                alt="Grocery bag icon with Amazon branding, representing Amazon Fresh service"
                containerStyle={{ width: '100%', height: '80px' }}
                objectFit="contain"
              />
              <h4 style={{ margin: '0.75rem 0 0.5rem', color: '#232F3E' }}>
                Amazon Fresh
              </h4>
              <p style={{ fontSize: '0.9rem', margin: 0 }}>
                Groceries delivered straight to your door.
              </p>
            </div>
            {/* Service 3 */}
            <div
              style={{
                backgroundColor: '#f3f3f3',
                borderRadius: '6px',
                padding: '1rem',
                textAlign: 'center',
              }}
            >
              <ImageWrapper
                alt="Healthcare or pharmacy icon, minimal style, Amazon color palette"
                containerStyle={{ width: '100%', height: '80px' }}
                objectFit="contain"
              />
              <h4 style={{ margin: '0.75rem 0 0.5rem', color: '#232F3E' }}>
                Amazon Pharmacy
              </h4>
              <p style={{ fontSize: '0.9rem', margin: 0 }}>
                Manage prescriptions and shop health products.
              </p>
            </div>
            {/* Service 4 */}
            <div
              style={{
                backgroundColor: '#f3f3f3',
                borderRadius: '6px',
                padding: '1rem',
                textAlign: 'center',
              }}
            >
              <ImageWrapper
                alt="Simplistic line art of an AWS cloud, referencing Amazon Web Services"
                containerStyle={{ width: '100%', height: '80px' }}
                objectFit="contain"
              />
              <h4 style={{ margin: '0.75rem 0 0.5rem', color: '#232F3E' }}>
                Amazon Web Services
              </h4>
              <p style={{ fontSize: '0.9rem', margin: 0 }}>
                Cloud computing solutions for businesses worldwide.
              </p>
            </div>
          </div>
        </section>

        {/* 4) DEALS & OFFERS */}
        <section
          style={{
            margin: '0 2rem 1.5rem',
            backgroundColor: '#fff',
            borderRadius: '6px',
            padding: '1rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          <h3
            style={{
              fontSize: '1.25rem',
              color: '#232F3E',
              marginBottom: '0.75rem',
              borderBottom: '1px solid #ddd',
              paddingBottom: '0.5rem',
            }}
          >
            Deals &amp; Offers
          </h3>
          <p style={{ margin: '0.5rem 0 1rem' }}>
            We regularly post limited-time offers and special discounts across
            all categories. Check out the deals below and find something new to
            enjoy.
          </p>

          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
              gap: '1rem',
            }}
          >
            {/* Deal 1 */}
            <div
              style={{
                backgroundColor: '#f3f3f3',
                borderRadius: '6px',
                padding: '1rem',
              }}
            >
              <ImageWrapper
                alt="An Amazon device (e.g., Echo Dot) on a clean background, discounted price tag"
                containerStyle={{ width: '100%', height: '150px' }}
                objectFit="contain"
              />
              <h4 style={{ margin: '0.75rem 0 0.5rem', color: '#232F3E' }}>
                Echo Dot
              </h4>
              <p style={{ margin: '0.25rem 0' }}>
                <span style={{ fontWeight: 'bold' }}>$29.99</span>{' '}
                <span
                  style={{
                    textDecoration: 'line-through',
                    color: '#666',
                    fontSize: '0.9rem',
                    marginLeft: '0.5rem',
                  }}
                >
                  $49.99
                </span>
              </p>
              <button
                type="button"
                style={{
                  backgroundColor: '#FFA41C',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '0.5rem 1rem',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
              >
                Buy Now
              </button>
            </div>
            {/* Deal 2 */}
            <div
              style={{
                backgroundColor: '#f3f3f3',
                borderRadius: '6px',
                padding: '1rem',
              }}
            >
              <ImageWrapper
                alt="Kitchen appliance (e.g., blender) on white background, with a sale label"
                containerStyle={{ width: '100%', height: '150px' }}
                objectFit="contain"
              />
              <h4 style={{ margin: '0.75rem 0 0.5rem', color: '#232F3E' }}>
                Blender
              </h4>
              <p style={{ margin: '0.25rem 0' }}>
                <span style={{ fontWeight: 'bold' }}>$19.99</span>{' '}
                <span
                  style={{
                    textDecoration: 'line-through',
                    color: '#666',
                    fontSize: '0.9rem',
                    marginLeft: '0.5rem',
                  }}
                >
                  $34.99
                </span>
              </p>
              <button
                type="button"
                style={{
                  backgroundColor: '#FFA41C',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '0.5rem 1rem',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
              >
                Buy Now
              </button>
            </div>
            {/* Deal 3 */}
            <div
              style={{
                backgroundColor: '#f3f3f3',
                borderRadius: '6px',
                padding: '1rem',
              }}
            >
              <ImageWrapper
                alt="Book set with bright covers, special discount tag, product on plain background"
                containerStyle={{ width: '100%', height: '150px' }}
                objectFit="contain"
              />
              <h4 style={{ margin: '0.75rem 0 0.5rem', color: '#232F3E' }}>
                Book Set
              </h4>
              <p style={{ margin: '0.25rem 0' }}>
                <span style={{ fontWeight: 'bold' }}>$14.99</span>{' '}
                <span
                  style={{
                    textDecoration: 'line-through',
                    color: '#666',
                    fontSize: '0.9rem',
                    marginLeft: '0.5rem',
                  }}
                >
                  $24.99
                </span>
              </p>
              <button
                type="button"
                style={{
                  backgroundColor: '#FFA41C',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '0.5rem 1rem',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
              >
                Buy Now
              </button>
            </div>
          </div>
        </section>

        {/* 5) PRIME MEMBERSHIP */}
        <section
          style={{
            margin: '0 2rem 1.5rem',
            backgroundColor: '#fff',
            borderRadius: '6px',
            padding: '1rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
            display: 'flex',
            gap: '1rem',
            alignItems: 'flex-start',
          }}
        >
          <div style={{ flex: '1' }}>
            <h3
              style={{
                fontSize: '1.25rem',
                color: '#232F3E',
                marginBottom: '0.75rem',
                borderBottom: '1px solid #ddd',
                paddingBottom: '0.5rem',
              }}
            >
              Amazon Prime
            </h3>
            <p style={{ margin: '0.5rem 0' }}>
              Prime is more than just fast shipping. Enjoy exclusive access to
              Prime Video, over two million songs on Prime Music, special deals,
              free games with Prime Gaming, and more.
            </p>
            <p style={{ margin: '0.5rem 0' }}>
              Members also benefit from secure photo storage, early access to
              Lightning Deals, and a host of other perks—all included under one
              membership.
            </p>
            <button
              type="button"
              style={{
                backgroundColor: '#FFA41C',
                border: 'none',
                borderRadius: '4px',
                padding: '0.5rem 1rem',
                cursor: 'pointer',
                fontWeight: 'bold',
                marginTop: '0.5rem',
              }}
            >
              Learn More
            </button>
          </div>
          <div style={{ flexShrink: 0 }}>
            <ImageWrapper
              alt="Amazon Prime membership banner, listing perks like streaming and shipping benefits"
              containerStyle={{ width: '220px', height: '160px' }}
              objectFit="cover"
            />
          </div>
        </section>

        {/* 6) TRENDING PRODUCTS */}
        <section
          style={{
            margin: '0 2rem 2rem',
            backgroundColor: '#fff',
            borderRadius: '6px',
            padding: '1rem',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
          }}
        >
          <h3
            style={{
              fontSize: '1.25rem',
              color: '#232F3E',
              marginBottom: '0.75rem',
              borderBottom: '1px solid #ddd',
              paddingBottom: '0.5rem',
            }}
          >
            Trending Products
          </h3>
          <p style={{ margin: '0.5rem 0 1rem' }}>
            Check out some of our most popular picks right now.
          </p>
          <div
            style={{
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))',
              gap: '1rem',
            }}
          >
            <div
              style={{
                backgroundColor: '#f3f3f3',
                borderRadius: '6px',
                padding: '1rem',
                textAlign: 'center',
              }}
            >
              <ImageWrapper
                alt="Trending product #1 with unique packaging and clean background"
                containerStyle={{ width: '100%', height: '120px' }}
                objectFit="contain"
              />
              <h4 style={{ margin: '0.5rem 0', color: '#232F3E' }}>
                Product #1
              </h4>
              <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}>
                From $9.99
              </p>
              <button
                type="button"
                style={{
                  backgroundColor: '#FFA41C',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '0.5rem 1rem',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
              >
                View
              </button>
            </div>

            <div
              style={{
                backgroundColor: '#f3f3f3',
                borderRadius: '6px',
                padding: '1rem',
                textAlign: 'center',
              }}
            >
              <ImageWrapper
                alt="Trending product #2 with unique packaging and clean background"
                containerStyle={{ width: '100%', height: '120px' }}
                objectFit="contain"
              />
              <h4 style={{ margin: '0.5rem 0', color: '#232F3E' }}>
                Product #2
              </h4>
              <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}>
                From $9.99
              </p>
              <button
                type="button"
                style={{
                  backgroundColor: '#FFA41C',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '0.5rem 1rem',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
              >
                View
              </button>
            </div>

            <div
              style={{
                backgroundColor: '#f3f3f3',
                borderRadius: '6px',
                padding: '1rem',
                textAlign: 'center',
              }}
            >
              <ImageWrapper
                alt="Trending product #3 with unique packaging and clean background"
                containerStyle={{ width: '100%', height: '120px' }}
                objectFit="contain"
              />
              <h4 style={{ margin: '0.5rem 0', color: '#232F3E' }}>
                Product #3
              </h4>
              <p style={{ margin: '0.25rem 0', fontSize: '0.9rem' }}>
                From $9.99
              </p>
              <button
                type="button"
                style={{
                  backgroundColor: '#FFA41C',
                  border: 'none',
                  borderRadius: '4px',
                  padding: '0.5rem 1rem',
                  cursor: 'pointer',
                  fontWeight: 'bold',
                }}
              >
                View
              </button>
            </div>
          </div>
        </section>
      </main>

      {/* ================= FOOTER ================= */}
      <footer
        style={{
          backgroundColor: '#232F3E',
          padding: '1rem',
          textAlign: 'center',
          color: '#fff',
        }}
      >
        <p style={{ margin: 0, fontSize: '0.9rem' }}>© 2025 Amazon</p>
      </footer>
    </div>
  );
};

AmazonHome.craft = {
  displayName: 'AmazonHome',
};

export default AmazonHome;
