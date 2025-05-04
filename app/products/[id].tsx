import { useQuery } from "@tanstack/react-query";
import { useLocalSearchParams } from "expo-router";
import React, { useState, useRef } from "react";
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  Image, 
  Dimensions, 
  FlatList,
} from "react-native";

const { width: screenWidth } = Dimensions.get("window");

interface Product {
  id: number;
  title: string;
  price: number;
  description: string;
  images: string[];
  category?: {
    name: string;
  };
}

const ProductDetails = () => {
  const { id } = useLocalSearchParams();
  const [activeIndex, setActiveIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const { data: product } = useQuery<Product>({
    queryKey: ["productDetailById", id],
    queryFn: async () => {
      const response = await fetch(
        `https://api.escuelajs.co/api/v1/products/${id}`
      );
      return await response.json();
    },
  });

  const renderPagination = () => {
    if (!product?.images) return null;
    
    return (
      <View style={styles.paginationContainer}>
        {product.images.map((_, index) => (
          <View
            key={index}
            style={[
              styles.paginationDot,
              activeIndex === index && styles.activeDot
            ]}
          />
        ))}
      </View>
    );
  };

  if (!product) {
    return (
      <View style={styles.loadingContainer}>
        <Text>Loading...</Text>
      </View>
    );
  }

  const descriptionPoints = product.description
    .split('\n')
    .filter(point => point.trim() !== '');

  return (
    <ScrollView style={styles.container}>
   <View style={styles.carouselContainer}>
        <FlatList
          ref={flatListRef}
          data={product.images}
          renderItem={({ item }) => (
            <Image 
              source={{ uri: item }} 
              style={styles.productImage} 
              resizeMode="contain"
            />
          )}
          horizontal
          pagingEnabled
          showsHorizontalScrollIndicator={false}
          onMomentumScrollEnd={(event) => {
            const index = Math.round(
              event.nativeEvent.contentOffset.x / screenWidth
            );
            setActiveIndex(index);
          }}
          keyExtractor={(item, index) => index.toString()}
        />
        {renderPagination()}
      </View>

      <View style={styles.infoContainer}>
        <Text style={styles.brand}>Film and Tinder</Text>
        <Text style={styles.title}>{product.title}</Text>
        <Text style={styles.price}>${product.price.toFixed(2)}</Text>
        
        <Text style={styles.sectionTitle}>Description</Text>
        {descriptionPoints.map((item, index) => (
          <Text key={index} style={styles.descriptionItem}>
            {item.trim()}
          </Text>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  carouselContainer: {
    height: screenWidth,
    position: "relative",
  },
  productImage: {
    width: screenWidth,
    height: screenWidth,
    backgroundColor: "#f5f5f5",
  },
  paginationContainer: {
    position: "absolute",
    bottom: 20,
    flexDirection: "row",
    justifyContent: "center",
    width: "100%",
  },
  paginationDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: "#ccc",
    marginHorizontal: 4,
  },
  activeDot: {
    backgroundColor: "#000",
  },
  infoContainer: {
    padding: 20,
  },
  brand: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
    marginBottom: 5,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },
  price: {
    fontSize: 20,
    fontWeight: "600",
    color: "#000",
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#000",
    marginBottom: 10,
  },
  descriptionItem: {
    fontSize: 16,
    color: "#333",
    marginBottom: 8,
    lineHeight: 22,
  },
});

export default ProductDetails;