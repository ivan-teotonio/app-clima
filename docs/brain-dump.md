# Projeto: Clima

Este projeto vai pegar a cidade e baseado nisso, consultar o clima naquela região, exibndo as pr,incipais informações de clima,
temperatura, humidade e etc...

### Aspectos Técnicos

O projeto vai ser feito em Vite + Vanilla + Typescript

- Todo o HTML da interface fica definido no `index.html` (container `#app`);
- Toda a interação e a lógica ficam no TypeScript (eventos, service layer, estados).

### Informações da API que será usada no projeto

Ele vai usar a APi OpenMeteo, om os seguintes endpoints:

#### Para pegart a latitude, longitude e timezone, baseado no nome da cidade:

https://geocoding-api.open-meteo.com/v1/search?name={NOME_DA_CIDADE}&count=1&language=pt&format=json

{NOME_DA_CIDADE} = Nome da cidade que o usuário digitou

Exemplo de resposta:
{
"results": [
{
"id": 3451190,
"name": "Rio de Janeiro",
"latitude": -22.90642,
"longitude": -43.18223,
"elevation": 12,
"feature_code": "PPLA",
"country_code": "BR",
"admin1_id": 3451189,
"admin2_id": 6322060,
"timezone": "America/Sao_Paulo",
"population": 6747815,
"country": "Brasil",
"admin1": "Rio de Janeiro",
"admin2": "Rio de Janeiro",
}
],
"generationtime_ms": 1.1940002
}

Informações que PRECISAMOS:

- name
- latitude
- longetide
- country_code
- timezone

#### Para pegar as informações de clima:

https://api.open-meteo.com/v1/forecast? latitude={LATITUDE}&longitude={LONGITUDE}&
current=precipitation_probability,temperature_2m,relative_humidity_2m,apparent_temperature,is_day,precipitation,wind_speed_10m,wind_direction_10m,weather_code&timezone={TIMEZONE}

{LATITUDE} = Latitude
{LONGETUDE} = Longitude
{TIMEZONE} = Timezone

Exemplo de resposta:
{
"latitude": -22.952549,
"longitude": -43.215027,
"generationtime_ms": 0.159382820129395,
"utc_offset_seconds": -10800,
"timezone": "America/São_Paulo",
"timezone_abbreviation": "GMT-3",
"elevation": 12,
"current_units": {
"time": "iso8601",
"interval": "seconds",
"precipitation_probability": "%",
"temperature_2m": "%",
"apparent_temperature": "°C",
"is_day": "",
"wind_speed_10m": "km/h",
"wind_direction_10m": "°",
"precipitation": "mm",
"weather_code": "wmo code"
},
"current": {
"time": "2026-06-17T09:30",
"interval": 900,
"temperature_2m": 19.2,
"relative_humidity_2m": 93,
"apparent_temperature": 21.3,
"is_day": 1,
"wind_speed_10m": 5.4,
"wind_direction_10m": 285,
"precipitation": 0,
"weather_code": 2
}
}

Informações que precisamos da resposta:
Na resposta eu tenho 2 itens:

- current_units tem as unidades de medidas das propiedades
- current tem os valores das propiedades

Propiedades obrigatórias:

- temperature_2m
- relative_humidity_2m
- apparent_temperature
- is_day
- wind_speed_10m
- wind_direction_10m
- precipitation_probability

#### Informação importante:

Teremos um arquivo com as funções do OpenMeteo, para que o projeto não faça requisição
direta a API mas sim use as funções desse arquivo.

Fluxo de pesquisa para receber o nome da cidade e pegar as informações de clima:

- Ao pegar latitude, longitude e timezone, o projeto usa essas informações para fazer a requisição e pegar as informações do clima dessa localização.
- Caso não ache as informações da cidade, se comportar como se não tivesse achado nada.
- Caso ache as infromações da cidade mas não as de clima, se comportar como se não tivesse achado nada.

A busca envolve as 2 requisições (buscar latitude/longitude/timezone + buscar clima),
mas para o usuário é uma só, com loading.

### Apectos visuais (design e UX)

Tem que ter Empty State.

- No carregamento inicial, o Empty State deve orientar o usuário a buscar uma cidade;
- A mensagem de "cidade não encontrada" só aparece após uma busca sem resultados;
- Se o campo for limpo e enviado vazio, o resultado anterior sai da tela e o app volta ao estado inicial.

Teremos uma área SUPERIOR centralizada que tem apenas o campo da busca da cidade

O projeto terá um sidebar na esquerda com as seguintes informações:

- Temperatura
- Nome da cidade, Código do pais
- Dia atual
- Se é dia/noite (baseado no is_day), com símbolo: ☀ para dia e ☾ para noite
- Weather Code

Na área principal

- Humidade relativa
- Temperatura aparente
- Probabilidade de precipitação
- Velocidade/Direção do vento

Design geral:

- O projeto terá um fundo cinza escuro
- A parte superior não terá background, mas tanto o sidebar quanto a área principal
  dentro de uma div com borda bem arredondada, fundo branco, centralizada e largura máxima
  de 800px.

Cores e feedback visual:

- O fundo da aplicação muda de cor conforme a condição climática retornada (weather code),
  considerando também se é dia ou noite;
- O estado de loading exibe um spinner girando junto com a mensagem de busca.

Informações de interpretação sobre o Weather Code
WMO Weather interpretation codes (WW)
Code Description
0 Clear sky
1, 2, 3 Mainly clear, partly cloudy, and overcast
45, 48 Fog and depositing rime fog
51, 53, 55 Drizzle: Light, moderate, and dense intensity
56, 57 Freezing Drizzle: Light and dense intensity
61, 63, 65 Rain: Slight, moderate and heavy intensity
66, 67 Freezing Rain: Light and heavy intensity
71, 73,75 Snow fall: Slight, moderate, and heavy intensity
77 Snow grains
80, 81, 82 Rain showers: Slight, moderate, snd violent
85, 86 Snow showers slight and heavy
95 _ Thunderstorm with slight and heavy hail
95, 99 _ Thunderstorm with slight and heavy hail

### Deploy e CI/CD

- O projeto é publicado no GitHub Pages automaticamente;
- Todo push na branch `main` dispara o GitHub Actions;
- O pipeline instala dependências (`npm ci`), roda o build (`tsc` + Vite) e publica a pasta `dist/`;
- Como o Pages serve o projeto em um subdiretório, o build usa `base: "/app-clima/"`;
- Também é possível rodar o workflow manualmente pela aba Actions do GitHub.
