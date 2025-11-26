import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  ImageBackground, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View
} from "react-native";
import api from '../../services/api';

const BACKGROUND_IMAGE = require("../../assets/fundo-site.png");

export default function EditarMissao() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [mission, setMission] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if(id) fetchMission();
  }, [id]);

  const fetchMission = async () => {
      try {
          const res = await api.get(`/missao/listarPorId/${id}`);
          setMission(res.data);
      } catch (e) {
          Alert.alert("Erro", "Não foi possível carregar a missão.");
          router.back();
      } finally {
          setLoading(false);
      }
  };

  const handleUpdate = async () => {
      try {
          await api.put(`/missao/atualizar/${id}`, mission);
          Alert.alert("Sucesso", "Missão atualizada!");
          router.back();
      } catch (e) {
          Alert.alert("Erro", "Falha ao atualizar.");
      }
  };

  const handleDelete = async () => {
      Alert.alert("Confirmar", "Deseja deletar esta missão?", [
          { text: "Não", style: "cancel" },
          { text: "Sim", onPress: async () => {
              try {
                  await api.delete(`/missao/deletar/${id}`);
                  router.back();
              } catch (e) {
                  Alert.alert("Erro", "Falha ao deletar.");
              }
          }}
      ]);
  };

  if(loading || !mission) return <View><Text>Carregando...</Text></View>;

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground source={BACKGROUND_IMAGE} style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <TouchableOpacity style={styles.voltar} onPress={() => router.back()}>
            <Text style={styles.voltarTexto}>←</Text>
          </TouchableOpacity>

          <Text style={styles.titulo}>Editar Missão</Text>

          <View style={styles.card}>
            <Text style={styles.label}>Descrição:</Text>
            <TextInput
              style={styles.input}
              value={mission.descricao}
              onChangeText={(t) => setMission({...mission, descricao: t})}
            />

            <Text style={styles.label}>Repetição (0/1):</Text>
            <TouchableOpacity style={styles.checkbox} onPress={() => setMission({...mission, repeticao: mission.repeticao === 1 ? 0 : 1})}>
              <View style={[styles.checkboxInner, mission.repeticao === 1 && { backgroundColor: "black" }]}/>
            </TouchableOpacity>

            <View style={styles.botoes}>
               {/* Botão Deletar */}
               <TouchableOpacity style={[styles.botao, {backgroundColor: 'black'}]} onPress={handleDelete}>
                <Text style={styles.textoBotao}>🗑️ Deletar</Text>
              </TouchableOpacity>

              <TouchableOpacity style={[styles.botao, styles.salvar]} onPress={handleUpdate}>
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
  titulo: { fontSize: 28, fontWeight: "bold", backgroundColor: "#FFB6C1", borderWidth: 3, borderColor: "black", paddingHorizontal: 20, paddingVertical: 5, marginBottom: 20 },
  card: { backgroundColor: "#FFF1F1", borderColor: "black", borderWidth: 3, borderRadius: 10, width: "85%", padding: 15 },
  label: { fontWeight: "bold", color: "black", marginTop: 10 },
  input: { borderWidth: 2, borderColor: "black", borderRadius: 8, paddingHorizontal: 10, height: 35, backgroundColor: "white", marginTop: 4 },
  checkbox: { width: 25, height: 25, borderColor: "black", borderWidth: 2, justifyContent: "center", alignItems: "center", marginTop: 5 },
  checkboxInner: { width: 15, height: 15 },
  botoes: { flexDirection: "row", justifyContent: "flex-end", marginTop: 25, gap: 15 },
  botao: { borderWidth: 3, borderColor: "black", borderRadius: 10, paddingHorizontal: 15, paddingVertical: 5 },
  salvar: { backgroundColor: "#38B000" },
  textoBotao: { color: "white", fontWeight: "bold", fontSize: 16 },
  voltar: { position: "absolute", left: 20, top: 25, backgroundColor: "#FFF", borderColor: "#000", borderWidth: 3, borderRadius: 10, width: 40, height: 40, alignItems: "center", justifyContent: "center", zIndex: 10 },
  voltarTexto: { fontSize: 22, fontWeight: "bold", color: "black" },
});