import { useEffect, useState } from 'react';
import { Text, TextInput, TouchableOpacity, View, StyleSheet, Image, FlatList } from 'react-native';

async function delay(timeout: number) {
  await new Promise((resolve) => {
    setTimeout(() => {
      resolve("ok");
    }, timeout);
  });
}

type ConsultaPokemon = {
  name: string;
  height: number;
  weight: number;
  image: string;
};

export default function AppHooks() {
  const [consulta, setConsulta] = useState<ConsultaPokemon[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [pokemon, setPokemon] = useState<string>("");

  async function handleFetchConsulta() {
    if (!pokemon) return;

    setLoading(true);
    try {
      await delay(2000);

      const request = await fetch(`https://pokeapi.co/api/v2/pokemon/${pokemon}`, {
        method: "GET",
        headers: {
          accept: "application/json",
          "content-type": "application/json",
        },
      });

      const data = await request.json();

      const novoPokemon: ConsultaPokemon = {
        name: data.name,
        height: data.height,
        weight: data.weight,
        image: data.sprites.other["official-artwork"].front_default,
      };

      setConsulta((prev) => [...prev, novoPokemon]);
      setPokemon("");

    } catch (e: any) {
      console.error(e.message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <View style={styles.container}>

      <TextInput
        style={styles.input}
        value={pokemon}
        onChangeText={setPokemon}
        placeholder="Digite o nome do Pokémon"
      />

      <TouchableOpacity onPress={handleFetchConsulta} style={styles.btn}>
        <Text style={styles.btnText}>Buscar Pokémon</Text>
      </TouchableOpacity>

      {loading && <Text>Carregando dados do Pokémon...</Text>}

      <FlatList
        data={consulta}
        keyExtractor={(item) => item.name}
        renderItem={({ item }) => (
          <View>
            <Image source={{ uri: item.image }} style={styles.image} />

            <Text style={styles.text}>Nome: {item.name}</Text>
            <Text style={styles.text}>Altura: {item.height}</Text>
            <Text style={styles.text}>Peso: {item.weight}</Text>
          </View>
        )}
      />

    </View>
  );
}

const styles = StyleSheet.create({
  container: { padding: 20, marginTop: 40 },
  input: {
    backgroundColor: "#eee",
    padding: 10,
    borderRadius: 8,
    marginBottom: 10,
  },
  btn: {
    backgroundColor: "#4888e9",
    padding: 12,
    borderRadius: 8,
    marginBottom: 20,
  },
  btnText: {
    color: "#fff",
    textAlign: "center",
    fontWeight: "bold",
  },
  image: {
    width: 140,
    height: 140,
  },
  text: {
    fontSize: 16,
    marginTop: 6,
  },
});