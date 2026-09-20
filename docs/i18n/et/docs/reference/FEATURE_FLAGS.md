# Feature Flags (Eesti)

🌐 **Languages:** 🇺🇸 [English](../../../../reference/FEATURE_FLAGS.md) · 🇪🇹 [am](../../../am/docs/reference/FEATURE_FLAGS.md) · 🇸🇦 [ar](../../../ar/docs/reference/FEATURE_FLAGS.md) · 🇦🇿 [az](../../../az/docs/reference/FEATURE_FLAGS.md) · 🇧🇬 [bg](../../../bg/docs/reference/FEATURE_FLAGS.md) · 🇧🇩 [bn](../../../bn/docs/reference/FEATURE_FLAGS.md) · 🇨🇿 [cs](../../../cs/docs/reference/FEATURE_FLAGS.md) · 🇩🇰 [da](../../../da/docs/reference/FEATURE_FLAGS.md) · 🇩🇪 [de](../../../de/docs/reference/FEATURE_FLAGS.md) · 🇬🇷 [el](../../../el/docs/reference/FEATURE_FLAGS.md) · 🇪🇸 [es](../../../es/docs/reference/FEATURE_FLAGS.md) · 🇮🇷 [fa](../../../fa/docs/reference/FEATURE_FLAGS.md) · 🇫🇮 [fi](../../../fi/docs/reference/FEATURE_FLAGS.md) · 🇫🇷 [fr](../../../fr/docs/reference/FEATURE_FLAGS.md) · 🇮🇪 [ga](../../../ga/docs/reference/FEATURE_FLAGS.md) · 🇮🇳 [gu](../../../gu/docs/reference/FEATURE_FLAGS.md) · 🇳🇬 [ha](../../../ha/docs/reference/FEATURE_FLAGS.md) · 🇮🇱 [he](../../../he/docs/reference/FEATURE_FLAGS.md) · 🇮🇳 [hi](../../../hi/docs/reference/FEATURE_FLAGS.md) · 🇭🇷 [hr](../../../hr/docs/reference/FEATURE_FLAGS.md) · 🇭🇺 [hu](../../../hu/docs/reference/FEATURE_FLAGS.md) · 🇦🇲 [hy](../../../hy/docs/reference/FEATURE_FLAGS.md) · 🇮🇩 [id](../../../id/docs/reference/FEATURE_FLAGS.md) · 🇳🇬 [ig](../../../ig/docs/reference/FEATURE_FLAGS.md) · 🇮🇹 [it](../../../it/docs/reference/FEATURE_FLAGS.md) · 🇯🇵 [ja](../../../ja/docs/reference/FEATURE_FLAGS.md) · 🇬🇪 [ka](../../../ka/docs/reference/FEATURE_FLAGS.md) · 🇰🇭 [km](../../../km/docs/reference/FEATURE_FLAGS.md) · 🇮🇳 [kn](../../../kn/docs/reference/FEATURE_FLAGS.md) · 🇰🇷 [ko](../../../ko/docs/reference/FEATURE_FLAGS.md) · 🇱🇹 [lt](../../../lt/docs/reference/FEATURE_FLAGS.md) · 🇱🇻 [lv](../../../lv/docs/reference/FEATURE_FLAGS.md) · 🇮🇳 [ml](../../../ml/docs/reference/FEATURE_FLAGS.md) · 🇮🇳 [mr](../../../mr/docs/reference/FEATURE_FLAGS.md) · 🇲🇾 [ms](../../../ms/docs/reference/FEATURE_FLAGS.md) · 🇲🇹 [mt](../../../mt/docs/reference/FEATURE_FLAGS.md) · 🇲🇲 [my](../../../my/docs/reference/FEATURE_FLAGS.md) · 🇳🇵 [ne](../../../ne/docs/reference/FEATURE_FLAGS.md) · 🇳🇱 [nl](../../../nl/docs/reference/FEATURE_FLAGS.md) · 🇳🇴 [no](../../../no/docs/reference/FEATURE_FLAGS.md) · 🇮🇳 [or](../../../or/docs/reference/FEATURE_FLAGS.md) · 🇮🇳 [pa](../../../pa/docs/reference/FEATURE_FLAGS.md) · 🇵🇭 [phi](../../../phi/docs/reference/FEATURE_FLAGS.md) · 🇵🇱 [pl](../../../pl/docs/reference/FEATURE_FLAGS.md) · 🇵🇹 [pt](../../../pt/docs/reference/FEATURE_FLAGS.md) · 🇧🇷 [pt-BR](../../../pt-BR/docs/reference/FEATURE_FLAGS.md) · 🇷🇴 [ro](../../../ro/docs/reference/FEATURE_FLAGS.md) · 🇷🇺 [ru](../../../ru/docs/reference/FEATURE_FLAGS.md) · 🇱🇰 [si](../../../si/docs/reference/FEATURE_FLAGS.md) · 🇸🇰 [sk](../../../sk/docs/reference/FEATURE_FLAGS.md) · 🇸🇮 [sl](../../../sl/docs/reference/FEATURE_FLAGS.md) · 🇷🇸 [sr](../../../sr/docs/reference/FEATURE_FLAGS.md) · 🇸🇪 [sv](../../../sv/docs/reference/FEATURE_FLAGS.md) · 🇰🇪 [sw](../../../sw/docs/reference/FEATURE_FLAGS.md) · 🇮🇳 [ta](../../../ta/docs/reference/FEATURE_FLAGS.md) · 🇮🇳 [te](../../../te/docs/reference/FEATURE_FLAGS.md) · 🇹🇭 [th](../../../th/docs/reference/FEATURE_FLAGS.md) · 🇹🇷 [tr](../../../tr/docs/reference/FEATURE_FLAGS.md) · 🇺🇦 [uk-UA](../../../uk-UA/docs/reference/FEATURE_FLAGS.md) · 🇵🇰 [ur](../../../ur/docs/reference/FEATURE_FLAGS.md) · 🇺🇿 [uz](../../../uz/docs/reference/FEATURE_FLAGS.md) · 🇻🇳 [vi](../../../vi/docs/reference/FEATURE_FLAGS.md) · 🇳🇬 [yo](../../../yo/docs/reference/FEATURE_FLAGS.md) · 🇨🇳 [zh-CN](../../../zh-CN/docs/reference/FEATURE_FLAGS.md) · 🇹🇼 [zh-TW](../../../zh-TW/docs/reference/FEATURE_FLAGS.md)

