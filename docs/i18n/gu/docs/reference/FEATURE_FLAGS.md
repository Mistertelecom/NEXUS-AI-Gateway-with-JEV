# Feature Flags (ગુજરાતી)

🌐 **Languages:** 🇺🇸 [English](../../../../reference/FEATURE_FLAGS.md) · 🇪🇹 [am](../../../am/docs/reference/FEATURE_FLAGS.md) · 🇸🇦 [ar](../../../ar/docs/reference/FEATURE_FLAGS.md) · 🇦🇿 [az](../../../az/docs/reference/FEATURE_FLAGS.md) · 🇧🇬 [bg](../../../bg/docs/reference/FEATURE_FLAGS.md) · 🇧🇩 [bn](../../../bn/docs/reference/FEATURE_FLAGS.md) · 🇨🇿 [cs](../../../cs/docs/reference/FEATURE_FLAGS.md) · 🇩🇰 [da](../../../da/docs/reference/FEATURE_FLAGS.md) · 🇩🇪 [de](../../../de/docs/reference/FEATURE_FLAGS.md) · 🇬🇷 [el](../../../el/docs/reference/FEATURE_FLAGS.md) · 🇪🇸 [es](../../../es/docs/reference/FEATURE_FLAGS.md) · 🇪🇪 [et](../../../et/docs/reference/FEATURE_FLAGS.md) · 🇮🇷 [fa](../../../fa/docs/reference/FEATURE_FLAGS.md) · 🇫🇮 [fi](../../../fi/docs/reference/FEATURE_FLAGS.md) · 🇫🇷 [fr](../../../fr/docs/reference/FEATURE_FLAGS.md) · 🇮🇪 [ga](../../../ga/docs/reference/FEATURE_FLAGS.md) · 🇳🇬 [ha](../../../ha/docs/reference/FEATURE_FLAGS.md) · 🇮🇱 [he](../../../he/docs/reference/FEATURE_FLAGS.md) · 🇮🇳 [hi](../../../hi/docs/reference/FEATURE_FLAGS.md) · 🇭🇷 [hr](../../../hr/docs/reference/FEATURE_FLAGS.md) · 🇭🇺 [hu](../../../hu/docs/reference/FEATURE_FLAGS.md) · 🇦🇲 [hy](../../../hy/docs/reference/FEATURE_FLAGS.md) · 🇮🇩 [id](../../../id/docs/reference/FEATURE_FLAGS.md) · 🇳🇬 [ig](../../../ig/docs/reference/FEATURE_FLAGS.md) · 🇮🇹 [it](../../../it/docs/reference/FEATURE_FLAGS.md) · 🇯🇵 [ja](../../../ja/docs/reference/FEATURE_FLAGS.md) · 🇬🇪 [ka](../../../ka/docs/reference/FEATURE_FLAGS.md) · 🇰🇭 [km](../../../km/docs/reference/FEATURE_FLAGS.md) · 🇮🇳 [kn](../../../kn/docs/reference/FEATURE_FLAGS.md) · 🇰🇷 [ko](../../../ko/docs/reference/FEATURE_FLAGS.md) · 🇱🇹 [lt](../../../lt/docs/reference/FEATURE_FLAGS.md) · 🇱🇻 [lv](../../../lv/docs/reference/FEATURE_FLAGS.md) · 🇮🇳 [ml](../../../ml/docs/reference/FEATURE_FLAGS.md) · 🇮🇳 [mr](../../../mr/docs/reference/FEATURE_FLAGS.md) · 🇲🇾 [ms](../../../ms/docs/reference/FEATURE_FLAGS.md) · 🇲🇹 [mt](../../../mt/docs/reference/FEATURE_FLAGS.md) · 🇲🇲 [my](../../../my/docs/reference/FEATURE_FLAGS.md) · 🇳🇵 [ne](../../../ne/docs/reference/FEATURE_FLAGS.md) · 🇳🇱 [nl](../../../nl/docs/reference/FEATURE_FLAGS.md) · 🇳🇴 [no](../../../no/docs/reference/FEATURE_FLAGS.md) · 🇮🇳 [or](../../../or/docs/reference/FEATURE_FLAGS.md) · 🇮🇳 [pa](../../../pa/docs/reference/FEATURE_FLAGS.md) · 🇵🇭 [phi](../../../phi/docs/reference/FEATURE_FLAGS.md) · 🇵🇱 [pl](../../../pl/docs/reference/FEATURE_FLAGS.md) · 🇵🇹 [pt](../../../pt/docs/reference/FEATURE_FLAGS.md) · 🇧🇷 [pt-BR](../../../pt-BR/docs/reference/FEATURE_FLAGS.md) · 🇷🇴 [ro](../../../ro/docs/reference/FEATURE_FLAGS.md) · 🇷🇺 [ru](../../../ru/docs/reference/FEATURE_FLAGS.md) · 🇱🇰 [si](../../../si/docs/reference/FEATURE_FLAGS.md) · 🇸🇰 [sk](../../../sk/docs/reference/FEATURE_FLAGS.md) · 🇸🇮 [sl](../../../sl/docs/reference/FEATURE_FLAGS.md) · 🇷🇸 [sr](../../../sr/docs/reference/FEATURE_FLAGS.md) · 🇸🇪 [sv](../../../sv/docs/reference/FEATURE_FLAGS.md) · 🇰🇪 [sw](../../../sw/docs/reference/FEATURE_FLAGS.md) · 🇮🇳 [ta](../../../ta/docs/reference/FEATURE_FLAGS.md) · 🇮🇳 [te](../../../te/docs/reference/FEATURE_FLAGS.md) · 🇹🇭 [th](../../../th/docs/reference/FEATURE_FLAGS.md) · 🇹🇷 [tr](../../../tr/docs/reference/FEATURE_FLAGS.md) · 🇺🇦 [uk-UA](../../../uk-UA/docs/reference/FEATURE_FLAGS.md) · 🇵🇰 [ur](../../../ur/docs/reference/FEATURE_FLAGS.md) · 🇺🇿 [uz](../../../uz/docs/reference/FEATURE_FLAGS.md) · 🇻🇳 [vi](../../../vi/docs/reference/FEATURE_FLAGS.md) · 🇳🇬 [yo](../../../yo/docs/reference/FEATURE_FLAGS.md) · 🇨🇳 [zh-CN](../../../zh-CN/docs/reference/FEATURE_FLAGS.md) · 🇹🇼 [zh-TW](../../../zh-TW/docs/reference/FEATURE_FLAGS.md)

---

> રીડિપ્લોય કર્યા **વિના** OmniRouteનું વર્તન બદલતા રનટાઇમ ટૉગલ્સ.
> અહીં સૂચિબદ્ધ દરેક ફ્લૅગ
> [`src/shared/constants/featureFlagDefinitions.ts`](../../src/shared/constants/featureFlagDefinitions.ts)
> માં વ્યાખ્યાયિત છે — સત્યનો એકમાત્ર સ્રોત. ડૅશબોર્ડ અને REST API બંને
> તે ફાઇલમાંથી વાંચે છે, તેથી નીચેનું કોષ્ટક તેની સાથે 1:1 મેળ ખાય તે રીતે જનરેટ કરવામાં આવ્યું છે.

---

## ફીચર ફ્લૅગ્સ શું છે

