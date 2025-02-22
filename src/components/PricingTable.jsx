import React, { useState } from "react";
import { auth, db } from "../lib/firebase";

export const plans = [
  {
    title: "Weekly",
    price: "$5.99",
    frequency: "/week",
    features: ["Unlimited messages", "Unlimited Support"],
    price_id: "price_1QulLs00yCNSEuua1tiC0IMQ",
    isPopular: false,
    isOneTime: false,
    ctaText: "Subscribe",
    paymentLink: "https://buy.stripe.com/7sIg2F4d3gwPeBy6oo",
    testPaymentLink: "https://buy.stripe.com/test_3cseXngREcaVeUoeUX",
  },
  {
    title: "Monthly",
    price: "$9.99",
    frequency: "/month",
    features: ["Unlimited messages", "Unlimited Support"],
    price_id: "price_1QulMQ00yCNSEuuae1g8pm8g",
    isPopular: true,
    isOneTime: false,
    ctaText: "Subscribe",
    paymentLink: "https://buy.stripe.com/3csaIl6lb6Wf1OM3cd",
    testPaymentLink: "https://buy.stripe.com/test_cN28yZ8l8fn7dQk6os",
  },
  {
    title: "Annually",
    price: "$49.99",
    frequency: "/year",
    features: ["Unlimited messages", "Unlimited Support"],
    price_id: "price_1QulND00yCNSEuuasdT21rVs",
    isPopular: false,
    isOneTime: true,
    ctaText: "Get it now",
    paymentLink: "https://buy.stripe.com/5kA8Ad9xnfsLbpm6oq",
    testPaymentLink: "https://buy.stripe.com/test_bIYeXnfNA1whbIccMR",
  },
];

const PricingTable = () => {
  const [plan, setPlan] = useState(plans[0]);

  return (
    <div>
      <div style={styles.container}>
        <div className="text-3xl p-4">PRICING</div>
        <div style={styles.pricingTable}>
          {plans.map((plan, index) => (
            <div
              key={index}
              style={{
                ...styles.plan,
                ...(plan.isPopular ? styles.popularPlan : {}),
              }}
            >
              <h2 style={styles.title}>{plan.title}</h2>
              <p style={styles.price}>
                {plan.price}{" "}
                <span style={styles.frequency}>{plan.frequency}</span>
              </p>
              <ul style={styles.features}>
                {plan.features.map((feature, i) => (
                  <li key={i} style={styles.feature}>
                    {feature}
                  </li>
                ))}
              </ul>
              <a
                target="_blank"
                href={
                  plan.testPaymentLink +
                  "?prefilled_email=" +
                  auth.currentUser.email
                }
              >
                <button style={styles.ctaButton}>{plan.ctaText}</button>
              </a>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

// Styles
const styles = {
  container: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    minHeight: "100vh",
    fontFamily: "Montserrat, Arial, sans-serif",
    backgroundColor: "#1f2937",
    padding: "20px",
    backgroundColor: "rgb(17,24,39)",
  },
  pricingTable: {
    display: "flex",
    flexDirection: "row",
    padding: "20px",
    gap: "30px",
    backgroundColor: "#1f2937",
    borderRadius: "10px",
    padding: "20px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
    width: "100%",
    maxWidth: "900px",
    flexWrap: "wrap", // Allows wrapping on smaller screens
    justifyContent: "center", // Centers plans on smaller screens
  },
  plan: {
    backgroundColor: "#1f2937",

    borderRadius: "8px",
    textAlign: "center",
    width: "250px",
    flex: "1 1 250px", // Allows flexibility for responsive sizing
  },
  popularPlan: {
    backgroundColor: "#1f2937",
  },
  title: {
    fontSize: "24px",
    marginBottom: "10px",
    color: "#fff",
  },
  price: {
    fontSize: "36px",
    fontWeight: "bold",
    color: "#fff",
    marginBottom: "20px",
  },
  frequency: {
    fontSize: "16px",
    color: "#6b7280",
  },
  features: {
    listStyle: "none",
    padding: "0",
    marginBottom: "20px",
  },
  feature: {
    marginBottom: "10px",
    color: "#fff",
  },
  ctaButton: {
    backgroundColor: "#ef4444",
    color: "#fff",
    border: "none",
    borderRadius: "30px",
    padding: "10px 20px",
    fontSize: "16px",
    cursor: "pointer",
    width: "100%",
  },
};

// Media Queries for Mobile Responsiveness
const mediaQueries = `
  @media (max-width: 768px) {
    .pricingTable {
      flex-direction: column;
      align-items: center;
    }
    .plan {
      width: 100%;
      max-width: 300px;
      margin-bottom: 20px;
    }
  }
`;

// Inject media queries into the document
const styleSheet = document.createElement("style");
styleSheet.type = "text/css";
styleSheet.innerText = mediaQueries;
document.head.appendChild(styleSheet);

export default PricingTable;
