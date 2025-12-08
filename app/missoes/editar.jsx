import { useLocalSearchParams, useRouter } from "expo-router";
import { useEffect, useState } from "react";
import {
  Alert,
  ImageBackground,
  Platform,
  SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View
} from "react-native";
import api from '../../services/api';

const BACKGROUND_IMAGE = require("../../assets/android-icon-foreground.png");

const SelectionGroup = ({ options, selectedValue, onSelect, color }) => (
  <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 5 }}>
    {options.map((opt) => (
      <TouchableOpacity
        key={opt.value}
        onPress={() => onSelect(opt.value)}
        style={[
          styles.optionBtn,
          selectedValue === opt.value && { backgroundColor: color, borderColor: 'black' }
        ]}
      >
        <Text style={[styles.optionText, selectedValue === opt.value && { color: 'white' }]}>{opt.label}</Text>
      </TouchableOpacity>
    ))}
  </View>
);

export default function EditarMissao() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [mission, setMission] = useState(null);
  const [loading, setLoading] = useState(true);

  // Estados para edição
  const [descricao, setDescricao] = useState("");
  const [repeticao, setRepeticao] = useState(false);
  const [dificuldade, setDificuldade] = useState(1);
  const [efeito, setEfeito] = useState(1);
  const [dataInicio, setDataInicio] = useState("");
  const [dataFinal, setDataFinal] = useState("");

  const formatApiDateToDisplay = (apiDate) => {
    if (!apiDate) return "";
    const [y, m, d] = apiDate.split('-');
    return `${d}/${m}/${y}`;
  };

  const convertDisplayDateToApi = (displayDate) => {
    const [d, m, y] = displayDate.split('/');
    return `${y}-${m}-${d}`;
  };

  useEffect(() => {
    if (id) fetchMission();
  }, [id]);

  const fetchMission = async () => {
    try {
      const res = await api.get(`/api/missao/listarPorId/${id}`);
      const m = res.data;
      setMission(m);
      setDescricao(m.descricao);
      setRepeticao(m.repeticao === 1);
      setDificuldade(m.dificuldade);
      setEfeito(m.efeito);
      setDataInicio(formatApiDateToDisplay(m.dataInicio));
      setDataFinal(formatApiDateToDisplay(m.dataFinalizacao));
    } catch (e) {
      Alert.alert("Erro", "Não foi possível carregar a missão.");
      router.back();
    } finally {
      setLoading(false);
    }
  };

  const applyDateMask = (text, setDateState) => {
    let cleaned = text.replace(/[^0-9]/g, '');
    if (cleaned.length > 2) cleaned = cleaned.substring(0, 2) + '/' + cleaned.substring(2);
    if (cleaned.length > 5) cleaned = cleaned.substring(0, 5) + '/' + cleaned.substring(5, 9);
    if (cleaned.length > 10) cleaned = cleaned.substring(0, 10);
    setDateState(cleaned);
  };

  const isValidDate = (dateString) => {
    const regex = /^(\d{2})\/(\d{2})\/(\d{4})$/;
    if (!regex.test(dateString)) return false;
    const [d, m, y] = dateString.split('/').map(Number);
    if (m === 0 || m > 12) return false;
    if (d === 0 || d > 31) return false;
    const monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (y % 400 === 0 || (y % 100 !== 0 && y % 4 === 0)) monthLength[1] = 29;
    return d <= monthLength[m - 1];
  };

  const handleUpdate = async () => {
    if (!descricao) { Alert.alert("Erro", "Descrição é obrigatória."); return; }
    if (!isValidDate(dataInicio) || !isValidDate(dataFinal)) { Alert.alert("Erro", "Datas inválidas."); return; }

    try {
      const payload = {
        ...mission,
        descricao,
        repeticao: repeticao ? 1 : 0,
        dificuldade,
        efeito,
        dataInicio: convertDisplayDateToApi(dataInicio),
        dataFinalizacao: convertDisplayDateToApi(dataFinal),
        personagemId: mission.personagemId || (mission.personagem ? mission.personagem.id : null)
      };

      await api.put(`/api/missao/atualizar/${id}`, payload);
      Alert.alert("Sucesso", "Missão atualizada!");
      router.back();
    } catch (e) {
      console.error(e);
      Alert.alert("Erro", "Falha ao atualizar.");
    }
  };

  // --- Lógica de Deletar Compatível com Web e Mobile ---
  const performDelete = async () => {
    try {
      await api.delete(`/api/missao/deletar/${id}`);
      if (Platform.OS === 'web') {
        alert("Missão removida com sucesso.");
      } else {
        Alert.alert("Deletada", "Missão removida com sucesso.");
      }
      router.back();
    } catch (e) {
      console.error(e);
      Alert.alert("Erro", "Falha ao deletar.");
    }
  };

  const handleDelete = () => {
    if (Platform.OS === 'web') {
      // No navegador usamos window.confirm
      if (confirm("Tem certeza que deseja excluir esta missão?")) {
        performDelete();
      }
    } else {
      // No celular usamos o Alert nativo
      Alert.alert("Deletar Missão", "Tem certeza?", [
        { text: "Cancelar", style: "cancel" },
        { text: "Excluir", style: "destructive", onPress: performDelete }
      ]);
    }
  };
  // -----------------------------------------------------

  const getDifficultyColor = (diff) => {
    switch (diff) {
      case 1: return "#38B000";
      case 2: return "#FFC107";
      case 3: return "#E83A41";
      default: return "#E83A41";
    }
  };

  if (loading) return <View><Text>Carregando...</Text></View>;

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
            <TextInput style={styles.input} value={descricao} onChangeText={setDescricao} />

            <Text style={styles.label}>Repetição:</Text>
            <TouchableOpacity style={styles.checkbox} onPress={() => setRepeticao(!repeticao)}>
              <View style={[styles.checkboxInner, repeticao && { backgroundColor: "black" }]} />
            </TouchableOpacity>

            <Text style={styles.label}>Dificuldade:</Text>
            <SelectionGroup options={[{ label: 'Fácil', value: 1 }, { label: 'Média', value: 2 }, { label: 'Difícil', value: 3 }]} selectedValue={dificuldade} onSelect={setDificuldade} color={getDifficultyColor(dificuldade)} />

            <Text style={styles.label}>Efeito:</Text>
            <SelectionGroup options={[{ label: 'Positivo (+)', value: 1 }, { label: 'Negativo (-)', value: 2 }]} selectedValue={efeito} onSelect={setEfeito} color={efeito === 2 ? "#E83A41" : "#38B000"} />

            <Text style={styles.label}>Data Início:</Text>
            <TextInput style={styles.input} keyboardType="numeric" maxLength={10} value={dataInicio} onChangeText={(text) => applyDateMask(text, setDataInicio)} />

            <Text style={styles.label}>Data Finalização:</Text>
            <TextInput style={styles.input} keyboardType="numeric" maxLength={10} value={dataFinal} onChangeText={(text) => applyDateMask(text, setDataFinal)} />

            <View style={styles.botoes}>
              <TouchableOpacity style={[styles.botao, { backgroundColor: 'black' }]} onPress={handleDelete}>
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
  optionBtn: { flex: 1, borderWidth: 2, borderColor: '#ccc', borderRadius: 5, alignItems: 'center', padding: 5, marginHorizontal: 2, backgroundColor: 'white' },
  optionText: { fontWeight: 'bold', fontSize: 12 },
  botoes: { flexDirection: "row", justifyContent: "flex-end", marginTop: 25, gap: 15 },
  botao: { borderWidth: 3, borderColor: "black", borderRadius: 10, paddingHorizontal: 15, paddingVertical: 5 },
  salvar: { backgroundColor: "#38B000" },
  textoBotao: { color: "white", fontWeight: "bold", fontSize: 16 },
  voltar: { position: "absolute", left: 20, top: 25, backgroundColor: "#FFF", borderColor: "#000", borderWidth: 3, borderRadius: 10, width: 40, height: 40, alignItems: "center", justifyContent: "center", zIndex: 10 },
  voltarTexto: { fontSize: 22, fontWeight: "bold", color: "black" },
});