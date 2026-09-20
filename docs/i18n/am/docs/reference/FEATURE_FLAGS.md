# Feature Flags (አማርኛ)

🌐 **Languages:** 🇺🇸 [English](../../../../reference/FEATURE_FLAGS.md) · 🇸🇦 [ar](../../../ar/docs/reference/FEATURE_FLAGS.md) · 🇦🇿 [az](../../../az/docs/reference/FEATURE_FLAGS.md) · 🇧🇬 [bg](../../../bg/docs/reference/FEATURE_FLAGS.md) · 🇧🇩 [bn](../../../bn/docs/reference/FEATURE_FLAGS.md) · 🇨🇿 [cs](../../../cs/docs/reference/FEATURE_FLAGS.md) · 🇩🇰 [da](../../../da/docs/reference/FEATURE_FLAGS.md) · 🇩🇪 [de](../../../de/docs/reference/FEATURE_FLAGS.md) · 🇬🇷 [el](../../../el/docs/reference/FEATURE_FLAGS.md) · 🇪🇸 [es](../../../es/docs/reference/FEATURE_FLAGS.md) · 🇪🇪 [et](../../../et/docs/reference/FEATURE_FLAGS.md) · 🇮🇷 [fa](../../../fa/docs/reference/FEATURE_FLAGS.md) · 🇫🇮 [fi](../../../fi/docs/reference/FEATURE_FLAGS.md) · 🇫🇷 [fr](../../../fr/docs/reference/FEATURE_FLAGS.md) · 🇮🇪 [ga](../../../ga/docs/reference/FEATURE_FLAGS.md) · 🇮🇳 [gu](../../../gu/docs/reference/FEATURE_FLAGS.md) · 🇳🇬 [ha](../../../ha/docs/reference/FEATURE_FLAGS.md) · 🇮🇱 [he](../../../he/docs/reference/FEATURE_FLAGS.md) · 🇮🇳 [hi](../../../hi/docs/reference/FEATURE_FLAGS.md) · 🇭🇷 [hr](../../../hr/docs/reference/FEATURE_FLAGS.md) · 🇭🇺 [hu](../../../hu/docs/reference/FEATURE_FLAGS.md) · 🇦🇲 [hy](../../../hy/docs/reference/FEATURE_FLAGS.md) · 🇮🇩 [id](../../../id/docs/reference/FEATURE_FLAGS.md) · 🇳🇬 [ig](../../../ig/docs/reference/FEATURE_FLAGS.md) · 🇮🇹 [it](../../../it/docs/reference/FEATURE_FLAGS.md) · 🇯🇵 [ja](../../../ja/docs/reference/FEATURE_FLAGS.md) · 🇬🇪 [ka](../../../ka/docs/reference/FEATURE_FLAGS.md) · 🇰🇭 [km](../../../km/docs/reference/FEATURE_FLAGS.md) · 🇮🇳 [kn](../../../kn/docs/reference/FEATURE_FLAGS.md) · 🇰🇷 [ko](../../../ko/docs/reference/FEATURE_FLAGS.md) · 🇱🇹 [lt](../../../lt/docs/reference/FEATURE_FLAGS.md) · 🇱🇻 [lv](../../../lv/docs/reference/FEATURE_FLAGS.md) · 🇮🇳 [ml](../../../ml/docs/reference/FEATURE_FLAGS.md) · 🇮🇳 [mr](../../../mr/docs/reference/FEATURE_FLAGS.md) · 🇲🇾 [ms](../../../ms/docs/reference/FEATURE_FLAGS.md) · 🇲🇹 [mt](../../../mt/docs/reference/FEATURE_FLAGS.md) · 🇲🇲 [my](../../../my/docs/reference/FEATURE_FLAGS.md) · 🇳🇵 [ne](../../../ne/docs/reference/FEATURE_FLAGS.md) · 🇳🇱 [nl](../../../nl/docs/reference/FEATURE_FLAGS.md) · 🇳🇴 [no](../../../no/docs/reference/FEATURE_FLAGS.md) · 🇮🇳 [or](../../../or/docs/reference/FEATURE_FLAGS.md) · 🇮🇳 [pa](../../../pa/docs/reference/FEATURE_FLAGS.md) · 🇵🇭 [phi](../../../phi/docs/reference/FEATURE_FLAGS.md) · 🇵🇱 [pl](../../../pl/docs/reference/FEATURE_FLAGS.md) · 🇵🇹 [pt](../../../pt/docs/reference/FEATURE_FLAGS.md) · 🇧🇷 [pt-BR](../../../pt-BR/docs/reference/FEATURE_FLAGS.md) · 🇷🇴 [ro](../../../ro/docs/reference/FEATURE_FLAGS.md) · 🇷🇺 [ru](../../../ru/docs/reference/FEATURE_FLAGS.md) · 🇱🇰 [si](../../../si/docs/reference/FEATURE_FLAGS.md) · 🇸🇰 [sk](../../../sk/docs/reference/FEATURE_FLAGS.md) · 🇸🇮 [sl](../../../sl/docs/reference/FEATURE_FLAGS.md) · 🇷🇸 [sr](../../../sr/docs/reference/FEATURE_FLAGS.md) · 🇸🇪 [sv](../../../sv/docs/reference/FEATURE_FLAGS.md) · 🇰🇪 [sw](../../../sw/docs/reference/FEATURE_FLAGS.md) · 🇮🇳 [ta](../../../ta/docs/reference/FEATURE_FLAGS.md) · 🇮🇳 [te](../../../te/docs/reference/FEATURE_FLAGS.md) · 🇹🇭 [th](../../../th/docs/reference/FEATURE_FLAGS.md) · 🇹🇷 [tr](../../../tr/docs/reference/FEATURE_FLAGS.md) · 🇺🇦 [uk-UA](../../../uk-UA/docs/reference/FEATURE_FLAGS.md) · 🇵🇰 [ur](../../../ur/docs/reference/FEATURE_FLAGS.md) · 🇺🇿 [uz](../../../uz/docs/reference/FEATURE_FLAGS.md) · 🇻🇳 [vi](../../../vi/docs/reference/FEATURE_FLAGS.md) · 🇳🇬 [yo](../../../yo/docs/reference/FEATURE_FLAGS.md) · 🇨🇳 [zh-CN](../../../zh-CN/docs/reference/FEATURE_FLAGS.md) · 🇹🇼 [zh-TW](../../../zh-TW/docs/reference/FEATURE_FLAGS.md)

---

> ያለ **ዳግም ማሰማራት** የOmniRouteን ባህሪ የሚቀይሩ የሩጫ ጊዜ መቀያየሪያዎች።
> እዚህ የተዘረዘረው እያንዳንዱ ጠቋሚ በ
> [`src/shared/constants/featureFlagDefinitions.ts`](../../src/shared/constants/featureFlagDefinitions.ts)
> ውስጥ ተገልጿል — ይህም ብቸኛው የእውነት ምንጭ ነው። ዳሽቦርዱም ሆነ REST API ከዚያ
> ፋይል ስለሚያነቡ፣ ከታች ያለው ሰንጠረዥ ከእሱ ጋር 1:1 እንዲዛመድ ተፈጥሯል።

