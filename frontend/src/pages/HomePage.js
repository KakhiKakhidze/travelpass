import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import api from "../services/api";
import { HiCamera, HiLocationMarker, HiStar, HiHome } from "react-icons/hi";
import { GiWineGlass } from "react-icons/gi";
import teamMember1 from "../assets/1.jpg";
import teamMember2 from "../assets/2.jpg";
import teamMember3 from "../assets/3.jpg";

const HomePage = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const [featuredVenues, setFeaturedVenues] = useState([]);
  const [loadingVenues, setLoadingVenues] = useState(true);
  const [stats, setStats] = useState({
    venues: 0,
    wineVenues: 0,
    khachapuriVenues: 0,
    villageFoodVenues: 0,
  });

  useEffect(() => {
    fetchFeaturedVenues();
    fetchStats();
  }, []);

  const fetchFeaturedVenues = async () => {
    try {
      setLoadingVenues(true);
      const response = await api.get("/venues?limit=6");
      setFeaturedVenues(response.data.data.venues || []);
    } catch (error) {
      console.error("Failed to fetch featured venues:", error);
    } finally {
      setLoadingVenues(false);
    }
  };

  const fetchStats = async () => {
    try {
      const response = await api.get("/venues?limit=100");
      const venues = response.data.data.venues || [];
      setStats({
        venues: venues.length,
        wineVenues: venues.filter((v) => v.category?.includes("wine")).length,
        khachapuriVenues: venues.filter((v) =>
          v.category?.includes("khachapuri")
        ).length,
        villageFoodVenues: venues.filter((v) =>
          v.category?.includes("village_food")
        ).length,
      });
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const features = [
    {
      icon: HiCamera,
      title: "Scan & Collect Stamps",
      description:
        "Scan QR codes at partner venues to collect digital stamps and unlock rewards. Track your travel journey across Georgia",
    },
    {
      icon: HiLocationMarker,
      title: "Discover Authentic Venues",
      description:
        "Find wineries, restaurants, and village food experiences. Read reviews from fellow travelers and explore hidden gems",
    },
    {
      icon: HiStar,
      title: "Complete Challenges",
      description:
        "Join wine trails, khachapuri routes, and regional challenges. Earn badges, XP, and exclusive rewards",
    },
    {
      icon: HiHome,
      title: "Build Taste Memory™",
      description:
        "Share your taste preferences and get personalized recommendations. Your taste profile grows with every experience",
    },
  ];

  return (
    <div style={{ background: "#ffffff", minHeight: "100vh" }}>
      {/* Hero Section */}
      <section
        style={{
          padding: "120px 24px 80px",
          background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div
          className="container"
          style={{ maxWidth: "1200px", margin: "0 auto" }}
        >
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "60px",
              alignItems: "center",
              position: "relative",
              zIndex: 1,
            }}
          >
            <div>
              <h1
                style={{
                  fontSize: "3.5rem",
                  fontWeight: "800",
                  lineHeight: "1.2",
                  marginBottom: "24px",
                  color: "#212529",
                  letterSpacing: "-1px",
                }}
              >
                Your Travel Journey Starts Here
              </h1>
              <p
                style={{
                  fontSize: "1.25rem",
                  color: "#6c757d",
                  marginBottom: "40px",
                  lineHeight: "1.6",
                }}
              >
                Discover authentic Georgian experiences, collect digital stamps
                at local venues, and build your taste memory. Join thousands of
                travelers exploring wine trails, khachapuri routes, and village
                food experiences across Georgia.
              </p>
              <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                {!isAuthenticated ? (
                  <>
                    <button
                      onClick={() => navigate("/register")}
                      style={{
                        padding: "16px 32px",
                        fontSize: "1rem",
                        fontWeight: "600",
                         background:
                           "linear-gradient(135deg, #2d5016 0%, #1a3009 100%)",
                         color: "white",
                         border: "none",
                         borderRadius: "12px",
                         cursor: "pointer",
                         boxShadow: "0 4px 12px rgba(45, 80, 22, 0.3)",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                         e.target.style.transform = "translateY(-2px)";
                         e.target.style.boxShadow =
                           "0 6px 16px rgba(45, 80, 22, 0.4)";
                      }}
                      onMouseLeave={(e) => {
                         e.target.style.transform = "translateY(0)";
                         e.target.style.boxShadow =
                           "0 4px 12px rgba(45, 80, 22, 0.3)";
                      }}
                    >
                      Start Exploring
                    </button>
                    <button
                      onClick={() => navigate("/login")}
                      style={{
                        padding: "16px 32px",
                        fontSize: "1rem",
                        fontWeight: "600",
                        background: "white",
                        color: "#2d5016",
                        border: "2px solid #2d5016",
                        borderRadius: "12px",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                      }}
                      onMouseEnter={(e) => {
                        e.target.style.background = "#f8f9fa";
                      }}
                      onMouseLeave={(e) => {
                        e.target.style.background = "white";
                      }}
                    >
                      Sign In
                    </button>
                  </>
                ) : (
                  <>
                    <button
                      onClick={() => navigate("/feed")}
                      style={{
                        padding: "16px 32px",
                        fontSize: "1rem",
                        fontWeight: "600",
                        background: "#2d5016",
                        color: "white",
                        border: "none",
                        borderRadius: "12px",
                        cursor: "pointer",
                        boxShadow: "0 4px 12px rgba(25, 118, 210, 0.3)",
                        transition: "all 0.3s ease",
                      }}
                    >
                      View Feed
                    </button>
                    <button
                      onClick={() => navigate("/communities")}
                      style={{
                        padding: "16px 32px",
                        fontSize: "1rem",
                        fontWeight: "600",
                        background: "white",
                        color: "#2d5016",
                        border: "2px solid #2d5016",
                        borderRadius: "12px",
                        cursor: "pointer",
                        transition: "all 0.3s ease",
                      }}
                    >
                      Join Communities
                    </button>
                  </>
                )}
              </div>
            </div>
            <div
              style={{
                position: "relative",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <div
                style={{
                  width: "400px",
                  height: "400px",
                  background:
                    "linear-gradient(135deg, #1e6b7f 0%, #2d5016 100%)",
                  borderRadius: "24px",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  boxShadow: "0 20px 60px rgba(0,0,0,0.15)",
                  position: "relative",
                }}
              >
                <div
                  style={{
                    fontSize: "120px",
                    filter: "drop-shadow(0 10px 20px rgba(0,0,0,0.2))",
                    color: "white",
                  }}
                >
                  <GiWineGlass size={120} />
                </div>
                <div
                  style={{
                    position: "absolute",
                    top: "20px",
                    right: "20px",
                    background: "white",
                    padding: "12px 16px",
                    borderRadius: "12px",
                    boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
                    fontSize: "14px",
                    fontWeight: "600",
                    color: "#212529",
                  }}
                >
                  Travel With Taste
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Company Logos Section */}
      <section
        style={{
          padding: "40px 24px",
          background: "#f8f9fa",
          borderTop: "1px solid #e9ecef",
          borderBottom: "1px solid #e9ecef",
        }}
      >
        <div
          className="container"
          style={{ maxWidth: "1200px", margin: "0 auto" }}
        >
          <p
            style={{
              textAlign: "center",
              fontSize: "0.875rem",
              color: "#6c757d",
              marginBottom: "24px",
              fontWeight: "500",
            }}
          >
            Join thousands of travelers exploring Georgia's treasures
          </p>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              gap: "48px",
              flexWrap: "wrap",
              opacity: 0.6,
            }}
          >
            {["Tbilisi", "Batumi", "Kakheti", "Mtskheta", "Sighnaghi"].map(
              (city, idx) => (
                <div
                  key={idx}
                  style={{
                    fontSize: "1.25rem",
                    fontWeight: "700",
                    color: "#495057",
                  }}
                >
                {city}
              </div>
              )
            )}
          </div>
        </div>
      </section>

      {/* Perfect Solution Section */}
      <section style={{ padding: "80px 24px", background: "white" }}>
        <div
          className="container"
          style={{ maxWidth: "1200px", margin: "0 auto" }}
        >
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <h2
              style={{
                fontSize: "2.5rem",
                fontWeight: "700",
                marginBottom: "16px",
                color: "#212529",
              }}
            >
              Everything You Need for Your Travel Adventure
            </h2>
            <p
              style={{
                fontSize: "1.125rem",
                color: "#6c757d",
                maxWidth: "600px",
                margin: "0 auto",
              }}
            >
              Discover authentic venues, collect stamps, complete challenges,
              and build your personalized taste memory as you explore Georgia
            </p>
          </div>
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))",
              gap: "32px",
            }}
          >
            {features.map((feature, index) => (
              <div 
                key={index}
                style={{
                  padding: "40px",
                  background: "white",
                  borderRadius: "16px",
                  border: "1px solid #e9ecef",
                  transition: "all 0.3s ease",
                  cursor: "pointer",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow =
                    "0 12px 24px rgba(0,0,0,0.1)";
                     e.currentTarget.style.borderColor = "#2d5016";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "none";
                  e.currentTarget.style.borderColor = "#e9ecef";
                }}
              >
                <div
                  style={{
                    fontSize: "64px",
                    marginBottom: "24px",
                    display: "inline-block",
                    color: "#2d5016",
                  }}
                >
                  {React.createElement(feature.icon, { size: 64 })}
                </div>
                <h3
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "700",
                    marginBottom: "12px",
                    color: "#212529",
                  }}
                >
                  {feature.title}
                </h3>
                <p
                  style={{
                    fontSize: "1rem",
                    color: "#6c757d",
                    lineHeight: "1.6",
                    marginBottom: "20px",
                  }}
                >
                  {feature.description}
                </p>
                <div style={{ display: "flex", gap: "16px", flexWrap: "wrap" }}>
                  <a 
                    href="#" 
                    onClick={(e) => {
                      e.preventDefault();
                      if (isAuthenticated) {
                        navigate("/scan");
                      } else {
                        navigate("/register");
                      }
                    }}
                    style={{
                      color: "#2d5016",
                      textDecoration: "none",
                      fontWeight: "600",
                      fontSize: "0.9375rem",
                    }}
                  >
                    Start Exploring →
                  </a>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Statistics Dashboard Section */}
      <section
        style={{
          padding: "80px 24px",
          background: "linear-gradient(135deg, #f8f9fa 0%, #e9ecef 100%)",
        }}
      >
        <div
          className="container"
          style={{ maxWidth: "1200px", margin: "0 auto" }}
        >
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <h2
              style={{
                fontSize: "2.5rem",
                fontWeight: "700",
                marginBottom: "16px",
                color: "#212529",
              }}
            >
              Your Travel Journey in Numbers
            </h2>
            <p
              style={{
                fontSize: "1.125rem",
                color: "#6c757d",
                maxWidth: "600px",
                margin: "0 auto",
              }}
            >
              Track your progress, see how many venues you've explored, and
              celebrate your achievements
            </p>
          </div>
          <div
            style={{
              background: "white",
              borderRadius: "24px",
              padding: "40px",
              boxShadow: "0 8px 24px rgba(0,0,0,0.08)",
            }}
          >
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(200px, 1fr))",
                gap: "32px",
              }}
            >
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: "3rem",
                    fontWeight: "800",
                    color: "#2d5016",
                    marginBottom: "8px",
                  }}
                >
                  {stats.venues}+
                </div>
                <div
                  style={{
                    fontSize: "1rem",
                    color: "#6c757d",
                    fontWeight: "500",
                  }}
                >
                  Total Venues
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: "3rem",
                    fontWeight: "800",
                    color: "#1e6b7f",
                    marginBottom: "8px",
                  }}
                >
                  {stats.wineVenues}+
                </div>
                <div
                  style={{
                    fontSize: "1rem",
                    color: "#6c757d",
                    fontWeight: "500",
                  }}
                >
                  Wine Venues
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: "3rem",
                    fontWeight: "800",
                    color: "#4a9b8e",
                    marginBottom: "8px",
                  }}
                >
                  {stats.khachapuriVenues}+
                </div>
                <div
                  style={{
                    fontSize: "1rem",
                    color: "#6c757d",
                    fontWeight: "500",
                  }}
                >
                  Khachapuri Venues
                </div>
              </div>
              <div style={{ textAlign: "center" }}>
                <div
                  style={{
                    fontSize: "3rem",
                    fontWeight: "800",
                    color: "#8b6f47",
                    marginBottom: "8px",
                  }}
                >
                  {stats.villageFoodVenues}+
                </div>
                <div
                  style={{
                    fontSize: "1rem",
                    color: "#6c757d",
                    fontWeight: "500",
                  }}
                >
                  Village Food
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Venues Section */}
      {!loadingVenues && featuredVenues.length > 0 && (
        <section style={{ padding: "80px 24px", background: "white" }}>
          <div
            className="container"
            style={{ maxWidth: "1200px", margin: "0 auto" }}
          >
            <div style={{ textAlign: "center", marginBottom: "60px" }}>
              <h2
                style={{
                  fontSize: "2.5rem",
                  fontWeight: "700",
                  marginBottom: "16px",
                  color: "#212529",
                }}
              >
                Featured Venues
              </h2>
              <p
                style={{
                  fontSize: "1.125rem",
                  color: "#6c757d",
                  maxWidth: "600px",
                  margin: "0 auto",
                }}
              >
                Discover amazing experiences across Georgia
              </p>
            </div>
            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                gap: "32px",
              }}
            >
              {featuredVenues.slice(0, 6).map((venue) => (
                <div 
                  key={venue.id}
                  style={{
                    background: "white",
                    borderRadius: "16px",
                    border: "1px solid #e9ecef",
                    overflow: "hidden",
                    transition: "all 0.3s ease",
                    cursor: "pointer",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.transform = "translateY(-8px)";
                    e.currentTarget.style.boxShadow =
                      "0 12px 24px rgba(0,0,0,0.1)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.transform = "translateY(0)";
                    e.currentTarget.style.boxShadow = "none";
                  }}
                  onClick={() => navigate("/communities")}
                >
                  <div style={{ padding: "24px" }}>
                    <div
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "16px",
                        marginBottom: "16px",
                      }}
                    >
                      <span
                        style={{
                          fontSize: "48px",
                          display: "flex",
                          alignItems: "center",
                          color: "#2d5016",
                        }}
                      >
                        {venue.category?.includes("wine") ? (
                          <GiWineGlass size={48} />
                        ) : venue.category?.includes("khachapuri") ? (
                          <HiHome size={48} />
                        ) : venue.category?.includes("village_food") ? (
                          <HiHome size={48} />
                        ) : (
                          <HiLocationMarker size={48} />
                        )}
                      </span>
                      <div style={{ flex: 1 }}>
                        <h4
                          style={{
                          margin: 0, 
                            fontSize: "1.25rem",
                            fontWeight: "700",
                            color: "#212529",
                            marginBottom: "4px",
                          }}
                        >
                          {venue.name}
                        </h4>
                        <p
                          style={{
                          margin: 0, 
                            fontSize: "0.875rem",
                            color: "#6c757d",
                          }}
                        >
                          {venue.type.charAt(0).toUpperCase() +
                            venue.type.slice(1)}
                        </p>
                      </div>
                    </div>
                    {venue.description && (
                      <p
                        style={{
                          fontSize: "0.9375rem",
                          color: "#6c757d",
                          marginBottom: "16px",
                          lineHeight: "1.6",
                        }}
                      >
                        {venue.description.length > 100 
                          ? venue.description.substring(0, 100) + "..."
                          : venue.description}
                      </p>
                    )}
                    <div
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "8px",
                        fontSize: "0.875rem",
                        color: "#6c757d",
                      }}
                    >
                      <span>📍</span>
                      <span>{venue.location.address}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            <div style={{ textAlign: "center", marginTop: "48px" }}>
              <button
                onClick={() => navigate("/communities")}
                style={{
                  padding: "16px 32px",
                  fontSize: "1rem",
                  fontWeight: "600",
                  background: "#2d5016",
                  color: "white",
                  border: "none",
                  borderRadius: "12px",
                  cursor: "pointer",
                  boxShadow: "0 4px 12px rgba(45, 80, 22, 0.3)",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.target.style.transform = "translateY(-2px)";
                  e.target.style.boxShadow =
                    "0 6px 16px rgba(45, 80, 22, 0.4)";
                }}
                onMouseLeave={(e) => {
                  e.target.style.transform = "translateY(0)";
                  e.target.style.boxShadow =
                    "0 4px 12px rgba(45, 80, 22, 0.3)";
                }}
              >
                View All Venues
              </button>
            </div>
          </div>
        </section>
      )}

      {/* Team Members Section */}
      <section style={{ padding: "80px 24px", background: "white" }}>
        <div
          className="container"
          style={{ maxWidth: "1200px", margin: "0 auto" }}
        >
          <div style={{ textAlign: "center", marginBottom: "60px" }}>
            <h2
              style={{
                fontSize: "2.5rem",
                fontWeight: "700",
                marginBottom: "16px",
                color: "#212529",
              }}
            >
              Meet Our Team
            </h2>
            <p
              style={{
                fontSize: "1.125rem",
                color: "#6c757d",
                maxWidth: "600px",
                margin: "0 auto",
              }}
            >
              The passionate people behind TravelPass, dedicated to making your
              travel experiences unforgettable
            </p>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "flex-start",
              gap: "40px",
              flexWrap: "nowrap",
              maxWidth: "1200px",
              margin: "0 auto",
            }}
          >
            {[
              {
                name: "Nanuka Khatiashvili",
                role: "CEO",
                image: teamMember1,
              },
              {
                name: "Kakhi Kakhidze",
                role: "CTO",
                image: teamMember2,
              },
              {
                name: "Nina Chkhikvadze",
                role: "Merketing Manager",
                image: teamMember3,
              }
            ].map((member, index) => (
              <div
                key={index}
                style={{
                  textAlign: "center",
                  transition: "all 0.3s ease",
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                }}
              >
                <div
                  style={{
                    width: "200px",
                    height: "200px",
                    borderRadius: "50%",
                    margin: "0 auto 24px",
                    overflow: "hidden",
                    border: "4px solid #e9ecef",
                    boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
                    transition: "all 0.3s ease",
                  }}
                  onMouseEnter={(e) => {
                    e.currentTarget.style.borderColor = "#2d5016";
                    e.currentTarget.style.boxShadow =
                      "0 12px 32px rgba(45, 80, 22, 0.3)";
                  }}
                  onMouseLeave={(e) => {
                    e.currentTarget.style.borderColor = "#e9ecef";
                    e.currentTarget.style.boxShadow =
                      "0 8px 24px rgba(0,0,0,0.1)";
                  }}
                >
                  <img
                    src={member.image}
                    alt={member.name}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      display: "block",
                    }}
                  />
                </div>
                <h3
                  style={{
                    fontSize: "1.5rem",
                    fontWeight: "700",
                    marginBottom: "8px",
                    color: "#212529",
                  }}
                >
                  {member.name}
                </h3>
                <p
                  style={{
                    fontSize: "1rem",
                    color: "#6c757d",
                    marginBottom: "16px",
                  }}
                >
                  {member.role}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
