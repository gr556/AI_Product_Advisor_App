import React from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  ScrollView,
  Alert,
} from "react-native";

import { PRODUCT_CATALOG } from "./catalog";
import ProductCard from "./components/ProductCard";

export default function AdvisorScreen() {
  const [query, setQuery] = React.useState(
    "Looking for a smart lock for my flat under ₹10k, with mobile control."
  );
  const [apiKey, setApiKey] = React.useState("");
  const [useLocal, setUseLocal] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [results, setResults] = React.useState([]);
  const [topK, setTopK] = React.useState(5);

  async function onRecommend() {
    if (!query.trim()) {
      Alert.alert("Enter a query", "e.g. 'robot vacuum for pets under ₹20k'");
      return;
    }
    setLoading(true);
    setResults([]);
    try {
      if (useLocal || !apiKey.trim()) {
        const recs = fallbackRank(query, PRODUCT_CATALOG, topK);
        setResults(recs);
      } else {
        const prompt = buildPrompt(query, PRODUCT_CATALOG, topK);
        const text = await callGemini(prompt, apiKey.trim());
        const parsed = parseFirstJson(text);
        const recs = normalizeResponse(parsed, PRODUCT_CATALOG).slice(0, topK);
        setResults(recs);
      }
    } catch (e) {
      console.error(e);
      try {
        const recs = fallbackRank(query, PRODUCT_CATALOG, topK);
        setResults(recs);
      } catch (e2) {
        Alert.alert("Error", String(e.message || e));
      }
    } finally {
      setLoading(false);
    }
  }

  return (
    <ScrollView
      style={{ flex: 1, backgroundColor: "#0f172a" }}
      contentContainerStyle={{ padding: 16 }}
      keyboardShouldPersistTaps="handled"
    >
      <Text style={{ color: "white", fontSize: 28, fontWeight: "800", marginBottom: 8 }}>
        AI Product Advisor
      </Text>
      <Text style={{ color: "#94a3b8", marginBottom: 16 }}>
        Describe your need. We'll recommend the best matches and explain why.
      </Text>

      {/* Query Input */}
      <View
        style={{
          backgroundColor: "#111827",
          borderRadius: 12,
          padding: 12,
          marginBottom: 12,
          borderWidth: 1,
          borderColor: "#1f2937",
        }}
      >
        <Text style={{ color: "#9ca3af", marginBottom: 8 }}>Your query</Text>
        <TextInput
          value={query}
          onChangeText={setQuery}
          placeholder="e.g., robot vacuum for 2BHK with mop under ₹25k"
          placeholderTextColor="#6b7280"
          style={{
            color: "white",
            backgroundColor: "#0b1220",
            borderRadius: 10,
            padding: 12,
            minHeight: 60,
          }}
          multiline
        />
      </View>

      {/* API Key Input */}
      <View
        style={{
          backgroundColor: "#111827",
          borderRadius: 12,
          padding: 12,
          marginBottom: 12,
          borderWidth: 1,
          borderColor: "#1f2937",
        }}
      >
        <Text style={{ color: "#9ca3af", marginBottom: 8 }}>Gemini API Key (optional)</Text>
        <TextInput
          value={apiKey}
          onChangeText={setApiKey}
          placeholder="Paste your Google Generative Language API key"
          placeholderTextColor="#6b7280"
          secureTextEntry
          autoCapitalize="none"
          autoCorrect={false}
          style={{
            color: "white",
            backgroundColor: "#0b1220",
            borderRadius: 10,
            padding: 12,
          }}
        />
        <Text style={{ color: "#64748b", marginTop: 6 }}>
          Leave blank or toggle "Local" to use the offline ranker.
        </Text>
      </View>

      {/* Controls */}
      <View style={{ flexDirection: "row", alignItems: "center", marginBottom: 12 }}>
        <TouchableOpacity
          onPress={() => setUseLocal((v) => !v)}
          style={{
            paddingVertical: 8,
            paddingHorizontal: 12,
            backgroundColor: "#0b1220",
            borderRadius: 10,
            borderWidth: 1,
            borderColor: useLocal || !apiKey ? "#22c55e" : "#1f2937",
          }}
        >
          <Text style={{ color: "white", fontWeight: "700" }}>
            {useLocal || !apiKey ? "Local: ON" : "Local: OFF"}
          </Text>
        </TouchableOpacity>

        {/* TopK control */}
        <TouchableOpacity
          onPress={() => setTopK((k) => Math.max(1, k - 1))}
          style={{
            marginLeft: 8,
            padding: 8,
            backgroundColor: "#0b1220",
            borderRadius: 8,
            borderWidth: 1,
            borderColor: "#1f2937",
          }}
        >
          <Text style={{ color: "white" }}>−</Text>
        </TouchableOpacity>
        <Text style={{ color: "white", width: 30, textAlign: "center" }}>{topK}</Text>
        <TouchableOpacity
          onPress={() => setTopK((k) => Math.min(10, k + 1))}
          style={{
            marginLeft: 4,
            padding: 8,
            backgroundColor: "#0b1220",
            borderRadius: 8,
            borderWidth: 1,
            borderColor: "#1f2937",
          }}
        >
          <Text style={{ color: "white" }}>+</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={onRecommend}
          style={{
            marginLeft: "auto",
            backgroundColor: "#2563eb",
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderRadius: 12,
          }}
        >
          {loading ? (
            <ActivityIndicator />
          ) : (
            <Text style={{ color: "white", fontWeight: "700" }}>Recommend</Text>
          )}
        </TouchableOpacity>
      </View>

      {/* Results */}
      {loading ? (
        <Text style={{ color: "#9ca3af" }}>Thinking…</Text>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => String(item.id)}
          renderItem={({ item, index }) => <ProductCard item={item} index={index} />}
          ItemSeparatorComponent={() => <View style={{ height: 10 }} />}
          scrollEnabled={false}
        />
      )}
    </ScrollView>
  );
}

