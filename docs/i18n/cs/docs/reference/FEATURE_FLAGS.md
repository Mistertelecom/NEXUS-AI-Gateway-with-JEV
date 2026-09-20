# Feature Flags (Čeština)

🌐 **Languages:** 🇺🇸 [English](../../../../reference/FEATURE_FLAGS.md) · 🇪🇹 [am](../../../am/docs/reference/FEATURE_FLAGS.md) · 🇸🇦 [ar](../../../ar/docs/reference/FEATURE_FLAGS.md) · 🇦🇿 [az](../../../az/docs/reference/FEATURE_FLAGS.md) · 🇧🇬 [bg](../../../bg/docs/reference/FEATURE_FLAGS.md) · 🇧🇩 [bn](../../../bn/docs/reference/FEATURE_FLAGS.md) · 🇩🇰 [da](../../../da/docs/reference/FEATURE_FLAGS.md) · 🇩🇪 [de](../../../de/docs/reference/FEATURE_FLAGS.md) · 🇬🇷 [el](../../../el/docs/reference/FEATURE_FLAGS.md) · 🇪🇸 [es](../../../es/docs/reference/FEATURE_FLAGS.md) · 🇪🇪 [et](../../../et/docs/reference/FEATURE_FLAGS.md) · 🇮🇷 [fa](../../../fa/docs/reference/FEATURE_FLAGS.md) · 🇫🇮 [fi](../../../fi/docs/reference/FEATURE_FLAGS.md) · 🇫🇷 [fr](../../../fr/docs/reference/FEATURE_FLAGS.md) · 🇮🇪 [ga](../../../ga/docs/reference/FEATURE_FLAGS.md) · 🇮🇳 [gu](../../../gu/docs/reference/FEATURE_FLAGS.md) · 🇳🇬 [ha](../../../ha/docs/reference/FEATURE_FLAGS.md) · 🇮🇱 [he](../../../he/docs/reference/FEATURE_FLAGS.md) · 🇮🇳 [hi](../../../hi/docs/reference/FEATURE_FLAGS.md) · 🇭🇷 [hr](../../../hr/docs/reference/FEATURE_FLAGS.md) · 🇭🇺 [hu](../../../hu/docs/reference/FEATURE_FLAGS.md) · 🇦🇲 [hy](../../../hy/docs/reference/FEATURE_FLAGS.md) · 🇮🇩 [id](../../../id/docs/reference/FEATURE_FLAGS.md) · 🇳🇬 [ig](../../../ig/docs/reference/FEATURE_FLAGS.md) · 🇮🇹 [it](../../../it/docs/reference/FEATURE_FLAGS.md) · 🇯🇵 [ja](../../../ja/docs/reference/FEATURE_FLAGS.md) · 🇬🇪 [ka](../../../ka/docs/reference/FEATURE_FLAGS.md) · 🇰🇭 [km](../../../km/docs/reference/FEATURE_FLAGS.md) · 🇮🇳 [kn](../../../kn/docs/reference/FEATURE_FLAGS.md) · 🇰🇷 [ko](../../../ko/docs/reference/FEATURE_FLAGS.md) · 🇱🇹 [lt](../../../lt/docs/reference/FEATURE_FLAGS.md) · 🇱🇻 [lv](../../../lv/docs/reference/FEATURE_FLAGS.md) · 🇮🇳 [ml](../../../ml/docs/reference/FEATURE_FLAGS.md) · 🇮🇳 [mr](../../../mr/docs/reference/FEATURE_FLAGS.md) · 🇲🇾 [ms](../../../ms/docs/reference/FEATURE_FLAGS.md) · 🇲🇹 [mt](../../../mt/docs/reference/FEATURE_FLAGS.md) · 🇲🇲 [my](../../../my/docs/reference/FEATURE_FLAGS.md) · 🇳🇵 [ne](../../../ne/docs/reference/FEATURE_FLAGS.md) · 🇳🇱 [nl](../../../nl/docs/reference/FEATURE_FLAGS.md) · 🇳🇴 [no](../../../no/docs/reference/FEATURE_FLAGS.md) · 🇮🇳 [or](../../../or/docs/reference/FEATURE_FLAGS.md) · 🇮🇳 [pa](../../../pa/docs/reference/FEATURE_FLAGS.md) · 🇵🇭 [phi](../../../phi/docs/reference/FEATURE_FLAGS.md) · 🇵🇱 [pl](../../../pl/docs/reference/FEATURE_FLAGS.md) · 🇵🇹 [pt](../../../pt/docs/reference/FEATURE_FLAGS.md) · 🇧🇷 [pt-BR](../../../pt-BR/docs/reference/FEATURE_FLAGS.md) · 🇷🇴 [ro](../../../ro/docs/reference/FEATURE_FLAGS.md) · 🇷🇺 [ru](../../../ru/docs/reference/FEATURE_FLAGS.md) · 🇱🇰 [si](../../../si/docs/reference/FEATURE_FLAGS.md) · 🇸🇰 [sk](../../../sk/docs/reference/FEATURE_FLAGS.md) · 🇸🇮 [sl](../../../sl/docs/reference/FEATURE_FLAGS.md) · 🇷🇸 [sr](../../../sr/docs/reference/FEATURE_FLAGS.md) · 🇸🇪 [sv](../../../sv/docs/reference/FEATURE_FLAGS.md) · 🇰🇪 [sw](../../../sw/docs/reference/FEATURE_FLAGS.md) · 🇮🇳 [ta](../../../ta/docs/reference/FEATURE_FLAGS.md) · 🇮🇳 [te](../../../te/docs/reference/FEATURE_FLAGS.md) · 🇹🇭 [th](../../../th/docs/reference/FEATURE_FLAGS.md) · 🇹🇷 [tr](../../../tr/docs/reference/FEATURE_FLAGS.md) · 🇺🇦 [uk-UA](../../../uk-UA/docs/reference/FEATURE_FLAGS.md) · 🇵🇰 [ur](../../../ur/docs/reference/FEATURE_FLAGS.md) · 🇺🇿 [uz](../../../uz/docs/reference/FEATURE_FLAGS.md) · 🇻🇳 [vi](../../../vi/docs/reference/FEATURE_FLAGS.md) · 🇳🇬 [yo](../../../yo/docs/reference/FEATURE_FLAGS.md) · 🇨🇳 [zh-CN](../../../zh-CN/docs/reference/FEATURE_FLAGS.md) · 🇹🇼 [zh-TW](../../../zh-TW/docs/reference/FEATURE_FLAGS.md)