---

## የባህሪ ጠቋሚዎች ምንድን ናቸው

የባህሪ ጠቋሚ በስም የተሰየመ መቀያየሪያ (boolean ወይም enum) ሲሆን፣ እሴቱ በሩጫ ጊዜ
ሊቀየር እና ዳግም የሂደት ማሰማራት ሳያስፈልግ በውሂብ ጎታው ውስጥ ሊቀመጥ ይችላል። እያንዳንዱ
ጠቋሚ `key`፣ `label`፣ `description`፣ `category`፣ `defaultValue`፣ `type` እና `requiresRestart`
ፍንጭ ባለው `FeatureFlagDefinition` ይገለጻል።

### የመፍትሔ ቅደም ተከተል

የአንድ ጠቋሚ **ተግባራዊ እሴት** በ
[`resolveFeatureFlag()`](../../src/shared/utils/featureFlags.ts) በሚከተለው
ቅድሚያ ይወሰናል (ከፍተኛው ያሸንፋል)፦

1. **የDB ተተኪ እሴት** — በ`feature_flags` የስም ክልል ስር ባለው `key_value`
   ሰንጠረዥ ውስጥ የተከማቸ እሴት (በዳሽቦርዱ ወይም በREST API በኩል የሚዋቀር)።
2. **የአካባቢ ተለዋዋጭ** — ከተዋቀረ እና ባዶ ካልሆነ `process.env[<KEY>]`።
3. **የትርጉም ነባሪ** — ከ`featureFlagDefinitions.ts` የሚገኘው `defaultValue`።

የboolean ጠቋሚ ተግባራዊ እሴቱ `"true"`፣ `"1"` ወይም `"yes"` ሲሆን
**እንደነቃ** ይቆጠራል (`isFeatureFlagEnabled()`ን ይመልከቱ)።

> [!NOTE]
> አብዛኞቹ ጠቋሚዎች በ[`ENVIRONMENT.md`](./ENVIRONMENT.md) ውስጥ የተመዘገበ
> **ተመሳሳይ ስም** ያለው ተዛማጅ የአካባቢ ተለዋዋጭም አላቸው። የጠቋሚው የDB ተተኪ እሴት
> ከዚያ የአካባቢ ተለዋዋጭ ቅድሚያ ይኖረዋል። `requiresRestart: true` ያለው ጠቋሚ
> ወዲያውኑ ይቀመጣል፣ ነገር ግን ዳግም የሚነበበው ሂደቱ ሲጀምር ብቻ ነው — እሱን መቀያየር በዳሽቦርዱ ውስጥ
> **"አገልጋዩን ዳግም ያስጀምሩ"** የሚል ሰንደቅ ያሳያል።

---

## የጠቋሚዎች ማውጫ

በ6 ምድቦች ውስጥ 72 ጠቋሚዎች። **ነባሪ** ማለት የትርጉሙ ነባሪ ነው — የDB ተተኪ እሴትም ሆነ
የአካባቢ ተለዋዋጭ በሌለበት ጊዜ ጥቅም ላይ የሚውለው እሴት።

### ደህንነት (10)

| ቁልፍ                                     | ዓይነት    | ነባሪ      | መግለጫ                                                                                                                                                                                                  |
| --------------------------------------- | ------- | -------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `REQUIRE_API_KEY`                       | boolean | `false`  | ለሁሉም ገቢ ጥያቄዎች API ቁልፍ እንዲኖር አስገዳጅ ያድርጉ።                                                                                                                                                               |
| `INPUT_SANITIZER_ENABLED`               | boolean | `true`   | ለሁሉም ጥያቄዎች የግቤት ማጽዳትን ያንቁ።                                                                                                                                                                            |
| `INJECTION_GUARD_MODE`                  | enum    | `off`    | የፕሮምፕት መርፌ ጥቃት መከላከያ ሁነታ። እሴቶች፦ `off`፣ `warn`፣ `block`፣ `redact`።                                                                                                                                     |
| `PII_REDACTION_ENABLED`                 | boolean | `false`  | PIIን ከጥያቄዎች ያጥፉ (`INPUT_SANITIZER_MODE` ላይ ያልተመሠረተ)።                                                                                                                                                  |
| `PII_RESPONSE_SANITIZATION`             | boolean | `false`  | PIIን ከአቅራቢ ምላሾች ያጽዱ።                                                                                                                                                                                  |
| `PII_RESPONSE_SANITIZATION_MODE`        | enum    | `redact` | ለPII ምላሽ ማጽዳት የሚውል ሁነታ። እሴቶች፦ `redact`፣ `warn`፣ `block`፣ `off`።                                                                                                                                       |
| `OUTBOUND_SSRF_GUARD_ENABLED`           | boolean | `true`   | ወደ የግል/ውስጣዊ IP ክልሎች የሚደረጉ ወጪ ጥያቄዎችን ያግዱ።                                                                                                                                                              |
| `ALLOW_API_KEY_REVEAL`                  | boolean | `false`  | የተረጋገጡ የዳሽቦርድ ተጠቃሚዎች የተሸፈኑ እሴቶችን ብቻ ከማየት ይልቅ የተከማቹ API ቁልፎችን እንዲያሳዩ ይፍቀዱ።                                                                                                                             |
| `AUTH_LOG_INCLUDE_ACCOUNT_ID`           | boolean | `false`  | በAUTH ምዝግብ መስመሮች ውስጥ የመለያ ቅድመ ቅጥያውን ያካትቱ (ለምሳሌ፦ "<provider> መለያ ጥቅም ላይ እየዋለ ነው፦ abc12345...")። የመለያ መለያዎች ከጋራ/ባለብዙ ተከራይ የሂደት ምዝግቦች እንዲደበቁ በነባሪ ተሰናክሏል። ከDebug Mode ነጻ ነው፤ Debug Modeን መቀየር ይህን አያሳይም። |
| `OMNIROUTE_OIDC_DISABLE_PASSWORD_LOGIN` | boolean | `false`  | OIDC ሲነቃ፣ ተጠቃሚዎች በOIDC Single Sign-On በኩል ብቻ ማረጋገጥ እንዲችሉ በይለፍ ቃል መግባትን ያሰናክሉ። ሲሰናከል (ነባሪው)፣ በይለፍ ቃል መግባትም ሆነ OIDC ይገኛሉ።                                                                               |

### አውታረ መረብ (15)