---

> Käitusaegsed lülitid, mis muudavad OmniRoute'i käitumist **ilma uue juurutuseta**.
> Kõik siin loetletud lipud on määratletud failis
> [`src/shared/constants/featureFlagDefinitions.ts`](../../src/shared/constants/featureFlagDefinitions.ts)
> — see on ainus tõeallikas. Nii juhtpaneel kui ka REST API loevad sellest
> failist, mistõttu on allolev tabel loodud sellele üks ühele vastama.

---

## Mis on funktsioonilipud

Funktsioonilipp on nimega lüliti (tõeväärtus või enum), mille väärtust saab muuta
käitusajal ja andmebaasis püsivalt talletada, ilma et protsessi oleks vaja uuesti juurutada. Iga
lippu kirjeldab `FeatureFlagDefinition`, millel on `key`, `label`,
`description`, `category`, `defaultValue`, `type` ja vihje `requiresRestart`.

### Lahendamise järjekord

Lipu **tegeliku väärtuse** lahendab
[`resolveFeatureFlag()`](../../src/shared/utils/featureFlags.ts) järgmise
prioriteediga (kõrgeim võidab):

1. **Andmebaasi alistus** — tabelis `key_value` nimeruumi
   `feature_flags` all talletatud väärtus (määratud juhtpaneeli või REST API kaudu).
2. **Keskkonnamuutuja** — `process.env[<KEY>]`, kui see on määratud ega ole tühi.
3. **Definitsiooni vaikeväärtus** — faili `featureFlagDefinitions.ts` väärtus `defaultValue`.

Tõeväärtusega lipp loetakse **lubatuks**, kui selle tegelik väärtus on `"true"`,
`"1"` või `"yes"` (vt `isFeatureFlagEnabled()`).

> [!NOTE]
> Enamikul lippudel on ka **sama nimega** vastav keskkonnamuutuja,
> mis on dokumenteeritud failis [`ENVIRONMENT.md`](./ENVIRONMENT.md). Lipu andmebaasi alistus
> on selle keskkonnamuutuja suhtes prioriteetsem. Lipp väärtusega
> `requiresRestart: true` talletatakse kohe, kuid loetakse uuesti alles protsessi
> käivitamisel — selle ümberlülitamisel kuvatakse juhtpaneelil bänner **„Taaskäivita server”**.

---

## Lippude kataloog

72 lippu 6 kategoorias. **Vaikeväärtus** on definitsiooni vaikeväärtus — väärtus,
mida kasutatakse siis, kui andmebaasi alistust ega keskkonnamuutujat pole määratud.

### Turvalisus (10)

| Võti                                    | Tüüp    | Vaikeväärtus | Kirjeldus                                                                                                                                                                                                                                                                                                 |
| --------------------------------------- | ------- | ------------ | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `REQUIRE_API_KEY`                       | boolean | `false`      | Nõua kõigi sissetulevate päringute puhul API võtit.                                                                                                                                                                                                                                                       |
| `INPUT_SANITIZER_ENABLED`               | boolean | `true`       | Luba kõigi päringute sisendi puhastamine.                                                                                                                                                                                                                                                                 |
| `INJECTION_GUARD_MODE`                  | enum    | `off`        | Viibasüsti vastase kaitse režiim. Väärtused: `off`, `warn`, `block`, `redact`.                                                                                                                                                                                                                            |
| `PII_REDACTION_ENABLED`                 | boolean | `false`      | Redigeeri päringutest isikuandmed (sõltumata väärtusest `INPUT_SANITIZER_MODE`).                                                                                                                                                                                                                          |
| `PII_RESPONSE_SANITIZATION`             | boolean | `false`      | Puhasta teenusepakkuja vastustest isikuandmed.                                                                                                                                                                                                                                                            |
| `PII_RESPONSE_SANITIZATION_MODE`        | enum    | `redact`     | Isikuandmete vastustest puhastamise režiim. Väärtused: `redact`, `warn`, `block`, `off`.                                                                                                                                                                                                                  |
| `OUTBOUND_SSRF_GUARD_ENABLED`           | boolean | `true`       | Blokeeri väljuvad päringud privaatsetesse/sisemistesse IP-vahemikesse.                                                                                                                                                                                                                                    |
| `ALLOW_API_KEY_REVEAL`                  | boolean | `false`      | Luba autenditud juhtpaneeli kasutajatel näha talletatud API võtmeid, mitte üksnes maskeeritud väärtusi.                                                                                                                                                                                                   |
| `AUTH_LOG_INCLUDE_ACCOUNT_ID`           | boolean | `false`      | Kaasa konto prefiks AUTH-logiridadele (nt „Kasutatakse teenusepakkuja <provider> kontot: abc12345...”). Vaikimisi on see keelatud, et kontoidentifikaatorid oleksid jagatud/mitme rentnikuga protsessilogides redigeeritud. See ei sõltu silumisrežiimist; silumisrežiimi ümberlülitamine seda ei avalda. |
| `OMNIROUTE_OIDC_DISABLE_PASSWORD_LOGIN` | boolean | `false`      | Kui OIDC on lubatud, keela parooliga sisselogimine, et kasutajad saaksid autentida ainult OIDC ühekordse sisselogimise kaudu. Kui see on keelatud (vaikimisi), on saadaval nii parooliga sisselogimine kui ka OIDC.                                                                                       |