/* ---------------- Utils (inline for minimal files) ---------------- */

function buildPrompt(userQuery, catalog, topK) {
  const slim = catalog.map((p) => ({
    id: p.id,
    brand: p.brand,
    name: p.name,
    price: p.price,
    category: p.category,
    description: p.description,
  }));
  return `You are an AI Product Advisor. The user describes their needs.
Pick the top ${topK} items from the catalog. Return STRICT JSON only:

{
  "recommendations": [
    { "id": <id>, "score": <0..1>, "rationale": "<why>", "matched_attributes": ["brand","price","category"] }
  ]
}

User request: ${JSON.stringify(userQuery)}

Catalog: ${JSON.stringify(slim)}
`;
}

async function callGemini(prompt, apiKey) {
  const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(
    apiKey
  )}`;
  const body = {
    contents: [{ role: "user", parts: [{ text: prompt }] }],
    generationConfig: { temperature: 0.2, maxOutputTokens: 512 },
  };
  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) throw new Error("Gemini API error");
  const data = await res.json();
  return data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join("") ?? "";
}

function parseFirstJson(text) {
  const start = Math.min(...[text.indexOf("{"), text.indexOf("[")].filter((v) => v >= 0));
  const end = Math.max(text.lastIndexOf("}"), text.lastIndexOf("]"));
  if (start < 0 || end < 0 || end <= start) throw new Error("No JSON found in response");
  const slice = text.slice(start, end + 1).replace(/```json|```/g, "");
  return JSON.parse(slice);
}

function normalizeResponse(parsed, catalog) {
  const byId = new Map(catalog.map((p) => [p.id, p]));
  const list = parsed?.recommendations || parsed || [];
  return list.map((r, i) => {
    const base = byId.get(r.id) || catalog[i % catalog.length];
    return { ...base, score: r.score ?? 0, rationale: r.rationale || "Recommended." };
  });
}

function fallbackRank(query, catalog, topK = 5) {
  const q = query.toLowerCase();
  const tokens = q.split(/\W+/).filter(Boolean);
  function scoreItem(p) {
    let s = 0;
    const hay = (p.brand + " " + p.name + " " + p.category + " " + p.description).toLowerCase();
    tokens.forEach((t) => {
      if (hay.includes(t)) s += 1;
    });
    if (/lock|door/.test(q) && /lock|door/i.test(hay)) s += 2;
    if (/vacuum|robot|mop/.test(q) && /vacuum|robot/.test(hay)) s += 2;
    if (/massage|massager/.test(q) && /massage/.test(hay)) s += 2;
    if (/projector|movie/.test(q) && /projector/.test(hay)) s += 1.5;
    return s;
  }
  const scored = catalog
    .map((p) => ({ ...p, score: scoreItem(p) }))
    .sort((a, b) => b.score - a.score)
    .slice(0, topK)
    .map((p) => ({ ...p, rationale: `Good fit: ${p.category}, ${p.brand}` }));
  return scored;
}