| ቁልፍ                                             | ዓይነት    | ነባሪ     | ዳግም ማስጀመር | መግለጫ                                                                                                                                                                                                                                                                                                                                                                                                      |
| ----------------------------------------------- | ------- | ------- | --------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ENABLE_TLS_FINGERPRINT`                        | boolean | `false` | ✓         | የTLS fingerprint ስውር ሁነታን ያንቁ።                                                                                                                                                                                                                                                                                                                                                                            |
| `AUDIO_REMOTE_PROVIDER_NODES`                   | boolean | `false` |           | የ/v1/audio/* መስመሮች localhost ውጭ የሚስተናገዱ OpenAI-ተኳኋኝ provider nodes እንዲጠቀሙ ይፍቀዱ። በነባሪ ጠፍቷል — audioን ወደ remote host ማዞር የወጪ ትራፊክ ማንነትን ይቀይራል፣ ስለዚህ ግልጽ የoperator ውሳኔ መሆን አለበት። Loopback nodes ሁልጊዜ የተፈቀዱ ሲሆኑ በዚህ አይነኩም።                                                                                                                                                                                     |
| `PROXY_AUTO_SELECT_ENABLED`                     | boolean | `false` |           | ለአንድ connection proxy ካልተመደበለት፣ ከregistryው ውስጥ የመጀመሪያውን የሚሠራ proxy በራስ-ሰር ይምረጡ። በነባሪ ጠፍቷል (ካልሆነ ማንኛውም የregistry proxy ዓለም አቀፍ fallback ይሆናል — #3332)።                                                                                                                                                                                                                                                     |
| `OMNIROUTE_CONTROL_PLANE_PROXY_DIRECT_FALLBACK` | boolean | `false` |           | የproxy ተደራሽነት ቅድመ-ምርመራዎች ሳይሳኩ ሲቀሩ፣ OAuth እና provider validation flows የተወሰነላቸውን proxy አልፈው በቀጥታ እንዲገናኙ ይፍቀዱ። ይህ የወጪ ትራፊክ IPን ሊቀይር ስለሚችል በነባሪ ጠፍቷል።                                                                                                                                                                                                                                                        |
| `NETWORK_ROTATION_SHARED_EGRESS_GUARD`          | boolean | `true`  |           | በmulti-account rotation executor ላይ የnetwork exception (timeout፣ connection refused/reset) ሲከሰት፣ ያልተሳካው account የራሱ dedicated proxy ከሌለው፣ እያንዳንዱን እንደገና ከመሞከር ይልቅ አጭር cooldown ይተግብሩ እና ለቀሪው request proxy የሌላቸውን ሌሎች accounts ይዝለሉ። በነባሪ በርቷል (ደህንነቱ የተጠበቀ፦ የወጪ ትራፊክ IP አይቀየርም፤ በshared-egress accounts ላይ የlatency/cooldown አደጋን ብቻ ይቀንሳል)። የመጀመሪያው proxy የሌለው throw ሲከሰት ፈጣን propagationን ለመመለስ ያሰናክሉ። |
| `PROXY_SKIP_RECENTLY_FAILED`                    | boolean | `false` |           | Proxy pools እና የopencode per-account rotation አሁን ያልተሳካ proxyን (ያልተሳካ TCP probe፣ ወይም በእሱ በኩል የተቀበለው 429)፣ በእያንዳንዱ ተደጋጋሚ ሙከራ እስከ ከፍተኛ ገደብ ድረስ በእጥፍ ለሚጨምር የper-process ጊዜ እንደገና ማቅረብ ያቆማሉ። ምንም የproxy status አይጻፍም፤ እያንዳንዱ candidate ወደ ጎን ሲቀመጥ ምርጫው ሳይቀየር ይቆያል። በነባሪ ጠፍቷል።                                                                                                                                 |
| `PROXY_POOL_EGRESS_OBSERVATION`                 | boolean | `false` |           | በdashboard ውስጥ ከproxy pool ስር፣ ባለፉት 24 h ምን ያህል የታዩ የወጪ ትራፊክ IPs አባላቱን እንዳገለገሉ እና ምን ያህል connections እንደተጠቀሙባቸው ያሳዩ። ለንባብ ብቻ ነው፣ ከproxy log ይሰላል፣ ፈጽሞ ለrouting አይጠቀምም። በነባሪ ጠፍቷል።                                                                                                                                                                                                                         |
| `OPENCODE_RESPONSES_STALL_ROTATION`             | boolean | `false` |           | ለOpenCode executor፣ የstreamed Responses reply የመጀመሪያውን body byte ይከታተሉ (መስኮት፦ `RESPONSES_FIRST_BYTE_TIMEOUT_MS`፣ ነባሪ `15000`)። መስኮቱ ካለፈ በኋላም ዝም ያለ 2xx Responses stream stalled ተደርጎ ይወሰዳል፦ accountው cooldown ይደረጋል እና requestው አንድ ጊዜ ወደ ቀጣዩ account ይዞራል፤ ሁለተኛ stall በፍጥነት ያስከሽፋል። በነባሪ ጠፍቷል፦ stalled streams እስከ stream readiness timeout ድረስ ያለውን የዛሬ መጠበቅ ይቀጥላሉ።                                     |
| `OPENCODE_USER_BLOCKED_ROTATION`                | boolean | `false` |           | OpenCode executor፦ `user_blocked` refusal ያለበት 403/451 ሲያጋጥም (geo ያልሆነ፣ የCloudflare fingerprint rejection ያልሆነ)፣ refused accountውን cooldown ያድርጉ እና በእያንዳንዱ request ቢበዛ አንድ ጊዜ ወደ ቀጣዩ account ያዙሩ፤ ሁለተኛ refusal ያለ success mark እንዳለ ይመለሳል። በነባሪ ጠፍቷል፦ upstream user blockን አልፎ routing ማድረግ እንደ ማምለጥ ሊታይ እና flagውን በመላው fleet ሊያሰራጭ ይችላል።                                                                |
| `OPENCODE_TRANSIENT_FAILOVER_BACKOFF`           | boolean | `false` |           | OpenCode rotation፦ ሁለት ተከታታይ transient upstream failures (5xx ወይም ባዶ 400) ከተከሰቱ በኋላ፣ ወደ ቀጣዩ account ከመሄድዎ በፊት ይቆዩ — 1.5s ሲሆን በእያንዳንዱ ተጨማሪ failure በእጥፍ ይጨምራል፣ በእያንዳንዱ pause 6s እና በእያንዳንዱ request 10s ላይ ይገደባል፣ client ግንኙነቱን ሲያቋርጥ ይዘለላል፤ ያልተሳካው body ከመጠበቁ በፊት ይለቀቃል። በነባሪ ጠፍቷል፦ failover ፈጣን ሆኖ ይቆያል።                                                                                                  |
| `OPENCODE_RATE_LIMITED_429_EARLY_STOP`          | boolean | `false` |           | OpenCode rotation፦ እንደ እውነተኛ rate limit በተመደበው የመጀመሪያ 429 ላይ account waveውን ያቁሙ (ሊተነተን የሚችል `Retry-After`፣ ወይም rate/usage limitን የሚጠቅስ body) እና ያንን upstream 429 ሳይቀየር ይመልሱ። ያልተመደቡ 429s rotationን ይቀጥላሉ። በነባሪ ጠፍቷል፦ free tier በእያንዳንዱ የወጪ ትራፊክ IP የተገደበ ነው (#9611)፣ ስለዚህ እያንዳንዱ 429 rotation ያደርጋል እና ያለቀ wave የመጨረሻውን upstream 429 ይመልሳል።                                                               |
| `MITM_DISABLE_TLS_VERIFY`                       | boolean | `false` | ✓         | ለMITM proxy የTLS certificate verificationን ያሰናክሉ። **አደገኛ።**                                                                                                                                                                                                                                                                                                                                               |
| `OMNIROUTE_ALLOW_PRIVATE_PROVIDER_URLS`         | boolean | `false` |           | ወደ private/internal networks የሚያመለክቱ provider URLsን ይፍቀዱ።                                                                                                                                                                                                                                                                                                                                                 |
| `OMNIROUTE_ALLOW_LOCAL_PROVIDER_URLS`           | boolean | `true`  |           | በlocal/private addresses (127.0.0.1, localhost, LAN) ላይ providersን ማከል/ማረጋገጥ ይፍቀዱ። በነባሪ በርቷል (local-first)፤ ጥብቅ public-only blocking ለማድረግ ያሰናክሉ። Cloud-metadata እንደታገደ ይቆያል።                                                                                                                                                                                                                             |
| `ENABLE_CC_COMPATIBLE_PROVIDER`                 | boolean | `false` | ✓         | ከClaude Code ጋር ተኳኋኝ የሆነ provider modeን ያንቁ።                                                                                                                                                                                                                                                                                                                                                              |

### ፖሊሲዎች (5)

| ቁልፍ                             | ዓይነት    | ነባሪ        | መግለጫ                                                                                                                                                 |
| ------------------------------- | ------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------- |
| `TOOL_POLICY_MODE`              | enum    | `disabled` | የመሣሪያ አጠቃቀም ፖሊሲ ማስፈጸሚያ ሁነታ። እሴቶች፦ `disabled`፣ `warn`፣ `block`።                                                                                       |
| `RATE_LIMIT_AUTO_ENABLE`        | boolean | `false`    | በአጠቃቀም ስልቶች ላይ በመመሥረት የጥያቄ መጠን ገደብን በራስ-ሰር ያንቁ።                                                                                                      |
| `DISABLE_CONTEXT_WINDOW_CHECKS` | boolean | `false`    | ቀጥተኛ የአንድ-ሞዴል ጥያቄዎችን በተመለከተ የOmniRoute አካባቢያዊ የዐውድ መስኮት / ከፍተኛ የግቤት ቶከን ፍተሻን ዝለል። የወደላይ አቅራቢ ገደቦች አሁንም ተፈጻሚ ናቸው።                                     |
| `CAPABILITY_FILTER_ENABLED`     | boolean | `false`    | ዒላማው ሞዴል አስፈላጊ ችሎታዎች ከሌሉት (ምስል፣ መሣሪያዎች፣ የተዋቀረ ውጤት፣ የዐውድ መስኮት) ጥያቄዎችን ከመላካቸው በፊት ውድቅ ያድርጉ። የጥምር-ንብርብር ተኳኋኝነት ማጣሪያን የሚያልፉ ቀጥተኛ የአንድ-አቅራቢ ጥያቄዎችን ይጠብቃል። |
| `RADAR_ENABLED`                 | boolean | `false`    | የOmniRoute Radar ሞጁልን (የካታሎግ ምግብ ማሳያዎችን እና ማመሳሰልን) ያንቁ። በነባሪ ጠፍቷል፤ ማንቃት የተጠቃሚ በይነገጹን ብቻ ይከፍታል — የውሂብ ማመሳሰል የተለየ የመርጦ መግባት ሂደት ሆኖ ይቆያል።               |

### የአሂድ ጊዜ (32)

| ቁልፍ                                         | ዓይነት    | ነባሪ     | ዳግም ማስጀመር | መግለጫ                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ------------------------------------------- | ------- | ------- | --------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `UNIVERSAL_CONTEXT_HANDOFF_ENABLED`         | boolean | `true`  |           | የኮምቦ ማዘዋወር ሞዴሎችን ሲቀይር የውይይት ማጠቃለያዎችን ያመነጫል እና ያስገባል። የሞዴል መቀያየርን በተናጠል ለማስተናገድ እና ለሁሉም ነባርና ወደፊት ለሚፈጠሩ ኮምቦዎች የጀርባ ሂደት ርክክብ ጥያቄዎችን ለመከላከል ያሰናክሉት።                                                                                                                                                                                                                                                                           |
| `RESPONSES_PASSTHROUGH_DROP_COMMENTARY`     | boolean | `true`  |           | ወደ ደንበኞች ከመላካቸው በፊት የውስጥ አስተያየት-ደረጃ ውጤት ንጥሎችን ከResponses API passthrough ዥረቶች ያስወግዳል። ጥሬውን የላይኛው ምንጭ አስተያየት ለመቀበል ያሰናክሉት።                                                                                                                                                                                                                                                                                                  |
| `OMNIROUTE_MCP_ENFORCE_SCOPES`              | boolean | `true`  |           | በMCP መሣሪያ መዳረሻ ላይ የወሰን ገደቦችን ያስፈጽማል።                                                                                                                                                                                                                                                                                                                                                                                       |
| `OMNIROUTE_MCP_COMPRESS_DESCRIPTIONS`       | boolean | `false` |           | የቶከን አጠቃቀምን ለመቀነስ የMCP መሣሪያ መግለጫዎችን ይጨምቃል።                                                                                                                                                                                                                                                                                                                                                                                 |
| `OMNIROUTE_ENABLE_RUNTIME_BACKGROUND_TASKS` | boolean | `false` |           | በአሂድ ጊዜ የጀርባ ሂደት ተግባር ማቀናበርን ያነቃል።                                                                                                                                                                                                                                                                                                                                                                                         |
| `OMNIROUTE_DISABLE_BACKGROUND_SERVICES`     | boolean | `false` | ✓         | ሁሉንም የጀርባ ሂደት አገልግሎቶች (የኮታ ማደስ፣ ማመሳሰል፣ ወዘተ) ያሰናክላል።                                                                                                                                                                                                                                                                                                                                                                        |
| `OMNIROUTE_RTK_TRUST_PROJECT_FILTERS`       | boolean | `false` |           | የፕሮጀክት-ደረጃ RTK ማጣሪያዎችን ያለማረጋገጫ ያምናል።                                                                                                                                                                                                                                                                                                                                                                                       |
| `OMNIROUTE_ENABLE_LIVE_WS`                  | boolean | `true`  | ✓         | ሲመጣ የቅጽበታዊ ዳሽቦርድ WebSocket አገልጋይን ያስጀምራል (በነባሪ ፖርት 20132)።                                                                                                                                                                                                                                                                                                                                                                 |
| `OMNIROUTE_CODEX_WS_ENABLED`                | boolean | `true`  |           | Codex የResponses-over-WebSocket ማጓጓዣን እንዲጠቀም ይፈቅዳል። ሲጠፋ Codex ወደ HTTP Responses ይመለሳል።                                                                                                                                                                                                                                                                                                                                     |
| `OMNIROUTE_CODEX_APP_SERVER_ENABLED`        | boolean | `true`  |           | Codex የአካባቢ app-server WebSocket JSON-RPC ማጓጓዣን (codexTransport=app-server) እንዲጠቀም ይፈቅዳል። ሲጠፋ app-serverን ለመጠቀም የተመረጡ ግንኙነቶች ወደ ሌሎች የCodex ማጓጓዣዎች ይመለሳሉ።                                                                                                                                                                                                                                                                   |
| `OMNIROUTE_EMERGENCY_FALLBACK`              | boolean | `true`  |           | በጀታቸው ያለቀ ጥያቄዎችን ወደ ድንገተኛ ነጻ ተተኪ አቅራቢ/ሞዴል ያዘዋውራል። (ከታች [የድንገተኛ በጀት ተተኪ](#emergency-budget-fallback)ን ይመልከቱ።)                                                                                                                                                                                                                                                                                                               |
| `STREAM_RECOVERY_ENABLED`                   | boolean | `false` |           | ማንኛውም የምላሽ ባይቶች ወደ ደንበኛው ከመድረሳቸው በፊት ለተቆረጡ የላይኛው ምንጭ SSE ዥረቶች ግልጽ የሆነ ቀደምት ዳግም ሙከራን ያነቃል።                                                                                                                                                                                                                                                                                                                                  |
| `STREAM_RECOVERY_MIDSTREAM_ENABLED`         | boolean | `false` |           | ባይቶች ቀድሞውኑ ወደ ደንበኛው ከደረሱ በኋላ የዥረት መልሶ ማግኘት ምላሽን ዳግም እንዲጠይቅና እንዲያገናኝ ይፈቅዳል።                                                                                                                                                                                                                                                                                                                                                 |
| `STREAM_RECOVERY_TOOLCALL_ORDER_FIX`        | boolean | `false` |           | የዥረት-መካከል ቀጣይነትን ለመሣሪያ ጥሪ ደህንነቱ የተጠበቀ ያደርጋል፦ አንድ ጊዜ የመሣሪያ ጥሪ ከተለቀቀ (በሂደት ላይ ወይም በfinish_reason tool_calls አስቀድሞ ከተጠናቀቀ) የተቆረጠ ዥረትን ፈጽሞ አይቀጥልም፣ እና መላውን በጀት ከማውጣት ይልቅ ከአንድ ባዶ ቀጣይነት በኋላ ይዘጋል። ጠፍቶ ሲሆን፦ የልቀት ባህሪ።                                                                                                                                                                                                            |
| `STREAM_EARLY_EOF_SIBLING_FAILOVER_ENABLED` | boolean | `false` |           | አንድ SSE ዥረት ማንኛውንም ጠቃሚ ፍሬም ከመልቀቁ በፊት ሲዘጋ እና የተወሰነው የተመሳሳይ-ግንኙነት ዳግም ሙከራ ሲያልቅ፣ አንድ ጊዜ ወደ እኩያ ግንኙነት ያስተላልፋል፤ ጥቅም ላይ የሚውል እኩያ ከሌለ የመጀመሪያው `STREAM_EARLY_EOF` 502 ይመለሳል። በነባሪ ጠፍቷል፦ ቀደምት-EOF ከተመሳሳይ-ግንኙነት ዳግም ሙከራ በኋላ መጨረሻ ሆኖ ይቆያል።                                                                                                                                                                                            |
| `MODEL_CATALOG_INCLUDE_NAMES`               | boolean | `true`  |           | በ`/v1/models` ምላሾች ውስጥ ለእይታ አመቺ የሆኑ የስም መስኮችን ያካትታል። የሞዴል መታወቂያዎችን ብቻ ለሚጠብቁ ደንበኞች ያሰናክሉት።                                                                                                                                                                                                                                                                                                                                  |
| `MODELS_CATALOG_PREFIX_MODE`                | enum    | `dual`  |           | የሞዴል መታወቂያዎች በ/v1/models ውስጥ እንዴት ቅድመ ቅጥያ እንደሚያገኙ ይቆጣጠራል። 'dual' (ነባሪ) ለኋላ ተኳኋኝነት ሁለቱንም ቅጽል ስም እና መደበኛ provider-id ቅድመ ቅጥያዎችን ያወጣል። 'alias' አጭሩን የቅጽል ስም ቅድመ ቅጥያ ብቻ ያወጣል (ለምሳሌ ds-web/model፣ deepseek-web/model አይደለም)። 'canonical' ሙሉውን provider-id ቅድመ ቅጥያ ብቻ ያወጣል። እሴቶች፦ `dual`፣ `alias`፣ `canonical`።                                                                                                                  |
| `ARENA_ELO_SYNC_ENABLED`                    | boolean | `true`  |           | ለሞዴል የመረጃ ደረጃዎች ወቅታዊ የArena AI የመሪዎች ሰንጠረዥ ELO ማመሳሰልን ያነቃል።                                                                                                                                                                                                                                                                                                                                                                |
| `EXPOSE_CC_DISCOVERY_ALIASES`               | boolean | `false` |           | የClaude Code ጌትዌይ የሞዴል ፍለጋ Claude ያልሆኑ ሞዴሎችን እንዲዘረዝር `claude/<provider>/<model>` የመስታወት መታወቂያዎችን በ`/v1/models` ላይ ያስተዋውቃል። የሦስት-ደረጃ በር ዓለም አቀፍ ደረጃ (env ከዳሽቦርዱ ማሻሻያ ይቀድማል)። [የClaude Code ውቅር](../guides/CLAUDE-CODE-CONFIGURATION.md#discovery-aliases--surface-non-claude-models-in-the-model-picker)ን ይመልከቱ።                                                                                                            |
| `NO_THINKING_ALIAS_ENABLED`                 | boolean | `true`  |           | ለno-think/<provider>/<model> ጌትዌይ ቅጽል ስሞች ዋና ማብሪያ/ማጥፊያ። ሲበራ (ነባሪ)፦ /v1/models ለእያንዳንዱ ብቁ የማሰብ ችሎታ ላለው Claude ሞዴል የማያስብ ተለዋጭ ያስተዋውቃል፣ እና በጥያቄ ውስጥ የተላከ no-think/ መታወቂያ አመክንዮ ተገድቦ ወደ እውነተኛው ሞዴል ይፈታል። ሲጠፋ፦ ምንም ተለዋጮች አይተዋወቁም እና no-think/ መታወቂያ እንደማንኛውም ሌላ ያልታወቀ የሞዴል መታወቂያ ይያዛል። ይህ በርቶ ሳለ የእያንዳንዱ ሞዴል ModelSpec.noThinkingAlias የመርጦ-መግባት/የመርጦ-መውጣት አሁንም ይተገበራል።                                                         |
| `OMNIROUTE_DISABLE_THINKING_LEVEL_VARIANTS` | boolean | `false` |           | በ/v1/models ካታሎግ ውስጥ የማሰብ ደረጃ ተለዋጮችን (ለምሳሌ -low፣ -medium፣ -high) ማመንጨትን ያሰናክላል።                                                                                                                                                                                                                                                                                                                                            |
| `OMNIROUTE_CHAT_VIRTUAL_LANES`              | boolean | `false` | ✓         | ለአቅራቢ መላክ በተከራይ የሚስማሙ ምናባዊ የመግቢያ መስመሮችን ያነቃል (#9654)፦ የአንድ ተከራይ ድንገተኛ ጭማሪ ከእንግዲህ ሌላውን 503 አያስከትልበትም። OMNIROUTE_CHAT_VIRTUAL_LANES env var ከዚህ የዳሽቦርድ ማሻሻያ ይቀድማል፤ ለውጦች አገልጋዩ ዳግም ሲጀመር ተግባራዊ ይሆናሉ።                                                                                                                                                                                                                           |
| `EXPOSE_FUNCTIONAL_GATEWAY_MIRRORS`         | boolean | `false` |           | መደበኛ ባለቤታቸው ንቁ ማረጋገጫ የሌለው ነገር ግን ንቁ ማረጋገጫ ያለው passthrough ጌትዌይ የሚያዘዋውራቸው ሞዴሎችን በተመለከተ <gateway-alias>/<model> የመስታወት መታወቂያዎችን በ/v1/models ላይ ያስተዋውቃል። ማስጠንቀቂያ፦ በዓለም አቀፍ ደረጃ ሲነቃ ለሁሉም ደንበኞች የካታሎግ ግቤቶችን ይጨምራል።                                                                                                                                                                                                              |
| `NEWAPI_AGGREGATOR_BALANCE`                 | boolean | `false` |           | ከNew-API / One-API / Sub2API አሰባሳቢ ጋር ተኳኋኝ ለሆኑ ኖዶች የቀሪ ሂሳብ ማወቅን ያነቃል። ሲነቃ፣ የአሰባሳቢ ባንዲራ የተዘጋጀላቸው ተኳኋኝ ኖዶች ቀሪ ሂሳባቸውን በዳሽቦርዱ እና በኮታ-ቅድመ ማጣሪያ ማዘዋወር ውስጥ ሪፖርት ያደርጋሉ።                                                                                                                                                                                                                                                            |
| `SERVER_OWNED_TOOL_LOOP_ENABLED`            | boolean | `false` |           | ሞዴሉ ደንበኛው ሊጠቀምበት የሚችል ምላሽ እስኪመልስ ድረስ በአገልጋዩ የሚተዳደሩ ዥረት-አልባ የመሣሪያ ጥሪዎችን ይቀጥላል።                                                                                                                                                                                                                                                                                                                                              |
| `SEARCH_STATS_HIDE_DELETED_CONNECTIONS`     | boolean | `false` |           | የፍለጋ ስታቲስቲክስና የቅርብ ጊዜ ፍለጋዎች አሁንም ንቁ ግንኙነት ያላቸውን አቅራቢዎች ብቻ ይቆጥራሉ (እንደ duckduckgo-free ያሉ ቁልፍ-አልባ አቅራቢዎች ሁልጊዜ ይቆጠራሉ)። ሲጠፋ፣ እያንዳንዱን የተያዘ የፍለጋ ረድፍ ከአቅራቢ መታወቂያው ጋር ያቆያል።                                                                                                                                                                                                                                                       |
| `FREE_BADGE_REQUIRES_PROVIDER_FREE_TIER`    | boolean | `false` |           | የዳሽቦርድ አቅራቢ ገጾች፦ የነጻ ባጅን አቅራቢው በሚያከብራቸው ምልክቶች ላይ ብቻ ያሳያል — የማሳያ-ስም ግምታዊ ዘዴን፣ boolean ያልሆኑ የነጻ መስኮችን እና ሰነድ የተደረገ ነጻ ደረጃ በሌላቸው የተመዘገቡ አቅራቢዎች ላይ ያሉ :free ቅጥያዎችን ያስወግዳል። ሲጠፋ ታሪካዊውን የባጅ ደንብ ያቆያል።                                                                                                                                                                                                                            |
| `RETRY_AFTER_PROVENANCE_ENABLED`            | boolean | `false` |           | በተሰባሰቡ 429/503 የማይገኝ ምላሾች ላይ፣ ተጨባጭ የወደፊት ዳግም ሙከራ ጊዜ ሳይታወቅ `Retry-After`ን ይተዋል (ከሰው ሰራሽ 1s ይልቅ)፣ `error.retry_after_provenance` (`signal` \| `none`)ን ይጨምራል፣ እና የኮምቦ ማስወገጃ ዱካዎች ከJSON እና ከግልጽ-ጽሑፍ የላይኛው ምንጭ አካላት ጽሑፋዊ የዳግም ሙከራ ፍንጮችን እንዲያነቡ ይፈቅዳል። መስኩ በ`unavailableResponse()` በተገነቡ ምላሾች ላይ ብቻ ይታያል፤ ሌሎች 429/503 አካላት ሳይቀየሩ ይቆያሉ።                                                                                         |
| `PROTECTED_PRIORITY_INFRA_502_ENABLED`      | boolean | `false` |           | fallback-only-on-quota-exhaustion ተብሎ ምልክት የተደረገበት `priority` የኮምቦ ዒላማ፣ ኮታ እንዳልሆነ በእርግጠኝነት ሊረጋገጥ በሚችል ምክንያት (የአቅራቢ የወረዳ መቆራረጫ መክፈት፣ ትንበያዊ የመዘግየት መዝለል) ኮምቦውን ሲያቆም፣ ኮታ የሚመስለውን 503 ከመመለስ ይልቅ 502 ይመልሳል። መቆለፍ፣ ማቀዝቀዝ፣ አለመገኘት፣ መሟጠጥ እና የትይዩነት-ገደብ ማቆሚያዎች 503ን ያቆያሉ።                                                                                                                                                           |
| `MISTRAL_AMBIGUOUS_401_SOFT_LOCKOUT`        | boolean | `false` |           | ተራ Mistral 401 (`{"detail":"Unauthorized"}`፣ ግልጽ የማረጋገጫ ምልክት የሌለው) ለተሻረ ቁልፍም ሆነ ለተሟጠጠ ኮታ ተመሳሳይ ነው። ሲበራ፣ ግንኙነቱን `expired` አድርጎ ከማቆም ይልቅ ያቀዘቅዘዋል፤ ለእያንዳንዱ ግንኙነት በሰዓት ቢበዛ 3 ጊዜ፤ ቀጣዩ ያቆመዋል፣ ስለዚህ የተሻረ ቁልፍ አሁንም ወደ ቋሚ ሁኔታ ይደርሳል። በነባሪ ጠፍቷል፦ እያንዳንዱ ተራ Mistral 401 እንደበፊቱ ግንኙነቱን ያቆማል።                                                                                                                                           |
| `XAI_OAUTH_LIVE_MODEL_DISCOVERY`            | boolean | `false` |           | የቀዘቀዘውን የማይንቀሳቀስ መነሻ ከመጠቀም ይልቅ፣ የOAuth bearer ቶከንን በመጠቀም ለ`xai-oauth` ግንኙነቶች የቀጥታውን xAI ሞዴል ካታሎግ ከ`https://api.x.ai/v1/models` ያመጣል። በነባሪ ጠፍቷል፦ `xai-oauth` የማይንቀሳቀሰውን መነሻ ሳይቀይር ማቅረቡን ይቀጥላል። በማንኛውም የመፍታት ስህተት፣ ፍለጋው ወደ መነሻው ይመለሳል (x.ai በዚህ መጨረሻ ነጥብ OAuth bearerን እንደሚቀበል አልተረጋገጠም)።                                                                                                                                    |
| `BATCH_AND_FILE_AUTO_CLEANUP_ENABLED`       | boolean | `false` |           | ራስ-ሰር የማጽዳት ቅኝት `OMNIROUTE_BATCH_RETENTION_DAYS` ካለፈባቸው የመጨረሻ ሁኔታ ላይ ያሉ (የተጠናቀቁ/ያልተሳኩ/የተሰረዙ/ጊዜያቸው ያለፈ) Batch API ሥራዎችን ከየመስመራቸው የሂደት መቆጣጠሪያ ነጥቦች ጋር እንዲሰርዝ፣ እንዲሁም የራሳቸው `expires_at` ያለፈባቸውን የተሰቀሉ ፋይሎች BLOB ይዘት እንዲያጸዳ ይፈቅዳል። በነባሪ ጠፍቷል፦ ኦፕሬተር መርጦ እስኪያነቃው ድረስ እያንዳንዱ ነባር ጭነት ይህን ውሂብ ልክ እንደበፊቱ ያቆያል። በኦፕሬተር የሚነሳው `DELETE /api/v1/batches/delete-completed` መስመር በሁለቱም ሁኔታ አይነካም — እሱ የተለየ፣ ቅድመ ሁኔታ የሌለው የሕዝብ API ውል ነው። |

