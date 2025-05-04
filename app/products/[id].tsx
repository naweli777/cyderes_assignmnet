import { ProductCard } from "@/components/ProductCard";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ProductDetails = () => {
  const { id } = useLocalSearchParams();

  const { isPending, isLoading, isError, data } = useQuery({
    queryKey: ["productDetailById"],
    queryFn: async () => {
      const response = await fetch(
        `https://api.escuelajs.co/api/v1/products/${id}`
      );
      return await response.json();
    },
  });


  return (
    <View>
      <Text style={styles.title}> Hello {id} </Text>
      <ProductCard
        title={data?.title}
        image={data?.images[1]}
        category={data?.category?.name}
        price={data?.price}
      />
    </View>
  );
};

export default ProductDetails;

const styles = StyleSheet.create({
  card: {
    padding: 10,
  },
  image: {
    width: "100%",
    height: 200,
    borderRadius: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 10,
    color: "#ffffff",
  },
});