ફીચર ફ્લૅગ એ નામ ધરાવતું ટૉગલ (બુલિયન અથવા એનમ) છે, જેનું મૂલ્ય રનટાઇમ દરમિયાન
બદલી શકાય છે અને ડેટાબેઝમાં જાળવી શકાય છે, જેના માટે પ્રોસેસને ફરીથી ડિપ્લોય કરવાની જરૂર નથી. દરેક
ફ્લૅગનું વર્ણન `FeatureFlagDefinition` દ્વારા કરવામાં આવે છે, જેમાં `key`, `label`,
`description`, `category`, `defaultValue`, `type`, અને `requiresRestart` સંકેત હોય છે.

### રિઝોલ્યુશન ક્રમ

ફ્લૅગનું **અસરકારક મૂલ્ય**
[`resolveFeatureFlag()`](../../src/shared/utils/featureFlags.ts) દ્વારા નીચેના
પ્રાધાન્યક્રમ મુજબ નક્કી થાય છે (સૌથી ઉચ્ચ પ્રાધાન્ય જીતે છે):

1. **DB ઓવરરાઇડ** — `feature_flags` નેમસ્પેસ હેઠળ `key_value` કોષ્ટકમાં
   સંગ્રહાયેલ મૂલ્ય (ડૅશબોર્ડ અથવા REST API મારફતે સેટ કરેલું).
2. **એન્વાયર્નમેન્ટ વેરિએબલ** — `process.env[<KEY>]`, જો સેટ કરેલું અને ખાલી ન હોય.
3. **વ્યાખ્યાનું ડિફૉલ્ટ** — `featureFlagDefinitions.ts` માંથી `defaultValue`.

બુલિયન ફ્લૅગનું અસરકારક મૂલ્ય `"true"`, `"1"`, અથવા `"yes"` હોય ત્યારે તેને
**સક્ષમ** માનવામાં આવે છે (`isFeatureFlagEnabled()` જુઓ).

> [!NOTE]
> મોટાભાગના ફ્લૅગ્સને **સમાન નામ** ધરાવતું મેળ ખાતું એન્વાયર્નમેન્ટ વેરિએબલ પણ હોય છે,
> જેનું દસ્તાવેજીકરણ [`ENVIRONMENT.md`](./ENVIRONMENT.md) માં કરવામાં આવ્યું છે. ફ્લૅગનું DB ઓવરરાઇડ
> તે એન્વાયર્નમેન્ટ વેરિએબલ કરતાં પ્રાધાન્ય ધરાવે છે. `requiresRestart: true`
> ધરાવતો ફ્લૅગ તરત જ જાળવવામાં આવે છે, પરંતુ પ્રોસેસ શરૂ થાય ત્યારે જ ફરીથી વાંચવામાં આવે છે
> — તેને ટૉગલ કરવાથી ડૅશબોર્ડમાં **"સર્વર પુનઃપ્રારંભ કરો"** બૅનર દેખાય છે.

---

## ફ્લૅગ સૂચિ

6 શ્રેણીઓમાં 72 ફ્લૅગ્સ. **ડિફૉલ્ટ** એટલે વ્યાખ્યાનું ડિફૉલ્ટ — જ્યારે DB ઓવરરાઇડ
કે એન્વાયર્નમેન્ટ વેરિએબલ, બંનેમાંથી કોઈ હાજર ન હોય ત્યારે વપરાતું મૂલ્ય.

### સુરક્ષા (10)

| કી                                      | પ્રકાર | ડિફૉલ્ટ  | વર્ણન                                                                                                                                                                                                                                                                           |
| --------------------------------------- | ------ | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `REQUIRE_API_KEY`                       | બુલિયન | `false`  | તમામ ઇનકમિંગ વિનંતીઓ માટે API કી આવશ્યક બનાવો.                                                                                                                                                                                                                                  |
| `INPUT_SANITIZER_ENABLED`               | બુલિયન | `true`   | તમામ વિનંતીઓ માટે ઇનપુટ સૅનિટાઇઝેશન સક્ષમ કરો.                                                                                                                                                                                                                                  |
| `INJECTION_GUARD_MODE`                  | એનમ    | `off`    | પ્રોમ્પ્ટ ઇન્જેક્શન ગાર્ડ મોડ. મૂલ્યો: `off`, `warn`, `block`, `redact`.                                                                                                                                                                                                        |
| `PII_REDACTION_ENABLED`                 | બુલિયન | `false`  | વિનંતીઓમાંથી PII રિડૅક્ટ કરો (`INPUT_SANITIZER_MODE`થી સ્વતંત્ર).                                                                                                                                                                                                               |
| `PII_RESPONSE_SANITIZATION`             | બુલિયન | `false`  | પ્રદાતાના પ્રતિસાદોમાંથી PII સૅનિટાઇઝ કરો.                                                                                                                                                                                                                                      |
| `PII_RESPONSE_SANITIZATION_MODE`        | એનમ    | `redact` | PII પ્રતિસાદ સૅનિટાઇઝેશન માટેનો મોડ. મૂલ્યો: `redact`, `warn`, `block`, `off`.                                                                                                                                                                                                  |
| `OUTBOUND_SSRF_GUARD_ENABLED`           | બુલિયન | `true`   | ખાનગી/આંતરિક IP રેન્જ તરફની આઉટબાઉન્ડ વિનંતીઓને અવરોધો.                                                                                                                                                                                                                         |
| `ALLOW_API_KEY_REVEAL`                  | બુલિયન | `false`  | પ્રમાણિત ડૅશબોર્ડ વપરાશકર્તાઓને માત્ર છુપાવેલાં મૂલ્યો જોવાને બદલે સંગ્રહિત API કીઓ પ્રગટ કરવાની મંજૂરી આપો.                                                                                                                                                                    |
| `AUTH_LOG_INCLUDE_ACCOUNT_ID`           | બુલિયન | `false`  | AUTH લૉગ લાઇનોમાં એકાઉન્ટ પ્રીફિક્સ સામેલ કરો (દા.ત. "<provider> એકાઉન્ટનો ઉપયોગ થઈ રહ્યો છે: abc12345..."). ડિફૉલ્ટ રૂપે અક્ષમ હોવાથી, શેર કરેલા/મલ્ટિ-ટેનન્ટ પ્રોસેસ લૉગ્સમાંથી એકાઉન્ટ ઓળખકર્તાઓ રિડૅક્ટ થાય છે. Debug Modeથી સ્વતંત્ર; Debug Mode બદલવાથી આ પ્રગટ થતું નથી. |
| `OMNIROUTE_OIDC_DISABLE_PASSWORD_LOGIN` | બુલિયન | `false`  | OIDC સક્ષમ હોય ત્યારે પાસવર્ડ લૉગિન અક્ષમ કરો, જેથી વપરાશકર્તાઓ ફક્ત OIDC Single Sign-On દ્વારા જ પ્રમાણિત થઈ શકે. અક્ષમ હોય ત્યારે (ડિફૉલ્ટ), પાસવર્ડ લૉગિન અને OIDC બંને ઉપલબ્ધ હોય છે.                                                                                       |

### નેટવર્ક (15)

