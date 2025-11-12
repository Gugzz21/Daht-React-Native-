import { Link, useLocalSearchParams } from "expo-router";
import { Image, StyleSheet, Text, TouchableOpacity, View } from "react-native";

const BACK_ICON = require("../assets/back-icon.png");

export default function MissaoScreen() {
  const { id, description } = useLocalSearchParams(); // pega os dados da missão

  return (
    <View style={styles.container}>
      {/* Botão de voltar */}
      <Link href="/home" asChild>
        <TouchableOpacity style={styles.backButton}>
          <Image source={BACK_ICON} style={styles.backIcon} resizeMode="contain" />
        </TouchableOpacity>
      </Link>

      <Text style={styles.title}>MISSÃO DETALHADA</Text>

      <View style={styles.box}>
        <Text style={styles.label}>ID da Missão:</Text>
        <Text style={styles.value}>{id}</Text>

        <Text style={styles.label}>Descrição:</Text>
        <Text style={styles.value}>{description}</Text>

        <Text style={styles.label}>Data de Finalização:</Text>
        <Text style={styles.value}>00/00/0000</Text>

        <Text style={styles.label}>Status:</Text>
        <Text style={styles.value}>Em andamento...</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#6DAAE8",
    alignItems: "center",
    paddingTop: 80,
  },
  backButton: {
    position: "absolute",
    top: 40,
    left: 20,
    backgroundColor: "white",
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 25,
    padding: 5,
  },
  backIcon: {
    width: 30,
    height: 30,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    color: "black",
    backgroundColor: "white",
    borderWidth: 3,
    borderColor: "black",
    paddingHorizontal: 20,
    paddingVertical: 5,
  },
  box: {
    marginTop: 30,
    backgroundColor: "#E3EEF9",
    borderWidth: 3,
    borderColor: "black",
    borderRadius: 10,
    padding: 20,
    width: "85%",
  },
  label: {
    fontWeight: "bold",
    color: "black",
    marginTop: 10,
  },
  value: {
    color: "black",
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "black",
    padding: 5,
    borderRadius: 5,
    marginTop: 3,
  },
});
