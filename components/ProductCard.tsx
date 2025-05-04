import React from "react";
import { Image, StyleSheet, Text, View } from "react-native";

interface ProductCardProps {
  title: string;
  image: string;
  price: number;
  category?: string;
}

export function ProductCard({
  title,
  image,
  price,
  category,
}: ProductCardProps) {
  return (
    <View style={styles.card}>
      <Image
        source={{ uri: image || "../assets/images/images.jpeg" }}
        style={styles.image}
        resizeMode="cover"
        defaultSource={require("../assets/images/images.jpeg")} // Fallback for Android
      />{" "}
      <View style={styles.textContainer}>
        <Text style={styles.brandText}>Film and Tinder</Text>
        <Text numberOfLines={2} style={styles.title}>
          {title}
        </Text>
        <Text style={styles.price}>${price}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    width: 160,
    margin: 8,
    borderRadius: 4,
    overflow: "hidden",
  },
  image: {
    width: "100%",
    height: 160,
  },
  textContainer: {
    padding: 10,
  },
  brandText: {
    fontSize: 12,
    color: "#666",
    marginBottom: 4,
  },
  title: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 4,
    color: "#000",
  },
  price: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#000",
  },
});
