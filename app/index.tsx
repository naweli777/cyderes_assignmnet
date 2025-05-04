import { ProductCard } from "@/components/ProductCard";
import { Product } from "@/constants/interface/ProductListInterface";
import { useQuery } from "@tanstack/react-query";
import { Link } from "expo-router";
import React from "react";
import { ScrollView } from "react-native";

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
    <ScrollView>
      {data?.map((item: Product, index: number) => (
        <Link key={index} href={`/products/${item?.id}`}>
          <ProductCard
            title={item?.title}
            image={item?.images[0]}
            category={item?.category?.name}
            price={item?.price}
          />
        </Link>
      ))}
    </ScrollView>
  );
};

export default Products;
