# Feature Flags (Dansk)

🌐 **Languages:** 🇺🇸 [English](../../../../reference/FEATURE_FLAGS.md) · 🇪🇹 [am](../../../am/docs/reference/FEATURE_FLAGS.md) · 🇸🇦 [ar](../../../ar/docs/reference/FEATURE_FLAGS.md) · 🇦🇿 [az](../../../az/docs/reference/FEATURE_FLAGS.md) · 🇧🇬 [bg](../../../bg/docs/reference/FEATURE_FLAGS.md) · 🇧🇩 [bn](../../../bn/docs/reference/FEATURE_FLAGS.md) · 🇨🇿 [cs](../../../cs/docs/reference/FEATURE_FLAGS.md) · 🇩🇪 [de](../../../de/docs/reference/FEATURE_FLAGS.md) · 🇬🇷 [el](../../../el/docs/reference/FEATURE_FLAGS.md) · 🇪🇸 [es](../../../es/docs/reference/FEATURE_FLAGS.md) · 🇪🇪 [et](../../../et/docs/reference/FEATURE_FLAGS.md) · 🇮🇷 [fa](../../../fa/docs/reference/FEATURE_FLAGS.md) · 🇫🇮 [fi](../../../fi/docs/reference/FEATURE_FLAGS.md) · 🇫🇷 [fr](../../../fr/docs/reference/FEATURE_FLAGS.md) · 🇮🇪 [ga](../../../ga/docs/reference/FEATURE_FLAGS.md) · 🇮🇳 [gu](../../../gu/docs/reference/FEATURE_FLAGS.md) · 🇳🇬 [ha](../../../ha/docs/reference/FEATURE_FLAGS.md) · 🇮🇱 [he](../../../he/docs/reference/FEATURE_FLAGS.md) · 🇮🇳 [hi](../../../hi/docs/reference/FEATURE_FLAGS.md) · 🇭🇷 [hr](../../../hr/docs/reference/FEATURE_FLAGS.md) · 🇭🇺 [hu](../../../hu/docs/reference/FEATURE_FLAGS.md) · 🇦🇲 [hy](../../../hy/docs/reference/FEATURE_FLAGS.md) · 🇮🇩 [id](../../../id/docs/reference/FEATURE_FLAGS.md) · 🇳🇬 [ig](../../../ig/docs/reference/FEATURE_FLAGS.md) · 🇮🇹 [it](../../../it/docs/reference/FEATURE_FLAGS.md) · 🇯🇵 [ja](../../../ja/docs/reference/FEATURE_FLAGS.md) · 🇬🇪 [ka](../../../ka/docs/reference/FEATURE_FLAGS.md) · 🇰🇭 [km](../../../km/docs/reference/FEATURE_FLAGS.md) · 🇮🇳 [kn](../../../kn/docs/reference/FEATURE_FLAGS.md) · 🇰🇷 [ko](../../../ko/docs/reference/FEATURE_FLAGS.md) · 🇱🇹 [lt](../../../lt/docs/reference/FEATURE_FLAGS.md) · 🇱🇻 [lv](../../../lv/docs/reference/FEATURE_FLAGS.md) · 🇮🇳 [ml](../../../ml/docs/reference/FEATURE_FLAGS.md) · 🇮🇳 [mr](../../../mr/docs/reference/FEATURE_FLAGS.md) · 🇲🇾 [ms](../../../ms/docs/reference/FEATURE_FLAGS.md) · 🇲🇹 [mt](../../../mt/docs/reference/FEATURE_FLAGS.md) · 🇲🇲 [my](../../../my/docs/reference/FEATURE_FLAGS.md) · 🇳🇵 [ne](../../../ne/docs/reference/FEATURE_FLAGS.md) · 🇳🇱 [nl](../../../nl/docs/reference/FEATURE_FLAGS.md) · 🇳🇴 [no](../../../no/docs/reference/FEATURE_FLAGS.md) · 🇮🇳 [or](../../../or/docs/reference/FEATURE_FLAGS.md) · 🇮🇳 [pa](../../../pa/docs/reference/FEATURE_FLAGS.md) · 🇵🇭 [phi](../../../phi/docs/reference/FEATURE_FLAGS.md) · 🇵🇱 [pl](../../../pl/docs/reference/FEATURE_FLAGS.md) · 🇵🇹 [pt](../../../pt/docs/reference/FEATURE_FLAGS.md) · 🇧🇷 [pt-BR](../../../pt-BR/docs/reference/FEATURE_FLAGS.md) · 🇷🇴 [ro](../../../ro/docs/reference/FEATURE_FLAGS.md) · 🇷🇺 [ru](../../../ru/docs/reference/FEATURE_FLAGS.md) · 🇱🇰 [si](../../../si/docs/reference/FEATURE_FLAGS.md) · 🇸🇰 [sk](../../../sk/docs/reference/FEATURE_FLAGS.md) · 🇸🇮 [sl](../../../sl/docs/reference/FEATURE_FLAGS.md) · 🇷🇸 [sr](../../../sr/docs/reference/FEATURE_FLAGS.md) · 🇸🇪 [sv](../../../sv/docs/reference/FEATURE_FLAGS.md) · 🇰🇪 [sw](../../../sw/docs/reference/FEATURE_FLAGS.md) · 🇮🇳 [ta](../../../ta/docs/reference/FEATURE_FLAGS.md) · 🇮🇳 [te](../../../te/docs/reference/FEATURE_FLAGS.md) · 🇹🇭 [th](../../../th/docs/reference/FEATURE_FLAGS.md) · 🇹🇷 [tr](../../../tr/docs/reference/FEATURE_FLAGS.md) · 🇺🇦 [uk-UA](../../../uk-UA/docs/reference/FEATURE_FLAGS.md) · 🇵🇰 [ur](../../../ur/docs/reference/FEATURE_FLAGS.md) · 🇺🇿 [uz](../../../uz/docs/reference/FEATURE_FLAGS.md) · 🇻🇳 [vi](../../../vi/docs/reference/FEATURE_FLAGS.md) · 🇳🇬 [yo](../../../yo/docs/reference/FEATURE_FLAGS.md) · 🇨🇳 [zh-CN](../../../zh-CN/docs/reference/FEATURE_FLAGS.md) · 🇹🇼 [zh-TW](../../../zh-TW/docs/reference/FEATURE_FLAGS.md)

