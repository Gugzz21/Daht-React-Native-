# 🎮 Daht - Agenda Gamificada (React Native)

Este é o repositório do aplicativo mobile (frontend) para o projeto **Daht**, uma agenda de tarefas gamificada. O objetivo do aplicativo é motivar o usuário a completar suas tarefas diárias ("Missões") oferecendo recompensas virtuais, como Ouro e XP, para um personagem.

Este projeto foi desenvolvido em **React Native** utilizando **Expo** e se conecta a um backend **Spring Boot** (que gerencia as regras de negócio e o banco de dados).

---

## ✨ Funcionalidades Principais

* **🔒 Autenticação:** Telas de Login e Registro de usuário.
* **👤 Personagem:** O usuário possui um personagem com Nível, XP (Experiência), Vida e Ouro.
* **🎯 Gerenciamento de Missões (CRUD):**
    * Criar novas missões (tarefas).
    * Listar missões diárias, semanais ou únicas.
    * Editar missões existentes.
    * Marcar missões como completas (recebendo Ouro e XP).
    * Deletar missões.
* **🏆 Loja de Prêmios:** Uma tela onde o usuário pode gastar o Ouro ganho para "comprar" prêmios virtuais pré-cadastrados.
* **⚙️ Configurações:** Telas para o usuário gerenciar seu perfil e as configurações do personagem (como alterar nickname ou avatar).

---

## 🛠️ Tecnologias Utilizadas

* **React Native**
* **Expo** (com Expo Router para navegação baseada em arquivos)
* **Axios** (para comunicação com a API REST)
* **JavaScript (ES6+)**
* **CSS-in-JS** (StyleSheet)

---

## 🚀 Como Executar o Projeto

### ⚠️ Pré-requisitos

1.  **Node.js** (versão LTS recomendada).
2.  **npm** ou **yarn**.
3.  O aplicativo **Expo Go** instalado no seu celular (Android ou iOS).
4.  O **Backend (Spring Boot) do Daht** deve estar em execução na sua rede local.

### 🏃 Passos para Execução

1.  **Clone o repositório:**
    ```bash
    git clone [https://github.com/seu-usuario/Daht-React-Native-.git](https://github.com/seu-usuario/Daht-React-Native-.git)
    cd Daht-React-Native-
    ```

2.  **Instale as dependências:**
    ```bash
    npm install
    ```

3.  **Configure a Conexão com a API:**
    * Abra o arquivo `app/services/api.js`.
    * Encontre a variável `API_URL`.
    * **Altere o IP** para o endereço de IP da máquina onde o seu backend Spring Boot está rodando. (Ex: `http://192.168.1.10:8080/api`).

4.  **Inicie o servidor de desenvolvimento Expo:**
    ```bash
    npx expo start
    ```

5.  **Acesse o aplicativo:**
    * Abra o aplicativo **Expo Go** no seu celular.
    * Escaneie o QR Code que apareceu no terminal (ou na página web que abriu).
    * O aplicativo será carregado no seu dispositivo.

---

## 🧑‍💻 Autor

* **Gustavo Diniz**

---

## 📚 Recursos Adicionais do Expo

* [Documentação do Expo](https://docs.expo.dev/): Aprenda os fundamentos e tópicos avançados.
* [Documentação do Expo Router](https://docs.expo.dev/router/introduction/): Entenda a navegação baseada em arquivos.
* [Comunidade no Discord](https://chat.expo.dev): Converse com outros usuários do Expo e tire dúvidas.
