# 🎮 Daht - Agenda Gamificada

![License](https://img.shields.io/badge/license-MIT-green)
![React Native](https://img.shields.io/badge/React_Native-v0.81-blue)
![Expo](https://img.shields.io/badge/Expo-v54-black)
![Status](https://img.shields.io/badge/Status-Em_Desenvolvimento-yellow)

> **Transforme sua produtividade em uma aventura épica!** 🛡️⚔️

O **Daht** é um aplicativo mobile de agenda gamificada que motiva você a completar suas tarefas diárias transformando-as em "Missões". Ganhe Ouro e XP, suba de nível e evolua seu personagem enquanto organiza sua vida.

---

## 📸 Screenshots

| Login | Dashboard | Missões | Loja |
|:---:|:---:|:---:|:---:|
| <img src="https://via.placeholder.com/200x400?text=Login" alt="Login" width="200"/> | <img src="https://via.placeholder.com/200x400?text=Dashboard" alt="Dashboard" width="200"/> | <img src="https://via.placeholder.com/200x400?text=Missoes" alt="Missões" width="200"/> | <img src="https://via.placeholder.com/200x400?text=Loja" alt="Loja" width="200"/> |

> *Adicione screenshots reais do aplicativo aqui para mostrar a interface.*

---

## ✨ Funcionalidades

*   **🔒 Autenticação Segura**: Login e Registro de usuários integrados.
*   **👤 Sistema de RPG**:
    *   **XP & Nível**: Evolua seu personagem completando tarefas.
    *   **Vida (HP)**: Cuidado para não falhar nas missões!
    *   **Ouro**: Moeda virtual para gastar na loja.
*   **📝 Gestão de Missões (CRUD)**:
    *   Crie, edite e exclua tarefas.
    *   Classifique como Diária, Semanal ou Única.
*   **🏆 Loja de Recompensas**: Gaste seu ouro suado em prêmios virtuais personalizados.
*   **⚙️ Personalização**: Configure seu perfil e avatar.

---

## 🛠️ Tecnologias

Este projeto utiliza as tecnologias mais modernas do ecossistema React Native:

*   ![React Native](https://img.shields.io/badge/React_Native-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)
*   ![Expo](https://img.shields.io/badge/Expo-000020?style=for-the-badge&logo=expo&logoColor=white)
*   ![TypeScript](https://img.shields.io/badge/TypeScript-007ACC?style=for-the-badge&logo=typescript&logoColor=white)
*   ![Axios](https://img.shields.io/badge/Axios-5A29E4?style=for-the-badge&logo=axios&logoColor=white)
*   ![Spring Boot](https://img.shields.io/badge/Backend-Spring_Boot-6DB33F?style=for-the-badge&logo=springboot&logoColor=white)

---

## 🚀 Começando

Siga estes passos para rodar o projeto localmente.

### Pré-requisitos

*   [Node.js](https://nodejs.org/) (LTS)
*   [Expo Go](https://expo.dev/client) no seu celular (Android/iOS)
*   Backend **Daht Spring Boot** rodando localmente.

### Instalação

1.  **Clone o repositório**
    ```bash
    git clone https://github.com/seu-usuario/Daht-React-Native-.git
    cd Daht-React-Native-
    ```

2.  **Instale as dependências**
    ```bash
    npm install
    ```

3.  **Configure a API**
    ⚠️ **Importante**: Para que o app no celular se comunique com o backend no seu PC, você precisa configurar o IP.

    *   Abra `app/services/api.js`
    *   Altere `API_URL` para o IP da sua máquina local:
        ```javascript
        // Exemplo
        const API_URL = 'http://192.168.1.15:8080/api';
        ```

4.  **Execute o projeto**
    ```bash
    npx expo start
    ```
    *   Escaneie o QR Code com o app **Expo Go**.

---

## 📂 Estrutura do Projeto

```
Daht-React-Native/
├── app/              # Telas e rotas (Expo Router)
├── components/       # Componentes reutilizáveis
├── services/         # Comunicação com API (Axios)
├── assets/           # Imagens e fontes
└── constants/        # Cores e configurações globais
```

---

## 🤝 Contribuição

Contribuições são bem-vindas! Sinta-se à vontade para abrir issues ou enviar pull requests.

1.  Faça um Fork do projeto
2.  Crie uma Branch para sua Feature (`git checkout -b feature/NovaFeature`)
3.  Faça o Commit (`git commit -m 'Adicionando nova feature'`)
4.  Faça o Push (`git push origin feature/NovaFeature`)
5.  Abra um Pull Request

---

## 🧑‍💻 Autor

Feito com ❤️ por **Gustavo Diniz**.