---

> Runtimekontakter, der ændrer OmniRoutes adfærd **uden en ny udrulning**.
> Alle flag, der er angivet her, er defineret i
> [`src/shared/constants/featureFlagDefinitions.ts`](../../src/shared/constants/featureFlagDefinitions.ts)
> — den eneste autoritative kilde. Både dashboardet og REST API'et læser fra
> denne fil, så tabellen nedenfor genereres, så den matcher den 1:1.

---

## Hvad feature flags er

Et feature flag er en navngivet kontakt (boolean eller enum), hvis værdi kan ændres
under kørsel og gemmes i databasen, uden at processen skal udrulles igen. Hvert
flag beskrives af en `FeatureFlagDefinition` med en `key`, `label`,
`description`, `category`, `defaultValue`, `type` og en `requiresRestart`-angivelse.

### Evalueringsrækkefølge

Et flags **effektive værdi** bestemmes af
[`resolveFeatureFlag()`](../../src/shared/utils/featureFlags.ts) med følgende
prioritet (højeste vinder):

1. **DB-tilsidesættelse** — en værdi, der er gemt i tabellen `key_value` under
   navnerummet `feature_flags` (angivet via dashboardet eller REST API'et).
2. **Miljøvariabel** — `process.env[<KEY>]`, hvis den er angivet og ikke er tom.
3. **Definitionens standardværdi** — `defaultValue` fra `featureFlagDefinitions.ts`.

Et boolean-flag betragtes som **aktiveret**, når dets effektive værdi er `"true"`,
`"1"` eller `"yes"` (se `isFeatureFlagEnabled()`).

> [!NOTE]
> De fleste flag har også en tilsvarende miljøvariabel med **samme navn**,
> som er dokumenteret i [`ENVIRONMENT.md`](./ENVIRONMENT.md). Flagets
> DB-tilsidesættelse har højere prioritet end denne miljøvariabel. Et flag med
> `requiresRestart: true` gemmes med det samme, men genindlæses først, når
> processen startes — hvis det skiftes, vises banneret **"Genstart server"** i dashboardet.

---

## Flagkatalog

72 flag fordelt på 6 kategorier. **Standard** er definitionens standardværdi — den værdi,
der bruges, når der hverken findes en DB-tilsidesættelse eller en miljøvariabel.

### Sikkerhed (10)

| Nøgle                                   | Type    | Standard | Beskrivelse                                                                                                                                                                                                                                                                     |
| --------------------------------------- | ------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `REQUIRE_API_KEY`                       | boolean | `false`  | Kræv en API-nøgle til alle indgående anmodninger.                                                                                                                                                                                                                               |
| `INPUT_SANITIZER_ENABLED`               | boolean | `true`   | Aktivér rensning af input for alle anmodninger.                                                                                                                                                                                                                                 |
| `INJECTION_GUARD_MODE`                  | enum    | `off`    | Tilstand for beskyttelse mod prompt-injektion. Værdier: `off`, `warn`, `block`, `redact`.                                                                                                                                                                                       |
| `PII_REDACTION_ENABLED`                 | boolean | `false`  | Maskér PII i anmodninger (uafhængigt af `INPUT_SANITIZER_MODE`).                                                                                                                                                                                                                |
| `PII_RESPONSE_SANITIZATION`             | boolean | `false`  | Rens PII fra udbydersvar.                                                                                                                                                                                                                                                       |
| `PII_RESPONSE_SANITIZATION_MODE`        | enum    | `redact` | Tilstand for rensning af PII i svar. Værdier: `redact`, `warn`, `block`, `off`.                                                                                                                                                                                                 |
| `OUTBOUND_SSRF_GUARD_ENABLED`           | boolean | `true`   | Bloker udgående anmodninger til private/interne IP-intervaller.                                                                                                                                                                                                                 |
| `ALLOW_API_KEY_REVEAL`                  | boolean | `false`  | Tillad godkendte dashboardbrugere at få vist gemte API-nøgler i stedet for kun at se maskerede værdier.                                                                                                                                                                         |
| `AUTH_LOG_INCLUDE_ACCOUNT_ID`           | boolean | `false`  | Medtag kontopræfikset i AUTH-loglinjer (f.eks. "Bruger <provider>-konto: abc12345..."). Deaktiveret som standard, så kontoidentifikatorer maskeres i delte/multitenant-proceslogfiler. Uafhængigt af fejlfindingstilstand; aktivering af fejlfindingstilstand viser ikke dette. |
| `OMNIROUTE_OIDC_DISABLE_PASSWORD_LOGIN` | boolean | `false`  | Når OIDC er aktiveret, deaktiveres login med adgangskode, så brugere kun kan godkendes via OIDC Single Sign-On. Når det er deaktiveret (standard), er både login med adgangskode og OIDC tilgængelige.                                                                          |

### Netværk (15)

| Nøgle                                           | Type    | Standard | Genstart | Beskrivelse                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| ----------------------------------------------- | ------- | -------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `ENABLE_TLS_FINGERPRINT`                        | boolesk | `false`  | ✓        | Aktivér skjult tilstand for TLS-fingeraftryk.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `AUDIO_REMOTE_PROVIDER_NODES`                   | boolesk | `false`  |          | Tillad, at ruterne /v1/audio/* bruger OpenAI-kompatible udbydernoder, der hostes uden for localhost. Deaktiveret som standard — dirigering af lyd til en fjernvært ændrer udgående identitet og skal være en udtrykkelig operatørbeslutning. Loopback-noder er altid tilladt og påvirkes ikke.                                                                                                                                                                                                                                                                                       |
| `PROXY_AUTO_SELECT_ENABLED`                     | boolesk | `false`  |          | Når der ikke er tildelt en proxy til en forbindelse, vælges den første fungerende proxy fra registreringsdatabasen automatisk. Deaktiveret som standard (ellers bliver enhver proxy i registreringsdatabasen en global reserveløsning — #3332).                                                                                                                                                                                                                                                                                                                                      |
| `OMNIROUTE_CONTROL_PLANE_PROXY_DIRECT_FALLBACK` | boolesk | `false`  |          | Tillad OAuth- og udbydervalideringsforløb at omgå en fastgjort proxy og oprette direkte forbindelse, når forhåndskontroller af proxyens tilgængelighed mislykkes. Deaktiveret som standard, fordi dette kan ændre den udgående IP-adresse.                                                                                                                                                                                                                                                                                                                                           |
| `NETWORK_ROTATION_SHARED_EGRESS_GUARD`          | boolesk | `true`   |          | Ved en netværksundtagelse (timeout, afvist/nulstillet forbindelse) for en rotationsudfører med flere konti: Hvis den fejlramte konto ikke har en dedikeret proxy, anvendes en kort nedkølingsperiode, og andre konti uden proxy springes over i resten af anmodningen i stedet for at forsøge hver enkelt igen. Aktiveret som standard (sikkert: ingen ændring af udgående IP-adresse, reducerer kun risikoen for forsinkelse/nedkøling på konti med delt udgående trafik). Deaktivér for at gendanne øjeblikkelig videresendelse ved den første undtagelse fra en konto uden proxy. |
| `PROXY_SKIP_RECENTLY_FAILED`                    | boolesk | `false`  |          | Proxypuljer og opencodes rotation pr. konto stopper med at genbruge en proxy, der netop har fejlet (afvist TCP-kontrol eller en 429 modtaget gennem den), i en periode pr. proces, som fordobles ved hver gentagelse op til en maksimumsgrænse. Der skrives ingen proxystatus; når alle kandidater er sat til side, forbliver valget uændret. Deaktiveret som standard.                                                                                                                                                                                                              |
| `PROXY_POOL_EGRESS_OBSERVATION`                 | boolesk | `false`  |          | Vis under en proxypulje i kontrolpanelet, hvor mange observerede udgående IP-adresser der har betjent dens medlemmer i løbet af de seneste 24 timer, og hvor mange forbindelser der brugte dem. Skrivebeskyttet, beregnet ud fra proxyloggen og aldrig brugt til dirigering. Deaktiveret som standard.                                                                                                                                                                                                                                                                               |
| `OPENCODE_RESPONSES_STALL_ROTATION`             | boolesk | `false`  |          | For OpenCode-udføreren overvåges den første byte i brødteksten fra et streamet Responses-svar (vindue: `RESPONSES_FIRST_BYTE_TIMEOUT_MS`, standard `15000`). En 2xx Responses-stream, der forbliver tavs efter vinduets udløb, behandles som gået i stå: Kontoen sættes på nedkøling, og anmodningen roteres én gang til den næste konto; endnu et stop medfører øjeblikkelig fejl. Deaktiveret som standard: Streams, der går i stå, fortsætter med den nuværende ventetid indtil timeout for streamparathed.                                                                       |
| `OPENCODE_USER_BLOCKED_ROTATION`                | boolesk | `false`  |          | OpenCode-udfører: Ved en 403/451 med et `user_blocked`-afslag (ikke geografisk og ikke en Cloudflare-afvisning af fingeraftryk) sættes den afviste konto på nedkøling, og der roteres til den næste konto højst én gang pr. anmodning; endnu et afslag returneres uændret og uden markering som vellykket. Deaktiveret som standard: Omdirigering uden om en upstream-brugerblokering kan ligne omgåelse og sprede markeringen til hele flåden.                                                                                                                                      |
| `OPENCODE_TRANSIENT_FAILOVER_BACKOFF`           | boolesk | `false`  |          | OpenCode-rotation: Efter to på hinanden følgende midlertidige upstream-fejl (5xx eller en tom 400) sættes der en pause ind før den næste konto — 1,5 sek., som fordobles for hver yderligere fejl, begrænset til 6 sek. pr. pause og 10 sek. pr. anmodning; pausen springes over, hvis klienten afbryder forbindelsen. Brødteksten fra fejlen frigives før ventetiden. Deaktiveret som standard: Failover sker fortsat øjeblikkeligt.                                                                                                                                                |
| `OPENCODE_RATE_LIMITED_429_EARLY_STOP`          | boolesk | `false`  |          | OpenCode-rotation: Stop kontobølgen ved den første 429, der klassificeres som en reel hastighedsbegrænsning (`Retry-After`, der kan fortolkes, eller en brødtekst, der nævner en hastigheds-/forbrugsgrænse), og returnér denne upstream-429 uændret. Uklassificerede 429-svar fortsætter rotationen. Deaktiveret som standard: Gratisniveauet er begrænset pr. udgående IP-adresse (#9611), så enhver 429 medfører rotation, og en udtømt bølge returnerer den sidste upstream-429.                                                                                                 |
| `MITM_DISABLE_TLS_VERIFY`                       | boolesk | `false`  | ✓        | Deaktivér verificering af TLS-certifikater for MITM-proxyen. **Fare.**                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `OMNIROUTE_ALLOW_PRIVATE_PROVIDER_URLS`         | boolesk | `false`  |          | Tillad udbyder-URL'er, der peger på private/interne netværk.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `OMNIROUTE_ALLOW_LOCAL_PROVIDER_URLS`           | boolesk | `true`   |          | Tillad tilføjelse/validering af udbydere på lokale/private adresser (127.0.0.1, localhost, LAN). Aktiveret som standard (lokalt først); deaktivér for streng blokering, der kun tillader offentlige adresser. Cloud-metadata forbliver blokeret.                                                                                                                                                                                                                                                                                                                                     |
| `ENABLE_CC_COMPATIBLE_PROVIDER`                 | boolesk | `false`  | ✓        | Aktivér Claude Code-kompatibel udbydertilstand.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |

### Politikker (5)

| Nøgle                           | Type    | Standard   | Beskrivelse                                                                                                                                                                                                                                           |
| ------------------------------- | ------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `TOOL_POLICY_MODE`              | enum    | `disabled` | Håndhævelsestilstand for politikken for brug af værktøjer. Værdier: `disabled`, `warn`, `block`.                                                                                                                                                      |
| `RATE_LIMIT_AUTO_ENABLE`        | boolean | `false`    | Aktivér automatisk hastighedsbegrænsning baseret på brugsmønstre.                                                                                                                                                                                     |
| `DISABLE_CONTEXT_WINDOW_CHECKS` | boolean | `false`    | Spring OmniRoutes lokale kontrol af kontekstvindue/maksimalt antal inputtokens over for direkte anmodninger til en enkelt model. Opstrømsgrænser gælder stadig.                                                                                       |
| `CAPABILITY_FILTER_ENABLED`     | boolean | `false`    | Afvis anmodninger før videresendelse, når målmodellen mangler påkrævede funktioner (vision, værktøjer, struktureret output, kontekstvindue). Beskytter direkte anmodninger til en enkelt udbyder, som omgår kombinationslagets kompatibilitetsfilter. |
| `RADAR_ENABLED`                 | boolean | `false`    | Aktivér OmniRoute Radar-modulet (skærmbilleder med katalogfeed og synkronisering). Deaktiveret som standard; aktivering låser kun brugergrænsefladen op — datasynkronisering kræver stadig særskilt tilvalg.                                          |

### Kørselstid (32)

| Nøgle                                       | Type    | Standardværdi | Genstart | Beskrivelse                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ------------------------------------------- | ------- | ------------- | -------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `UNIVERSAL_CONTEXT_HANDOFF_ENABLED`         | boolean | `true`        |          | Generér og indsæt samtaleresuméer, når kombinationsrouting skifter model. Deaktivér for at behandle modelskift uafhængigt og forhindre baggrundsanmodninger om overdragelse for alle eksisterende og fremtidige kombinationer.                                                                                                                                                                                                                                                                                                                                               |
| `RESPONSES_PASSTHROUGH_DROP_COMMENTARY`     | boolean | `true`        |          | Fjern interne outputelementer fra kommentarfasen i passthrough-streams fra Responses API, før de videresendes til klienter. Deaktivér for at modtage rå kommentarer fra upstream.                                                                                                                                                                                                                                                                                                                                                                                            |
| `OMNIROUTE_MCP_ENFORCE_SCOPES`              | boolean | `true`        |          | Håndhæv omfangsbegrænsninger for adgang til MCP-værktøjer.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `OMNIROUTE_MCP_COMPRESS_DESCRIPTIONS`       | boolean | `false`       |          | Komprimer beskrivelser af MCP-værktøjer for at reducere tokenforbruget.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `OMNIROUTE_ENABLE_RUNTIME_BACKGROUND_TASKS` | boolean | `false`       |          | Aktivér behandling af baggrundsopgaver under kørsel.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `OMNIROUTE_DISABLE_BACKGROUND_SERVICES`     | boolean | `false`       | ✓        | Deaktivér alle baggrundstjenester (opdatering af kvoter, synkronisering osv.).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `OMNIROUTE_RTK_TRUST_PROJECT_FILTERS`       | boolean | `false`       |          | Hav tillid til RTK-filtre på projektniveau uden validering.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `OMNIROUTE_ENABLE_LIVE_WS`                  | boolean | `true`        | ✓        | Start WebSocket-serveren til realtidsdashboardet ved import (port 20132 som standard).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `OMNIROUTE_CODEX_WS_ENABLED`                | boolean | `true`        |          | Tillad Codex at bruge Responses-over-WebSocket-transporten. Når den er slået fra, falder Codex tilbage til HTTP Responses.                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `OMNIROUTE_CODEX_APP_SERVER_ENABLED`        | boolean | `true`        |          | Tillad Codex at bruge den lokale app-server WebSocket JSON-RPC-transport (codexTransport=app-server). Når den er slået fra, falder forbindelser, der har tilvalgt app-server, tilbage til Codex' øvrige transporter.                                                                                                                                                                                                                                                                                                                                                         |
| `OMNIROUTE_EMERGENCY_FALLBACK`              | boolean | `true`        |          | Route anmodninger med opbrugt budget til nødudbyderen/-modellen med gratis fallback. (Se [Fallback ved nødbudget](#emergency-budget-fallback) nedenfor.)                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `STREAM_RECOVERY_ENABLED`                   | boolean | `false`       |          | Aktivér transparent tidlig gentagelse for afkortede upstream-SSE-streams, før nogen svarbytes når klienten.                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `STREAM_RECOVERY_MIDSTREAM_ENABLED`         | boolean | `false`       |          | Tillad streamgenoprettelse at genanmode om og sammenføje et svar, efter at bytes allerede er nået frem til klienten.                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `STREAM_RECOVERY_TOOLCALL_ORDER_FIX`        | boolean | `false`       |          | Gør fortsættelse midt i en stream sikker for værktøjskald: Genoptag aldrig en afbrudt stream, når et værktøjskald er blevet udsendt (igangværende eller allerede afsluttet med finish_reason tool_calls), og luk efter én tom fortsættelse i stedet for at bruge hele budgettet. Slået fra: udgivelsesadfærd.                                                                                                                                                                                                                                                                |
| `STREAM_EARLY_EOF_SIBLING_FAILOVER_ENABLED` | boolean | `false`       |          | Skift én gang til en søskendeforbindelse, når en SSE-stream lukkes, før den har udsendt en brugbar frame, og den begrænsede gentagelse på samme forbindelse er opbrugt. Hvis der ikke findes en brugbar søskendeforbindelse, returneres den oprindelige `STREAM_EARLY_EOF` 502. Slået fra som standard: Tidlig EOF forbliver terminal efter gentagelsen på samme forbindelse.                                                                                                                                                                                                |
| `MODEL_CATALOG_INCLUDE_NAMES`               | boolean | `true`        |          | Inkludér visningsvenlige navnefelter i svar fra `/v1/models`. Deaktivér for klienter, der kun forventer model-id'er.                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `MODELS_CATALOG_PREFIX_MODE`                | enum    | `dual`        |          | Styrer, hvordan model-id'er får præfiks i /v1/models. 'dual' (standard) udsender både aliaspræfikser og kanoniske udbyder-id-præfikser af hensyn til bagudkompatibilitet. 'alias' udsender kun det korte aliaspræfiks (f.eks. ds-web/model, ikke deepseek-web/model). 'canonical' udsender kun det fulde udbyder-id-præfiks. Værdier: `dual`, `alias`, `canonical`.                                                                                                                                                                                                          |
| `ARENA_ELO_SYNC_ENABLED`                    | boolean | `true`        |          | Aktivér periodisk ELO-synkronisering af Arena AI-ranglisten til rangering af modelintelligens.                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `EXPOSE_CC_DISCOVERY_ALIASES`               | boolean | `false`       |          | Annoncér spejl-id'erne `claude/<provider>/<model>` på `/v1/models`, så Claude Code-gatewayens modelregistrering viser ikke-Claude-modeller. Det globale niveau i styringen med tre niveauer (miljøvariablen har forrang over dashboardtilsidesættelsen). Se [Konfiguration af Claude Code](../guides/CLAUDE-CODE-CONFIGURATION.md#discovery-aliases--surface-non-claude-models-in-the-model-picker).                                                                                                                                                                         |
| `NO_THINKING_ALIAS_ENABLED`                 | boolean | `true`        |          | Hovedafbryder for gatewayaliaserne no-think/<provider>/<model>. Slået til (standard): /v1/models annoncerer en variant uden tænkning for alle kvalificerede Claude-modeller med tænkefunktion, og et no-think/-id sendt i en anmodning fortolkes som den rigtige model med ræsonnering undertrykt. Slået fra: Ingen varianter annonceres, og et no-think/-id behandles som ethvert andet ukendt model-id. Til-/fravalget ModelSpec.noThinkingAlias for hver model gælder stadig, mens dette er slået til.                                                                    |
| `OMNIROUTE_DISABLE_THINKING_LEVEL_VARIANTS` | boolean | `false`       |          | Deaktivér genereringen af varianter med forskellige tænkeniveauer (f.eks. -low, -medium, -high) i /v1/models-kataloget.                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `OMNIROUTE_CHAT_VIRTUAL_LANES`              | boolean | `false`       | ✓        | Aktivér adaptive virtuelle adgangsbaner pr. tenant til udbyder-dispatch (#9654): Én tenants belastningsspids medfører ikke længere 503-fejl for en anden. Miljøvariablen OMNIROUTE_CHAT_VIRTUAL_LANES har forrang over denne dashboardtilsidesættelse. Ændringer træder i kraft ved genstart af serveren.                                                                                                                                                                                                                                                                    |
| `EXPOSE_FUNCTIONAL_GATEWAY_MIRRORS`         | boolean | `false`       |          | Annoncér spejl-id'erne <gateway-alias>/<model> på /v1/models for modeller, hvis kanoniske ejer ikke har aktive legitimationsoplysninger, men som routes af en passthrough-gateway med aktive legitimationsoplysninger. Advarsel: Tilføjer katalogposter for alle klienter, når funktionen aktiveres globalt.                                                                                                                                                                                                                                                                 |
| `NEWAPI_AGGREGATOR_BALANCE`                 | boolean | `false`       |          | Aktivér saldoregistrering for New-API / One-API / Sub2API-aggregatorkompatible noder. Når dette er aktiveret, rapporterer kompatible noder med aggregatorflaget angivet deres saldo i dashboardet og ved kvoteprækontrol af routing.                                                                                                                                                                                                                                                                                                                                         |
| `SERVER_OWNED_TOOL_LOOP_ENABLED`            | boolean | `false`       |          | Fortsæt ikke-streamende, serverejede værktøjskald, indtil modellen returnerer et svar, som klienten kan bruge.                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `SEARCH_STATS_HIDE_DELETED_CONNECTIONS`     | boolean | `false`       |          | Søgestatistik og seneste søgninger tæller kun udbydere, der stadig har en aktiv forbindelse (udbydere uden nøgle såsom duckduckgo-free tæller altid). Når funktionen er slået fra, beholdes alle gemte søgerækker med et udbyder-id.                                                                                                                                                                                                                                                                                                                                         |
| `FREE_BADGE_REQUIRES_PROVIDER_FREE_TIER`    | boolean | `false`       |          | Dashboardets udbydersider: Vis kun mærket Gratis ved signaler, som udbyderen respekterer — ignorer heuristikken for visningsnavne, ikke-booleske gratisfelter og :free-suffikser hos registrerede udbydere uden et dokumenteret gratis niveau. Når funktionen er slået fra, bevares den historiske regel for mærket.                                                                                                                                                                                                                                                         |
| `RETRY_AFTER_PROVENANCE_ENABLED`            | boolean | `false`       |          | Ved aggregerede utilgængelighedssvar med 429/503 skal `Retry-After` udelades, når der ikke kendes et konkret fremtidigt tidspunkt for et nyt forsøg (i stedet for et syntetisk 1s), `error.retry_after_provenance` (`signal` \| `none`) skal tilføjes, og kombinationens dræningsstier skal kunne læse tekstbaserede hints om nye forsøg fra JSON- og klartekst-upstream-svartekster. Feltet vises kun i svar oprettet af `unavailableResponse()`; andre 429/503-svartekster er uændrede.                                                                                    |
| `PROTECTED_PRIORITY_INFRA_502_ENABLED`      | boolean | `false`       |          | Når et `priority`-kombinationsmål, der er markeret til kun at falde tilbage ved opbrugt kvote, stopper kombinationen af en årsag, som beviseligt ikke er kvoterelateret (udbyderens effektafbryder er åben, prædiktiv forsinkelsesudeladelse), skal der svares med 502 i stedet for den kvotelignende 503. Stop som følge af spærring, nedkøling, utilgængelighed, opbrugte ressourcer og samtidighedsgrænser beholder 503.                                                                                                                                                  |
| `MISTRAL_AMBIGUOUS_401_SOFT_LOCKOUT`        | boolean | `false`       |          | Et rent Mistral 401-svar (`{"detail":"Unauthorized"}`, uden et eksplicit godkendelsessignal) er identisk for en tilbagekaldt nøgle og for en opbrugt kvote. Når funktionen er slået til, nedkøles forbindelsen i stedet for at blive parkeret som `expired`, højst 3 gange i timen pr. forbindelse. Den næste hændelse parkerer den, så en tilbagekaldt nøgle stadig konvergerer. Slået fra som standard: Hvert rent Mistral 401-svar parkerer forbindelsen som før.                                                                                                         |
| `XAI_OAUTH_LIVE_MODEL_DISCOVERY`            | boolean | `false`       |          | Hent det aktive xAI-modelkatalog for `xai-oauth`-forbindelser fra `https://api.x.ai/v1/models` ved hjælp af OAuth-bearer-tokenet i stedet for den fastlåste statiske startliste. Slået fra som standard: `xai-oauth` fortsætter med at levere den statiske startliste uændret. Ved enhver fortolkningsfejl falder registreringen tilbage til startlisten (det er ikke verificeret, om x.ai accepterer en OAuth-bearer på dette endpoint).                                                                                                                                    |
| `BATCH_AND_FILE_AUTO_CLEANUP_ENABLED`       | boolean | `false`       |          | Lad den automatiske oprydning slette afsluttede (completed/failed/cancelled/expired) Batch API-job, der er ældre end `OMNIROUTE_BATCH_RETENTION_DAYS`, sammen med deres kontrolpunkter pr. linje, og ryd BLOB-indholdet i uploadede filer efter deres egen `expires_at`. Slået fra som standard: Alle eksisterende installationer beholder disse data præcis som før, indtil en operatør tilvælger funktionen. Den operatørudløste rute `DELETE /api/v1/batches/delete-completed` påvirkes ikke i nogen af tilfældene — den er en separat, ubetinget offentlig API-kontrakt. |

### CLI (5)

| Nøgle                                 | Type    | Standardværdi | Genstart | Beskrivelse                                                                                                                                                                                                                                |
| ------------------------------------- | ------- | ------------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `CLI_COMPAT_ALL`                      | boolean | `false`       | ✓        | Aktivér kompatibilitetstilstand for alle CLI-klienter.                                                                                                                                                                                     |
| `MODEL_ALIAS_COMPAT_ENABLED`          | boolean | `false`       |          | Aktivér kompatibilitetslaget for modelaliasser.                                                                                                                                                                                            |
| `PRICING_SYNC_ENABLED`                | boolean | `false`       |          | Aktivér automatisk synkronisering af prisdata (kræver også miljøvariablen `PRICING_SYNC_ENABLED`).                                                                                                                                         |
| `OMNIROUTE_AUTO_SYNC_CODEX_PROFILES`  | boolean | `false`       |          | Efter synkronisering af en udbydermodel skal ~/.codex/*.config.toml-profilfiler automatisk (gen)skrives ud fra livekataloget. Den aktive Codex-standardkonfiguration ændres aldrig. Deaktiveret som standard.                              |
| `OMNIROUTE_AUTO_SYNC_CLAUDE_PROFILES` | boolean | `false`       |          | Efter synkronisering af en udbydermodel skal Claude Code-profilerne ~/.claude/profiles/<name>/settings.json automatisk (gen)skrives ud fra livekataloget. Den aktive Claude-standardkonfiguration ændres aldrig. Deaktiveret som standard. |

### Tilstand (5)

| Nøgle                                     | Type    | Standardværdi | Beskrivelse                                                                                                                                                                                                                                                                                                                    |
| ----------------------------------------- | ------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `OMNIROUTE_DISABLE_LOCAL_HEALTHCHECK`     | boolean | `false`       | Deaktivér tilstandskontrolslutpunktet for den lokale instans.                                                                                                                                                                                                                                                                  |
| `OMNIROUTE_DISABLE_TOKEN_HEALTHCHECK`     | boolean | `false`       | Deaktivér tilstandskontrollen for tokenvalidering.                                                                                                                                                                                                                                                                             |
| `SKILLS_SANDBOX_NETWORK_ENABLED`          | boolean | `false`       | Aktivér netværksadgang i færdighedssandkassemiljøet.                                                                                                                                                                                                                                                                           |
| `PROXY_HEALTH_BLOCKED_RESETS_STREAK`      | boolean | `false`       | Under proxytilstandskontrollen nulstiller en forespørgsel, som målet afviste (401/403/429), proxyens række af på hinanden følgende fejl. Deaktiveret som standard: En afvisning forbliver neutral (#10654). En 5xx forbliver uafklaret i begge tilfælde; en afvisning fjerner, deaktiverer eller genaktiverer aldrig en proxy. |
| `DB_HEALTHCHECK_STARTUP_DEFERRED_ENABLED` | boolean | `false`       | Kør integritets-/tilstandskontrollen af databasen ved opstart, efter at serveren er begyndt at acceptere anmodninger (via `setImmediate`), i stedet for at blokere opstarten, indtil den er fuldført (#13717). Deaktiveret som standard: Opstarten blokeres præcis som før denne PR.                                           |

> [!NOTE]
> `INPUT_SANITIZER_BLOCK_THRESHOLD` og dets ældre alias
> `INJECTION_GUARD_BLOCK_THRESHOLD` justerer tilstanden `block` for
> `INJECTION_GUARD_MODE`, men de er almindelige miljøvariabler, der læses af
> [`src/shared/utils/injectionSeverity.ts`](../../src/shared/utils/injectionSeverity.ts),
> og ikke funktionsflag: De kan ikke tilsidesættes via databasen og har ingen kontakt i kontrolpanelet. Se
> [`ENVIRONMENT.md`](./ENVIRONMENT.md#4-security--authentication).

> [!NOTE]
> Kolonnen `Genstart` markerer flag med `requiresRestart: true` — værdien
> gemmes øjeblikkeligt, men træder først i kraft, efter at processen er genindlæst. Enum-
> flag afviser enhver værdi uden for deres tilladte mængde (valideret på serversiden i
> både `setFeatureFlagOverride()` og REST-`PUT`-handleren).

---

## Skift af flag

### Dashboard

Gå til **Dashboard → Indstillinger → Funktionsflag**
(`/dashboard/settings/feature-flags`). Gitteret
(`src/app/(dashboard)/dashboard/settings/components/FeatureFlagsGrid.tsx`)
understøtter:

- **Søgning** efter nøgle eller beskrivelse og **filtrering** efter kategori (samt en syntetisk
  visning for **Kræver genstart**).
- En **til/fra-knap** til booleske flag og en **rullemenu** til enum-flag
  (`src/app/(dashboard)/dashboard/settings/components/FeatureFlagCard.tsx`).
- Et **kildemærke** for hvert flag — `DB`, `ENV` eller `DEF` — som viser, hvor den
  effektive værdi stammer fra.
- En **Nulstil**-knap (vises kun for flag med `DB` som kilde), der fjerner tilsidesættelsen,
  og en **Nulstil alle tilsidesættelser**-knap nederst.
- Et **Genstart server**-banner, når et flag med `requiresRestart` ændres.

### REST-API

Alle handlinger går gennem en enkelt rute:
[`src/app/api/settings/feature-flags/route.ts`](../../src/app/api/settings/feature-flags/route.ts).
Hver metode kræver en godkendt dashboardsession (ellers `401`).

#### `GET /api/settings/feature-flags`

Returnerer hvert flag med dets effektive værdi, kilde og en oversigt.

```jsonc
{
  "flags": [
    {
      "key": "REQUIRE_API_KEY",
      "label": "Require API Key",
      "description": "Require an API key for all incoming requests",
      "category": "security",
      "type": "boolean",
      "enumValues": null,
      "defaultValue": "false",
      "effectiveValue": "false",
      "source": "default", // "db" | "env" | "default"
      "requiresRestart": false,
      "warningLevel": "caution",
    },
    // ... alle 72 flag
  ],
  "summary": {
    "total": 56,
    "active": 0,
    "inactive": 0,
    "overriddenByDb": 0,
    "overriddenByEnv": 0,
  },
}
```

#### `PUT /api/settings/feature-flags`

Angiv eller fjern en enkelt tilsidesættelse. Brødtekst: `{ key: string; value?: string }`.
Hvis `value` udelades, fjernes tilsidesættelsen (og env/standardværdien gendannes).

```bash
# Angiv en DB-tilsidesættelse
curl -X PUT http://localhost:20128/api/settings/feature-flags \
  -H "Content-Type: application/json" \
  -d '{"key":"REQUIRE_API_KEY","value":"true"}'

# Fjern tilsidesættelsen (ingen "value")
curl -X PUT http://localhost:20128/api/settings/feature-flags \
  -H "Content-Type: application/json" \
  -d '{"key":"REQUIRE_API_KEY"}'
```

Svaret returnerer den nye `effectiveValue`/`source`, den tidligere `previousValue`/
`previousSource` samt `requiresRestart`. Ukendte nøgler og enum-værdier uden for det tilladte
interval afvises med `400`.

#### `DELETE /api/settings/feature-flags`

Rydder **alle** DB-tilsidesættelser på én gang og gendanner hvert flag til dets env-/standardværdi.
Returnerer `{ cleared: <count>, message: "..." }`.

> [!NOTE]
> Flag med `requiresRestart: true` træder først i kraft efter en genindlæsning af processen.
> Dashboardets genstartsforløb kalder `POST /api/restart` og forespørger derefter gentagne gange
> på `GET /api/health/ping`, indtil serveren er oppe igen.

---

## Nødreserve ved budgetoverskridelse

`OMNIROUTE_EMERGENCY_FALLBACK` (kategori `runtime`, standardværdi `true`) styrer
nødreserveforløbet med gratis fallback i
[`open-sse/services/emergencyFallback.ts`](../../open-sse/services/emergencyFallback.ts).
Når det er aktiveret, dirigeres anmodninger, der har opbrugt deres budget, til en gratis
fallback-udbyder/-model i stedet for straks at mislykkes. Indstil det til `false` (eller `0`) — via
til/fra-knappen i dashboardet, en DB-tilsidesættelse eller miljøvariablen
`OMNIROUTE_EMERGENCY_FALLBACK` — for at deaktivere adfærden og lade anmodninger med
opbrugt budget mislykkes. (Gjort tilgængelig som en til/fra-knap i dashboardet i PR'er #3741 / #3752.)

---

## Se også

- [Reference til miljøvariabler](./ENVIRONMENT.md) — de fleste flag har en
  miljøvariabel med samme navn, som er dokumenteret dér (DB-tilsidesættelsen
  har forrang for den).
- [`src/shared/constants/featureFlagDefinitions.ts`](../../src/shared/constants/featureFlagDefinitions.ts)
  — den autoritative kilde for alle flag.
- [`src/shared/utils/featureFlags.ts`](../../src/shared/utils/featureFlags.ts)
  — evalueringslogik (`resolveFeatureFlag`, `isFeatureFlagEnabled`,
  `resolveAllFeatureFlags`).
- [`src/lib/db/featureFlags.ts`](../../src/lib/db/featureFlags.ts) — lagring af
  DB-tilsidesættelser i navneområdet `feature_flags` i tabellen `key_value`.