| કી                                              | પ્રકાર  | ડિફૉલ્ટ | રીસ્ટાર્ટ | વર્ણન                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| ----------------------------------------------- | ------- | ------- | --------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ENABLE_TLS_FINGERPRINT`                        | boolean | `false` | ✓         | TLS ફિંગરપ્રિન્ટ સ્ટેલ્થ મોડ સક્ષમ કરો.                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `AUDIO_REMOTE_PROVIDER_NODES`                   | boolean | `false` |           | /v1/audio/* રૂટ્સને localhostની બહાર હોસ્ટ કરાયેલા OpenAI-સુસંગત પ્રોવાઇડર નોડ્સનો ઉપયોગ કરવાની મંજૂરી આપો. ડિફૉલ્ટ રૂપે બંધ — ઑડિયોને રિમોટ હોસ્ટ તરફ રૂટ કરવાથી એગ્રેસ ઓળખ બદલાય છે અને તે ઑપરેટરનો સ્પષ્ટ નિર્ણય હોવો આવશ્યક છે. લૂપબૅક નોડ્સને હંમેશાં મંજૂરી છે અને તેના પર કોઈ અસર થતી નથી.                                                                                                                                                                                                    |
| `PROXY_AUTO_SELECT_ENABLED`                     | boolean | `false` |           | જ્યારે કનેક્શનને કોઈ પ્રૉક્સી અસાઇન કરાયેલ ન હોય, ત્યારે રજિસ્ટ્રીમાંથી પ્રથમ કાર્યરત પ્રૉક્સીને આપમેળે પસંદ કરો. ડિફૉલ્ટ રૂપે બંધ (નહીં તો રજિસ્ટ્રીની કોઈપણ પ્રૉક્સી વૈશ્વિક ફૉલબૅક બની જાય છે — #3332).                                                                                                                                                                                                                                                                                           |
| `OMNIROUTE_CONTROL_PLANE_PROXY_DIRECT_FALLBACK` | boolean | `false` |           | પ્રૉક્સી રીચેબિલિટી પ્રી-ચેક્સ નિષ્ફળ જાય ત્યારે OAuth અને પ્રોવાઇડર વૅલિડેશન ફ્લોને પિન કરેલી પ્રૉક્સીને બાયપાસ કરીને સીધું કનેક્ટ કરવાની મંજૂરી આપો. ડિફૉલ્ટ રૂપે બંધ, કારણ કે તે એગ્રેસ IP બદલી શકે છે.                                                                                                                                                                                                                                                                                           |
| `NETWORK_ROTATION_SHARED_EGRESS_GUARD`          | boolean | `true`  |           | મલ્ટિ-એકાઉન્ટ રોટેશન એક્ઝિક્યુટર માટે નેટવર્ક અપવાદ (ટાઇમઆઉટ, કનેક્શન નામંજૂર/રીસેટ) આવે અને નિષ્ફળ થયેલા એકાઉન્ટ પાસે સમર્પિત પ્રૉક્સી ન હોય, ત્યારે દરેક એકાઉન્ટનો ફરી પ્રયાસ કરવાને બદલે ટૂંકો કૂલડાઉન લાગુ કરો અને બાકીની રિક્વેસ્ટ માટે પ્રૉક્સી વિનાનાં અન્ય એકાઉન્ટ્સને છોડી દો. ડિફૉલ્ટ રૂપે ચાલુ (સુરક્ષિત: એગ્રેસ IP બદલાતો નથી, ફક્ત શેર્ડ-એગ્રેસ એકાઉન્ટ્સ પર લેટન્સી/કૂલડાઉનનું જોખમ ઘટાડે છે). પ્રૉક્સી વિનાનો પ્રથમ થ્રો થતાં જ તાત્કાલિક પ્રોપેગેશન પુનઃસ્થાપિત કરવા માટે અક્ષમ કરો. |
| `PROXY_SKIP_RECENTLY_FAILED`                    | boolean | `false` |           | પ્રૉક્સી પૂલ્સ અને opencodeનું પ્રતિ-એકાઉન્ટ રોટેશન, હમણાં જ નિષ્ફળ થયેલી પ્રૉક્સી (નામંજૂર થયેલી TCP પ્રોબ અથવા તેના દ્વારા પ્રાપ્ત થયેલો 429)ને એવી પ્રતિ-પ્રોસેસ અવધિ માટે ફરી આપવાનું બંધ કરે છે, જે દરેક પુનરાવર્તન સાથે બમણી થાય છે અને મહત્તમ મર્યાદા સુધી જાય છે. કોઈ પ્રૉક્સી સ્ટેટસ લખાતું નથી; દરેક ઉમેદવારને બાજુ પર રાખવામાં આવે તો પસંદગી યથાવત્ રહે છે. ડિફૉલ્ટ રૂપે બંધ.                                                                                                             |
| `PROXY_POOL_EGRESS_OBSERVATION`                 | boolean | `false` |           | ડૅશબોર્ડમાં પ્રૉક્સી પૂલ હેઠળ બતાવો કે છેલ્લા 24 h દરમિયાન કેટલા અવલોકિત એગ્રેસ IPએ તેના સભ્યોને સેવા આપી અને કેટલાં કનેક્શનોએ તેનો ઉપયોગ કર્યો. ફક્ત વાંચવા માટે, પ્રૉક્સી લૉગમાંથી ગણતરી કરવામાં આવે છે અને રૂટિંગ માટે ક્યારેય ઉપયોગ થતો નથી. ડિફૉલ્ટ રૂપે બંધ.                                                                                                                                                                                                                                   |
| `OPENCODE_RESPONSES_STALL_ROTATION`             | boolean | `false` |           | OpenCode એક્ઝિક્યુટર માટે, સ્ટ્રીમ કરાયેલા Responses જવાબના પ્રથમ બૉડી બાઇટ પર નજર રાખો (વિન્ડો: `RESPONSES_FIRST_BYTE_TIMEOUT_MS`, ડિફૉલ્ટ `15000`). વિન્ડો પૂરી થયા પછી પણ મૌન રહેતી 2xx Responses સ્ટ્રીમને અટકી ગયેલી માનવામાં આવે છે: એકાઉન્ટને કૂલડાઉન કરવામાં આવે છે અને રિક્વેસ્ટને એક વખત આગામી એકાઉન્ટ પર રોટેટ કરવામાં આવે છે; બીજી વાર અટકે તો તરત નિષ્ફળ થાય છે. ડિફૉલ્ટ રૂપે બંધ: અટકેલી સ્ટ્રીમ્સ આજના સ્ટ્રીમ રેડીનેસ ટાઇમઆઉટ સુધી રાહ જોવાનું ચાલુ રાખે છે.                         |
| `OPENCODE_USER_BLOCKED_ROTATION`                | boolean | `false` |           | OpenCode એક્ઝિક્યુટર: `user_blocked` અસ્વીકાર ધરાવતા 403/451 પર (જિયો નહીં, Cloudflare ફિંગરપ્રિન્ટ અસ્વીકાર નહીં), અસ્વીકારાયેલા એકાઉન્ટને કૂલડાઉન કરો અને પ્રતિ રિક્વેસ્ટ વધુમાં વધુ એક વખત આગામી એકાઉન્ટ પર રોટેટ કરો; બીજો અસ્વીકાર સફળતાના ચિહ્ન વિના, જેમનો તેમ પરત કરવામાં આવે છે. ડિફૉલ્ટ રૂપે બંધ: અપસ્ટ્રીમ યુઝર બ્લૉકની આસપાસ રૂટિંગ કરવું ટાળવા જેવું લાગી શકે છે અને સમગ્ર ફ્લીટમાં ફ્લૅગ ફેલાવી શકે છે.                                                                                |
| `OPENCODE_TRANSIENT_FAILOVER_BACKOFF`           | boolean | `false` |           | OpenCode રોટેશન: અપસ્ટ્રીમની સતત બે કામચલાઉ નિષ્ફળતાઓ (5xx અથવા ખાલી 400) પછી, આગામી એકાઉન્ટ પહેલાં વિરામ લો — વધુ દરેક નિષ્ફળતા માટે 1.5s બમણો થતો જાય છે, પ્રતિ વિરામ મહત્તમ 6s અને પ્રતિ રિક્વેસ્ટ મહત્તમ 10s સુધી; ક્લાયન્ટ ડિસ્કનેક્ટ થાય ત્યારે તે છોડવામાં આવે છે; રાહ જોતા પહેલાં નિષ્ફળ બૉડી રિલીઝ કરવામાં આવે છે. ડિફૉલ્ટ રૂપે બંધ: ફેઇલઓવર તાત્કાલિક રહે છે.                                                                                                                              |
| `OPENCODE_RATE_LIMITED_429_EARLY_STOP`          | boolean | `false` |           | OpenCode રોટેશન: વાસ્તવિક રેટ લિમિટ તરીકે વર્ગીકૃત થયેલા પ્રથમ 429 પર એકાઉન્ટ વેવને રોકો (પાર્સ કરી શકાય તેવું `Retry-After`, અથવા રેટ/યુઝેજ લિમિટ દર્શાવતી બૉડી) અને તે અપસ્ટ્રીમ 429ને ફેરફાર વિના પરત કરો. અવર્ગીકૃત 429 પર રોટેશન ચાલુ રહે છે. ડિફૉલ્ટ રૂપે બંધ: ફ્રી ટિયર પ્રતિ એગ્રેસ IP મર્યાદિત છે (#9611), તેથી દરેક 429 રોટેટ થાય છે અને સમાપ્ત થયેલી વેવ છેલ્લું અપસ્ટ્રીમ 429 પરત કરે છે.                                                                                                |
| `MITM_DISABLE_TLS_VERIFY`                       | boolean | `false` | ✓         | MITM પ્રૉક્સી માટે TLS સર્ટિફિકેટ વેરિફિકેશન અક્ષમ કરો. **જોખમી.**                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `OMNIROUTE_ALLOW_PRIVATE_PROVIDER_URLS`         | boolean | `false` |           | ખાનગી/આંતરિક નેટવર્ક તરફ નિર્દેશ કરતા પ્રોવાઇડર URLsને મંજૂરી આપો.                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `OMNIROUTE_ALLOW_LOCAL_PROVIDER_URLS`           | boolean | `true`  |           | લોકલ/ખાનગી ઍડ્રેસ (127.0.0.1, localhost, LAN) પર પ્રોવાઇડર્સ ઉમેરવા/વૅલિડેટ કરવાની મંજૂરી આપો. ડિફૉલ્ટ રૂપે ચાલુ (લોકલ-ફર્સ્ટ); ફક્ત સાર્વજનિક ઍડ્રેસની કડક મંજૂરી માટે અક્ષમ કરો. Cloud-metadata અવરોધિત જ રહે છે.                                                                                                                                                                                                                                                                                  |
| `ENABLE_CC_COMPATIBLE_PROVIDER`                 | boolean | `false` | ✓         | Claude Code સુસંગત પ્રોવાઇડર મોડ સક્ષમ કરો.                                                                                                                                                                                                                                                                                                                                                                                                                                                          |

### નીતિઓ (5)

| કી                              | પ્રકાર  | ડિફૉલ્ટ    | વર્ણન                                                                                                                                                                                                                       |
| ------------------------------- | ------- | ---------- | --------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `TOOL_POLICY_MODE`              | enum    | `disabled` | ટૂલના ઉપયોગ માટેની નીતિ લાગુ કરવાની સ્થિતિ. મૂલ્યો: `disabled`, `warn`, `block`.                                                                                                                                            |
| `RATE_LIMIT_AUTO_ENABLE`        | boolean | `false`    | ઉપયોગની પેટર્નના આધારે દર મર્યાદાને આપમેળે સક્ષમ કરો.                                                                                                                                                                       |
| `DISABLE_CONTEXT_WINDOW_CHECKS` | boolean | `false`    | સીધી સિંગલ-મોડલ વિનંતીઓ માટે OmniRouteની સ્થાનિક કૉન્ટેક્સ્ટ-વિન્ડો / મહત્તમ-ઇનપુટ-ટોકન તપાસને અવગણો. અપસ્ટ્રીમ મર્યાદાઓ હજુ પણ લાગુ પડે છે.                                                                                |
| `CAPABILITY_FILTER_ENABLED`     | boolean | `false`    | લક્ષ્ય મોડલમાં જરૂરી ક્ષમતાઓ (વિઝન, ટૂલ્સ, સ્ટ્રક્ચર્ડ આઉટપુટ, કૉન્ટેક્સ્ટ વિન્ડો) ન હોય ત્યારે ડિસ્પૅચ પહેલાં વિનંતીઓને નકારો. આ કૉમ્બો-લેયર સુસંગતતા ફિલ્ટરને બાયપાસ કરતી સીધી સિંગલ-પ્રોવાઇડર વિનંતીઓને સુરક્ષિત કરે છે. |
| `RADAR_ENABLED`                 | boolean | `false`    | OmniRoute Radar મૉડ્યૂલ (કૅટલૉગ ફીડ સ્ક્રીનો અને સિંક) સક્ષમ કરો. ડિફૉલ્ટ રૂપે બંધ હોય છે; તેને સક્ષમ કરવાથી માત્ર UI અનલૉક થાય છે — ડેટા સિંક માટે અલગથી ઑપ્ટ-ઇન કરવું જરૂરી છે.                                           |

### રનટાઇમ (32)

| કી                                          | પ્રકાર  | ડિફૉલ્ટ | રીસ્ટાર્ટ | વર્ણન                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| ------------------------------------------- | ------- | ------- | --------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `UNIVERSAL_CONTEXT_HANDOFF_ENABLED`         | boolean | `true`  |           | કૉમ્બો રૂટિંગ મોડલ બદલે ત્યારે વાર્તાલાપના સારાંશ જનરેટ કરીને ઇન્જેક્ટ કરો. મોડલ સ્વિચને સ્વતંત્ર રીતે ગણવા અને હાલના તથા ભવિષ્યના તમામ કૉમ્બો માટે બૅકગ્રાઉન્ડ હૅન્ડઑફ વિનંતીઓ અટકાવવા આને અક્ષમ કરો.                                                                                                                                                                                                                                                                                                                                                  |
| `RESPONSES_PASSTHROUGH_DROP_COMMENTARY`     | boolean | `true`  |           | ક્લાયન્ટ્સને ફૉર્વર્ડ કરતાં પહેલાં Responses API પાસથ્રૂ સ્ટ્રીમમાંથી આંતરિક commentary-ફેઝ આઉટપુટ આઇટમ દૂર કરો. કાચી અપસ્ટ્રીમ commentary મેળવવા આને અક્ષમ કરો.                                                                                                                                                                                                                                                                                                                                                                                        |
| `OMNIROUTE_MCP_ENFORCE_SCOPES`              | boolean | `true`  |           | MCP ટૂલ ઍક્સેસ પર સ્કોપ પ્રતિબંધો લાગુ કરો.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `OMNIROUTE_MCP_COMPRESS_DESCRIPTIONS`       | boolean | `false` |           | ટોકનનો ઉપયોગ ઘટાડવા MCP ટૂલનાં વર્ણનો સંકુચિત કરો.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `OMNIROUTE_ENABLE_RUNTIME_BACKGROUND_TASKS` | boolean | `false` |           | રનટાઇમ દરમિયાન બૅકગ્રાઉન્ડ ટાસ્ક પ્રોસેસિંગ સક્ષમ કરો.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `OMNIROUTE_DISABLE_BACKGROUND_SERVICES`     | boolean | `false` | ✓         | બધી બૅકગ્રાઉન્ડ સેવાઓ (ક્વોટા રિફ્રેશ, સિંક વગેરે) અક્ષમ કરો.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `OMNIROUTE_RTK_TRUST_PROJECT_FILTERS`       | boolean | `false` |           | ચકાસણી વિના પ્રોજેક્ટ-સ્તરના RTK ફિલ્ટર્સ પર વિશ્વાસ કરો.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `OMNIROUTE_ENABLE_LIVE_WS`                  | boolean | `true`  | ✓         | ઇમ્પોર્ટ વખતે રિયલ-ટાઇમ ડૅશબોર્ડ WebSocket સર્વર શરૂ કરો (ડિફૉલ્ટ રૂપે પોર્ટ 20132).                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `OMNIROUTE_CODEX_WS_ENABLED`                | boolean | `true`  |           | Codexને Responses-over-WebSocket ટ્રાન્સપોર્ટનો ઉપયોગ કરવાની મંજૂરી આપો. બંધ હોય ત્યારે Codex HTTP Responses પર પાછું ફરે છે.                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `OMNIROUTE_CODEX_APP_SERVER_ENABLED`        | boolean | `true`  |           | Codexને સ્થાનિક app-server WebSocket JSON-RPC ટ્રાન્સપોર્ટ (codexTransport=app-server)નો ઉપયોગ કરવાની મંજૂરી આપો. બંધ હોય ત્યારે app-server પસંદ કરેલાં કનેક્શન્સ Codexના અન્ય ટ્રાન્સપોર્ટ પર પાછાં ફરે છે.                                                                                                                                                                                                                                                                                                                                            |
| `OMNIROUTE_EMERGENCY_FALLBACK`              | boolean | `true`  |           | બજેટ સમાપ્ત થઈ ગયેલી વિનંતીઓને ઇમર્જન્સી મફત ફૉલબૅક પ્રોવાઇડર/મોડલ તરફ રૂટ કરો. (નીચે [ઇમર્જન્સી બજેટ ફૉલબૅક](#emergency-budget-fallback) જુઓ.)                                                                                                                                                                                                                                                                                                                                                                                                         |
| `STREAM_RECOVERY_ENABLED`                   | boolean | `false` |           | કોઈપણ પ્રતિસાદ બાઇટ્સ ક્લાયન્ટ સુધી પહોંચે તે પહેલાં અધૂરી રહેલી અપસ્ટ્રીમ SSE સ્ટ્રીમ માટે પારદર્શક વહેલી પુનઃપ્રયાસ પ્રક્રિયા સક્ષમ કરો.                                                                                                                                                                                                                                                                                                                                                                                                              |
| `STREAM_RECOVERY_MIDSTREAM_ENABLED`         | boolean | `false` |           | બાઇટ્સ પહેલેથી જ ક્લાયન્ટ સુધી પહોંચી ગયા પછી સ્ટ્રીમ રિકવરીને પ્રતિસાદ ફરીથી માગવાની અને જોડવાની મંજૂરી આપો.                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `STREAM_RECOVERY_TOOLCALL_ORDER_FIX`        | boolean | `false` |           | મધ્ય-સ્ટ્રીમ ચાલુ રાખવાની પ્રક્રિયાને ટૂલ-કૉલ માટે સુરક્ષિત બનાવો: ટૂલ કૉલ ઉત્સર્જિત થયા પછી (ચાલુ હોય અથવા finish_reason tool_calls સાથે પહેલેથી પૂર્ણ થયો હોય) કાપેલી સ્ટ્રીમને ક્યારેય ફરી શરૂ કરશો નહીં અને સમગ્ર બજેટ ખર્ચવાને બદલે એક ખાલી continuation પછી બંધ કરો. બંધ: રિલીઝ વર્તન.                                                                                                                                                                                                                                                            |
| `STREAM_EARLY_EOF_SIBLING_FAILOVER_ENABLED` | boolean | `false` |           | જ્યારે કોઈ ઉપયોગી ફ્રેમ ઉત્સર્જિત કરતાં પહેલાં SSE સ્ટ્રીમ બંધ થઈ જાય અને મર્યાદિત સમાન-કનેક્શન પુનઃપ્રયાસ વપરાઈ ચૂક્યો હોય ત્યારે sibling કનેક્શન પર એકવાર ફેઇલઓવર કરો; ઉપયોગી sibling ન હોય તો મૂળ `STREAM_EARLY_EOF` 502 પરત કરવામાં આવે છે. ડિફૉલ્ટ રૂપે બંધ: સમાન-કનેક્શન પુનઃપ્રયાસ પછી early-EOF અંતિમ રહે છે.                                                                                                                                                                                                                                   |
| `MODEL_CATALOG_INCLUDE_NAMES`               | boolean | `true`  |           | `/v1/models` પ્રતિસાદોમાં ડિસ્પ્લે માટે અનુકૂળ નામ ફીલ્ડ્સ સામેલ કરો. માત્ર મોડલ IDની અપેક્ષા રાખતા ક્લાયન્ટ્સ માટે આને અક્ષમ કરો.                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `MODELS_CATALOG_PREFIX_MODE`                | enum    | `dual`  |           | /v1/modelsમાં મોડલ IDને કેવી રીતે પ્રીફિક્સ આપવામાં આવે છે તે નિયંત્રિત કરે છે. 'dual' (ડિફૉલ્ટ) પાછળની સુસંગતતા માટે alias અને canonical provider-id બંને પ્રીફિક્સ ઉત્સર્જિત કરે છે. 'alias' માત્ર ટૂંકો alias પ્રીફિક્સ ઉત્સર્જિત કરે છે (દા.ત. ds-web/model, deepseek-web/model નહીં). 'canonical' માત્ર સંપૂર્ણ provider-id પ્રીફિક્સ ઉત્સર્જિત કરે છે. મૂલ્યો: `dual`, `alias`, `canonical`.                                                                                                                                                      |
| `ARENA_ELO_SYNC_ENABLED`                    | boolean | `true`  |           | મોડલ ઇન્ટેલિજન્સ રૅન્કિંગ્સ માટે સમયાંતરે Arena AI લીડરબોર્ડ ELO સિંક સક્ષમ કરો.                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `EXPOSE_CC_DISCOVERY_ALIASES`               | boolean | `false` |           | `/v1/models` પર `claude/<provider>/<model>` mirror IDની જાહેરાત કરો, જેથી Claude Code ગેટવે મોડલ ડિસ્કવરીમાં non-Claude મોડલ સૂચિબદ્ધ થાય. ત્રણ-સ્તરીય ગેટનું વૈશ્વિક સ્તર (env ડૅશબોર્ડ ઓવરરાઇડ કરતાં પ્રાધાન્ય પામે છે). [Claude Code કન્ફિગરેશન](../guides/CLAUDE-CODE-CONFIGURATION.md#discovery-aliases--surface-non-claude-models-in-the-model-picker) જુઓ.                                                                                                                                                                                       |
| `NO_THINKING_ALIAS_ENABLED`                 | boolean | `true`  |           | no-think/<provider>/<model> ગેટવે aliases માટેનો મુખ્ય સ્વિચ. ચાલુ (ડિફૉલ્ટ): /v1/models દરેક પાત્ર thinking-capable Claude મોડલ માટે no-thinking વેરિઅન્ટની જાહેરાત કરે છે અને વિનંતીમાં મોકલાયેલ no-think/ ID reasoning દબાવીને પાછું વાસ્તવિક મોડલ તરીકે રિઝૉલ્વ થાય છે. બંધ: કોઈ વેરિઅન્ટની જાહેરાત થતી નથી અને no-think/ IDને અન્ય કોઈપણ અજ્ઞાત મોડલ IDની જેમ ગણવામાં આવે છે. આ ચાલુ હોય ત્યારે પ્રતિ-મોડલ ModelSpec.noThinkingAlias opt-in/opt-out હજી પણ લાગુ પડે છે.                                                                            |
| `OMNIROUTE_DISABLE_THINKING_LEVEL_VARIANTS` | boolean | `false` |           | /v1/models કૅટલૉગમાં thinking level વેરિઅન્ટ્સ (દા.ત. -low, -medium, -high)નું જનરેશન અક્ષમ કરો.                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `OMNIROUTE_CHAT_VIRTUAL_LANES`              | boolean | `false` | ✓         | પ્રોવાઇડર ડિસ્પૅચ (#9654) માટે પ્રતિ-ટેનન્ટ અનુકૂલનશીલ virtual admission lanes સક્ષમ કરો: હવે એક ટેનન્ટનો બર્સ્ટ બીજા ટેનન્ટ માટે 503 સર્જતો નથી. OMNIROUTE_CHAT_VIRTUAL_LANES env var આ ડૅશબોર્ડ ઓવરરાઇડ કરતાં પ્રાધાન્ય પામે છે; ફેરફારો સર્વર રીસ્ટાર્ટ વખતે અમલમાં આવે છે.                                                                                                                                                                                                                                                                          |
| `EXPOSE_FUNCTIONAL_GATEWAY_MIRRORS`         | boolean | `false` |           | એવા મોડલ માટે /v1/models પર <gateway-alias>/<model> mirror IDની જાહેરાત કરો, જેમના canonical માલિક પાસે કોઈ સક્રિય credential નથી, પરંતુ સક્રિય credential ધરાવતો passthrough ગેટવે તેમને રૂટ કરે છે. ચેતવણી: વૈશ્વિક રીતે સક્ષમ હોય ત્યારે બધા ક્લાયન્ટ્સ માટે કૅટલૉગ એન્ટ્રીઓ ઉમેરે છે.                                                                                                                                                                                                                                                               |
| `NEWAPI_AGGREGATOR_BALANCE`                 | boolean | `false` |           | New-API / One-API / Sub2API aggregator-સુસંગત નોડ્સ માટે બૅલેન્સ શોધ સક્ષમ કરો. સક્ષમ હોય ત્યારે aggregator ફ્લૅગ સેટ કરેલા સુસંગત નોડ્સ ડૅશબોર્ડ અને quota-preflight રૂટિંગમાં તેમનું બૅલેન્સ રિપોર્ટ કરશે.                                                                                                                                                                                                                                                                                                                                            |
| `SERVER_OWNED_TOOL_LOOP_ENABLED`            | boolean | `false` |           | મોડલ ક્લાયન્ટ-ઉપયોગી પ્રતિસાદ પરત કરે ત્યાં સુધી non-streaming સર્વર-માલિકીવાળા ટૂલ કૉલ્સ ચાલુ રાખો.                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `SEARCH_STATS_HIDE_DELETED_CONNECTIONS`     | boolean | `false` |           | શોધના આંકડા અને તાજેતરની શોધોમાં માત્ર એવા પ્રોવાઇડર્સની ગણતરી કરો જેમની પાસે હજી live કનેક્શન છે (duckduckgo-free જેવા keyless પ્રોવાઇડર્સ હંમેશા ગણાય છે). બંધ રાખવાથી provider ID ધરાવતી દરેક સાચવી રાખેલી search row જળવાય છે.                                                                                                                                                                                                                                                                                                                      |
| `FREE_BADGE_REQUIRES_PROVIDER_FREE_TIER`    | boolean | `false` |           | ડૅશબોર્ડ પ્રોવાઇડર પેજ: Free બૅજ માત્ર પ્રોવાઇડર માન્ય રાખે તેવા સંકેતો પર જ બતાવો — documented free tier વિનાના registered પ્રોવાઇડર્સ પર display-name heuristic, non-boolean free fields અને :free suffixes દૂર કરે છે. બંધ રાખવાથી ઐતિહાસિક બૅજ નિયમ જળવાય છે.                                                                                                                                                                                                                                                                                       |
| `RETRY_AFTER_PROVENANCE_ENABLED`            | boolean | `false` |           | એકત્રિત 429/503 unavailable પ્રતિસાદોમાં, જ્યારે કોઈ ચોક્કસ ભાવિ retry સમય જાણીતો ન હોય ત્યારે (કૃત્રિમ 1sને બદલે) `Retry-After` છોડો, `error.retry_after_provenance` (`signal` \| `none`) ઉમેરો અને combo drain pathsને JSON તથા plain-text અપસ્ટ્રીમ bodiesમાંથી ગદ્યરૂપ retry સંકેતો વાંચવા દો. આ ફીલ્ડ માત્ર `unavailableResponse()` દ્વારા બનાવાયેલા પ્રતિસાદોમાં દેખાય છે; અન્ય 429/503 bodies અપરિવર્તિત રહે છે.                                                                                                                                 |
| `PROTECTED_PRIORITY_INFRA_502_ENABLED`      | boolean | `false` |           | જ્યારે fallback-only-on-quota-exhaustion તરીકે ચિહ્નિત `priority` combo target સાબિત રીતે quota ન હોય તેવા કારણસર comboને અટકાવે (provider circuit breaker open, predictive latency skip), ત્યારે quota જેવો લાગતો 503 આપવાને બદલે 502 આપો. Lockout, cooldown, unavailable, exhaustion અને concurrency-cap stops માટે 503 જ રહે છે.                                                                                                                                                                                                                     |
| `MISTRAL_AMBIGUOUS_401_SOFT_LOCKOUT`        | boolean | `false` |           | સાદો Mistral 401 (`{"detail":"Unauthorized"}`, કોઈ સ્પષ્ટ auth signal નહીં) revoked key અને exhausted quota બંને માટે સમાન છે. ચાલુ હોય ત્યારે, કનેક્શનને `expired` તરીકે પાર્ક કરવાને બદલે cooldownમાં મૂકે છે, પ્રતિ કનેક્શન પ્રતિ કલાક વધુમાં વધુ 3 વખત; ત્યારપછીનો પ્રયાસ તેને પાર્ક કરે છે, જેથી revoked key અંતે સ્થિર સ્થિતિએ પહોંચે છે. ડિફૉલ્ટ રૂપે બંધ: પહેલાંની જેમ દરેક સાદો Mistral 401 કનેક્શનને પાર્ક કરે છે.                                                                                                                            |
| `XAI_OAUTH_LIVE_MODEL_DISCOVERY`            | boolean | `false` |           | સ્થિર static seedને બદલે OAuth bearer tokenનો ઉપયોગ કરીને `https://api.x.ai/v1/models` પરથી `xai-oauth` કનેક્શન્સ માટે live xAI model catalog મેળવો. ડિફૉલ્ટ રૂપે બંધ: `xai-oauth` static seedને અપરિવર્તિત રીતે સર્વ કરવાનું ચાલુ રાખે છે. કોઈપણ resolution error પર discovery seed પર પાછી ફરે છે (આ endpoint પર x.ai OAuth bearer સ્વીકારે છે કે નહીં તે ચકાસાયેલ નથી).                                                                                                                                                                              |
| `BATCH_AND_FILE_AUTO_CLEANUP_ENABLED`       | boolean | `false` |           | સ્વચાલિત cleanup sweepને `OMNIROUTE_BATCH_RETENTION_DAYS` કરતાં જૂના terminal (completed/failed/cancelled/expired) Batch API jobs તેમની per-line checkpoints સાથે કાઢી નાખવા અને પોતાની `expires_at` સમયમર્યાદા વટાવી ચૂકેલી uploaded filesનું BLOB content સાફ કરવાની મંજૂરી આપો. ડિફૉલ્ટ રૂપે બંધ: operator opt in ન કરે ત્યાં સુધી દરેક હાલનું installation આ dataને પહેલાંની જેમ જ રાખે છે. Operator દ્વારા trigger કરાયેલ `DELETE /api/v1/batches/delete-completed` route પર કોઈપણ સ્થિતિમાં અસર થતી નથી — તે અલગ, બિનશરતી public API contract છે. |

