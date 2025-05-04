import { ProductCard } from "@/components/ProductCard";
import { Product } from "@/constants/interface/ProductListInterface";
import { useQuery } from "@tanstack/react-query";
import { Link } from "expo-router";
import React, { useState, useMemo } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";

const Products = () => {
  const { isPending, isLoading, isError, data } = useQuery({
    queryKey: ["productList"],
    queryFn: async () => {
      const response = await fetch("https://api.escuelajs.co/api/v1/products");
      return await response.json();
    },
  });

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(null);

  // Extract unique categories
  const seen = new Set();
  const uniqueCategories = data
    ?.filter((el: any) => {
      const id = el?.category?.id;
      if (!id || seen.has(id)) return false;
      seen.add(id);
      return true;
    })
    .map((el: any) => el.category);

  // Filter products based on selected category
  const filteredData = useMemo(() => {
    if (!selectedCategoryId) return data ?? [];
    return data?.filter((item: any) => item?.category?.id === selectedCategoryId);
  }, [data, selectedCategoryId]);

  if (isPending || isLoading) {
    return <Text>Loading...</Text>;
  }

  if (isError) {
    return <Text>Error loading products</Text>;
  }

  return (
    <FlatList<Product>
      data={filteredData}
      renderItem={({ item }) => (
        <Link href={`/products/${item.id}`} asChild>
          <Pressable>
            <ProductCard
              title={item?.title}
              image={item?.images?.[0]}
              category={item?.category?.name}
              price={item?.price}
            />
          </Pressable>
        </Link>
      )}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}
      contentContainerStyle={styles.container}
      ListHeaderComponent={
        <View style={styles.filterContainer}>
          {/* All Chip */}
          <Pressable
            style={[
              styles.chip,
              selectedCategoryId === null && styles.chipSelected,
            ]}
            onPress={() => setSelectedCategoryId(null)}
          >
            <Text
              style={[
                styles.chipText,
                selectedCategoryId === null && styles.chipTextSelected,
              ]}
            >
              All
            </Text>
          </Pressable>

          {/* Category Chips */}
          {uniqueCategories?.map((item: any) => (
            <Pressable
              key={item?.id}
              style={[
                styles.chip,
                selectedCategoryId === item?.id && styles.chipSelected,
              ]}
              onPress={() =>
                setSelectedCategoryId(
                  selectedCategoryId === item?.id ? null : item?.id
                )
              }
            >
              <Text
                style={[
                  styles.chipText,
                  selectedCategoryId === item?.id && styles.chipTextSelected,
                ]}
              >
                {item?.name}
              </Text>
            </Pressable>
          ))}
        </View>
      }
    />
  );
};

export default Products;

const styles = StyleSheet.create({
  container: {
    padding: 30,
    flexGrow: 1,
    alignItems: "center",
  },
  filterContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 10,
    gap: 8,
  },
  chip: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    backgroundColor: "#e0e0e0",
    borderRadius: 20,
    marginRight: 8,
    marginBottom: 8,
  },
  chipSelected: {
    backgroundColor: "#007bff",
  },
  chipText: {
    fontSize: 14,
    color: "#333",
  },
  chipTextSelected: {
    color: "#fff",
    fontWeight: "bold",
  },
});
