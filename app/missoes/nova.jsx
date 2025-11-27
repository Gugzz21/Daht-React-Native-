import { useRouter, useLocalSearchParams } from "expo-router";
import { useState } from "react";
import {
  ImageBackground, SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Alert
} from "react-native";
import api from '../../services/api';

const BACKGROUND_IMAGE = require("../../assets/fundo-site.png");

// Componente de Grupo de Botões
const SelectionGroup = ({ options, selectedValue, onSelect, color }) => (
    <View style={{flexDirection: 'row', justifyContent:'space-between', marginVertical: 5}}>
        {options.map((opt) => (
            <TouchableOpacity 
                key={opt.value} 
                onPress={() => onSelect(opt.value)}
                style={[
                    styles.optionBtn, 
                    selectedValue === opt.value && { backgroundColor: color, borderColor: 'black' }
                ]}
            >
                <Text style={[styles.optionText, selectedValue === opt.value && {color:'white'}]}>{opt.label}</Text>
            </TouchableOpacity>
        ))}
    </View>
);

export default function NovaMissao() {
  const router = useRouter();
  const { charId } = useLocalSearchParams(); 

  const [descricao, setDescricao] = useState("");
  const [repeticao, setRepeticao] = useState(false);
  const [dificuldade, setDificuldade] = useState(1);
  const [efeito, setEfeito] = useState(1);
  
  const [dataInicio, setDataInicio] = useState("");
  const [dataFinal, setDataFinal] = useState("");

  // --- Lógica de Data (Máscara) ---
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
    
    // Validações básicas
    if (m === 0 || m > 12) return false;
    if (d === 0 || d > 31) return false;
    if (y < 2000 || y > 2100) return false; 

    // Valida dias do mês
    const monthLength = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
    if (y % 400 === 0 || (y % 100 !== 0 && y % 4 === 0)) monthLength[1] = 29; 
    
    return d <= monthLength[m - 1];
  };

  const convertDateToApi = (dateString) => {
    const [day, month, year] = dateString.split('/');
    return `${year}-${month}-${day}`;
  };
  // --------------------------------

  const handleSalvar = async () => {
    if (!descricao) { Alert.alert("Erro", "Digite a descrição."); return; }
    
    // 1. Valida formato das datas
    if (!isValidDate(dataInicio)) { Alert.alert("Erro", "Data de Início inválida."); return; }
    if (!isValidDate(dataFinal)) { Alert.alert("Erro", "Data Final inválida."); return; }

    // 2. Valida Lógica: Final >= Início
    const dtInicio = new Date(convertDateToApi(dataInicio));
    const dtFinal = new Date(convertDateToApi(dataFinal));
    
    // Zera o horário para comparar apenas o dia
    dtInicio.setHours(0,0,0,0);
    dtFinal.setHours(0,0,0,0);

    if (dtFinal < dtInicio) {
        Alert.alert("Data Inválida", "A data de finalização deve ser igual ou posterior à data de início.");
        return;
    }

    try {
        console.log("Enviando missão para Personagem ID:", charId);

        const payload = {
            descricao,
            repeticao: repeticao ? 1 : 0,
            dificuldade,
            efeito,
            dataInicio: convertDateToApi(dataInicio),
            dataFinalizacao: convertDateToApi(dataFinal),
            status: 1, 
            // CORREÇÃO: Enviando o ID plano, conforme o Java espera (evita o NullPointerException)
            personagemId: parseInt(charId) 
        };

        await api.post('/missao/criar', payload);
        Alert.alert("Sucesso", "Missão criada!");
        router.back();

    } catch (error) {
        console.error("Erro Criar Missão:", error);
        Alert.alert("Erro", "Falha ao criar missão. Verifique se o backend está rodando.");
    }
  };

  // Cores: Verde (Fácil), Amarelo (Médio), Vermelho (Difícil)
  const getDifficultyColor = (diff) => {
    switch(diff) {
        case 1: return "#38B000"; // Verde
        case 2: return "#FFC107"; // Amarelo
        case 3: return "#E83A41"; // Vermelho
        default: return "#E83A41";
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <ImageBackground source={BACKGROUND_IMAGE} style={styles.container}>
        <ScrollView contentContainerStyle={styles.scroll}>
          <TouchableOpacity style={styles.voltar} onPress={() => router.back()}>
            <Text style={styles.voltarTexto}>←</Text>
          </TouchableOpacity>

          <Text style={styles.titulo}>Nova Missão</Text>

          <View style={styles.card}>
            <Text style={styles.label}>Descrição:</Text>
            <TextInput style={styles.input} placeholder="Descrição..." value={descricao} onChangeText={setDescricao} />

            <Text style={styles.label}>Repetição:</Text>
            <TouchableOpacity style={styles.checkbox} onPress={() => setRepeticao(!repeticao)}>
              <View style={[styles.checkboxInner, repeticao && { backgroundColor: "black" }]}/>
            </TouchableOpacity>

            <Text style={styles.label}>Dificuldade:</Text>
            <SelectionGroup 
                options={[{label:'Fácil', value:1}, {label:'Média', value:2}, {label:'Difícil', value:3}]}
                selectedValue={dificuldade}
                onSelect={setDificuldade}
                color={getDifficultyColor(dificuldade)}
            />

            <Text style={styles.label}>Efeito:</Text>
            <SelectionGroup 
                options={[{label:'Positivo (+)', value:1}, {label:'Negativo (-)', value:2}]}
                selectedValue={efeito}
                onSelect={setEfeito}
                color={efeito === 2 ? "#E83A41" : "#38B000"}
            />

            <Text style={styles.label}>Data Início:</Text>
            <TextInput 
                style={styles.input} 
                placeholder="DD/MM/AAAA"
                keyboardType="numeric"
                maxLength={10}
                value={dataInicio}
                onChangeText={(text) => applyDateMask(text, setDataInicio)}
            />

            <Text style={styles.label}>Data Finalização:</Text>
            <TextInput 
                style={styles.input} 
                placeholder="DD/MM/AAAA"
                keyboardType="numeric"
                maxLength={10}
                value={dataFinal}
                onChangeText={(text) => applyDateMask(text, setDataFinal)}
            />

            <View style={styles.botoes}>
              <TouchableOpacity style={[styles.botao, styles.cancelar]} onPress={() => router.back()}>
                <Text style={styles.textoBotao}>✖</Text>
              </TouchableOpacity>
              <TouchableOpacity style={[styles.botao, styles.salvar]} onPress={handleSalvar}>
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
  titulo: { fontSize: 28, fontWeight: "bold", backgroundColor: "#FFE082", borderWidth: 3, borderColor: "black", paddingHorizontal: 20, paddingVertical: 5, marginBottom: 20 },
  card: { backgroundColor: "#FFF7E1", borderColor: "black", borderWidth: 3, borderRadius: 10, width: "85%", padding: 15 },
  label: { fontWeight: "bold", color: "black", marginTop: 10 },
  input: { borderWidth: 2, borderColor: "black", borderRadius: 8, paddingHorizontal: 10, height: 35, backgroundColor: "white", marginTop: 4 },
  checkbox: { width: 25, height: 25, borderColor: "black", borderWidth: 2, justifyContent: "center", alignItems: "center", marginTop: 5 },
  checkboxInner: { width: 15, height: 15 },
  optionBtn: { flex:1, borderWidth:2, borderColor:'#ccc', borderRadius:5, alignItems:'center', padding:5, marginHorizontal:2, backgroundColor:'white'},
  optionText: { fontWeight:'bold', fontSize:12 },
  botoes: { flexDirection: "row", justifyContent: "flex-end", marginTop: 25, gap: 15 },
  botao: { borderWidth: 3, borderColor: "black", borderRadius: 10, paddingHorizontal: 15, paddingVertical: 5 },
  salvar: { backgroundColor: "#38B000" },
  cancelar: { backgroundColor: "#E83A41" },
  textoBotao: { color: "white", fontWeight: "bold", fontSize: 16 },
  voltar: { position: "absolute", left: 20, top: 25, backgroundColor: "#FFF", borderColor: "#000", borderWidth: 3, borderRadius: 10, width: 40, height: 40, alignItems: "center", justifyContent: "center", zIndex: 10 },
  voltarTexto: { fontSize: 22, fontWeight: "bold", color: "black" },
});