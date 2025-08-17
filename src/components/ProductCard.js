import React from "react";
import { View, Text } from "react-native";

export default function ProductCard({ item, index }) {
  return (
    <View
      style={{
        backgroundColor: "#1e293b",
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: "#334155",
      }}
    >
      {/* Rank Number */}
      <Text style={{ color: "#64748b", fontSize: 12, marginBottom: 4 }}>
        #{index + 1} Recommendation
      </Text>

      {/* Product Name */}
      <Text
        style={{
          color: "white",
          fontSize: 18,
          fontWeight: "700",
          marginBottom: 6,
        }}
      >
        {item.name}
      </Text>

      {/* Brand & Category */}
      <Text style={{ color: "#cbd5e1", marginBottom: 4 }}>
        {item.brand} · {item.category}
      </Text>

      {/* Price */}
      <Text style={{ color: "#fbbf24", fontWeight: "600", marginBottom: 8 }}>
        ₹{item.price.toLocaleString("en-IN")}
      </Text>

      {/* Rationale / Explanation */}
      {item.rationale && (
        <Text style={{ color: "#94a3b8", marginBottom: 6 }}>
          💡 {item.rationale}
        </Text>
      )}

      {/* Score (only for local ranker) */}
      {item.score !== undefined && (
        <Text style={{ color: "#64748b", fontSize: 12 }}>
          Match Score: {item.score.toFixed(1)}
        </Text>
      )}
    </View>
  );
}
