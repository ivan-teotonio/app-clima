# PRD — Aplicativo Clima

**Documento de Requisitos de Produto**
- Versão: 1.0.0
- Status: Rascunho
- Data: 30/10/2026
- Fontes: `docs/brain-dump.md`

---

## 1. Introdução

### 1.1. Propósito

Este PRD consolida os requisitos do aplicativo **Clima**, a partir do brain-dump do projeto, e define:

- os **aspectos funcionais** (o que o sistema deve fazer);
- os **requisitos de sistema** (restrições, performance, usabilidade);
- os **detalhes técnicos** (stack, contratos de API, arquitetura);
- as **instruções visuais** (design e UX).

### 1.2. Problema

Usuários precisam saber rapidamente as condições climáticas atuais (temperatura, umidade, vento, precipitação) de uma cidade qualquer.

Consultas manuais em múltiplas fontes são dispendiosas; o aplicativo deve centralizar essa busca em uma única experiência simples e rápida.

### 1.3. Solução

Aplicação web construída com **Vite + Vanilla + TypeScript**, que:

1. Recebe o nome de uma cidade via campo de busca (área superior, centralizada);
2. Faz a requisição de geocoding (`name → latitude/longitude/timezone`);
3. Faz a requisição de forecast (`latitude/longitude/timezone → dados de clima`);
4. Exibe as principais variáveis climáticas na interface.

### 1.4. Escopo

**Dentro do escopo do MVP:**

- Busca por nome de cidade;
- Exibição das variáveis obrigatórias do bloco `current` da API;
- Estados de loading, sucesso e **empty state**;
- Interpretação do weather code (WMO).

**Fora do escopo (futuro):**

- Previsões meteorológicas (periodo, por horas/dias);
- Mapas / geolocalização por GPS;
- Histórico de buscas / favoritos;
- Personalização de unidades.

---

## 2. Personas

Usuário leigo que deseja saber "como está o clima em …".

- Não precisa de dados técnicos avançados;
- Interação mínima: uma única busca;
- Feedback claro em todos os estados (loading, sucesso, vazio, erro).

---

## 3. Requisitos funcionais

### 3.1. UC-01 — Consultar o clima atual de uma cidade

#### RF-01 — Campo de busca (área superior)

- O campo de busca fica na **área superior**, **centralizada**, contendo **apenas o campo da busca da cidade** (sem filtros ou widgets extras).
- O campo deve ser acessível por teclado, com `label` associado e `placeholder` descritivo (ex.: "Ex.: São Paulo").

#### RF-02 — Fluxo de busca (geocoding + forecast + loading)

Ao submeter o nome da cidade, o sistema deve:

1. Executar a requisição de **geocoding** com `count=1` e `language=pt`;
2. Com os dados de `latitude`, `longitude` e `timezone` retornados, executar a requisição de **forecast** com as variáveis de `current`;
3. Exibir estado de **loading** durante todo o processo.

**Regras de tratamento:**

- Se o geocoding não retornar resultados → tratar como **cidade não encontrada** (exibir empty state);
- Se a cidade for encontrada, mas o forecast não retornar dados → tratar como **não encontrada** (exibir empty state);
- O usuário não deve ver erro técnico; o fluxo deve convergir para o empty state.

#### RF-03 — Exibição das informações

**Sidebar (área à esquerda):**

| Variável | Fonte (API) | Observações |
|---|---|---|
| Temperatura atual | `current.temperature_2m` | °C |
| Nome da cidade | resultado do geocoding (`name`) | + `country_code` |
| Dia atual | derivado de `current.time` | dia da semana |
| Dia/Night | `current.is_day` | `1` = dia, `0` = noite |
| Weather code | `current.weather_code` | ver tabela WMO na se 6.4 |

**Área principal:**