---

> Přepínače za běhu, které mění chování OmniRoute **bez opětovného nasazení**.
> Každý zde uvedený příznak je definován v
> [`src/shared/constants/featureFlagDefinitions.ts`](../../src/shared/constants/featureFlagDefinitions.ts)
> — jediném zdroji pravdy. Řídicí panel i REST API čtou z
> tohoto souboru, takže níže uvedená tabulka je vygenerována tak, aby mu odpovídala 1:1.

---

## Co jsou příznaky funkcí

Příznak funkce je pojmenovaný přepínač (boolean nebo enum), jehož hodnotu lze změnit za
běhu a uložit do databáze, aniž by bylo nutné proces znovu nasadit. Každý
příznak je popsán pomocí `FeatureFlagDefinition` s položkami `key`, `label`,
`description`, `category`, `defaultValue`, `type` a nápovědou `requiresRestart`.

### Pořadí vyhodnocování

**Efektivní hodnota** příznaku je určena pomocí
[`resolveFeatureFlag()`](../../src/shared/utils/featureFlags.ts) s následující
prioritou (vyšší má přednost):

1. **Přepsání z DB** — hodnota uložená v tabulce `key_value` v rámci
   jmenného prostoru `feature_flags` (nastavená prostřednictvím řídicího panelu nebo REST API).
2. **Proměnná prostředí** — `process.env[<KEY>]`, pokud je nastavena a není prázdná.
3. **Výchozí hodnota definice** — `defaultValue` z `featureFlagDefinitions.ts`.

Příznak typu boolean se považuje za **povolený**, pokud je jeho efektivní hodnota `"true"`,
`"1"` nebo `"yes"` (viz `isFeatureFlagEnabled()`).

> [!NOTE]
> Většina příznaků má také odpovídající proměnnou prostředí se **stejným názvem**,
> zdokumentovanou v souboru [`ENVIRONMENT.md`](./ENVIRONMENT.md). Přepsání příznaku z DB
> má před touto proměnnou prostředí přednost. Příznak s
> `requiresRestart: true` se uloží okamžitě, ale znovu se načte až při spuštění
> procesu — jeho přepnutí zobrazí na řídicím panelu banner **„Restartovat server“**.

---

## Katalog příznaků

72 příznaků v 6 kategoriích. **Výchozí hodnota** je výchozí hodnota definice — hodnota
použitá, pokud není přítomno přepsání z DB ani proměnná prostředí.

### Zabezpečení (10)

| Klíč                                    | Typ     | Výchozí hodnota | Popis                                                                                                                                                                                                                                                                                                         |
| --------------------------------------- | ------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `REQUIRE_API_KEY`                       | boolean | `false`         | Vyžadovat klíč API pro všechny příchozí požadavky.                                                                                                                                                                                                                                                            |
| `INPUT_SANITIZER_ENABLED`               | boolean | `true`          | Povolit sanitizaci vstupu pro všechny požadavky.                                                                                                                                                                                                                                                              |
| `INJECTION_GUARD_MODE`                  | enum    | `off`           | Režim ochrany před prompt injection. Hodnoty: `off`, `warn`, `block`, `redact`.                                                                                                                                                                                                                               |
| `PII_REDACTION_ENABLED`                 | boolean | `false`         | Redigovat osobní identifikační údaje v požadavcích (nezávisle na `INPUT_SANITIZER_MODE`).                                                                                                                                                                                                                     |
| `PII_RESPONSE_SANITIZATION`             | boolean | `false`         | Sanitizovat osobní identifikační údaje v odpovědích poskytovatelů.                                                                                                                                                                                                                                            |
| `PII_RESPONSE_SANITIZATION_MODE`        | enum    | `redact`        | Režim sanitizace osobních identifikačních údajů v odpovědích. Hodnoty: `redact`, `warn`, `block`, `off`.                                                                                                                                                                                                      |
| `OUTBOUND_SSRF_GUARD_ENABLED`           | boolean | `true`          | Blokovat odchozí požadavky na privátní/interní rozsahy IP adres.                                                                                                                                                                                                                                              |
| `ALLOW_API_KEY_REVEAL`                  | boolean | `false`         | Umožnit ověřeným uživatelům řídicího panelu zobrazit uložené klíče API namísto pouhého zobrazení maskovaných hodnot.                                                                                                                                                                                          |
| `AUTH_LOG_INCLUDE_ACCOUNT_ID`           | boolean | `false`         | Zahrnout prefix účtu do řádků protokolu AUTH (např. „Používá se účet poskytovatele <provider>: abc12345...“). Ve výchozím nastavení je zakázáno, aby byly identifikátory účtů redigovány ve sdílených/víceklientských protokolech procesu. Nezávisí na režimu ladění; jeho přepnutí tuto informaci nezobrazí. |
| `OMNIROUTE_OIDC_DISABLE_PASSWORD_LOGIN` | boolean | `false`         | Když je povoleno OIDC, zakázat přihlašování heslem, aby se uživatelé mohli ověřovat pouze prostřednictvím jednotného přihlašování OIDC. Když je zakázáno (výchozí nastavení), je k dispozici přihlašování heslem i OIDC.                                                                                      |

