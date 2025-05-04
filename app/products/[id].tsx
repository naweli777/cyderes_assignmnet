import { ProductCard } from "@/components/ProductCard";
import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import React from "react";
import { View, Text, StyleSheet } from "react-native";

const ProductDetails = () => {
  const { id } = useLocalSearchParams();

  const { data } = useQuery({
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
      <Text> Hello {id} </Text>
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