### Võrk (15)

| Võti                                            | Tüüp    | Vaikeväärtus | Taaskäivitus | Kirjeldus                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ----------------------------------------------- | ------- | ------------ | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `ENABLE_TLS_FINGERPRINT`                        | boolean | `false`      | ✓            | Luba TLS-sõrmejälje varjamise režiim.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `AUDIO_REMOTE_PROVIDER_NODES`                   | boolean | `false`      |              | Luba marsruutidel /v1/audio/* kasutada OpenAI-ga ühilduvaid teenusepakkuja sõlmi, mida majutatakse väljaspool localhost'i. Vaikimisi väljas — heli suunamine kaughosti muudab väljamineva liikluse identiteeti ja peab olema käitaja teadlik otsus. Tagasisideahela sõlmed on alati lubatud ja see säte neid ei mõjuta.                                                                                                                                                                                                  |
| `PROXY_AUTO_SELECT_ENABLED`                     | boolean | `false`      |              | Kui ühendusele pole puhverserverit määratud, vali registrist automaatselt esimene töötav puhverserver. Vaikimisi väljas (vastasel juhul muutub iga registri puhverserver globaalseks varuvariandiks — #3332).                                                                                                                                                                                                                                                                                                            |
| `OMNIROUTE_CONTROL_PLANE_PROXY_DIRECT_FALLBACK` | boolean | `false`      |              | Luba OAuthi ja teenusepakkuja valideerimisvoogudel seotud puhverserverist mööda minna ning luua otseühendus, kui puhverserveri kättesaadavuse eelkontrollid nurjuvad. Vaikimisi väljas, sest see võib muuta väljamineva liikluse IP-aadressi.                                                                                                                                                                                                                                                                            |
| `NETWORK_ROTATION_SHARED_EGRESS_GUARD`          | boolean | `true`       |              | Mitme konto rotatsiooni täituri võrguerandi korral (ajalõpp, ühendusest keeldumine või ühenduse lähtestamine), kui nurjunud kontol pole eraldi puhverserverit, rakenda lühike ooteaeg ja jäta ülejäänud puhverserverita kontod päringu lõpuni vahele, selle asemel et igaüht uuesti proovida. Vaikimisi sees (ohutu: väljamineva liikluse IP-aadress ei muutu, vähendab ainult jagatud väljamineva liiklusega kontode latentsuse ja ooteaja riski). Keela, et taastada esimese puhverserverita erandi kohene edastamine. |
| `PROXY_SKIP_RECENTLY_FAILED`                    | boolean | `false`      |              | Puhverserverikogumid ja opencode'i kontopõhine rotatsioon lõpetavad äsja nurjunud puhverserveri uuesti pakkumise (tagasilükatud TCP-kontroll või selle kaudu saadud 429) protsessipõhiseks ajavahemikuks, mis iga korduva nurjumisega kahekordistub kuni ülempiirini. Puhverserveri olekut ei kirjutata; kui kõik kandidaadid on kõrvale jäetud, jääb valik muutmata. Vaikimisi väljas.                                                                                                                                  |
| `PROXY_POOL_EGRESS_OBSERVATION`                 | boolean | `false`      |              | Kuva juhtpaneelil puhverserverikogumi all, mitu täheldatud väljamineva liikluse IP-aadressi teenindas viimase 24 h jooksul selle liikmeid ja mitu ühendust neid kasutas. Kirjutuskaitstud, arvutatakse puhverserveri logist ja seda ei kasutata kunagi marsruutimiseks. Vaikimisi väljas.                                                                                                                                                                                                                                |
| `OPENCODE_RESPONSES_STALL_ROTATION`             | boolean | `false`      |              | Jälgi OpenCode'i täituri puhul voogedastatud Responsesi vastuse keha esimest baiti (aken: `RESPONSES_FIRST_BYTE_TIMEOUT_MS`, vaikeväärtus `15000`). 2xx Responsesi voogu, mis jääb pärast akna möödumist vaikseks, käsitletakse seiskununa: kontole rakendatakse ooteaega ja päring suunatakse ühe korra järgmisele kontole; teine seiskumine nurjub kohe. Vaikimisi väljas: seiskunud vood jätkavad praegust ootamist kuni voo valmisoleku ajalõpuni.                                                                   |
| `OPENCODE_USER_BLOCKED_ROTATION`                | boolean | `false`      |              | OpenCode'i täitur: `user_blocked`-tõrget sisaldava 403/451 korral (mitte geograafiline piirang ega Cloudflare'i sõrmejälje tagasilükkamine) rakenda tagasilükatud kontole ooteaega ja suuna päring järgmisele kontole kõige rohkem üks kord päringu kohta; teine tõrge tagastatakse muutmata kujul ilma õnnestumise märgistuseta. Vaikimisi väljas: ülesvoolu kasutajablokeeringust mööda marsruutimine võib näida piirangust kõrvalehoidmisena ja levitada märgistust kogu süsteemipargis.                              |
| `OPENCODE_TRANSIENT_FAILOVER_BACKOFF`           | boolean | `false`      |              | OpenCode'i rotatsioon: pärast kahte järjestikust ajutist ülesvoolu tõrget (5xx või tühi 400) pea enne järgmist kontot paus — 1,5 s, mis iga järgmise tõrkega kahekordistub; ühe pausi ülempiir on 6 s ja päringu ülempiir 10 s; kliendi ühenduse katkemisel jäetakse paus vahele. Nurjunud vastuse keha vabastatakse enne ootamist. Vaikimisi väljas: tõrkesiire jääb koheseks.                                                                                                                                          |
| `OPENCODE_RATE_LIMITED_429_EARLY_STOP`          | boolean | `false`      |              | OpenCode'i rotatsioon: peata kontode laine esimese tegelikuks kiiruspiiranguks liigitatud 429 korral (sõelutav `Retry-After` või keha, mis nimetab kiiruse- või kasutuspiirangut) ja tagasta see ülesvoolu 429 muutmata kujul. Liigitamata 429 korral rotatsioon jätkub. Vaikimisi väljas: tasuta taseme piirang kehtib väljamineva liikluse IP-aadressi kohta (#9611), seega käivitab iga 429 rotatsiooni ja ammendatud laine tagastab viimase ülesvoolu 429.                                                           |
| `MITM_DISABLE_TLS_VERIFY`                       | boolean | `false`      | ✓            | Keela MITM-puhverserveri TLS-serdi kontrollimine. **Ohtlik.**                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `OMNIROUTE_ALLOW_PRIVATE_PROVIDER_URLS`         | boolean | `false`      |              | Luba privaatsetele/sisevõrkudele osutavad teenusepakkuja URL-id.                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `OMNIROUTE_ALLOW_LOCAL_PROVIDER_URLS`           | boolean | `true`       |              | Luba lisada ja valideerida kohalikel/privaatsetel aadressidel (127.0.0.1, localhost, LAN) olevaid teenusepakkujaid. Vaikimisi sees (kohalik eelistatud); keela rangeks ainult avalike aadresside lubamiseks. Pilve metaandmed jäävad blokeerituks.                                                                                                                                                                                                                                                                       |
| `ENABLE_CC_COMPATIBLE_PROVIDER`                 | boolean | `false`      | ✓            | Luba Claude Code'iga ühilduv teenusepakkuja režiim.                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |

### Poliitikad (5)

| Võti                            | Tüüp    | Vaikeväärtus | Kirjeldus                                                                                                                                                                                                                                             |
| ------------------------------- | ------- | ------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `TOOL_POLICY_MODE`              | enum    | `disabled`   | Tööriistade kasutamise poliitika jõustamise režiim. Väärtused: `disabled`, `warn`, `block`.                                                                                                                                                           |
| `RATE_LIMIT_AUTO_ENABLE`        | boolean | `false`      | Lülita kasutusmustrite põhjal automaatselt sisse päringusageduse piiramine.                                                                                                                                                                           |
| `DISABLE_CONTEXT_WINDOW_CHECKS` | boolean | `false`      | Jäta otseste ühe mudeli päringute puhul OmniRoute'i kohalik kontekstiakna / sisendi maksimaalse tokenite arvu kontroll vahele. Ülesvoolu piirangud kehtivad endiselt.                                                                                 |
| `CAPABILITY_FILTER_ENABLED`     | boolean | `false`      | Lükka päringud enne edastamist tagasi, kui sihtmudelil puuduvad nõutavad võimekused (nägemine, tööriistad, struktureeritud väljund, kontekstiaken). Kaitseb otseseid ühe teenusepakkuja päringuid, mis mööduvad kombinatsioonikihi ühilduvusfiltrist. |
| `RADAR_ENABLED`                 | boolean | `false`      | Lülita sisse OmniRoute Radari moodul (kataloogivoo vaated ja sünkroonimine). Vaikimisi väljas; sisselülitamine avab ainult kasutajaliidese — andmete sünkroonimine nõuab eraldi nõusolekut.                                                           |

### Käituskeskkond (32)

| Võti                                        | Tüüp    | Vaikimisi | Taaskäivitus | Kirjeldus                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| ------------------------------------------- | ------- | --------- | ------------ | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `UNIVERSAL_CONTEXT_HANDOFF_ENABLED`         | boolean | `true`    |              | Genereeri ja sisesta vestluste kokkuvõtted, kui kombineeritud marsruutimine vahetab mudelit. Keela, et käsitleda mudelivahetusi sõltumatult ja vältida taustal üleandmispäringuid kõigi olemasolevate ja tulevaste kombinatsioonide puhul.                                                                                                                                                                                                                                                                                                                                   |
| `RESPONSES_PASSTHROUGH_DROP_COMMENTARY`     | boolean | `true`    |              | Eemalda Responses API läbivooluvoogudest enne klientidele edastamist sisemised kommentaarifaasi väljundelemendid. Keela, et saada töötlemata ülesvoolu kommentaare.                                                                                                                                                                                                                                                                                                                                                                                                          |
| `OMNIROUTE_MCP_ENFORCE_SCOPES`              | boolean | `true`    |              | Jõusta MCP-tööriistade juurdepääsu ulatusepiirangud.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `OMNIROUTE_MCP_COMPRESS_DESCRIPTIONS`       | boolean | `false`   |              | Tihenda MCP-tööriistade kirjeldusi, et vähendada tokenite kasutust.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `OMNIROUTE_ENABLE_RUNTIME_BACKGROUND_TASKS` | boolean | `false`   |              | Luba käitusajal taustülesannete töötlemine.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `OMNIROUTE_DISABLE_BACKGROUND_SERVICES`     | boolean | `false`   | ✓            | Keela kõik taustteenused (kvoodi värskendamine, sünkroonimine jne).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `OMNIROUTE_RTK_TRUST_PROJECT_FILTERS`       | boolean | `false`   |              | Usalda projektitaseme RTK-filtreid ilma valideerimiseta.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `OMNIROUTE_ENABLE_LIVE_WS`                  | boolean | `true`    | ✓            | Käivita importimisel reaalajas töölaua WebSocket-server (vaikimisi port 20132).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `OMNIROUTE_CODEX_WS_ENABLED`                | boolean | `true`    |              | Luba Codexil kasutada Responses-over-WebSocket transporti. Kui see on välja lülitatud, kasutab Codex varuvariandina HTTP Responses transporti.                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `OMNIROUTE_CODEX_APP_SERVER_ENABLED`        | boolean | `true`    |              | Luba Codexil kasutada kohaliku app-serveri WebSocket JSON-RPC transporti (codexTransport=app-server). Kui see on välja lülitatud, kasutavad app-serveri valinud ühendused varuvariandina Codexi muid transporte.                                                                                                                                                                                                                                                                                                                                                             |
| `OMNIROUTE_EMERGENCY_FALLBACK`              | boolean | `true`    |              | Marsruudi eelarve ammendanud päringud erakorralisele tasuta varupakkujale/-mudelile. (Vaata allpool jaotist [Erakorraline eelarvevaru](#emergency-budget-fallback).)                                                                                                                                                                                                                                                                                                                                                                                                         |
| `STREAM_RECOVERY_ENABLED`                   | boolean | `false`   |              | Luba katkenud ülesvoolu SSE-voogude läbipaistev varajane korduskatse enne, kui vastuse baidid jõuavad kliendini.                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `STREAM_RECOVERY_MIDSTREAM_ENABLED`         | boolean | `false`   |              | Luba voo taastamisel vastust uuesti pärida ja liita pärast seda, kui baidid on juba kliendini jõudnud.                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `STREAM_RECOVERY_TOOLCALL_ORDER_FIX`        | boolean | `false`   |              | Muuda voo keskel jätkamine tööriistakutsete jaoks ohutuks: ära kunagi jätka katkenud voogu, kui tööriistakutse on väljastatud (pooleli või juba lõpetatud väärtusega finish_reason tool_calls), ning lõpeta pärast üht tühja jätkamist, selle asemel et kulutada kogu eelarve. Väljas: väljalaske tavakäitumine.                                                                                                                                                                                                                                                             |
| `STREAM_EARLY_EOF_SIBLING_FAILOVER_ENABLED` | boolean | `false`   |              | Lülitu üks kord sõsarühendusele, kui SSE-voog sulgub enne mis tahes kasuliku kaadri väljastamist ja piiratud korduskatse samal ühendusel on ammendatud; kasutatava sõsarühenduse puudumisel tagastatakse algne `STREAM_EARLY_EOF` 502. Vaikimisi väljas: varajane EOF jääb pärast samal ühendusel tehtud korduskatset lõplikuks.                                                                                                                                                                                                                                             |
| `MODEL_CATALOG_INCLUDE_NAMES`               | boolean | `true`    |              | Kaasa `/v1/models` vastustesse kuvamiseks sobivad nimeväljad. Keela klientide jaoks, mis eeldavad ainult mudeli ID-sid.                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `MODELS_CATALOG_PREFIX_MODE`                | enum    | `dual`    |              | Määrab, kuidas mudeli ID-dele lisatakse /v1/models-is prefiksid. 'dual' (vaikimisi) väljastab tagasiühilduvuse tagamiseks nii aliase kui ka kanoonilise pakkuja ID prefiksid. 'alias' väljastab ainult lühikese aliaseprefiksi (nt ds-web/model, mitte deepseek-web/model). 'canonical' väljastab ainult täieliku pakkuja ID prefiksi. Väärtused: `dual`, `alias`, `canonical`.                                                                                                                                                                                              |
| `ARENA_ELO_SYNC_ENABLED`                    | boolean | `true`    |              | Luba mudelite intelligentsuse pingerea jaoks Arena AI edetabeli ELO perioodiline sünkroonimine.                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `EXPOSE_CC_DISCOVERY_ALIASES`               | boolean | `false`   |              | Avalda `/v1/models` kaudu `claude/<provider>/<model>` peegel-ID-d, et Claude Code'i lüüsi mudeliotsing loetleks ka mitte-Claude'i mudeleid. Kolmetasemelise lüliti globaalne tase (keskkonnamuutuja alistab töölaua sätte). Vaata [Claude Code'i konfiguratsiooni](../guides/CLAUDE-CODE-CONFIGURATION.md#discovery-aliases--surface-non-claude-models-in-the-model-picker).                                                                                                                                                                                                 |
| `NO_THINKING_ALIAS_ENABLED`                 | boolean | `true`    |              | Pealüliti lüüsi no-think/<provider>/<model> aliastele. Sees (vaikimisi): /v1/models avaldab mõtlemiseta variandi iga sobiva mõtlemisvõimelise Claude'i mudeli jaoks ning päringus saadetud no-think/ ID teisendatakse tagasi tegelikuks mudeliks, mille arutluskäik on pärsitud. Väljas: variante ei avaldata ja no-think/ ID-d käsitletakse nagu mis tahes muud tundmatut mudeli ID-d. Mudelipõhine ModelSpec.noThinkingAlias lubamine/keelamine kehtib endiselt, kui see on sisse lülitatud.                                                                               |
| `OMNIROUTE_DISABLE_THINKING_LEVEL_VARIANTS` | boolean | `false`   |              | Keela mõtlemistaseme variantide (nt -low, -medium, -high) genereerimine /v1/models kataloogis.                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `OMNIROUTE_CHAT_VIRTUAL_LANES`              | boolean | `false`   | ✓            | Luba pakkujale edastamiseks rentnikupõhised kohanduvad virtuaalsed vastuvõturajad (#9654): ühe rentniku päringutulv ei põhjusta enam teisele 503-vastuseid. Keskkonnamuutuja OMNIROUTE_CHAT_VIRTUAL_LANES alistab selle töölaua sätte; muudatused jõustuvad serveri taaskäivitamisel.                                                                                                                                                                                                                                                                                        |
| `EXPOSE_FUNCTIONAL_GATEWAY_MIRRORS`         | boolean | `false`   |              | Avalda /v1/models kaudu <gateway-alias>/<model> peegel-ID-d mudelitele, mille kanoonilisel omanikul pole aktiivset mandaati, kuid mida marsruudib aktiivse mandaadiga läbivoolulüüs. Hoiatus: globaalsel lubamisel lisab kataloogikirjed kõigile klientidele.                                                                                                                                                                                                                                                                                                                |
| `NEWAPI_AGGREGATOR_BALANCE`                 | boolean | `false`   |              | Luba saldo tuvastamine New-API / One-API / Sub2API agregaatoriga ühilduvates sõlmedes. Kui see on lubatud, kuvavad agregaatorilipuga ühilduvad sõlmed oma saldo töölaual ja kvoodieelse kontrolli marsruutimisel.                                                                                                                                                                                                                                                                                                                                                            |
| `SERVER_OWNED_TOOL_LOOP_ENABLED`            | boolean | `false`   |              | Jätka mittevoogedastavaid serveri hallatavaid tööriistakutseid, kuni mudel tagastab kliendile kasutatava vastuse.                                                                                                                                                                                                                                                                                                                                                                                                                                                            |
| `SEARCH_STATS_HIDE_DELETED_CONNECTIONS`     | boolean | `false`   |              | Otsingustatistika ja hiljutised otsingud arvestavad ainult pakkujaid, millel on endiselt aktiivne ühendus (võtmeta pakkujaid, nagu duckduckgo-free, arvestatakse alati). Väljalülitatud olekus säilitatakse iga alleshoitud otsingurida koos pakkuja ID-ga.                                                                                                                                                                                                                                                                                                                  |
| `FREE_BADGE_REQUIRES_PROVIDER_FREE_TIER`    | boolean | `false`   |              | Töölaua pakkujalehed: kuva märk Free ainult signaalide korral, mida pakkuja toetab — jätab välja kuvatava nime heuristika, mitte-tõeväärtuslikud tasuta kasutuse väljad ja registreeritud pakkujate :free sufiksid, kui dokumenteeritud tasuta taset pole. Väljalülitatud olekus säilib senine märgireegel.                                                                                                                                                                                                                                                                  |
| `RETRY_AFTER_PROVENANCE_ENABLED`            | boolean | `false`   |              | Koondatud 429/503 kättesaamatuse vastustes jäta `Retry-After` välja, kui konkreetne tulevane korduskatse aeg pole teada (sünteetilise 1s asemel), lisa `error.retry_after_provenance` (`signal` \| `none`) ning luba kombinatsiooni tühjendusteedel lugeda korduskatse tekstilisi vihjeid JSON-ist ja ülesvoolu lihttekstkehadest. Väli ilmub ainult funktsiooni `unavailableResponse()` loodud vastustes; muud 429/503 kehad ei muutu.                                                                                                                                      |
| `PROTECTED_PRIORITY_INFRA_502_ENABLED`      | boolean | `false`   |              | Kui `priority` kombinatsiooni sihtmärk, mis on märgitud varuvariandiks ainult kvoodi ammendumise korral, peatab kombinatsiooni põhjusel, mis pole tõendatavalt kvoodiga seotud (pakkuja kaitselüliti on avatud, ennustava latentsuse tõttu vahelejätmine), vasta kvoodile viitava 503 asemel koodiga 502. Lukustusest, jahtumisest, kättesaamatusest, ammendumisest ja samaaegsuspiirangust tingitud peatumised jäävad koodiga 503.                                                                                                                                          |
| `MISTRAL_AMBIGUOUS_401_SOFT_LOCKOUT`        | boolean | `false`   |              | Paljas Mistrali 401 (`{"detail":"Unauthorized"}`, ilma otsese autentimissignaalita) on tühistatud võtme ja ammendunud kvoodi puhul identne. Kui see on sisse lülitatud, pannakse ühendus olekusse `expired` parkimise asemel jahtuma, maksimaalselt 3 korda tunnis ühenduse kohta; järgmine kord ühendus pargitakse, nii et tühistatud võti jõuab siiski lõppolekusse. Vaikimisi väljas: iga paljas Mistrali 401 pargib ühenduse nagu varem.                                                                                                                                 |
| `XAI_OAUTH_LIVE_MODEL_DISCOVERY`            | boolean | `false`   |              | Hangi `xai-oauth` ühenduste reaalajas xAI mudelikataloog aadressilt `https://api.x.ai/v1/models`, kasutades OAuthi esitaja tokenit, selle asemel et kasutada külmutatud staatilist algkogumit. Vaikimisi väljas: `xai-oauth` jätkab staatilise algkogumi muutmata kujul pakkumist. Mis tahes lahendusvea korral kasutatakse avastuse varuvariandina algkogumit (pole kontrollitud, kas x.ai aktsepteerib selles lõpp-punktis OAuthi esitaja tokenit).                                                                                                                        |
| `BATCH_AND_FILE_AUTO_CLEANUP_ENABLED`       | boolean | `false`   |              | Luba automaatsel puhastusel kustutada lõppolekus (completed/failed/cancelled/expired) Batch API tööd, mis on vanemad kui `OMNIROUTE_BATCH_RETENTION_DAYS`, koos nende reapõhiste kontrollpunktidega, ning tühjendada oma `expires_at` aja ületanud üleslaaditud failide BLOB-sisu. Vaikimisi väljas: iga olemasolev installatsioon säilitab need andmed täpselt nagu varem, kuni operaator funktsiooni lubab. Operaatori käivitatavat marsruuti `DELETE /api/v1/batches/delete-completed` see kummalgi juhul ei mõjuta — see on eraldiseisev tingimusteta avalik API leping. |

### CLI (5)

| Võti                                  | Tüüp    | Vaikeväärtus | Taaskäivitus | Kirjeldus                                                                                                                                                                                                                                                |
| ------------------------------------- | ------- | ------------ | ------------ | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CLI_COMPAT_ALL`                      | boolean | `false`      | ✓            | Luba ühilduvusrežiim kõigi CLI-klientide jaoks.                                                                                                                                                                                                          |
| `MODEL_ALIAS_COMPAT_ENABLED`          | boolean | `false`      |              | Luba mudelialiaste ühilduvuskiht.                                                                                                                                                                                                                        |
| `PRICING_SYNC_ENABLED`                | boolean | `false`      |              | Luba hinnakujundusandmete automaatne sünkroonimine (vajab ka keskkonnamuutujat `PRICING_SYNC_ENABLED`).                                                                                                                                                  |
| `OMNIROUTE_AUTO_SYNC_CODEX_PROFILES`  | boolean | `false`      |              | Pärast teenusepakkuja mudelite sünkroonimist kirjuta aktiivse kataloogi põhjal automaatselt (uuesti) profiilifailid ~/.codex/*.config.toml. Aktiivset/vaikimisi Codexi konfiguratsiooni ei muudeta kunagi. Vaikimisi väljas.                             |
| `OMNIROUTE_AUTO_SYNC_CLAUDE_PROFILES` | boolean | `false`      |              | Pärast teenusepakkuja mudelite sünkroonimist kirjuta aktiivse kataloogi põhjal automaatselt (uuesti) Claude Code'i profiilid ~/.claude/profiles/<name>/settings.json. Aktiivset/vaikimisi Claude'i konfiguratsiooni ei muudeta kunagi. Vaikimisi väljas. |

### Tervisekontroll (5)

| Võti                                      | Tüüp    | Vaikeväärtus | Kirjeldus                                                                                                                                                                                                                                                                                                          |
| ----------------------------------------- | ------- | ------------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `OMNIROUTE_DISABLE_LOCAL_HEALTHCHECK`     | boolean | `false`      | Keela kohaliku eksemplari tervisekontrolli lõpp-punkt.                                                                                                                                                                                                                                                             |
| `OMNIROUTE_DISABLE_TOKEN_HEALTHCHECK`     | boolean | `false`      | Keela loa valideerimise tervisekontroll.                                                                                                                                                                                                                                                                           |
| `SKILLS_SANDBOX_NETWORK_ENABLED`          | boolean | `false`      | Luba oskuste liivakastikeskkonnas võrgujuurdepääs.                                                                                                                                                                                                                                                                 |
| `PROXY_HEALTH_BLOCKED_RESETS_STREAK`      | boolean | `false`      | Puhverserverite tervisekontrolli käigus lähtestab sihtmärgi tagasilükatud päring (401/403/429) puhverserveri järjestikuste tõrgete seeria. Vaikimisi väljas: tagasilükkamine jääb neutraalseks (#10654). 5xx jääb mõlemal juhul ebaselgeks; tagasilükkamine ei eemalda, keela ega aktiveeri puhverserverit uuesti. |
| `DB_HEALTHCHECK_STARTUP_DEFERRED_ENABLED` | boolean | `false`      | Käivita DB tervikluse/terviseseisundi kontroll pärast seda, kui server hakkab päringuid vastu võtma (`setImmediate` kaudu), selle asemel et käivitamist kontrolli lõppemiseni blokeerida (#13717). Vaikimisi väljas: käivitamine blokeeritakse täpselt samamoodi nagu enne seda PR-i.                              |

> [!NOTE]
> `INPUT_SANITIZER_BLOCK_THRESHOLD` ja selle pärandalias
> `INJECTION_GUARD_BLOCK_THRESHOLD` häälestavad muutuja
> `INJECTION_GUARD_MODE` režiimi `block`, kuid need on tavalised keskkonnamuutujad, mida loeb
> [`src/shared/utils/injectionSeverity.ts`](../../src/shared/utils/injectionSeverity.ts),
> mitte funktsioonilipud: neil pole DB-poolset alistust ega juhtpaneeli lülitit. Vaata
> [`ENVIRONMENT.md`](./ENVIRONMENT.md#4-security--authentication).

> [!NOTE]
> Veerus `Taaskäivitus` märgitakse lipud, millel on `requiresRestart: true` — väärtus
> salvestatakse kohe, kuid rakendub alles pärast protsessi uuesti laadimist. Enum-tüüpi
> lipud lükkavad tagasi kõik väärtused, mis ei kuulu nende lubatud hulka (serveripoolne valideerimine toimub
> nii funktsioonis `setFeatureFlagOverride()` kui ka REST-i `PUT`-töötlejas).

---

## Lippude ümberlülitamine

### Töölaud

Liikuge jaotisse **Töölaud → Seaded → Funktsioonilipud**
(`/dashboard/settings/feature-flags`). Ruudustik
(`src/app/(dashboard)/dashboard/settings/components/FeatureFlagsGrid.tsx`)
toetab järgmist:

- **Otsing** võtme või kirjelduse järgi ja **filtreerimine** kategooria järgi (lisaks sünteetiline
  vaade **Nõuab taaskäivitamist**).
- **Lüliti** kahendväärtusega lippude ja **rippmenüü** loendväärtusega lippude jaoks
  (`src/app/(dashboard)/dashboard/settings/components/FeatureFlagCard.tsx`).
- Iga lipu **allikamärgis** — `DB`, `ENV` või `DEF` — näitab, kust
  kehtiv väärtus pärineb.
- Nupp **Lähtesta** (kuvatakse ainult `DB`-allikaga lippude puhul) ülekirjutuse eemaldamiseks
  ja allosas nupp **Lähtesta kõik ülekirjutused**.
- Bänner **Taaskäivita server**, kui muudetakse lippu `requiresRestart`.

### REST API

Kõik toimingud kasutavad üht marsruuti:
[`src/app/api/settings/feature-flags/route.ts`](../../src/app/api/settings/feature-flags/route.ts).
Iga meetod nõuab autenditud töölauaseanssi (vastasel juhul `401`).

#### `GET /api/settings/feature-flags`

Tagastab kõik lipud koos nende kehtiva väärtuse, allika ja kokkuvõttega.

```jsonc
{
  "flags": [
    {
      "key": "REQUIRE_API_KEY",
      "label": "Nõua API-võtit",
      "description": "Nõua API-võtit kõigi sissetulevate päringute puhul",
      "category": "security",
      "type": "boolean",
      "enumValues": null,
      "defaultValue": "false",
      "effectiveValue": "false",
      "source": "default", // "db" | "env" | "default"
      "requiresRestart": false,
      "warningLevel": "caution",
    },
    // ... kõik 72 lippu
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

Määrab või eemaldab ühe ülekirjutuse. Keha: `{ key: string; value?: string }`.
Välja `value` ärajätmine eemaldab ülekirjutuse (taastades keskkonnamuutuja / vaikeväärtuse).

```bash
# DB ülekirjutuse määramine
curl -X PUT http://localhost:20128/api/settings/feature-flags \
  -H "Content-Type: application/json" \
  -d '{"key":"REQUIRE_API_KEY","value":"true"}'

# Ülekirjutuse eemaldamine (ilma väljata "value")
curl -X PUT http://localhost:20128/api/settings/feature-flags \
  -H "Content-Type: application/json" \
  -d '{"key":"REQUIRE_API_KEY"}'
```

Vastus tagastab uued `effectiveValue`/`source` väärtused, varasemad `previousValue`/
`previousSource` väärtused ja `requiresRestart`. Tundmatud võtmed ja lubatud vahemikust väljapoole jäävad loendväärtused
lükatakse tagasi koodiga `400`.

#### `DELETE /api/settings/feature-flags`

Eemaldab korraga **kõik** DB ülekirjutused, taastades iga lipu keskkonnamuutuja / vaikeväärtuse.
Tagastab `{ cleared: <count>, message: "..." }`.

> [!NOTE]
> Lipud, mille puhul on `requiresRestart: true`, jõustuvad alles pärast protsessi uuesti laadimist.
> Töölaua taaskäivitusvoog kutsub välja `POST /api/restart` ja seejärel küsitleb
> `GET /api/health/ping`, kuni server on taas töös.

---

## Eelarve hädaolukorra varuvariant

`OMNIROUTE_EMERGENCY_FALLBACK` (kategooria `runtime`, vaikeväärtus `true`) juhib
hädaolukorra tasuta varuvariandi teed failis
[`open-sse/services/emergencyFallback.ts`](../../open-sse/services/emergencyFallback.ts).
Kui see on lubatud, suunatakse eelarve ammendanud päringud täieliku nurjumise asemel
tasuta varupakkujale/-mudelile. Määrake selle väärtuseks `false` (või `0`) — töölaua
lüliti, DB ülekirjutuse või keskkonnamuutuja `OMNIROUTE_EMERGENCY_FALLBACK`
kaudu — et see käitumine keelata ja lasta eelarve ammendanud päringutel
nurjuda. (Lisati töölaua lülitina PR-ides #3741 / #3752.)

---

## Vaata ka

- [Keskkonnamuutujate viide](./ENVIRONMENT.md) — enamikul lippudel on seal
  dokumenteeritud samanimeline keskkonnamuutuja (andmebaasi ülekirjutus on
  sellest prioriteetsem).
- [`src/shared/constants/featureFlagDefinitions.ts`](../../src/shared/constants/featureFlagDefinitions.ts)
  — kõigi lippude lõplik tõeallikas.
- [`src/shared/utils/featureFlags.ts`](../../src/shared/utils/featureFlags.ts)
  — lahendusloogika (`resolveFeatureFlag`, `isFeatureFlagEnabled`,
  `resolveAllFeatureFlags`).
- [`src/lib/db/featureFlags.ts`](../../src/lib/db/featureFlags.ts) — andmebaasi
  ülekirjutuste püsiv salvestamine tabeli `key_value` nimeruumis `feature_flags`.