| Variável | Fonte (API) | Observações |
|---|---|---|
| Umidade relativa | `current.relative_humidity_2m` | % |
| Temperatura aparente | `current.apparent_temperature` | °C |
| Probabilidade de precipitação | `current.precipitation_probability` | % |
| Vento — velocidade | `current.wind_speed_10m` | km/h |
| Vento — direção | `current.wind_direction_10m` | ° (ver se 5.5) |

### 3.2. UC-02 — Estado vazio (inicial e cidade não encontrada)

- **O app deve ter um Empty State** (requisito obrigatório).
- No carregamento inicial (antes de qualquer busca), exibir mensagem de orientação para o usuário digitar o nome de uma cidade.
- Quando a busca não retornar dados, exibir mensagem de "cidade não encontrada" / "não encontramos dados para esta cidade", com orientação para o usuário digitar outra cidade.
- Submeter o campo de busca vazio (por exemplo, após limpar o texto) deve limpar o resultado exibido e voltar ao estado inicial (Empty State inicial).

### 3.3. UC-03 — Interpretação do weather code (WMO)

- O sistema deve interpretar os códigos WMO retornados em `current.weather_code` e exibir a descrição correspondente.

---

## 4. Requisitos não funcionais

### 4.1. Performance

- Máximo de **2 requisições** por interação de busca (geocoding + forecast);
- Estado de **loading** visível durante a busca;
- A API externa (Open-Meteo) é de terceiros: o PRD assume disponibilidade pública sem chave.

### 4.2. Usabilidade e acessibilidade

- Todos os estados (loading, sucesso, empty, erro) devem ser percebidos por usuários de tecnologia média;
- Foco visível e navegação por teclado no campo de busca;
- Textos legíveis e contraste adequado.

### 4.3. Responsividade

- O layout deve funcionar em telas mobile e desktop;
- Card centralizado com largura máxima de **800px** deve se adaptar.

---

## 5. Requisitos técnicos

### 5.1. Stack

- **Vite** (build/servidor de dev);
- **TypeScript** (tipagem forte);
- **Vanilla** (sem framework de UI — manipulação direta do DOM / CSS).

Build padrão do projeto: `tsc && vite build`.

### 5.2. Arquitetura e estrutura sugerida

```
src/
├── main.ts                 # bootstrap — monta a interface em #app e registra as interações
├── services/               # funções que encapsulam as chamadas ao Open-Meteo
├── types/                  # interfaces dos payloads da API
├── utils/                  # mapeamentos (weather code, direção do vento, dia da semana)
└── styles/                 # estilos (CSS)
```

A interface (HTML) é definida diretamente no `index.html`, dentro do container `#app`; toda a interação e a lógica ficam no TypeScript (via `main.ts` e módulos).

**Regra de arquitetura:** o projeto **não deve fazer requisição direta à API** a partir da interface; toda chamada deve passar por um módulo de funções (service layer).

### 5.3. Contrato de API — Geocoding

**Endpoint:** `https://geocoding-api.open-meteo.com/v1/search`

| Parâmetro | Valor |
|---|---|
| `name` | Nome da cidade informado pelo usuário |
| `count` | `1` |
| `language` | `pt` |
| `format` | `json` |

**Resposta relevante:** `results[]` com `id`, `name`, `latitude`, `longitude`, `elevation`, `feature_code`, `country_code`, `admin1_id`, `admin2_id`, `timezone`, `population`, `country`, `admin1`, `admin2`, além de `generationtime_ms`.

**Campos mapeados para o domínio:**

| Campo | Tipo | Uso |
|---|---|---|
| `name` | string | Nome exibido |
| `latitude` | number | Coordenada |
| `longitude` | number | Coordenada |
| `country_code` | string | Código do país |
| `timezone` | string | Timezone para o forecast |

### 5.4. Contrato de API — Forecast

**Endpoint:** `https://api.open-meteo.com/v1/forecast`