### CLI (5)

| ቁልፍ                                   | ዓይነት    | ነባሪ     | ዳግም ማስጀመር | መግለጫ                                                                                                                                                                |
| ------------------------------------- | ------- | ------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CLI_COMPAT_ALL`                      | boolean | `false` | ✓         | ለሁሉም CLI ደንበኞች የተኳኋኝነት ሁነታን ያንቁ።                                                                                                                                    |
| `MODEL_ALIAS_COMPAT_ENABLED`          | boolean | `false` |           | የሞዴል ተለዋጭ ስም ተኳኋኝነት ንብርብርን ያንቁ።                                                                                                                                     |
| `PRICING_SYNC_ENABLED`                | boolean | `false` |           | ራስ-ሰር የዋጋ መረጃ ማመሳሰልን ያንቁ (`PRICING_SYNC_ENABLED` የአካባቢ ተለዋዋጭንም ይፈልጋል)።                                                                                              |
| `OMNIROUTE_AUTO_SYNC_CODEX_PROFILES`  | boolean | `false` |           | የአቅራቢ ሞዴል ከተመሳሰለ በኋላ፣ ከቀጥታ ካታሎጉ በመጠቀም የ~/.codex/*.config.toml መገለጫ ፋይሎችን በራስ-ሰር (እንደገና) ይጻፉ። ንቁውን/ነባሪውን Codex ውቅር ፈጽሞ አይቀይርም። በነባሪ ጠፍቷል።                            |
| `OMNIROUTE_AUTO_SYNC_CLAUDE_PROFILES` | boolean | `false` |           | የአቅራቢ ሞዴል ከተመሳሰለ በኋላ፣ ከቀጥታ ካታሎጉ በመጠቀም የ~/.claude/profiles/<name>/settings.json Claude Code መገለጫዎችን በራስ-ሰር (እንደገና) ይጻፉ። ንቁውን/ነባሪውን Claude ውቅር ፈጽሞ አይቀይርም። በነባሪ ጠፍቷል። |

### ጤና (5)

| ቁልፍ                                       | ዓይነት    | ነባሪ     | መግለጫ                                                                                                                                                                                                            |
| ----------------------------------------- | ------- | ------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `OMNIROUTE_DISABLE_LOCAL_HEALTHCHECK`     | boolean | `false` | የአካባቢያዊ ኢንስታንስ ጤና ምርመራ መጨረሻ ነጥብን ያሰናክሉ።                                                                                                                                                                         |
| `OMNIROUTE_DISABLE_TOKEN_HEALTHCHECK`     | boolean | `false` | የቶከን ማረጋገጫ ጤና ምርመራን ያሰናክሉ።                                                                                                                                                                                      |
| `SKILLS_SANDBOX_NETWORK_ENABLED`          | boolean | `false` | በክህሎቶች sandbox አካባቢ ውስጥ የአውታረ መረብ መዳረሻን ያንቁ።                                                                                                                                                                    |
| `PROXY_HEALTH_BLOCKED_RESETS_STREAK`      | boolean | `false` | በፕሮክሲ ጤና ፍተሻ ውስጥ፣ ዒላማው ያልተቀበለው መመርመሪያ (401/403/429) የፕሮክሲውን ተከታታይ-ውድቀት ቆጠራ ዳግም ያስጀምራል። በነባሪ ጠፍቷል፦ አለመቀበል ገለልተኛ ሆኖ ይቆያል (#10654)። 5xx በሁለቱም ሁኔታ ያልተወሰነ ሆኖ ይቆያል፤ አለመቀበል ፕሮክሲን ፈጽሞ አያስወግድም፣ አያሰናክልም ወይም ዳግም አያነቃም። |
| `DB_HEALTHCHECK_STARTUP_DEFERRED_ENABLED` | boolean | `false` | የአገልጋዩን መጀመር እስኪጠናቀቅ ድረስ ከማገድ ይልቅ፣ አገልጋዩ ጥያቄዎችን መቀበል ከጀመረ በኋላ (በ`setImmediate` በኩል) የመነሻ DB ታማኝነት/ጤና ምርመራን ያሂዱ (#13717)። በነባሪ ጠፍቷል፦ መጀመር ከዚህ PR በፊት እንደነበረው በትክክል ይታገዳል።                                        |

> [!NOTE]
> `INPUT_SANITIZER_BLOCK_THRESHOLD` እና የቆየው ተለዋጭ ስሙ
> `INJECTION_GUARD_BLOCK_THRESHOLD` የ`INJECTION_GUARD_MODE`ን `block` ሁነታ
> ያስተካክላሉ፣ ነገር ግን በ
> [`src/shared/utils/injectionSeverity.ts`](../../src/shared/utils/injectionSeverity.ts)
> የሚነበቡ ተራ የአካባቢ ተለዋዋጮች እንጂ የባህሪ ጠቋሚዎች አይደሉም፦ የDB ሽረትም ሆነ የዳሽቦርድ መቀያየሪያ የላቸውም።
> [`ENVIRONMENT.md`](./ENVIRONMENT.md#4-security--authentication)ን ይመልከቱ።

> [!NOTE]
> የ`Restart` ዓምድ `requiresRestart: true` ያላቸውን ጠቋሚዎች ያመለክታል — እሴቱ
> ወዲያውኑ ይቀመጣል፣ ነገር ግን ተግባራዊ የሚሆነው ሂደቱ ዳግም ከተጫነ በኋላ ብቻ ነው። የEnum
> ጠቋሚዎች ከተፈቀደላቸው ስብስብ ውጭ ያለን ማንኛውንም እሴት ውድቅ ያደርጋሉ (በሁለቱም
> `setFeatureFlagOverride()` እና በREST `PUT` ተቆጣጣሪ ውስጥ በአገልጋይ-በኩል የተረጋገጠ)።

---

## ፍላጎት አመልካቾችን ማብራትና ማጥፋት

### ዳሽቦርድ

ወደ **ዳሽቦርድ → ቅንብሮች → የባህሪ አመልካቾች**
(`/dashboard/settings/feature-flags`) ይሂዱ። ሰንጠረዡ
(`src/app/(dashboard)/dashboard/settings/components/FeatureFlagsGrid.tsx`)
የሚከተሉትን ይደግፋል፦

- በቁልፍ ወይም በመግለጫ **መፈለግ**፣ እና በምድብ **ማጣራት** (በተጨማሪም ሰው ሠራሽ
  **ዳግም ማስጀመር ይፈልጋል** እይታ)።
- ለቡሊያን አመልካቾች **ማብሪያ/ማጥፊያ** እና ለenum አመልካቾች **ተቆልቋይ ምናሌ**
  (`src/app/(dashboard)/dashboard/settings/components/FeatureFlagCard.tsx`)።
- ለእያንዳንዱ አመልካች ውጤታማው እሴት ከየት እንደመጣ የሚያሳይ **የምንጭ ባጅ** — `DB`፣ `ENV`፣ ወይም `DEF`።
- ተተኪውን ለማስወገድ **ዳግም አስጀምር** አዝራር (ምንጫቸው `DB` ለሆኑ አመልካቾች ብቻ ይታያል)፣
  እና ከታች **ሁሉንም ተተኪዎች ዳግም አስጀምር** አዝራር።
- `requiresRestart` አመልካች ሲቀየር **ሰርቨሩን ዳግም አስጀምር** ባነር።

### REST API

ሁሉም ክወናዎች በአንድ መንገድ ያልፋሉ፦
[`src/app/api/settings/feature-flags/route.ts`](../../src/app/api/settings/feature-flags/route.ts)።
እያንዳንዱ ዘዴ የተረጋገጠ የዳሽቦርድ ክፍለ-ጊዜ ይፈልጋል (አለበለዚያ `401`)።

#### `GET /api/settings/feature-flags`

እያንዳንዱን አመልካች ከውጤታማ እሴቱ፣ ምንጩ እና ማጠቃለያው ጋር ይመልሳል።

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
    // ... ሁሉም 72 አመልካቾች
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

አንድ ተተኪ ያዘጋጁ ወይም ያስወግዱ። የጥያቄ አካል፦ `{ key: string; value?: string }`።
`value`ን አለማካተት ተተኪውን ያስወግዳል (env / ነባሪውን ይመልሳል)።

```bash
# የDB ተተኪ ያዘጋጁ
curl -X PUT http://localhost:20128/api/settings/feature-flags \
  -H "Content-Type: application/json" \
  -d '{"key":"REQUIRE_API_KEY","value":"true"}'

