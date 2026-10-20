# Clanm Mouse Slits V2 — Linux Configurator

[![Release](https://img.shields.io/github/v/release/kaguya-dev/mouse-slits-v2-linux?color=00ADB5&logo=github)](https://github.com/kaguya-dev/mouse-slits-v2-linux/releases)
[![Platform](https://img.shields.io/badge/platform-Linux%20x86__64-orange?logo=linux)](https://github.com/kaguya-dev/mouse-slits-v2-linux/releases)
[![License](https://img.shields.io/badge/license-MIT-blue)](LICENSE)

Configurador oficial e nativo para Linux do mouse gamer **Clanm Mouse Slits V2** (controlador Wuxi Instant Microelectronics **A825**, USB ID `30fa:1040`).

Permite configurar todos os botões, DPI, Polling Rate, macros e os 14 modos de iluminação RGB diretamente no Linux, sem necessidade de Wine.

---

## ⚡ Instalação Rápida

### 1. Configurar permissão USB (`udev`)

Para que o aplicativo possa se comunicar com o mouse sem precisar rodar como `sudo`, adicione a regra udev.

#### Opção A (One-liner com `curl` — Recomendado):
```bash
sudo curl -sSL https://raw.githubusercontent.com/kaguya-dev/mouse-slits-v2-linux/main/70-mouse-slits-v2.rules -o /etc/udev/rules.d/70-mouse-slits-v2.rules && sudo udevadm control --reload-rules && sudo udevadm trigger
```

#### Opção B (One-liner com `echo` — 100% autônomo):
```bash
sudo sh -c 'echo "KERNEL==\"hidraw*\", ATTRS{idVendor}==\"30fa\", ATTRS{idProduct}==\"1040\", MODE=\"0660\", TAG+=\"uaccess\"" > /etc/udev/rules.d/70-mouse-slits-v2.rules' && sudo udevadm control --reload-rules && sudo udevadm trigger
```

---

### 2. Baixar e Executar o AppImage

1. Baixe o executável `Mouse-Slits-V2-1.0.0-linux-x86_64.AppImage` da aba [Releases](https://github.com/kaguya-dev/mouse-slits-v2-linux/releases).
2. Dê permissão de execução e inicie:
```bash
chmod +x Mouse-Slits-V2-1.0.0-linux-x86_64.AppImage
./Mouse-Slits-V2-1.0.0-linux-x86_64.AppImage
```

---

## 🎮 Funcionalidades

- **Mapeamento de Teclas (Botões 1 a 6)**:
  - Clique Esquerdo, Direito, Meio/Scroll, Avançar, Voltar, Troca de DPI.
  - Funções de Fogo (Fire Key), Clique Duplo, Atalhos, Macros e Desligar.
- **DPI e Parâmetros Avançados**:
  - 6 Estágios de DPI customizáveis de 200 a 12800 DPI.
  - Seletor de cores RGB individual por estágio de DPI.
  - Ativar/desativar estágios individuais.
  - Taxa de Relatório USB (Polling Rate): 125 Hz, 250 Hz, 500 Hz, 1000 Hz.
  - Ajuste de sensibilidade, rolagem e velocidade de clique duplo.
- **Iluminação RGB (14 Modos com Pré-visualização Animada)**:
  - 0: DPI Breathing
  - 1: Cycle Breathing
  - 2: Constant
  - 3: Flowing Water
  - 4: Mono Water
  - 5: CometTail
  - 6: Neon
  - 7: Ambilight
  - 8: Flashing
  - 9: Star Trek
  - 10: Ripple
  - 11: Enraptured
  - 12: Response
  - 13: LED Off
  - Ajuste de brilho (0 a 7), velocidade (1 a 7) e direção do fluxo.
- **Perfis On-Board**:
  - Alternância entre Perfis (Office, Game I, Game II) salvos diretamente na EEPROM do mouse.
- **Gravação de Macros**:
  - Suporte a sequências de cliques e offsets XY.

---

## 🛠️ Compilação a partir do código-fonte

```bash
cd app
npm install
npm run dist
```
Os binários compilados estarão na pasta `dist/`.

---

## 📄 Licença
Distribuído sob a licença MIT.
