# Soccer App

Aplicativo mobile desenvolvido com **React Native** usando **Expo**, que permite explorar informações de países ao redor do mundo. O app consome a API pública do [REST Countries](https://restcountries.com/) e oferece funcionalidades de busca, favoritos e visualização detalhada de informações geográficas e políticas.

## 📱 Funcionalidades

- 🔍 Buscar países por nome.
- ⭐ Marcar e visualizar países favoritos.
- 📄 Exibir informações detalhadas de cada país:
  - Nome oficial e comum
  - Capital
  - Região e sub-região
  - População
  - Área
  - Moedas e idiomas
  - Bandeira em alta resolução

## 📦 Tecnologias e Dependências

- **React Native** `0.79.2`
- **Expo** `~53.0.9`
- **Axios** `^1.9.0`
- **React Navigation**
  - `@react-navigation/native`
  - `@react-navigation/stack`
  - `@react-navigation/bottom-tabs`
- **AsyncStorage** para persistência local
- **SVG rendering** via `react-native-svg`
- **Expo Status Bar**, `react-native-gesture-handler`, entre outros

## 🏁 Como Executar

### Pré-requisitos

- Node.js e npm instalados
- Expo CLI instalado globalmente:
  ```bash
  npm install -g expo-cli
  ```

### Instruções

1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/soccer-app.git
   cd soccer-app
   ```

2. Instale as dependências:
   ```bash
   npm install
   ```

3. Inicie o projeto:
   ```bash
   npm start
   ```

4. Escaneie o QR code com o app Expo Go no seu celular.

## 📂 Estrutura de Pastas

```
soccer-app/
├── App.js               # Componente principal e navegação
├── index.js             # Registro do App com Expo
├── app.json             # Configurações do projeto Expo
├── assets/              # Ícones e splash screen
├── node_modules/
├── package.json
└── ...
```

## 🔧 Scripts Disponíveis

- `npm start` - Inicia o Expo.
- `npm run android` - Inicia em um dispositivo/emulador Android.
- `npm run ios` - Inicia em um dispositivo/emulador iOS.
- `npm run web` - Executa em ambiente web.

## 🧪 API Utilizada

- **REST Countries API**  
  Documentação: https://restcountries.com/

## 📸 Capturas de Tela (opcional)

Adicione aqui imagens da interface do app para enriquecer a documentação.

## 📄 Licença

Este projeto está sob a licença [MIT](LICENSE).

---

Desenvolvido com 💙 usando React Native + Expo.