### CLI (5)

| કી                                    | પ્રકાર  | ડિફૉલ્ટ | પુનઃપ્રારંભ | વર્ણન                                                                                                                                                                                                   |
| ------------------------------------- | ------- | ------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CLI_COMPAT_ALL`                      | boolean | `false` | ✓           | બધા CLI ક્લાયન્ટ માટે સુસંગતતા મોડ સક્ષમ કરો.                                                                                                                                                           |
| `MODEL_ALIAS_COMPAT_ENABLED`          | boolean | `false` |             | મોડેલ ઉપનામ સુસંગતતા સ્તર સક્ષમ કરો.                                                                                                                                                                    |
| `PRICING_SYNC_ENABLED`                | boolean | `false` |             | કિંમત-નિર્ધારણ ડેટાનું આપમેળે સમન્વયન સક્ષમ કરો (આ માટે `PRICING_SYNC_ENABLED` પર્યાવરણ વેરિયેબલ પણ જરૂરી છે).                                                                                          |
| `OMNIROUTE_AUTO_SYNC_CODEX_PROFILES`  | boolean | `false` |             | પ્રદાતા મોડેલના સમન્વયન પછી, લાઇવ કેટલોગમાંથી ~/.codex/*.config.toml પ્રોફાઇલ ફાઇલો આપમેળે (ફરીથી) લખો. સક્રિય/ડિફૉલ્ટ Codex કન્ફિગને ક્યારેય બદલતું નથી. ડિફૉલ્ટ રૂપે બંધ છે.                          |
| `OMNIROUTE_AUTO_SYNC_CLAUDE_PROFILES` | boolean | `false` |             | પ્રદાતા મોડેલના સમન્વયન પછી, લાઇવ કેટલોગમાંથી ~/.claude/profiles/<name>/settings.json Claude Code પ્રોફાઇલો આપમેળે (ફરીથી) લખો. સક્રિય/ડિફૉલ્ટ Claude કન્ફિગને ક્યારેય બદલતું નથી. ડિફૉલ્ટ રૂપે બંધ છે. |

### આરોગ્ય (5)

| કી                                        | પ્રકાર  | ડિફૉલ્ટ | વર્ણન                                                                                                                                                                                                                                                                        |
| ----------------------------------------- | ------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `OMNIROUTE_DISABLE_LOCAL_HEALTHCHECK`     | boolean | `false` | સ્થાનિક ઇન્સ્ટન્સનું આરોગ્ય-તપાસ એન્ડપોઇન્ટ અક્ષમ કરો.                                                                                                                                                                                                                       |
| `OMNIROUTE_DISABLE_TOKEN_HEALTHCHECK`     | boolean | `false` | ટોકન માન્યતા આરોગ્ય-તપાસ અક્ષમ કરો.                                                                                                                                                                                                                                          |
| `SKILLS_SANDBOX_NETWORK_ENABLED`          | boolean | `false` | કૌશલ્ય સેન્ડબૉક્સ પર્યાવરણમાં નેટવર્ક ઍક્સેસ સક્ષમ કરો.                                                                                                                                                                                                                      |
| `PROXY_HEALTH_BLOCKED_RESETS_STREAK`      | boolean | `false` | પ્રોક્સી આરોગ્ય સ્વીપમાં, લક્ષ્ય દ્વારા નકારવામાં આવેલી તપાસ (401/403/429) પ્રોક્સીની સળંગ નિષ્ફળતાઓની શ્રેણી રીસેટ કરે છે. ડિફૉલ્ટ રૂપે બંધ: નકાર તટસ્થ રહે છે (#10654). 5xx કોઈપણ સ્થિતિમાં અનિર્ણાયક રહે છે; નકાર ક્યારેય પ્રોક્સીને દૂર, અક્ષમ અથવા ફરી સક્રિય કરતો નથી. |
| `DB_HEALTHCHECK_STARTUP_DEFERRED_ENABLED` | boolean | `false` | સ્ટાર્ટઅપ પૂર્ણ થાય ત્યાં સુધી તેને અવરોધવાને બદલે, સર્વર વિનંતીઓ સ્વીકારવાનું શરૂ કરે ત્યાર પછી (`setImmediate` દ્વારા) સ્ટાર્ટઅપ DB અખંડિતતા/આરોગ્ય-તપાસ ચલાવો (#13717). ડિફૉલ્ટ રૂપે બંધ: સ્ટાર્ટઅપ આ PR પહેલાંની જેમ જ અવરોધાય છે.                                       |

> [!NOTE]
> `INPUT_SANITIZER_BLOCK_THRESHOLD` અને તેનું લેગસી ઉપનામ
> `INJECTION_GUARD_BLOCK_THRESHOLD`, `INJECTION_GUARD_MODE`ના `block` મોડને
> સમાયોજિત કરે છે, પરંતુ તે
> [`src/shared/utils/injectionSeverity.ts`](../../src/shared/utils/injectionSeverity.ts) દ્વારા વાંચવામાં આવતા સાદા પર્યાવરણ વેરિયેબલ છે,
> ફીચર ફ્લૅગ નથી: તેમના માટે કોઈ DB ઓવરરાઇડ કે ડૅશબોર્ડ ટૉગલ નથી. જુઓ
> [`ENVIRONMENT.md`](./ENVIRONMENT.md#4-security--authentication).

> [!NOTE]
> `પુનઃપ્રારંભ` કૉલમ `requiresRestart: true` ધરાવતા ફ્લૅગ દર્શાવે છે — મૂલ્ય
> તરત જ સંગ્રહિત થાય છે, પરંતુ પ્રોસેસ ફરી લોડ થયા પછી જ અમલમાં આવે છે. Enum
> ફ્લૅગ તેમના માન્ય સમૂહની બહારના કોઈપણ મૂલ્યને નકારે છે (સર્વર-સાઇડ પર
> `setFeatureFlagOverride()` અને REST `PUT` હૅન્ડલર બંનેમાં માન્ય કરાયેલ).

---

## ફ્લૅગ્સ ટૉગલ કરવા

### ડૅશબોર્ડ

**Dashboard → Settings → Feature Flags**
(`/dashboard/settings/feature-flags`) પર જાઓ. ગ્રિડ
(`src/app/(dashboard)/dashboard/settings/components/FeatureFlagsGrid.tsx`)
આ સુવિધાઓને સપોર્ટ કરે છે:

- કી અથવા વર્ણન દ્વારા **શોધ**, અને કેટેગરી દ્વારા **ફિલ્ટર** (ઉપરાંત કૃત્રિમ
  **Requires Restart** વ્યૂ).
- બુલિયન ફ્લૅગ્સ માટે **ટૉગલ** અને enum ફ્લૅગ્સ માટે **ડ્રૉપડાઉન**
  (`src/app/(dashboard)/dashboard/settings/components/FeatureFlagCard.tsx`).
- દરેક ફ્લૅગ માટે **સ્રોત બૅજ** — `DB`, `ENV`, અથવા `DEF` — જે દર્શાવે છે કે
  અસરકારક મૂલ્ય ક્યાંથી આવ્યું છે.
- ઓવરરાઇડ દૂર કરવા માટેનું **Reset** બટન (ફક્ત `DB`-સ્રોતવાળા ફ્લૅગ્સ માટે દર્શાવાય છે),
  અને નીચે **Reset All Overrides** બટન.
- જ્યારે `requiresRestart` ફ્લૅગ બદલાય ત્યારે **Restart Server** બૅનર.

### REST API

બધી કામગીરી એક જ રૂટ દ્વારા થાય છે:
[`src/app/api/settings/feature-flags/route.ts`](../../src/app/api/settings/feature-flags/route.ts).
દરેક મેથડ માટે પ્રમાણિત ડૅશબોર્ડ સેશન જરૂરી છે (નહિતર `401`).

#### `GET /api/settings/feature-flags`

દરેક ફ્લૅગને તેના અસરકારક મૂલ્ય, સ્રોત અને સારાંશ સાથે પરત કરે છે.

```jsonc
{
  "flags": [
    {
      "key": "REQUIRE_API_KEY",
      "label": "API કી જરૂરી બનાવો",
      "description": "આવનારી બધી વિનંતીઓ માટે API કી જરૂરી બનાવો",
      "category": "security",
      "type": "boolean",
      "enumValues": null,
      "defaultValue": "false",
      "effectiveValue": "false",
      "source": "default", // "db" | "env" | "default"
      "requiresRestart": false,
      "warningLevel": "caution",
    },
    // ... બધા 72 ફ્લૅગ્સ
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

એક ઓવરરાઇડ સેટ કરો અથવા દૂર કરો. બૉડી: `{ key: string; value?: string }`.
`value` છોડવાથી ઓવરરાઇડ દૂર થાય છે (env / ડિફૉલ્ટ પુનઃસ્થાપિત થાય છે).

```bash
# DB ઓવરરાઇડ સેટ કરો
curl -X PUT http://localhost:20128/api/settings/feature-flags \
  -H "Content-Type: application/json" \
  -d '{"key":"REQUIRE_API_KEY","value":"true"}'

# ઓવરરાઇડ દૂર કરો ("value" વગર)
curl -X PUT http://localhost:20128/api/settings/feature-flags \
  -H "Content-Type: application/json" \
  -d '{"key":"REQUIRE_API_KEY"}'
```

રિસ્પોન્સ નવા `effectiveValue`/`source`, `previousValue`/
`previousSource`, અને `requiresRestart` ને પાછા મોકલે છે. અજાણી કી અને માન્ય શ્રેણીની બહારનાં enum
મૂલ્યોને `400` સાથે નકારવામાં આવે છે.

#### `DELETE /api/settings/feature-flags`

બધા DB ઓવરરાઇડ્સને એકસાથે સાફ કરે છે અને દરેક ફ્લૅગને તેના env / ડિફૉલ્ટ
મૂલ્ય પર પુનઃસ્થાપિત કરે છે. `{ cleared: <count>, message: "..." }` પરત કરે છે.

> [!NOTE]
> `requiresRestart: true` ધરાવતા ફ્લૅગ્સ ફક્ત પ્રોસેસ ફરીથી લોડ થયા પછી જ અસર કરે છે.
> ડૅશબોર્ડનો રિસ્ટાર્ટ પ્રવાહ `POST /api/restart` ને કૉલ કરે છે અને પછી સર્વર ફરી ચાલુ થાય ત્યાં સુધી
> `GET /api/health/ping` નું પોલિંગ કરે છે.

---

## કટોકટી બજેટ ફૉલબૅક

`OMNIROUTE_EMERGENCY_FALLBACK` (કેટેગરી `runtime`, ડિફૉલ્ટ `true`)
[`open-sse/services/emergencyFallback.ts`](../../open-sse/services/emergencyFallback.ts) માં
કટોકટીના મફત-ફૉલબૅક પાથને નિયંત્રિત કરે છે.
જ્યારે તે સક્ષમ હોય, ત્યારે પોતાના બજેટનો સંપૂર્ણ ઉપયોગ કરી ચૂકેલી વિનંતીઓ સીધી નિષ્ફળ જવાને બદલે
મફત ફૉલબૅક પ્રદાતા/મૉડલ તરફ રૂટ થાય છે. આ વર્તનને અક્ષમ કરવા અને બજેટ સમાપ્ત થઈ ગયેલી વિનંતીઓને
નિષ્ફળ થવા દેવા માટે — ડૅશબોર્ડ ટૉગલ, DB ઓવરરાઇડ, અથવા
`OMNIROUTE_EMERGENCY_FALLBACK` એન્વાયર્નમેન્ટ વેરિયેબલ દ્વારા — તેને `false` (અથવા `0`) પર સેટ કરો.
(PRs #3741 / #3752 માં ડૅશબોર્ડ ટૉગલ તરીકે રજૂ કરાયું.)

---

## આ પણ જુઓ

- [એન્વાયરમેન્ટ વેરિએબલ્સ સંદર્ભ](./ENVIRONMENT.md) — મોટાભાગના ફ્લૅગ માટે અહીં દસ્તાવેજીકૃત સમાન નામ ધરાવતું એન્વાયરમેન્ટ વેરિએબલ છે (DB ઓવરરાઇડ તેના કરતાં પ્રાથમિકતા ધરાવે છે).
- [`src/shared/constants/featureFlagDefinitions.ts`](../../src/shared/constants/featureFlagDefinitions.ts)
  — દરેક ફ્લૅગ માટેનો અધિકૃત સ્રોત.
- [`src/shared/utils/featureFlags.ts`](../../src/shared/utils/featureFlags.ts)
  — રિઝોલ્યુશન લોજિક (`resolveFeatureFlag`, `isFeatureFlagEnabled`,
  `resolveAllFeatureFlags`).
- [`src/lib/db/featureFlags.ts`](../../src/lib/db/featureFlags.ts) — `key_value` ટેબલના `feature_flags` નેમસ્પેસમાં DB ઓવરરાઇડનું સાતત્યપૂર્ણ સંગ્રહણ.
