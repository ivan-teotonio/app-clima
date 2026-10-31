# Tasks — Aplicativo Clima

- **Status:** em andamento
- **Base:** `docs/prd.md`
- **Regra:** cada task abaixo deve ser implementada de forma **progressiva** (uma de cada vez) por agentes de IA.
- **Convenção:** para não duplicar informações, cada task deve seguir os requisitos do PRD indicado e, caso precise de ajuste de escopo, a alteração deve ser registrada no PRD antes.

## Tasks

- [x] **Task 1 — Configurar estrutura de pastas do frontend**

  - Critério de aprovação:
    - [x] Pastas `src/components/`, `src/services/`, `src/types/`, `src/utils/` e `src/styles/` criadas;
    - [x] `npm run build` executa com sucesso com a nova estrutura.

  - Requisito(s) relacionado(s): PRD — seção 5.2 (Arquitetura e estrutura sugerida).

- [x] **Task 2 — Criar tipos TypeScript dos contratos da API Open-Meteo**

  - Critério de aprovação:
    - [x] Interfaces/types criadas para geocoding (`results` com `name`, `latitude`, `longitude`, `country_code`, `timezone`, etc.);
    - [x] Interfaces/types criadas para forecast (`current_units`, `current` com as variáveis obrigatórias);
    - [x] Tipagem compila via `tsc` sem erros.

  - Requisito(s) relacionado(s): PRD — seções 5.3 e 5.4 (Contratos de API).

- [x] **Task 3 — Implementar service layer com as funções do Open-Meteo**

  - Critério de aprovação:
    - [x] Módulo de service criado com as funções de geocoding e forecast;
    - [x] Funções com assinaturas e tipos definidos conforme PRD;
    - [x] Componentes **não** realizam requisição direta à API.

  - Requisito(s) relacionado(s): PRD — seção 5.2 (Regra de arquitetura) e seção 5.5 (Mapeamentos).

- [x] **Task 4 — Implementar utilitários de mapeamento (weather code, vento, is_day, dia da semana)**

  - Critério de aprovação:
    - [x] Função de conversão de `weather_code` (WMO) para descrição em pt-BR (tabela do PRD, seção 6.4);
    - [x] Função de conversão de direção do vento (graus → cardinal);
    - [x] Funções/flags para `is_day` e dia da semana.

  - Requisito(s) relacionado(s): PRD — seção 5.5 e seção 6.4.

- [ ] **Task 5 — Implementar componente SearchBar (área superior centralizada)**

  - Critério de aprovação:
    - [ ] Campo de busca único na área superior, centralizado;
    - [ ] Campo acessível por teclado com label associado e placeholder.

  - Requisito(s) relacionado(s): PRD — RF-01 (seção 3.1).

- [ ] **Task 6 — Implementar estado de Loading durante a busca**

  - Critério de aprovação:
    - [ ] Estado de loading exibido durante geocoding + forecast;
    - [ ] Loading acompanha o fluxo completo da busca.

  - Requisito(s) relacionado(s): PRD — RF-02 (seção 3.2).

- [ ] **Task 7 — Implementar Empty State (estado inicial e cidade não encontrada)**

  - Critério de aprovação:
    - [ ] Empty State exibido no carregamento inicial;
    - [ ] Empty State exibido quando a cidade não é encontrada ou não há dados.

  - Requisito(s) relacionado(s): PRD — UC-02 / RF-02 (seção 3.2).

- [ ] **Task 8 — Implementar exibição de dados (sidebar + área principal)**

  - Critério de aprovação:
    - [ ] Sidebar exibe temperatura, nome da cidade + código do país, dia atual, is_day e weather code;
    - [ ] Área principal exibe umidade relativa, temperatura aparente, probabilidade de precipitação e vento (velocidade/direção);
    - [ ] Variáveis obrigatórias da API estão sendo exibidas.

  - Requisito(s) relacionado(s): PRD — RF-03 (seção 3.3).

- [ ] **Task 9 — Implementar tratamento de erros do fluxo de busca**

  - Critério de aprovação:
    - [ ] Fluxo de falha (geocoding sem resultado / forecast sem dados) converge para o Empty State;
    - [ ] Usuário nunca visualiza erro técnico bruto.

  - Requisito(s) relacionado(s): PRD — RF-02 (seção 3.2).

- [ ] **Task 10 — Implementar layout visual completo**

  - Critério de aprovação:
    - [ ] Fundo cinza escuro aplicado;
    - [ ] Área superior sem background, com busca centralizada;
    - [ ] Card branco com borda bem arredondada, centralizado, largura máxima 800px;
    - [ ] Sidebar (esquerda) e área principal (direita) renderizadas conforme PRD.

  - Requisito(s) relacionado(s): PRD — seção 6 (Instruções visuais).

- [ ] **Task 11 — Validação final (build + critérios de aceite do PRD)**

  - Critério de aprovação:
    - [ ] `npm run build` concluí com sucesso;
    - [ ] Checklist de Critérios de Aceite do PRD (seção 8) atendido.

  - Requisito(s) relacionado(s): PRD — seção 8 (Critérios de aceite).