### Síť (15)

| Klíč                                            | Typ     | Výchozí | Restart | Popis                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| ----------------------------------------------- | ------- | ------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `ENABLE_TLS_FINGERPRINT`                        | boolean | `false` | ✓       | Povolit režim maskování otisku TLS.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `AUDIO_REMOTE_PROVIDER_NODES`                   | boolean | `false` |         | Povolit trasám /v1/audio/* používat uzly poskytovatelů kompatibilní s OpenAI, které jsou hostovány mimo localhost. Ve výchozím nastavení vypnuto — směrování zvuku na vzdáleného hostitele mění identitu výstupního připojení a musí být výslovným rozhodnutím provozovatele. Uzly zpětné smyčky jsou vždy povoleny a toto nastavení je neovlivňuje.                                                                                                                                                                                       |
| `PROXY_AUTO_SELECT_ENABLED`                     | boolean | `false` |         | Pokud připojení nemá přiřazenou proxy, automaticky vybrat první funkční proxy z registru. Ve výchozím nastavení vypnuto (jinak se libovolná proxy v registru stává globální záložní možností — #3332).                                                                                                                                                                                                                                                                                                                                     |
| `OMNIROUTE_CONTROL_PLANE_PROXY_DIRECT_FALLBACK` | boolean | `false` |         | Povolit tokům OAuth a ověřování poskytovatelů obejít pevně nastavenou proxy a připojit se přímo, pokud selžou předběžné kontroly dostupnosti proxy. Ve výchozím nastavení vypnuto, protože to může změnit výstupní IP adresu.                                                                                                                                                                                                                                                                                                              |
| `NETWORK_ROTATION_SHARED_EGRESS_GUARD`          | boolean | `true`  |         | Při síťové výjimce (vypršení časového limitu, odmítnutí/resetování připojení) u vykonavatele rotace více účtů, pokud účet, u něhož došlo k selhání, nemá vyhrazenou proxy, použít krátkou dobu čekání a po zbytek požadavku přeskočit ostatní účty bez proxy namísto opakování pokusu pro každý z nich. Ve výchozím nastavení zapnuto (bezpečné: nedochází ke změně výstupní IP adresy, pouze se snižuje riziko latence/doby čekání u účtů se sdíleným výstupem). Vypnutím obnovíte okamžité propagování při první výjimce účtu bez proxy. |
| `PROXY_SKIP_RECENTLY_FAILED`                    | boolean | `false` |         | Fondy proxy a rotace opencode pro jednotlivé účty přestanou znovu nabízet proxy, která právě selhala (odmítnutý test TCP nebo odpověď 429 přijatá přes tuto proxy), na dobu v rámci procesu, která se při každém opakování zdvojnásobí až do stanoveného maxima. Stav proxy se nezapisuje; pokud jsou všichni kandidáti odloženi stranou, výběr se nezmění. Ve výchozím nastavení vypnuto.                                                                                                                                                 |
| `PROXY_POOL_EGRESS_OBSERVATION`                 | boolean | `false` |         | Zobrazit na řídicím panelu u fondu proxy, kolik pozorovaných výstupních IP adres obsluhovalo jeho členy za posledních 24 h a kolik připojení je použilo. Pouze pro čtení, vypočítáváno z protokolu proxy a nikdy nepoužíváno pro směrování. Ve výchozím nastavení vypnuto.                                                                                                                                                                                                                                                                 |
| `OPENCODE_RESPONSES_STALL_ROTATION`             | boolean | `false` |         | U vykonavatele OpenCode sledovat první bajt těla streamované odpovědi Responses (interval: `RESPONSES_FIRST_BYTE_TIMEOUT_MS`, výchozí hodnota `15000`). Stream Responses se stavem 2xx, který zůstane po uplynutí tohoto intervalu bez dat, je považován za zaseknutý: účet přejde do doby čekání a požadavek se jednou přesměruje na další účet; druhé zaseknutí okamžitě selže. Ve výchozím nastavení vypnuto: zaseknuté streamy nadále čekají jako dnes až do vypršení časového limitu připravenosti streamu.                           |
| `OPENCODE_USER_BLOCKED_ROTATION`                | boolean | `false` |         | Vykonavatel OpenCode: při odpovědi 403/451 obsahující odmítnutí `user_blocked` (nikoli kvůli zeměpisné poloze ani odmítnutí otisku Cloudflare) přepnout odmítnutý účet do doby čekání a nejvýše jednou za požadavek přejít na další účet; druhé odmítnutí se vrátí beze změny, bez označení úspěchu. Ve výchozím nastavení vypnuto: obcházení blokace uživatele na straně upstreamu směrováním může působit jako pokus o obcházení a rozšířit příznak napříč celou flotilou.                                                               |
| `OPENCODE_TRANSIENT_FAILOVER_BACKOFF`           | boolean | `false` |         | Rotace OpenCode: po dvou po sobě jdoucích přechodných selháních upstreamu (5xx nebo prázdná odpověď 400) pozastavit přechod na další účet — 1,5 s s dvojnásobným prodloužením při každém dalším selhání, maximálně 6 s na jedno pozastavení a 10 s na požadavek; při odpojení klienta se pozastavení přeskočí. Tělo neúspěšné odpovědi se před čekáním uvolní. Ve výchozím nastavení vypnuto: převzetí služeb při selhání zůstává okamžité.                                                                                                |
| `OPENCODE_RATE_LIMITED_429_EARLY_STOP`          | boolean | `false` |         | Rotace OpenCode: zastavit vlnu účtů při první odpovědi 429 klasifikované jako skutečné omezení rychlosti (zpracovatelná hlavička `Retry-After` nebo tělo zmiňující limit rychlosti či využití) a vrátit tuto upstreamovou odpověď 429 beze změny. Neklasifikované odpovědi 429 pokračují v rotaci. Ve výchozím nastavení vypnuto: bezplatná úroveň je omezena podle výstupní IP adresy (#9611), takže každá odpověď 429 vyvolá rotaci a vyčerpaná vlna vrátí poslední upstreamovou odpověď 429.                                            |
| `MITM_DISABLE_TLS_VERIFY`                       | boolean | `false` | ✓       | Zakázat ověřování certifikátu TLS pro MITM proxy. **Nebezpečné.**                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `OMNIROUTE_ALLOW_PRIVATE_PROVIDER_URLS`         | boolean | `false` |         | Povolit adresy URL poskytovatelů odkazující na soukromé/interní sítě.                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `OMNIROUTE_ALLOW_LOCAL_PROVIDER_URLS`           | boolean | `true`  |         | Povolit přidávání/ověřování poskytovatelů na místních/soukromých adresách (127.0.0.1, localhost, LAN). Ve výchozím nastavení zapnuto (přednostně místní); vypnutím aktivujete striktní blokování všeho kromě veřejných adres. Cloudová metadata zůstávají blokována.                                                                                                                                                                                                                                                                       |
| `ENABLE_CC_COMPATIBLE_PROVIDER`                 | boolean | `false` | ✓       | Povolit režim poskytovatele kompatibilního s Claude Code.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |

### Zásady (5)

| Klíč                            | Typ     | Výchozí hodnota | Popis                                                                                                                                                                                                                                                      |
| ------------------------------- | ------- | --------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `TOOL_POLICY_MODE`              | výčet   | `disabled`      | Režim vynucování zásad používání nástrojů. Hodnoty: `disabled`, `warn`, `block`.                                                                                                                                                                           |
| `RATE_LIMIT_AUTO_ENABLE`        | boolean | `false`         | Automaticky povolí omezování četnosti požadavků na základě vzorců používání.                                                                                                                                                                               |
| `DISABLE_CONTEXT_WINDOW_CHECKS` | boolean | `false`         | Přeskočí místní kontrolu kontextového okna / maximálního počtu vstupních tokenů OmniRoute u přímých požadavků na jeden model. Omezení nadřazené služby zůstávají v platnosti.                                                                              |
| `CAPABILITY_FILTER_ENABLED`     | boolean | `false`         | Odmítne požadavky před odesláním, pokud cílový model postrádá požadované funkce (obrazový vstup, nástroje, strukturovaný výstup, kontextové okno). Chrání přímé požadavky na jednoho poskytovatele, které obcházejí filtr kompatibility kombinační vrstvy. |
| `RADAR_ENABLED`                 | boolean | `false`         | Povolí modul OmniRoute Radar (obrazovky kanálu katalogu a synchronizace). Ve výchozím nastavení je vypnutý; povolením se pouze zpřístupní uživatelské rozhraní — synchronizace dat nadále vyžaduje samostatnou aktivaci.                                   |

### Běhové prostředí (32)

| Klíč                                        | Typ     | Výchozí hodnota | Restart | Popis                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ------------------------------------------- | ------- | --------------- | ------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `UNIVERSAL_CONTEXT_HANDOFF_ENABLED`         | boolean | `true`          |         | Generuje a vkládá souhrny konverzací, když kombinované směrování přepíná mezi modely. Vypnutím se přepnutí modelů budou zpracovávat nezávisle a zabrání se požadavkům na předání kontextu na pozadí pro všechny existující i budoucí kombinace.                                                                                                                                                                                                                                                                                                                                             |
| `RESPONSES_PASSTHROUGH_DROP_COMMENTARY`     | boolean | `true`          |         | Před předáním klientům odstraní z průchozích streamů Responses API interní výstupní položky fáze komentáře. Vypnutím lze přijímat nezpracované komentáře od nadřazené služby.                                                                                                                                                                                                                                                                                                                                                                                                               |
| `OMNIROUTE_MCP_ENFORCE_SCOPES`              | boolean | `true`          |         | Vynucuje omezení rozsahů přístupu k nástrojům MCP.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `OMNIROUTE_MCP_COMPRESS_DESCRIPTIONS`       | boolean | `false`         |         | Komprimuje popisy nástrojů MCP za účelem snížení spotřeby tokenů.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `OMNIROUTE_ENABLE_RUNTIME_BACKGROUND_TASKS` | boolean | `false`         |         | Povoluje zpracování úloh na pozadí za běhu.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `OMNIROUTE_DISABLE_BACKGROUND_SERVICES`     | boolean | `false`         | ✓       | Zakazuje všechny služby na pozadí (obnovování kvót, synchronizaci atd.).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `OMNIROUTE_RTK_TRUST_PROJECT_FILTERS`       | boolean | `false`         |         | Důvěřuje filtrům RTK na úrovni projektu bez ověření.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `OMNIROUTE_ENABLE_LIVE_WS`                  | boolean | `true`          | ✓       | Při importu spustí WebSocket server řídicího panelu v reálném čase (ve výchozím nastavení na portu 20132).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `OMNIROUTE_CODEX_WS_ENABLED`                | boolean | `true`          |         | Umožňuje nástroji Codex používat přenos Responses-over-WebSocket. Je-li vypnuto, Codex použije HTTP Responses.                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `OMNIROUTE_CODEX_APP_SERVER_ENABLED`        | boolean | `true`          |         | Umožňuje nástroji Codex používat lokální přenos app-server WebSocket JSON-RPC (codexTransport=app-server). Je-li vypnuto, připojení nastavená na app-server použijí ostatní přenosy nástroje Codex.                                                                                                                                                                                                                                                                                                                                                                                         |
| `OMNIROUTE_EMERGENCY_FALLBACK`              | boolean | `true`          |         | Směruje požadavky s vyčerpaným rozpočtem k nouzovému bezplatnému záložnímu poskytovateli/modelu. (Viz níže [Nouzový záložní mechanismus při vyčerpání rozpočtu](#emergency-budget-fallback).)                                                                                                                                                                                                                                                                                                                                                                                               |
| `STREAM_RECOVERY_ENABLED`                   | boolean | `false`         |         | Povoluje transparentní včasné opakování požadavku u zkrácených nadřazených streamů SSE ještě předtím, než se ke klientovi dostanou jakékoli bajty odpovědi.                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `STREAM_RECOVERY_MIDSTREAM_ENABLED`         | boolean | `false`         |         | Umožňuje obnovení streamu prostřednictvím nového požadavku a spojení odpovědi poté, co se ke klientovi již dostaly bajty.                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `STREAM_RECOVERY_TOOLCALL_ORDER_FIX`        | boolean | `false`         |         | Zajišťuje bezpečnost volání nástrojů při pokračování uprostřed streamu: nikdy neobnoví přerušený stream poté, co bylo vysláno volání nástroje (probíhající nebo již dokončené s finish_reason tool_calls), a po jednom prázdném pokračování stream uzavře, místo aby vyčerpalo celý rozpočet. Vypnuto: chování vydané verze.                                                                                                                                                                                                                                                                |
| `STREAM_EARLY_EOF_SIBLING_FAILOVER_ENABLED` | boolean | `false`         |         | Po vyčerpání omezeného počtu opakování na stejném připojení jednou přepne na sesterské připojení, pokud se stream SSE uzavře před vysláním jakéhokoli užitečného rámce; není-li k dispozici použitelné sesterské připojení, vrátí se původní chyba `STREAM_EARLY_EOF` 502. Ve výchozím nastavení vypnuto: předčasný konec souboru zůstává po opakování na stejném připojení konečným stavem.                                                                                                                                                                                                |
| `MODEL_CATALOG_INCLUDE_NAMES`               | boolean | `true`          |         | Zahrnuje do odpovědí `/v1/models` pole s názvy vhodnými pro zobrazení. Vypněte pro klienty, kteří očekávají pouze ID modelů.                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `MODELS_CATALOG_PREFIX_MODE`                | enum    | `dual`          |         | Určuje způsob přidávání prefixů k ID modelů v /v1/models. 'dual' (výchozí) kvůli zpětné kompatibilitě vysílá prefix aliasu i kanonického ID poskytovatele. 'alias' vysílá pouze krátký prefix aliasu (např. ds-web/model, nikoli deepseek-web/model). 'canonical' vysílá pouze úplný prefix ID poskytovatele. Hodnoty: `dual`, `alias`, `canonical`.                                                                                                                                                                                                                                        |
| `ARENA_ELO_SYNC_ENABLED`                    | boolean | `true`          |         | Povoluje pravidelnou synchronizaci ELO žebříčku Arena AI pro hodnocení inteligence modelů.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `EXPOSE_CC_DISCOVERY_ALIASES`               | boolean | `false`         |         | Zveřejňuje zrcadlená ID `claude/<provider>/<model>` v `/v1/models`, aby vyhledávání modelů brány Claude Code uvádělo i jiné modely než Claude. Globální úroveň tříúrovňového přepínače (proměnná prostředí má přednost před nastavením v řídicím panelu). Viz [Konfigurace Claude Code](../guides/CLAUDE-CODE-CONFIGURATION.md#discovery-aliases--surface-non-claude-models-in-the-model-picker).                                                                                                                                                                                           |
| `NO_THINKING_ALIAS_ENABLED`                 | boolean | `true`          |         | Hlavní přepínač aliasů brány no-think/<provider>/<model>. Zapnuto (výchozí): /v1/models zveřejňuje variantu bez uvažování pro každý způsobilý model Claude podporující uvažování a ID no-think/ odeslané v požadavku se přeloží zpět na skutečný model s potlačeným uvažováním. Vypnuto: žádné varianty se nezveřejňují a ID no-think/ se zpracovává jako jakékoli jiné neznámé ID modelu. Dokud je tato možnost zapnutá, nadále platí přihlášení/odhlášení jednotlivých modelů pomocí ModelSpec.noThinkingAlias.                                                                           |
| `OMNIROUTE_DISABLE_THINKING_LEVEL_VARIANTS` | boolean | `false`         |         | Zakazuje generování variant úrovně uvažování (např. -low, -medium, -high) v katalogu /v1/models.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `OMNIROUTE_CHAT_VIRTUAL_LANES`              | boolean | `false`         | ✓       | Povoluje adaptivní virtuální fronty příjmu podle jednotlivých tenantů pro odesílání poskytovateli (#9654): nárazový provoz jednoho tenanta již nezpůsobí chybu 503 jinému. Proměnná prostředí OMNIROUTE_CHAT_VIRTUAL_LANES má přednost před tímto nastavením v řídicím panelu; změny se projeví po restartování serveru.                                                                                                                                                                                                                                                                    |
| `EXPOSE_FUNCTIONAL_GATEWAY_MIRRORS`         | boolean | `false`         |         | Zveřejňuje zrcadlená ID <gateway-alias>/<model> v /v1/models pro modely, jejichž kanonický vlastník nemá aktivní přihlašovací údaje, ale směruje je průchozí brána s aktivními přihlašovacími údaji. Varování: při globálním povolení přidá položky katalogu pro všechny klienty.                                                                                                                                                                                                                                                                                                           |
| `NEWAPI_AGGREGATOR_BALANCE`                 | boolean | `false`         |         | Povoluje zjišťování zůstatku pro uzly kompatibilní s agregátory New-API / One-API / Sub2API. Je-li povoleno, kompatibilní uzly s nastaveným příznakem agregátoru budou hlásit svůj zůstatek v řídicím panelu a při směrování s předběžnou kontrolou kvóty.                                                                                                                                                                                                                                                                                                                                  |
| `SERVER_OWNED_TOOL_LOOP_ENABLED`            | boolean | `false`         |         | Pokračuje v nestreamovaných voláních nástrojů řízených serverem, dokud model nevrátí odpověď použitelnou klientem.                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `SEARCH_STATS_HIDE_DELETED_CONNECTIONS`     | boolean | `false`         |         | Statistiky vyhledávání a nedávná hledání započítávají pouze poskytovatele, kteří stále mají aktivní připojení (poskytovatelé bez klíče, například duckduckgo-free, se započítávají vždy). Při vypnutí se zachová každý uložený řádek vyhledávání s ID poskytovatele.                                                                                                                                                                                                                                                                                                                        |
| `FREE_BADGE_REQUIRES_PROVIDER_FREE_TIER`    | boolean | `false`         |         | Stránky poskytovatelů v řídicím panelu: zobrazí odznak Bezplatné pouze podle signálů, které poskytovatel respektuje — ignoruje heuristiku zobrazovaného názvu, nebooleanovská pole bezplatnosti a přípony :free u registrovaných poskytovatelů bez zdokumentované bezplatné úrovně. Při vypnutí se zachová dosavadní pravidlo odznaku.                                                                                                                                                                                                                                                      |
| `RETRY_AFTER_PROVENANCE_ENABLED`            | boolean | `false`         |         | U agregovaných odpovědí 429/503 o nedostupnosti vynechá `Retry-After`, pokud není znám žádný konkrétní budoucí čas opakování (namísto syntetické 1 s), přidá `error.retry_after_provenance` (`signal` \| `none`) a umožní cestám vyčerpání kombinace číst textové pokyny k opakování z těl nadřazených odpovědí ve formátu JSON i prostého textu. Pole se zobrazuje pouze v odpovědích vytvořených funkcí `unavailableResponse()`; ostatní těla odpovědí 429/503 se nemění.                                                                                                                 |
| `PROTECTED_PRIORITY_INFRA_502_ENABLED`      | boolean | `false`         |         | Když cíl kombinace `priority`, označený pro záložní použití pouze při vyčerpání kvóty, zastaví kombinaci z důvodu, který prokazatelně nesouvisí s kvótou (otevřený jistič poskytovatele, přeskočení kvůli predikované latenci), odpoví chybou 502 namísto chyby 503 vypadající jako vyčerpání kvóty. Zastavení kvůli uzamčení, době zklidnění, nedostupnosti, vyčerpání a limitu souběžnosti nadále vracejí 503.                                                                                                                                                                            |
| `MISTRAL_AMBIGUOUS_401_SOFT_LOCKOUT`        | boolean | `false`         |         | Prostá chyba Mistral 401 (`{"detail":"Unauthorized"}`, bez explicitního signálu ověření) je stejná pro odvolaný klíč i vyčerpanou kvótu. Je-li zapnuto, přepne připojení do doby zklidnění namísto jeho odstavení jako `expired`, nejvýše třikrát za hodinu pro každé připojení; další chyba jej odstaví, takže odvolaný klíč nakonec stále přejde do správného stavu. Ve výchozím nastavení vypnuto: každá prostá chyba Mistral 401 odstaví připojení stejně jako dříve.                                                                                                                   |
| `XAI_OAUTH_LIVE_MODEL_DISCOVERY`            | boolean | `false`         |         | Načítá aktuální katalog modelů xAI pro připojení `xai-oauth` z `https://api.x.ai/v1/models` pomocí nosného tokenu OAuth namísto neměnného statického základu. Ve výchozím nastavení vypnuto: `xai-oauth` nadále beze změny poskytuje statický základ. Při jakékoli chybě rozlišení se zjišťování vrátí ke statickému základu (není ověřeno, zda x.ai na tomto koncovém bodu přijímá nosný token OAuth).                                                                                                                                                                                     |
| `BATCH_AND_FILE_AUTO_CLEANUP_ENABLED`       | boolean | `false`         |         | Umožňuje automatickému úklidu odstraňovat ukončené úlohy Batch API (completed/failed/cancelled/expired) starší než `OMNIROUTE_BATCH_RETENTION_DAYS` spolu s jejich kontrolními body pro jednotlivé řádky a mazat obsah BLOB nahraných souborů po uplynutí jejich vlastního `expires_at`. Ve výchozím nastavení vypnuto: každá existující instalace uchovává tato data přesně jako dříve, dokud správce tuto možnost nepovolí. Trasa `DELETE /api/v1/batches/delete-completed` spouštěná správcem není ovlivněna žádným nastavením — jde o samostatnou, bezpodmínečnou veřejnou smlouvu API. |

### CLI (5)

| Klíč                                  | Typ     | Výchozí hodnota | Restart | Popis                                                                                                                                                                                                                               |
| ------------------------------------- | ------- | --------------- | ------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CLI_COMPAT_ALL`                      | boolean | `false`         | ✓       | Povolí režim kompatibility pro všechny klienty CLI.                                                                                                                                                                                 |
| `MODEL_ALIAS_COMPAT_ENABLED`          | boolean | `false`         |         | Povolí vrstvu kompatibility aliasů modelů.                                                                                                                                                                                          |
| `PRICING_SYNC_ENABLED`                | boolean | `false`         |         | Povolí automatickou synchronizaci cenových dat (vyžaduje také proměnnou prostředí `PRICING_SYNC_ENABLED`).                                                                                                                          |
| `OMNIROUTE_AUTO_SYNC_CODEX_PROFILES`  | boolean | `false`         |         | Po synchronizaci modelů poskytovatele automaticky (znovu) zapíše soubory profilů ~/.codex/*.config.toml z aktuálního katalogu. Nikdy nemění aktivní/výchozí konfiguraci Codex. Ve výchozím nastavení vypnuto.                       |
| `OMNIROUTE_AUTO_SYNC_CLAUDE_PROFILES` | boolean | `false`         |         | Po synchronizaci modelů poskytovatele automaticky (znovu) zapíše profily Claude Code ~/.claude/profiles/<name>/settings.json z aktuálního katalogu. Nikdy nemění aktivní/výchozí konfiguraci Claude. Ve výchozím nastavení vypnuto. |

### Kontrola stavu (5)

| Klíč                                      | Typ     | Výchozí hodnota | Popis                                                                                                                                                                                                                                                                                            |
| ----------------------------------------- | ------- | --------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `OMNIROUTE_DISABLE_LOCAL_HEALTHCHECK`     | boolean | `false`         | Zakáže koncový bod kontroly stavu místní instance.                                                                                                                                                                                                                                               |
| `OMNIROUTE_DISABLE_TOKEN_HEALTHCHECK`     | boolean | `false`         | Zakáže kontrolu stavu ověřování tokenů.                                                                                                                                                                                                                                                          |
| `SKILLS_SANDBOX_NETWORK_ENABLED`          | boolean | `false`         | Povolí přístup k síti v izolovaném prostředí dovedností.                                                                                                                                                                                                                                         |
| `PROXY_HEALTH_BLOCKED_RESETS_STREAK`      | boolean | `false`         | Při kontrole stavu proxy sonda odmítnutá cílem (401/403/429) vynuluje řadu po sobě jdoucích selhání proxy. Ve výchozím nastavení vypnuto: odmítnutí zůstává neutrální (#10654). Odpověď 5xx zůstává v obou případech neprůkazná; odmítnutí nikdy neodebere, nezakáže ani znovu neaktivuje proxy. |
| `DB_HEALTHCHECK_STARTUP_DEFERRED_ENABLED` | boolean | `false`         | Spustí při startu kontrolu integrity/stavu DB až poté, co server začne přijímat požadavky (prostřednictvím `setImmediate`), namísto blokování spuštění do jejího dokončení (#13717). Ve výchozím nastavení vypnuto: spuštění je blokováno přesně stejně jako před tímto PR.                      |

> [!NOTE]
> `INPUT_SANITIZER_BLOCK_THRESHOLD` a jeho starší alias
> `INJECTION_GUARD_BLOCK_THRESHOLD` upravují režim `block` příznaku
> `INJECTION_GUARD_MODE`, ale jde o běžné proměnné prostředí načítané souborem
> [`src/shared/utils/injectionSeverity.ts`](../../src/shared/utils/injectionSeverity.ts),
> nikoli o příznaky funkcí: nemají přepsání v DB ani přepínač na řídicím panelu. Viz
> [`ENVIRONMENT.md`](./ENVIRONMENT.md#4-security--authentication).

> [!NOTE]
> Sloupec `Restart` označuje příznaky s `requiresRestart: true` — hodnota se
> uloží okamžitě, ale projeví se až po opětovném načtení procesu. Výčtové
> příznaky odmítnou jakoukoli hodnotu mimo jejich povolenou množinu (ověřuje se na straně serveru
> jak v `setFeatureFlagOverride()`, tak v obslužné rutině REST `PUT`).

---

## Přepínání příznaků

### Řídicí panel

Přejděte na **Řídicí panel → Nastavení → Příznaky funkcí**
(`/dashboard/settings/feature-flags`). Mřížka
(`src/app/(dashboard)/dashboard/settings/components/FeatureFlagsGrid.tsx`)
podporuje:

- **Vyhledávání** podle klíče nebo popisu a **filtrování** podle kategorie (včetně syntetického zobrazení
  **Vyžaduje restart**).
- **Přepínač** pro booleovské příznaky a **rozbalovací nabídku** pro výčtové příznaky
  (`src/app/(dashboard)/dashboard/settings/components/FeatureFlagCard.tsx`).
- **Odznak zdroje** u každého příznaku — `DB`, `ENV` nebo `DEF` — který ukazuje, odkud
  pochází výsledná hodnota.
- Tlačítko **Obnovit** (zobrazuje se pouze u příznaků se zdrojem `DB`) pro odstranění přepsání
  a tlačítko **Obnovit všechna přepsání** ve spodní části.
- Banner **Restartovat server**, když dojde ke změně příznaku `requiresRestart`.

### REST API

Všechny operace probíhají prostřednictvím jediné trasy:
[`src/app/api/settings/feature-flags/route.ts`](../../src/app/api/settings/feature-flags/route.ts).
Každá metoda vyžaduje ověřenou relaci řídicího panelu (jinak vrací `401`).

#### `GET /api/settings/feature-flags`

Vrací všechny příznaky s jejich výslednou hodnotou, zdrojem a souhrnem.

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
    // ... všech 72 příznaků
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

Nastaví nebo odstraní jedno přepsání. Tělo: `{ key: string; value?: string }`.
Vynecháním `value` se přepsání odstraní (a obnoví se hodnota z prostředí / výchozí hodnota).

```bash
# Nastavení přepsání v DB
curl -X PUT http://localhost:20128/api/settings/feature-flags \
  -H "Content-Type: application/json" \
  -d '{"key":"REQUIRE_API_KEY","value":"true"}'

# Odstranění přepsání (bez "value")
curl -X PUT http://localhost:20128/api/settings/feature-flags \
  -H "Content-Type: application/json" \
  -d '{"key":"REQUIRE_API_KEY"}'
```

Odpověď vrací novou hodnotu `effectiveValue`/`source`, předchozí hodnotu `previousValue`/
`previousSource` a `requiresRestart`. Neznámé klíče a výčtové hodnoty mimo povolený rozsah
jsou odmítnuty se stavem `400`.

#### `DELETE /api/settings/feature-flags`

Najednou vymaže **všechna** přepsání v DB a obnoví u každého příznaku hodnotu z prostředí / výchozí
hodnotu. Vrací `{ cleared: <count>, message: "..." }`.

> [!NOTE]
> Příznaky s `requiresRestart: true` se projeví až po opětovném načtení procesu.
> Proces restartování z řídicího panelu volá `POST /api/restart` a poté opakovaně dotazuje
> `GET /api/health/ping`, dokud není server opět spuštěn.

---

## Nouzové záložní řešení při vyčerpání rozpočtu

`OMNIROUTE_EMERGENCY_FALLBACK` (kategorie `runtime`, výchozí hodnota `true`) řídí
nouzovou bezplatnou záložní cestu v
[`open-sse/services/emergencyFallback.ts`](../../open-sse/services/emergencyFallback.ts).
Když je tato možnost povolena, požadavky, které vyčerpají svůj rozpočet, jsou směrovány k bezplatnému záložnímu
poskytovateli/modelu namísto toho, aby rovnou selhaly. Nastavením na `false` (nebo `0`) — prostřednictvím
přepínače na řídicím panelu, přepsání v DB nebo proměnné prostředí `OMNIROUTE_EMERGENCY_FALLBACK`
— toto chování zakážete a požadavky s vyčerpaným rozpočtem budou moci
selhat. (Zpřístupněno jako přepínač na řídicím panelu v PR #3741 / #3752.)

---

## Viz také

- [Referenční příručka proměnných prostředí](./ENVIRONMENT.md) — většina příznaků má
  stejnojmennou proměnnou prostředí, která je zde zdokumentována (přepsání v DB
  má před ní přednost).
- [`src/shared/constants/featureFlagDefinitions.ts`](../../src/shared/constants/featureFlagDefinitions.ts)
  — autoritativní zdroj pro všechny příznaky.
- [`src/shared/utils/featureFlags.ts`](../../src/shared/utils/featureFlags.ts)
  — logika vyhodnocování (`resolveFeatureFlag`, `isFeatureFlagEnabled`,
  `resolveAllFeatureFlags`).
- [`src/lib/db/featureFlags.ts`](../../src/lib/db/featureFlags.ts) — ukládání
  přepsání v DB ve jmenném prostoru `feature_flags` tabulky `key_value`.
