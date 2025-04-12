// CustomComponentString.ts
// <VideoWrapper videoId="dQw4w9WgXcQ" style={{ flex: 1, minWidth: "250px", marginRight: "10px" }} />
const returnedComponentString = `const AmazonBlueprint: React.FC = () => {
  return (
    <div style={{ fontFamily: "Arial, sans-serif", margin: 0, padding: 0 }}>
      <header style={{ backgroundColor: "#131921", color: "white", padding: "10px 20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1 style={{ margin: 0, fontSize: "24px" }}>Amazon.co.uk</h1>
          <div style={{ display: "flex", alignItems: "center", fontSize: "14px" }}>
            <span style={{ marginRight: "15px" }}>Deliver to Joshua, London</span>
            <span style={{ marginRight: "15px" }}>Hello, Joshua: Account & Lists</span>
            <span style={{ marginRight: "15px" }}>Returns & Orders</span>
            <span>Basket</span>
          </div>
        </div>
        <div style={{ marginTop: "10px", display: "flex" }}>
          <input
            type="text"
            placeholder="Search Amazon.co.uk"
            style={{ flex: 1, padding: "8px", border: "none", borderRadius: "4px 0 0 4px" }}
          />
          <button style={{ padding: "8px 12px", backgroundColor: "#febd69", border: "none", borderRadius: "0 4px 4px 0" }}>
            Search
          </button>
        </div>
      </header>
      <nav style={{ backgroundColor: "#232F3E", color: "white", padding: "10px 20px", display: "flex", flexWrap: "wrap" }}>
        <a href="#" style={{ margin: "5px 10px", color: "white", textDecoration: "none" }}>All Grocery</a>
        <a href="#" style={{ margin: "5px 10px", color: "white", textDecoration: "none" }}>Buy Again</a>
        <a href="#" style={{ margin: "5px 10px", color: "white", textDecoration: "none" }}>Gift Ideas</a>
        <a href="#" style={{ margin: "5px 10px", color: "white", textDecoration: "none" }}>Today's Deals</a>
        <a href="#" style={{ margin: "5px 10px", color: "white", textDecoration: "none" }}>Browsing History</a>
        <a href="#" style={{ margin: "5px 10px", color: "white", textDecoration: "none" }}>Fashion</a>
        <a href="#" style={{ margin: "5px 10px", color: "white", textDecoration: "none" }}>Customer Service</a>
        <a href="#" style={{ margin: "5px 10px", color: "white", textDecoration: "none" }}>Books</a>
        <a href="#" style={{ margin: "5px 10px", color: "white", textDecoration: "none" }}>Best Sellers</a>
        <a href="#" style={{ margin: "5px 10px", color: "white", textDecoration: "none" }}>Home & Garden</a>
        <a href="#" style={{ margin: "5px 10px", color: "white", textDecoration: "none" }}>Prime</a>
      </nav>
      <main style={{ padding: "20px" }}>
        <section style={{ marginBottom: "30px" }}>
          <h2 style={{ color: "#131921", marginBottom: "20px" }}>Product Promotions</h2>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center" }}>
            <div style={{ flex: 1, minWidth: "250px", marginRight: "10px", backgroundColor: "#f3f3f3", padding: "15px", textAlign: "center" }}>
              <h3 style={{ marginTop: 0 }}>New Outdoor Camera Plus 2K</h3>
              <p style={{ marginBottom: "15px" }}>From Ring</p>
              <button style={{ backgroundColor: "#febd69", border: "none", padding: "10px 15px", cursor: "pointer" }}>
                Shop Now
              </button>
            </div>
            <ImageWrapper
              alt="A modern outdoor security camera with sleek design and technical details"
              containerStyle={{ flex: 1, minWidth: "250px", margin: "10px", maxHeight: "200px", overflow: "hidden" }}
              objectFit="cover"
            />
          </div>
        </section>
        <section style={{ marginBottom: "30px" }}>
          <h2 style={{ color: "#131921", marginBottom: "20px" }}>Today's Deals</h2>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(150px, 1fr))", gap: "15px" }}>
            <div style={{ backgroundColor: "white", border: "1px solid #ddd", padding: "10px", textAlign: "center" }}>
              <h4 style={{ margin: "10px 0" }}>15% off deal</h4>
              <button style={{ backgroundColor: "#febd69", border: "none", padding: "8px 12px", cursor: "pointer" }}>
                View Deal
              </button>
            </div>
            <div style={{ backgroundColor: "white", border: "1px solid #ddd", padding: "10px", textAlign: "center" }}>
              <h4 style={{ margin: "10px 0" }}>23% off deal</h4>
              <button style={{ backgroundColor: "#febd69", border: "none", padding: "8px 12px", cursor: "pointer" }}>
                View Deal
              </button>
            </div>
            <div style={{ backgroundColor: "white", border: "1px solid #ddd", padding: "10px", textAlign: "center" }}>
              <h4 style={{ margin: "10px 0" }}>18% off deal</h4>
              <button style={{ backgroundColor: "#febd69", border: "none", padding: "8px 12px", cursor: "pointer" }}>
                View Deal
              </button>
            </div>
            <div style={{ backgroundColor: "white", border: "1px solid #ddd", padding: "10px", textAlign: "center" }}>
              <h4 style={{ margin: "10px 0" }}>21% off deal</h4>
              <button style={{ backgroundColor: "#febd69", border: "none", padding: "8px 12px", cursor: "pointer" }}>
                View Deal
              </button>
            </div>
          </div>
        </section>
        <section style={{ marginBottom: "30px" }}>
          <h2 style={{ color: "#131921", marginBottom: "20px" }}>Popular Categories</h2>
          <ul style={{ listStyle: "none", padding: 0, display: "flex", flexWrap: "wrap" }}>
            {["Furniture", "Gardening", "Grocery", "Home Storage", "Outdoor Cooking", "Decor & Lighting", "Electronics", "Books"].map(category => (
              <li
                key={category}
                style={{ backgroundColor: "#f3f3f3", padding: "10px 15px", margin: "5px", borderRadius: "4px", fontSize: "14px" }}
              >
                {category}
              </li>
            ))}
          </ul>
        </section>
        <section style={{ marginBottom: "30px" }}>
          <h2 style={{ color: "#131921", marginBottom: "20px" }}>Customer Experience</h2>
          <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center" }}>
            <p style={{ flex: 1, minWidth: "250px", fontSize: "16px", lineHeight: "1.5" }}>
              Experience Amazon's seamless shopping interface with curated deals and an intuitive design that makes browsing and purchasing simple.
            </p>
          </div>
        </section>
      </main>
      <footer style={{ backgroundColor: "#131921", color: "white", padding: "20px", textAlign: "center" }}>
        <p style={{ margin: 0 }}>&copy; 2023 Amazon.co.uk. All rights reserved.</p>
        <nav style={{ marginTop: "10px" }}>
          <a href="#" style={{ margin: "0 10px", color: "white", textDecoration: "none" }}>About</a>
          <a href="#" style={{ margin: "0 10px", color: "white", textDecoration: "none" }}>Careers</a>
          <a href="#" style={{ margin: "0 10px", color: "white", textDecoration: "none" }}>Press Releases</a>
          <a href="#" style={{ margin: "0 10px", color: "white", textDecoration: "none" }}>Contact</a>
        </nav>
      </footer>
    </div>
  );
};
export default AmazonBlueprint;`;

export default returnedComponentString;