| Parâmetro | Valor |
|---|---|
| `latitude` | Latitude retornada pelo geocoding |
| `longitude` | Longitude retornada pelo geocoding |
| `current` | `precipitation_probability,temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,wind_speed_10m,wind_direction_10m,weather_code` |
| `timezone` | Timezone retornada pelo geocoding |

**Resposta relevante:** `latitude`, `longitude`, `generationtime_ms`, `utc_offset_seconds`, `timezone`, `timezone_abbreviation`, `elevation`, `current_units`, `current`.

**`current_units`** descreve as unidades de cada variável. **`current`** contém os valores.

**Variáveis obrigatórias para exibição:**

- `temperature_2m`
- `relative_humidity_2m`
- `apparent_temperature`
- `is_day`
- `wind_speed_10m`
- `wind_direction_10m`
- `precipitation_probability`

Demais variáveis presentes na requisição (`precipitation`, `weather_code`) são utilizadas para completude dos dados exibidos.

### 5.5. Mapeamentos e regras de negócio

- **Unidades:** temperatura em °C; umidade em %; vento em km/h; direção em °; probabilidade em %.
- **Direção do vento:** converter graus (`wind_direction_10m`) em direção cardinal (N, NE, E, SE, S, SW, W, NW).
- **Dia/noite:** `is_day` (`1` = dia, `0` = noite).
- **Dia atual:** derivar o dia da semana a partir de `current.time`.

---

## 6. Instruções visuais (Design e UX)

### 6.1. Layout geral

```
+--------------------------------------------------------------+
|   (área superior — SEM fundo, sobre fundo cinza escuro)        |
|        [          Campo de busca da cidade         ]           |
+--------------------------------------------------------------+

+--------------------------------------------------------------+
|  [ Card branco                                        ]         |
|  [ borda bem arredondada, fundo branco,                   ]     |
|  [ centralizado, largura máxima 800px ]                    |     |
|  +------------------------+-------------------------------+  |
|  | Sidebar (esquerda)    | Area principal              |  |
|  | - Temperatura          | - Umidade                   |  |
|  | - Cidade / pais        | - Temp. aparente            |  |
|  | - Dia / is_day         | - Prob. precipita.          |  |
|  | - Weather code         | - Vento                     |  |
|  +------------------------+-------------------------------+  |
+--------------------------------------------------------------+
```

- **Fundo da aplicação:** cinza escuro no estado inicial/vazio; após uma busca bem-sucedida, assume a paleta da condição climática (seção 6.5).
- **Área superior:** sem background; conteúdo centralizado com **apenas o campo de busca da cidade**.
- **Card de conteúdo:** borda bem arredondada, **fundo branco**, **centralizado**, **largura máxima de 800px**.
- **Sidebar:** à esquerda; **área principal:** à direita (empilhadas em telas estreitas).

### 6.2. Componentes

- **SearchBar:** campo único de texto.
- **Sidebar:** temperatura, cidade + código do país, dia atual, indicador dia/noite (símbolo ☀ para dia / ☾ para noite + texto), weather code.
- **Área principal:** umidade relativa, temperatura aparente, probabilidade de precipitação, vento (velocidade/direção).

### 6.3. Estados visuais

| Estado | Requisito |
|---|---|
| Loading | Spinner girando + mensagem durante a busca (geocoding + forecast) |
| Sucesso | Sidebar + área principal preenchidas |
| Vazio | **Empty state obrigatório**: no estado inicial orienta a busca; após busca sem resultados exibe "cidade não encontrada" |
| Erro | Mensagem amigável + ação de nova busca |

### 6.4. Weather codes (WMO)

