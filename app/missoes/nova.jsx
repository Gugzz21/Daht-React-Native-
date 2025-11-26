import DateTimePicker from '@react-native-community/datetimepicker';
import { useLocalSearchParams, useRouter } from "expo-router";
import { useState } from "react";
import {
  Alert,
  ImageBackground,
  Platform,
  SafeAreaView, ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View
} from "react-native";
import api from '../../services/api';

const BACKGROUND_IMAGE = require("../../assets/fundo-site.png");

// Botões de Seleção (Fácil/Médio/Difícil ou Pos/Neg)
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
  const [dificuldade, setDificuldade] = useState(1); // 1=Fácil, 2=Médio, 3=Difícil
  const [efeito, setEfeito] = useState(1); // 1=Positivo, 2=Negativo

  // Datas
  const [dataInicio, setDataInicio] = useState(new Date());
  const [dataFinal, setDataFinal] = useState(new Date());
  const [showPicker, setShowPicker] = useState({ show: false, mode: 'start' });

  const onDateChange = (event, selectedDate) => {
    const currentDate = selectedDate || (showPicker.mode === 'start' ? dataInicio : dataFinal);
    setShowPicker({ ...showPicker, show: Platform.OS === 'ios' });
    if (showPicker.mode === 'start') setDataInicio(currentDate);
    else setDataFinal(currentDate);
  };

  const showDatepicker = (mode) => {
    setShowPicker({ show: true, mode });
  };

  const formatDate = (date) => {
      return date.toISOString().split('T')[0]; 
  };

  const handleSalvar = async () => {
    if (!descricao) { Alert.alert("Erro", "Digite a descrição."); return; }

    try {
        const payload = {
            descricao,
            repeticao: repeticao ? 1 : 0,
            dificuldade,
            efeito,
            dataInicio: formatDate(dataInicio),
            dataFinalizacao: formatDate(dataFinal),
            status: 1, // Ativa
            personagem: { id: charId }
        };

        await api.post('/missao/criar', payload);
        Alert.alert("Sucesso", "Missão criada!");
        router.back();

    } catch (error) {
        console.error(error);
        Alert.alert("Erro", "Falha ao criar missão.");
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
              <View style={[styles.checkboxInner, repeticao && { backgroundColor: "black" }]}/>
            </TouchableOpacity>

            <Text style={styles.label}>Dificuldade:</Text>
            <SelectionGroup 
                options={[{label:'Fácil', value:1}, {label:'Média', value:2}, {label:'Difícil', value:3}]}
                selectedValue={dificuldade}
                onSelect={setDificuldade}
                color="#E83A41"
            />

            <Text style={styles.label}>Efeito:</Text>
            <SelectionGroup 
                options={[{label:'Positivo (+)', value:1}, {label:'Negativo (-)', value:2}]}
                selectedValue={efeito}
                onSelect={setEfeito}
                color="#38B000"
            />

            <Text style={styles.label}>Data Início:</Text>
            <TouchableOpacity onPress={() => showDatepicker('start')} style={styles.dateBtn}>
                <Text>{formatDate(dataInicio)}</Text>
            </TouchableOpacity>

            <Text style={styles.label}>Data Finalização:</Text>
            <TouchableOpacity onPress={() => showDatepicker('final')} style={styles.dateBtn}>
                <Text>{formatDate(dataFinal)}</Text>
            </TouchableOpacity>

            {showPicker.show && (
                <DateTimePicker
                    value={showPicker.mode === 'start' ? dataInicio : dataFinal}
                    mode="date"
                    display="default"
                    onChange={onDateChange}
                />
            )}

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
  dateBtn: { borderWidth: 2, borderColor: "black", borderRadius: 8, padding: 8, backgroundColor: "white", marginTop: 4, alignItems:'center' },
  botoes: { flexDirection: "row", justifyContent: "flex-end", marginTop: 25, gap: 15 },
  botao: { borderWidth: 3, borderColor: "black", borderRadius: 10, paddingHorizontal: 15, paddingVertical: 5 },
  salvar: { backgroundColor: "#38B000" },
  cancelar: { backgroundColor: "#E83A41" },
  textoBotao: { color: "white", fontWeight: "bold", fontSize: 16 },
  voltar: { position: "absolute", left: 20, top: 25, backgroundColor: "#FFF", borderColor: "#000", borderWidth: 3, borderRadius: 10, width: 40, height: 40, alignItems: "center", justifyContent: "center", zIndex: 10 },
  voltarTexto: { fontSize: 22, fontWeight: "bold", color: "black" },
});