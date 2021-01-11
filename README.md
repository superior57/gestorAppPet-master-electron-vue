# Gestor v.0.2

## Install
Install [Node](https://nodejs.org/en/)

Install [Git](https://git-scm.com/download/win)

Install [Python](https://www.python.org/downloads/)

Install [Visual Studio](https://visualstudio.microsoft.com/thank-you-downloading-visual-studio/?sku=Community&rel=16)

![Visual Studio Installer](https://i.stack.imgur.com/S3RgX.png)

```bash
npm install -g yarn
git clone https://github.com/filiwoe/gestorAppPet.git appet
cd appet
git clone https://github.com/filiwoe/appPetBack.git api
git clone https://github.com/filiwoe/api_front_pet.git integrator
yarn preinstall
```

## Run update
```bash
yarn g4r
yarn api
yarn i8r
```

## Run backend
```bash
yarn api:serve
yarn i8r:serve
```

## Run browser
```bash
yarn g4r:serve
```

## Run electron
```bash
yarn g4r:electron:serve
```

## Build electron
```bash
yarn g4r:electron:build
```
