import { useRouter } from "expo-router";
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

export default function NovaMissao() {
  const router = useRouter();
  const [descricao, setDescricao] = useState("");
  const [repeticao, setRepeticao] = useState(false);
  const [dificuldade, setDificuldade] = useState("");
  const [efeito, setEfeito] = useState("");
  const [dataInicio, setDataInicio] = useState("");
  const [dataFinal, setDataFinal] = useState("");

  const handleSalvar = () => {
    console.log({
      descricao,
      repeticao,
      dificuldade,
      efeito,
      dataInicio,
      dataFinal,
    });
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

          <Text style={styles.titulo}>Nova Missão</Text>

          {/* Campos */}
          <View style={styles.card}>
            <Text style={styles.label}>Descrição:</Text>
            <TextInput
              style={styles.input}
              placeholder="Digite a descrição..."
              value={descricao}
              onChangeText={setDescricao}
            />

            <Text style={styles.label}>Repetição:</Text>
            <TouchableOpacity
              style={styles.checkbox}
              onPress={() => setRepeticao(!repeticao)}
            >
              <View
                style={[
                  styles.checkboxInner,
                  repeticao && { backgroundColor: "black" },
                ]}
              />
            </TouchableOpacity>

            <Text style={styles.label}>Dificuldade:</Text>
            <TextInput
              style={styles.input}
              placeholder="Fácil, Média, Difícil..."
              value={dificuldade}
              onChangeText={setDificuldade}
            />

            <Text style={styles.label}>Efeito:</Text>
            <TextInput
              style={styles.input}
              placeholder="Ex: +100 XP"
              value={efeito}
              onChangeText={setEfeito}
            />

            <Text style={styles.label}>Data Início:</Text>
            <TextInput
              style={styles.input}
              placeholder="DD/MM/AAAA"
              value={dataInicio}
              onChangeText={setDataInicio}
            />

            <Text style={styles.label}>Data Finalização:</Text>
            <TextInput
              style={styles.input}
              placeholder="DD/MM/AAAA"
              value={dataFinal}
              onChangeText={setDataFinal}
            />

            {/* Botões */}
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
    backgroundColor: "#FFE082",
    borderWidth: 3,
    borderColor: "black",
    paddingHorizontal: 20,
    paddingVertical: 5,
    marginBottom: 20,
  },
  card: {
    backgroundColor: "#FFF7E1",
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
  checkboxInner: {
    width: 15,
    height: 15,
  },
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
