import React from 'react';
import { StyleSheet, Image, Text, View ,ScrollView} from 'react-native';

interface ProductCardProps {
  title: string;
  image: string;
  category: string;
  price: number;
  description?: string;
}

export function ProductCard({ title, image, category, price, description }: ProductCardProps) {
    return (
      <ScrollView>
        <View style={styles.card}>
          <Image 
            source={{ uri: image }} 
            style={styles.image} 
            resizeMode="cover" 
          />
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.title}>{category}</Text>
          <Text style={styles.title}>₹{price}</Text>
          {description && <Text>{description}</Text>}
        </View>
      </ScrollView>
    );
  }
  
  

const styles = StyleSheet.create({
  card: {
    padding: 10,
  },
  image: {
    width: '100%',
    height: 200,
    borderRadius: 8,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginTop: 10,
    color:'#ffffff'
  },
});

