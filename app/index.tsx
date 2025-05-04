import { ProductCard } from "@/components/ProductCard";
import { Product } from "@/constants/interface/ProductListInterface";
import { useQuery } from "@tanstack/react-query";
import { Link } from "expo-router";
import React from "react";
import { FlatList, StyleSheet, View, Text } from "react-native";

const Products = () => {
  const { isPending, isLoading, isError, data } = useQuery({
    queryKey: ["productList"],
    queryFn: async () => {
      const response = await fetch("https://api.escuelajs.co/api/v1/products");
      return await response.json();
    },
  });

  const categoryFilter = new Set(data?.map((el: any) => el?.category?.name));

  return (
    <FlatList<Product>
      data={data ?? []}
      renderItem={({ item }) => (
        <Link href={`/products/${item.id}`}>
          <ProductCard
            title={item?.title}
            image={item?.images[0]}
            category={item?.category?.name}
            price={item?.price}
          />
        </Link>
      )}
      keyExtractor={(item) => item.id.toString()}
      numColumns={2}
      contentContainerStyle={styles.container}
    />
  );
};

export default Products;

const styles = StyleSheet.create({
  container: {
    padding: 30,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 16,
  },
  cardWrapper: {
    flex: 1,
    marginHorizontal: 5,
  },
});