| Código | Descrição (WMO) | Descrição (pt-BR) |
|---|---|---|
| 0 | Clear sky | Céu claro |
| 1 | Mainly clear | Predominantemente claro |
| 2 | Partly cloudy | Parcialmente nublado |
| 3 | Overcast | Encoberto |
| 45 | Fog and depositing rime fog | Neblina |
| 48 | Fog and depositing rime fog | Neblina com deposição |
| 51 | Drizzle: Light | Garoa: Leve |
| 53 | Drizzle: Moderate | Garoa: Moderada |
| 55 | Drizzle: Dense | Garoa: Densa |
| 56 | Freezing Drizzle: Light | Garoa congelante: Leve |
| 57 | Freezing Drizzle: Dense | Garoa congelante: Densa |
| 61 | Rain: Slight | Chuva: Leve |
| 63 | Rain: Moderate | Chuva: Moderada |
| 65 | Rain: Heavy | Chuva: Forte |
| 66 | Freezing Rain: Light | Chuva congelante: Leve |
| 67 | Freezing Rain: Heavy | Chuva congelante: Forte |
| 71 | Snow fall: Slight | Neve: Leve |
| 73 | Snow fall: Moderate | Neve: Moderada |
| 75 | Snow fall: Heavy | Neve: Forte |
| 77 | Snow grains | Grãos de neve |
| 80 | Rain showers: Slight | Chuva em ráfagas: Leve |
| 81 | Rain showers: Moderate | Chuva em ráfagas: Moderada |
| 82 | Rain showers: Violent | Chuva em ráfagas: Violenta |
| 85 | Snow showers: Slight | Chuva e neve em ráfagas: Leve |
| 86 | Snow showers: Heavy | Chuva e neve em ráfagas: Forte |
| 95 | Thunderstorm with hail | Tempestade com granizo |
| 99 | Thunderstorm with hail | Tempestade com granizo |

### 6.5. Cores dinâmicas por condição climática

Após uma busca bem-sucedida, o fundo da aplicação e a cor de destaque da temperatura assumem uma paleta baseada em `current.weather_code` e em `current.is_day`:

| Grupo | Weather codes | Dia | Noite |
|---|---|---|---|
| Céu claro | 0, 1 | Azul céu | Azul noturno |
| Nublado | 2, 3 | Cinza azulado | Cinza escuro |
| Neblina | 45, 48 | Cinza suave | Cinza escuro |
| Garoa | 51, 53, 55, 56, 57 | Azul-acinzentado | Azul petróleo |
| Chuva | 61–67, 80–82 | Azul chuvoso | Azul profundo |
| Neve | 71–77, 85, 86 | Azul gelado | Azul-acinzentado |
| Tempestade | 95, 99 | Cinza-tempestade | Azul quase preto |

- Sem dados (estado inicial/vazio) o fundo permanece no cinza escuro neutro;
- Em caso de falha, o tema anterior é removido (volta ao neutro);
- O spinner do loading é exibido sobre o fundo do tema atual.

---

## 7. Fluxo do usuário

1. **Estado inicial:** Empty State (campo de busca centralizado).
2. Usuário digita cidade → **Loading**.
3. Sucesso → exibir Sidebar + área principal com os dados.
4. Usuário digita nova cidade → novo carregamento (substituição dos dados).

---

## 8. Critérios de aceite

- [x] Ao buscar "São Paulo", exibe temperatura, umidade, vento, etc.
- [x] Ao buscar cidade inexistente, exibe Empty State.
- [x] Durante a busca, exibe loading.
- [x] Sidebar e área principal seguem o layout visual definido (card branco, max 800px, fundo escuro).
- [x] Todas as variáveis obrigatórias da API estão sendo exibidas.

---

## 9. Fora do escopo / Roadmap

- Previsão meteorológica;
- Mapas/geolocalização;
- Favoritos/histórico;
- Troca de unidades.

---

## 10. Riscos e dúvidas em aberto

- Tratamento de falhas de rede.
- Timeout das requisições.
- Detalhes visuais (tipografia, cores de destaque, ícones) não especificados no brain-dump.
- Requisitos não funcionais restantes (LGPD, SEO, analytics).

---

*Documento gerado a partir de `docs/brain-dump.md`.*
