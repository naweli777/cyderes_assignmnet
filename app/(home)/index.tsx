import { ProductCard } from "@/components/ProductCard";
import { SignOutButton } from "@/components/SignOutButton";
import { Product } from "@/constants/interface/ProductListInterface";
import { SignedIn, useUser } from "@clerk/clerk-expo";
import { useQuery } from "@tanstack/react-query";
import { Link, Redirect, useNavigation } from "expo-router";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import {
  FlatList,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

const Products = () => {
  const navigation = useNavigation();
  const { isSignedIn } = useUser();

  const { isPending, isLoading, isError, data } = useQuery({
    queryKey: ["productList"],
    queryFn: async () => {
      const response = await fetch("https://api.escuelajs.co/api/v1/products");
      return await response.json();
    },
  });

  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState<string>("");

  const seen = new Set();
  const uniqueCategories = data
    ?.filter((el: any) => {
      const id = el?.category?.id;
      if (!id || seen.has(id)) return false;
      seen.add(id);
      return true;
    })
    .map((el: any) => el.category);

  const filteredData = useMemo(() => {
    let filtered = data ?? [];

    if (selectedCategoryId) {
      filtered = filtered.filter(
        (item: any) => item?.category?.id === selectedCategoryId
      );
    }

    if (searchTerm) {
      filtered = filtered.filter((item: any) =>
        item?.title.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    return filtered;
  }, [data, selectedCategoryId, searchTerm]);

  const renderItem = useCallback(
    ({ item }: { item: Product }) => (
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
    ),
    []
  );

  const renderCategoryItem = useCallback(
    ({ item }: { item: any }) => (
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
    ),
    [selectedCategoryId]
  );

  useEffect(() => {
    navigation.setOptions({ headerShown: false });
  }, [navigation]);

  if (!isSignedIn) {
    return <Redirect href={"/(auth)/sign-in"} />;
  }

  if (isPending || isLoading) {
    return <Text>Loading...</Text>;
  }

  if (isError) {
    return <Text>Error loading products</Text>;
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <TextInput
            style={styles.searchInput}
            placeholder="Search by title..."
            value={searchTerm}
            onChangeText={setSearchTerm}
          />
          <SignedIn>
            <SignOutButton />
          </SignedIn>
        </View>

        <View style={styles.filterContainer}>
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

          <FlatList
            data={uniqueCategories}
            horizontal
            keyExtractor={(item) => item?.id?.toString()}
            showsHorizontalScrollIndicator={false}
            renderItem={renderCategoryItem}
          />
        </View>
      </View>
      <FlatList<Product>
        data={filteredData}
        renderItem={renderItem}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.flatListContainer}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

export default Products;

const styles = StyleSheet.create({
  container: {
    marginTop: 55,
    flex: 1,
    alignItems: "center",
  },
  flatListContainer: {
    alignItems: "center",
  },
  headerContainer: {
    width: "100%",
    paddingHorizontal: 20,
  },
  searchInput: {
    flex: 1,
    height: 40,
    borderColor: "#ccc",
    borderWidth: 1,
    borderRadius: 20,
    paddingHorizontal: 12,
    marginRight: 4,
    fontSize: 16,
    color: "#cccccc",
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
