// App.js (versão com visual aprimorado nos detalhes do país)
import React, { useState, useEffect } from 'react';
import {
  View, Text, FlatList, TouchableOpacity, StyleSheet, Image, ActivityIndicator,
  TextInput, Pressable, ScrollView, SafeAreaView
} from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import axios from 'axios';
import { Ionicons } from '@expo/vector-icons';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createStackNavigator();
const FAVORITES_KEY = 'favorite_countries';

const App = () => (
  <NavigationContainer>
    <Stack.Navigator initialRouteName="Países" screenOptions={styles.navHeader}>
      <Stack.Screen name="Países" component={CountriesScreen} options={{ title: 'Explorar Países' }} />
      <Stack.Screen name="Detalhes" component={CountryDetailsScreen} options={({ route }) => ({ title: route.params.country.name.common })} />
    </Stack.Navigator>
  </NavigationContainer>
);

const CountriesScreen = ({ navigation }) => {
  const [countries, setCountries] = useState([]);
  const [search, setSearch] = useState('');
  const [favorites, setFavorites] = useState([]);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    fetchCountries();
    loadFavorites();
  }, []);

  const fetchCountries = async () => {
    try {
      setRefreshing(true);
      const res = await axios.get('https://restcountries.com/v3.1/all');
      const sorted = res.data.sort((a, b) => a.name.common.localeCompare(b.name.common));
      setCountries(sorted);
    } catch (e) {
      console.log('Erro ao buscar países:', e);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const loadFavorites = async () => {
    const stored = await AsyncStorage.getItem(FAVORITES_KEY);
    if (stored) setFavorites(JSON.parse(stored));
  };

  const toggleFavorite = async (code) => {
    const updated = favorites.includes(code)
      ? favorites.filter(c => c !== code)
      : [...favorites, code];
    setFavorites(updated);
    await AsyncStorage.setItem(FAVORITES_KEY, JSON.stringify(updated));
  };

  const filtered = countries.filter(c => {
    const match = c.name.common.toLowerCase().includes(search.toLowerCase());
    return match && (!showFavoritesOnly || favorites.includes(c.cca3));
  });

  if (loading) return <ActivityIndicator style={styles.center} size="large" color="#2c3e50" />;

  return (
    <SafeAreaView style={styles.container}>
      <TextInput
        style={styles.searchInput}
        placeholder="Buscar país..."
        value={search}
        onChangeText={setSearch}
      />
      <Pressable onPress={() => setShowFavoritesOnly(prev => !prev)} style={styles.toggleButton}>
        <Ionicons name={showFavoritesOnly ? 'star' : 'star-outline'} size={20} color="#f5b400" />
        <Text>{showFavoritesOnly ? 'Todos' : 'Favoritos'}</Text>
      </Pressable>
      <FlatList
        data={filtered}
        keyExtractor={item => item.cca3}
        refreshing={refreshing}
        onRefresh={fetchCountries}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() => navigation.navigate('Detalhes', { country: item })}
          >
            <Image source={{ uri: item.flags.svg }} style={styles.flag} />
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{item.name.common}</Text>
              <Text style={styles.subtitle}>{item.capital?.[0] || 'Sem capital'}</Text>
            </View>
            <Ionicons
              name={favorites.includes(item.cca3) ? 'star' : 'star-outline'}
              size={24}
              color={favorites.includes(item.cca3) ? '#f5b400' : '#ccc'}
              onPress={() => toggleFavorite(item.cca3)}
            />
          </TouchableOpacity>
        )}
      />
    </SafeAreaView>
  );
};

const CountryDetailsScreen = ({ route }) => {
  const { country } = route.params;
  const languages = country.languages ? Object.values(country.languages).join(', ') : 'Não informado';
  const currencies = country.currencies
    ? Object.entries(country.currencies).map(([code, c]) => `${c.name} (${c.symbol || '—'})`).join(', ')
    : 'Não informado';

  return (
    <ScrollView contentContainerStyle={styles.detailsContainer}>
      <Image source={{ uri: country.flags.svg }} style={styles.flagLarge} />
      <Text style={styles.detailsTitle}>{country.name.common}</Text>
      <View style={styles.detailsCard}>
        <DetailRow label="Nome oficial" value={country.name.official} />
        <DetailRow label="Capital" value={country.capital?.[0] || 'Desconhecida'} />
        <DetailRow label="Região" value={country.region} />
        <DetailRow label="Sub-região" value={country.subregion || 'Não informada'} />
        <DetailRow label="População" value={country.population.toLocaleString()} />
        <DetailRow label="Área" value={`${country.area.toLocaleString()} km²`} />
        <DetailRow label="Idiomas" value={languages} />
        <DetailRow label="Moedas" value={currencies} />
      </View>
    </ScrollView>
  );
};

const DetailRow = ({ label, value }) => (
  <View style={styles.detailRow}>
    <Text style={styles.detailLabel}>{label}:</Text>
    <Text style={styles.detailValue}>{value}</Text>
  </View>
);

const styles = StyleSheet.create({
  navHeader: {
    headerStyle: { backgroundColor: '#2c3e50' },
    headerTintColor: '#fff',
    headerTitleStyle: { fontWeight: 'bold' },
  },
  container: { flex: 1, backgroundColor: '#f8f9fa', padding: 10 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  searchInput: {
    backgroundColor: '#fff', padding: 12, borderRadius: 8,
    marginBottom: 10, borderColor: '#ccc', borderWidth: 1,
  },
  toggleButton: {
    flexDirection: 'row', alignItems: 'center',
    padding: 10, marginBottom: 10,
    borderRadius: 8, backgroundColor: '#eee', gap: 8,
  },
  item: {
    flexDirection: 'row', alignItems: 'center',
    backgroundColor: '#fff', padding: 12,
    marginBottom: 10, borderRadius: 10, elevation: 1,
  },
  flag: { width: 50, height: 30, marginRight: 12, borderRadius: 4 },
  title: { fontSize: 16, fontWeight: 'bold' },
  subtitle: { fontSize: 14, color: '#7f8c8d' },
  detailsContainer: { alignItems: 'center', padding: 20, backgroundColor: '#f8f9fa' },
  flagLarge: { width: 250, height: 150, borderRadius: 10, marginBottom: 20 },
  detailsTitle: { fontSize: 26, fontWeight: 'bold', color: '#2c3e50', marginBottom: 20 },
  detailsCard: {
    width: '100%', backgroundColor: '#fff', borderRadius: 10,
    padding: 16, shadowColor: '#000', shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 }, shadowRadius: 5,
    elevation: 2,
  },
  detailRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    marginVertical: 6,
  },
  detailLabel: {
    fontWeight: '600', color: '#555', fontSize: 15,
  },
  detailValue: {
    flexShrink: 1, textAlign: 'right', color: '#2c3e50', fontSize: 15,
  },
});

export default App;