# ተተኪውን ያስወግዱ ("value" የለም)
curl -X PUT http://localhost:20128/api/settings/feature-flags \
  -H "Content-Type: application/json" \
  -d '{"key":"REQUIRE_API_KEY"}'
```

ምላሹ አዲሱን `effectiveValue`/`source`፣ `previousValue`/
`previousSource`፣ እና `requiresRestart` መልሶ ያሳያል። ያልታወቁ ቁልፎች እና ከክልል ውጭ የሆኑ enum
እሴቶች በ`400` ውድቅ ይደረጋሉ።

#### `DELETE /api/settings/feature-flags`

**ሁሉንም** የDB ተተኪዎች በአንድ ጊዜ በማጽዳት፣ እያንዳንዱን አመልካች ወደ env / ነባሪ
እሴቱ ይመልሳል። `{ cleared: <count>, message: "..." }`ን ይመልሳል።

> [!NOTE]
> `requiresRestart: true` ያላቸው አመልካቾች ተግባራዊ የሚሆኑት ሂደቱ ዳግም ከተጫነ በኋላ ብቻ ነው።
> የዳሽቦርዱ የዳግም ማስጀመር ሂደት `POST /api/restart`ን ይጠራል፣ ከዚያም ሰርቨሩ ዳግም እስኪነሳ ድረስ
> `GET /api/health/ping`ን በተደጋጋሚ ይፈትሻል።

---

## የአስቸኳይ ጊዜ በጀት አማራጭ

`OMNIROUTE_EMERGENCY_FALLBACK` (ምድብ `runtime`፣ ነባሪ `true`) በ
[`open-sse/services/emergencyFallback.ts`](../../open-sse/services/emergencyFallback.ts)
ውስጥ ያለውን የአስቸኳይ ጊዜ ነጻ አማራጭ መንገድ ይቆጣጠራል።
ሲነቃ፣ በጀታቸውን ያሟጠጡ ጥያቄዎች ሙሉ በሙሉ ከመክሸፍ ይልቅ ወደ ነጻ አማራጭ
አቅራቢ/ሞዴል ይመራሉ። ይህን ባህሪ ለማሰናከል እና በጀታቸውን ያሟጠጡ ጥያቄዎች
እንዲከሽፉ ለመፍቀድ፣ በዳሽቦርዱ ማብሪያ/ማጥፊያ፣ በDB ተተኪ፣ ወይም በ
`OMNIROUTE_EMERGENCY_FALLBACK` የአካባቢ ተለዋዋጭ በኩል ወደ `false` (ወይም `0`) ያዘጋጁት።
(በPRs #3741 / #3752 ውስጥ እንደ የዳሽቦርድ ማብሪያ/ማጥፊያ ቀርቧል።)

---

## በተጨማሪ ይመልከቱ

- [የአካባቢ ተለዋዋጮች ማጣቀሻ](./ENVIRONMENT.md) — አብዛኛዎቹ ጠቋሚዎች እዚያ የተመዘገበ ተመሳሳይ ስም ያለው የአካባቢ ተለዋዋጭ አላቸው (የDB መሻር ከእሱ ይቀድማል)።
- [`src/shared/constants/featureFlagDefinitions.ts`](../../src/shared/constants/featureFlagDefinitions.ts)
  — ለእያንዳንዱ ጠቋሚ ትክክለኛው የመረጃ ምንጭ።
- [`src/shared/utils/featureFlags.ts`](../../src/shared/utils/featureFlags.ts)
  — የመፍታት አመክንዮ (`resolveFeatureFlag`፣ `isFeatureFlagEnabled`፣
  `resolveAllFeatureFlags`)።
- [`src/lib/db/featureFlags.ts`](../../src/lib/db/featureFlags.ts) — በ`key_value` ሰንጠረዥ
  `feature_flags` namespace ውስጥ የDB መሻርን በቋሚነት ማከማቸት።
