import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
    ImageBackground,
    SafeAreaView,
    ScrollView,
    StyleSheet,
    Text,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";

const BACKGROUND_IMAGE = require("../../assets/fundo-site.png");

export default function EditarMissao() {
  const router = useRouter();
  const { id } = useLocalSearchParams();

  // Simulando busca de missão (você pode substituir por async fetch)
  const [missao, setMissao] = useState({
    descricao: "Descrição...",
    repeticao: true,
    dificuldade: "Fácil, Média, Difícil",
    efeito: "+ ou -",
    dataInicio: "DD/MM/AAAA",
    dataFinal: "DD/MM/AAAA",
  });

  const handleSalvar = () => {
    console.log("Missão atualizada:", missao);
    router.back();
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground source={BACKGROUND_IMAGE} style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll}>
          {/* Botão de voltar */}
          <TouchableOpacity style={styles.voltar} onPress={() => router.back()}>
            <Text style={styles.voltarTexto}>←</Text>
          </TouchableOpacity>

          <Text style={styles.titulo}>Editar Missão</Text>

          <View style={styles.card}>
            <Text style={styles.label}>Descrição:</Text>
            <TextInput
              style={styles.input}
              value={missao.descricao}
              onChangeText={(v) => setMissao({ ...missao, descricao: v })}
            />

            <Text style={styles.label}>Repetição:</Text>
            <TouchableOpacity
              style={styles.checkbox}
              onPress={() =>
                setMissao({ ...missao, repeticao: !missao.repeticao })
              }
            >
              <View
                style={[
                  styles.checkboxInner,
                  missao.repeticao && { backgroundColor: "black" },
                ]}
              />
            </TouchableOpacity>

            <Text style={styles.label}>Dificuldade:</Text>
            <TextInput
              style={styles.input}
              value={missao.dificuldade}
              onChangeText={(v) => setMissao({ ...missao, dificuldade: v })}
            />

            <Text style={styles.label}>Efeito:</Text>
            <TextInput
              style={styles.input}
              value={missao.efeito}
              onChangeText={(v) => setMissao({ ...missao, efeito: v })}
            />

            <Text style={styles.label}>Data Início:</Text>
            <TextInput
              style={styles.input}
              value={missao.dataInicio}
              onChangeText={(v) => setMissao({ ...missao, dataInicio: v })}
            />

            <Text style={styles.label}>Data Finalização:</Text>
            <TextInput
              style={styles.input}
              value={missao.dataFinal}
              onChangeText={(v) => setMissao({ ...missao, dataFinal: v })}
            />

            <View style={styles.botoes}>
              <TouchableOpacity
                style={[styles.botao, styles.cancelar]}
                onPress={() => router.back()}
              >
                <Text style={styles.textoBotao}>✖</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.botao, styles.salvar]}
                onPress={handleSalvar}
              >
                <Text style={styles.textoBotao}>Salvar</Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
  scroll: { alignItems: "center", paddingVertical: 30 },
  titulo: {
    fontSize: 28,
    fontWeight: "bold",
    backgroundColor: "#FFB6C1",
    borderWidth: 3,
    borderColor: "black",
    paddingHorizontal: 20,
    paddingVertical: 5,
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#FFF1F1",
    borderColor: "black",
    borderWidth: 3,
    borderRadius: 10,
    width: "85%",
    padding: 15,
  },
  label: { fontWeight: "bold", color: "black", marginTop: 10 },
  input: {
    borderWidth: 2,
    borderColor: "black",
    borderRadius: 8,
    paddingHorizontal: 10,
    height: 35,
    backgroundColor: "white",
    marginTop: 4,
  },
  checkbox: {
    width: 25,
    height: 25,
    borderColor: "black",
    borderWidth: 2,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 5,
  },
  checkboxInner: { width: 15, height: 15 },
  botoes: {
    flexDirection: "row",
    justifyContent: "flex-end",
    marginTop: 25,
    gap: 15,
  },
  botao: {
    borderWidth: 3,
    borderColor: "black",
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 5,
  },
  salvar: { backgroundColor: "#38B000" },
  cancelar: { backgroundColor: "#E83A41" },
  textoBotao: { color: "white", fontWeight: "bold", fontSize: 16 },
  voltar: {
    position: "absolute",
    left: 20,
    top: 25,
    backgroundColor: "#FFF",
    borderColor: "#000",
    borderWidth: 3,
    borderRadius: 10,
    width: 40,
    height: 40,
    alignItems: "center",
    justifyContent: "center",
    zIndex: 10,
  },
  voltarTexto: { fontSize: 22, fontWeight: "bold", color: "black" },
});
