# Feature Flags (עברית)

🌐 **Languages:** 🇺🇸 [English](../../../../reference/FEATURE_FLAGS.md) · 🇪🇹 [am](../../../am/docs/reference/FEATURE_FLAGS.md) · 🇸🇦 [ar](../../../ar/docs/reference/FEATURE_FLAGS.md) · 🇦🇿 [az](../../../az/docs/reference/FEATURE_FLAGS.md) · 🇧🇬 [bg](../../../bg/docs/reference/FEATURE_FLAGS.md) · 🇧🇩 [bn](../../../bn/docs/reference/FEATURE_FLAGS.md) · 🇨🇿 [cs](../../../cs/docs/reference/FEATURE_FLAGS.md) · 🇩🇰 [da](../../../da/docs/reference/FEATURE_FLAGS.md) · 🇩🇪 [de](../../../de/docs/reference/FEATURE_FLAGS.md) · 🇬🇷 [el](../../../el/docs/reference/FEATURE_FLAGS.md) · 🇪🇸 [es](../../../es/docs/reference/FEATURE_FLAGS.md) · 🇪🇪 [et](../../../et/docs/reference/FEATURE_FLAGS.md) · 🇮🇷 [fa](../../../fa/docs/reference/FEATURE_FLAGS.md) · 🇫🇮 [fi](../../../fi/docs/reference/FEATURE_FLAGS.md) · 🇫🇷 [fr](../../../fr/docs/reference/FEATURE_FLAGS.md) · 🇮🇪 [ga](../../../ga/docs/reference/FEATURE_FLAGS.md) · 🇮🇳 [gu](../../../gu/docs/reference/FEATURE_FLAGS.md) · 🇳🇬 [ha](../../../ha/docs/reference/FEATURE_FLAGS.md) · 🇮🇳 [hi](../../../hi/docs/reference/FEATURE_FLAGS.md) · 🇭🇷 [hr](../../../hr/docs/reference/FEATURE_FLAGS.md) · 🇭🇺 [hu](../../../hu/docs/reference/FEATURE_FLAGS.md) · 🇦🇲 [hy](../../../hy/docs/reference/FEATURE_FLAGS.md) · 🇮🇩 [id](../../../id/docs/reference/FEATURE_FLAGS.md) · 🇳🇬 [ig](../../../ig/docs/reference/FEATURE_FLAGS.md) · 🇮🇹 [it](../../../it/docs/reference/FEATURE_FLAGS.md) · 🇯🇵 [ja](../../../ja/docs/reference/FEATURE_FLAGS.md) · 🇬🇪 [ka](../../../ka/docs/reference/FEATURE_FLAGS.md) · 🇰🇭 [km](../../../km/docs/reference/FEATURE_FLAGS.md) · 🇮🇳 [kn](../../../kn/docs/reference/FEATURE_FLAGS.md) · 🇰🇷 [ko](../../../ko/docs/reference/FEATURE_FLAGS.md) · 🇱🇹 [lt](../../../lt/docs/reference/FEATURE_FLAGS.md) · 🇱🇻 [lv](../../../lv/docs/reference/FEATURE_FLAGS.md) · 🇮🇳 [ml](../../../ml/docs/reference/FEATURE_FLAGS.md) · 🇮🇳 [mr](../../../mr/docs/reference/FEATURE_FLAGS.md) · 🇲🇾 [ms](../../../ms/docs/reference/FEATURE_FLAGS.md) · 🇲🇹 [mt](../../../mt/docs/reference/FEATURE_FLAGS.md) · 🇲🇲 [my](../../../my/docs/reference/FEATURE_FLAGS.md) · 🇳🇵 [ne](../../../ne/docs/reference/FEATURE_FLAGS.md) · 🇳🇱 [nl](../../../nl/docs/reference/FEATURE_FLAGS.md) · 🇳🇴 [no](../../../no/docs/reference/FEATURE_FLAGS.md) · 🇮🇳 [or](../../../or/docs/reference/FEATURE_FLAGS.md) · 🇮🇳 [pa](../../../pa/docs/reference/FEATURE_FLAGS.md) · 🇵🇭 [phi](../../../phi/docs/reference/FEATURE_FLAGS.md) · 🇵🇱 [pl](../../../pl/docs/reference/FEATURE_FLAGS.md) · 🇵🇹 [pt](../../../pt/docs/reference/FEATURE_FLAGS.md) · 🇧🇷 [pt-BR](../../../pt-BR/docs/reference/FEATURE_FLAGS.md) · 🇷🇴 [ro](../../../ro/docs/reference/FEATURE_FLAGS.md) · 🇷🇺 [ru](../../../ru/docs/reference/FEATURE_FLAGS.md) · 🇱🇰 [si](../../../si/docs/reference/FEATURE_FLAGS.md) · 🇸🇰 [sk](../../../sk/docs/reference/FEATURE_FLAGS.md) · 🇸🇮 [sl](../../../sl/docs/reference/FEATURE_FLAGS.md) · 🇷🇸 [sr](../../../sr/docs/reference/FEATURE_FLAGS.md) · 🇸🇪 [sv](../../../sv/docs/reference/FEATURE_FLAGS.md) · 🇰🇪 [sw](../../../sw/docs/reference/FEATURE_FLAGS.md) · 🇮🇳 [ta](../../../ta/docs/reference/FEATURE_FLAGS.md) · 🇮🇳 [te](../../../te/docs/reference/FEATURE_FLAGS.md) · 🇹🇭 [th](../../../th/docs/reference/FEATURE_FLAGS.md) · 🇹🇷 [tr](../../../tr/docs/reference/FEATURE_FLAGS.md) · 🇺🇦 [uk-UA](../../../uk-UA/docs/reference/FEATURE_FLAGS.md) · 🇵🇰 [ur](../../../ur/docs/reference/FEATURE_FLAGS.md) · 🇺🇿 [uz](../../../uz/docs/reference/FEATURE_FLAGS.md) · 🇻🇳 [vi](../../../vi/docs/reference/FEATURE_FLAGS.md) · 🇳🇬 [yo](../../../yo/docs/reference/FEATURE_FLAGS.md) · 🇨🇳 [zh-CN](../../../zh-CN/docs/reference/FEATURE_FLAGS.md) · 🇹🇼 [zh-TW](../../../zh-TW/docs/reference/FEATURE_FLAGS.md)

---

> מתגי זמן ריצה שמשנים את ההתנהגות של OmniRoute **ללא פריסה מחדש**.
> כל דגל שמופיע כאן מוגדר בקובץ
> [`src/shared/constants/featureFlagDefinitions.ts`](../../src/shared/constants/featureFlagDefinitions.ts)
> — מקור האמת היחיד. גם לוח הבקרה וגם ה-REST API קוראים
> מקובץ זה, ולכן הטבלה שלהלן נוצרת כך שתתאים לו ביחס של 1:1.

---

## מהם דגלי תכונות

דגל תכונה הוא מתג בעל שם (בוליאני או enum), שניתן לשנות את ערכו
בזמן ריצה ולשמור אותו במסד הנתונים, ללא צורך בפריסה מחדש של התהליך. כל
דגל מתואר באמצעות `FeatureFlagDefinition` הכולל `key`,‏ `label`,
‏`description`,‏ `category`,‏ `defaultValue`,‏ `type` ורמז `requiresRestart`.

### סדר ההכרעה

**הערך האפקטיבי** של דגל נקבע באמצעות
[`resolveFeatureFlag()`](../../src/shared/utils/featureFlags.ts) לפי סדר
העדיפויות הבא (העדיפות הגבוהה ביותר גוברת):

1. **דריסה במסד הנתונים** — ערך המאוחסן בטבלה `key_value` תחת מרחב השמות
   `feature_flags` (מוגדר באמצעות לוח הבקרה או ה-REST API).
2. **משתנה סביבה** — `process.env[<KEY>]`, אם הוא מוגדר ואינו ריק.
3. **ברירת המחדל שבהגדרה** — ה-`defaultValue` מתוך `featureFlagDefinitions.ts`.

דגל בוליאני נחשב **מופעל** כאשר הערך האפקטיבי שלו הוא `"true"`,
‏`"1"` או `"yes"` (ראו `isFeatureFlagEnabled()`).

> [!NOTE]
> לרוב הדגלים יש גם משתנה סביבה תואם **באותו שם**
> המתועד ב-[`ENVIRONMENT.md`](./ENVIRONMENT.md). הדריסה של הדגל במסד הנתונים
> מקבלת עדיפות על פני משתנה סביבה זה. דגל עם
> `requiresRestart: true` נשמר באופן מיידי, אך נקרא מחדש רק בעת הפעלת
> התהליך — שינוי שלו מציג כרזת **"הפעלת השרת מחדש"** בלוח הבקרה.

---

## קטלוג הדגלים

72 דגלים ב-6 קטגוריות. **ברירת מחדל** היא ברירת המחדל שבהגדרה — הערך
שמשמש כאשר לא קיימים דריסה במסד הנתונים או משתנה סביבה.

### אבטחה (10)

| מפתח                                    | סוג     | ברירת מחדל | תיאור                                                                                                                                                                                                                                        |
| --------------------------------------- | ------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `REQUIRE_API_KEY`                       | בוליאני | `false`    | דרישת מפתח API עבור כל הבקשות הנכנסות.                                                                                                                                                                                                       |
| `INPUT_SANITIZER_ENABLED`               | בוליאני | `true`     | הפעלת טיהור קלט עבור כל הבקשות.                                                                                                                                                                                                              |
| `INJECTION_GUARD_MODE`                  | enum    | `off`      | מצב ההגנה מפני הזרקת הנחיות. ערכים: `off`,‏ `warn`,‏ `block`,‏ `redact`.                                                                                                                                                                     |
| `PII_REDACTION_ENABLED`                 | בוליאני | `false`    | השחרת מידע המאפשר זיהוי אישי בבקשות (ללא תלות ב-`INPUT_SANITIZER_MODE`).                                                                                                                                                                     |
| `PII_RESPONSE_SANITIZATION`             | בוליאני | `false`    | טיהור מידע המאפשר זיהוי אישי מתגובות הספק.                                                                                                                                                                                                   |
| `PII_RESPONSE_SANITIZATION_MODE`        | enum    | `redact`   | מצב לטיהור מידע המאפשר זיהוי אישי בתגובות. ערכים: `redact`,‏ `warn`,‏ `block`,‏ `off`.                                                                                                                                                       |
| `OUTBOUND_SSRF_GUARD_ENABLED`           | בוליאני | `true`     | חסימת בקשות יוצאות לטווחי כתובות IP פרטיים/פנימיים.                                                                                                                                                                                          |
| `ALLOW_API_KEY_REVEAL`                  | בוליאני | `false`    | מתן אפשרות למשתמשים מאומתים בלוח הבקרה לחשוף מפתחות API שמורים במקום לראות ערכים מוסווים בלבד.                                                                                                                                               |
| `AUTH_LOG_INCLUDE_ACCOUNT_ID`           | בוליאני | `false`    | הכללת קידומת החשבון בשורות יומן AUTH (לדוגמה, "שימוש בחשבון <provider>: abc12345..."). מושבת כברירת מחדל, כדי שמזהי חשבונות יושחרו ביומני תהליכים משותפים/מרובי דיירים. ללא תלות במצב ניפוי באגים; שינוי מצב ניפוי הבאגים אינו חושף מידע זה. |
| `OMNIROUTE_OIDC_DISABLE_PASSWORD_LOGIN` | בוליאני | `false`    | כאשר OIDC מופעל, השבתת התחברות באמצעות סיסמה כך שמשתמשים יוכלו לבצע אימות רק באמצעות כניסה יחידה של OIDC. כאשר האפשרות מושבתת (ברירת המחדל), זמינות גם התחברות באמצעות סיסמה וגם התחברות באמצעות OIDC.                                       |

### רשת (15)

| מפתח                                            | סוג     | ברירת מחדל | הפעלה מחדש | תיאור                                                                                                                                                                                                                                                                                                                                                                                                                  |
| ----------------------------------------------- | ------- | ---------- | ---------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ENABLE_TLS_FINGERPRINT`                        | boolean | `false`    | ✓          | הפעלת מצב הסוואה של טביעת אצבע של TLS.                                                                                                                                                                                                                                                                                                                                                                                 |
| `AUDIO_REMOTE_PROVIDER_NODES`                   | boolean | `false`    |            | מתן אפשרות לנתיבי /v1/audio/* להשתמש בצומתי ספק תואמי OpenAI המתארחים מחוץ ל-localhost. מושבת כברירת מחדל — ניתוב שמע למארח מרוחק משנה את זהות תעבורת היציאה ומחייב החלטה מפורשת של המפעיל. צומתי loopback מותרים תמיד ואינם מושפעים.                                                                                                                                                                                  |
| `PROXY_AUTO_SELECT_ENABLED`                     | boolean | `false`    |            | כאשר לא מוקצה proxy לחיבור, בחירה אוטומטית של ה-proxy התקין הראשון מתוך הרישום. מושבת כברירת מחדל (אחרת כל proxy ברישום הופך לחלופה גלובלית — #3332).                                                                                                                                                                                                                                                                  |
| `OMNIROUTE_CONTROL_PLANE_PROXY_DIRECT_FALLBACK` | boolean | `false`    |            | מתן אפשרות לתהליכי OAuth ואימות ספק לעקוף proxy מקובע ולהתחבר ישירות כאשר בדיקות נגישות מקדימות של ה-proxy נכשלות. מושבת כברירת מחדל משום שהדבר עשוי לשנות את כתובת ה-IP של תעבורת היציאה.                                                                                                                                                                                                                             |
| `NETWORK_ROTATION_SHARED_EGRESS_GUARD`          | boolean | `true`     |            | בעת חריגת רשת (פסק זמן, חיבור שנדחה/אופס) במבצע רוטציה מרובה-חשבונות, כאשר לחשבון שנכשל אין proxy ייעודי, החלת תקופת צינון קצרה ודילוג על חשבונות אחרים ללא proxy למשך יתרת הבקשה, במקום לנסות כל אחד מהם מחדש. מופעל כברירת מחדל (בטוח: אין שינוי בכתובת ה-IP של תעבורת היציאה; רק מופחת הסיכון להשהיה/צינון בחשבונות בעלי תעבורת יציאה משותפת). יש להשבית כדי לשחזר הפצה מיידית בעת החריגה הראשונה מחשבון ללא proxy. |
| `PROXY_SKIP_RECENTLY_FAILED`                    | boolean | `false`    |            | מאגרי proxy והרוטציה לכל חשבון של opencode מפסיקים להקצות מחדש proxy שזה עתה נכשל (בדיקת TCP שנדחתה, או תגובת 429 שהתקבלה דרכו) למשך פרק זמן לכל תהליך, המוכפל בכל כשל חוזר עד לתקרה. לא נכתב מצב proxy; כאשר כל מועמד מושהה, הבחירה נותרת ללא שינוי. מושבת כברירת מחדל.                                                                                                                                               |
| `PROXY_POOL_EGRESS_OBSERVATION`                 | boolean | `false`    |            | הצגה בלוח הבקרה, תחת מאגר proxy, של מספר כתובות ה-IP הנצפות של תעבורת היציאה ששירתו את חברי המאגר במהלך 24 השעות האחרונות ושל מספר החיבורים שהשתמשו בהן. לקריאה בלבד, מחושב מיומן ה-proxy ולעולם אינו משמש לניתוב. מושבת כברירת מחדל.                                                                                                                                                                                  |
| `OPENCODE_RESPONSES_STALL_ROTATION`             | boolean | `false`    |            | עבור מבצע OpenCode, מעקב אחר הבית הראשון בגוף של תשובת Responses מוזרמת (חלון: `RESPONSES_FIRST_BYTE_TIMEOUT_MS`, ברירת מחדל `15000`). זרם Responses עם 2xx שנותר ללא נתונים מעבר לחלון נחשב לתקוע: החשבון מועבר לצינון והבקשה עוברת ברוטציה לחשבון הבא פעם אחת; תקיעה שנייה גורמת לכשל מיידי. מושבת כברירת מחדל: זרמים תקועים ממשיכים להמתין כפי שהם ממתינים כיום, עד לפסק הזמן של מוכנות הזרם.                       |
| `OPENCODE_USER_BLOCKED_ROTATION`                | boolean | `false`    |            | מבצע OpenCode: בעת תגובת 403/451 הכוללת סירוב מסוג `user_blocked` (לא חסימה גאוגרפית ולא דחייה של טביעת אצבע מצד Cloudflare), העברת החשבון שסורב לצינון ומעבר ברוטציה לחשבון הבא פעם אחת לכל היותר בכל בקשה; סירוב שני מוחזר כפי שהוא, ללא סימון הצלחה. מושבת כברירת מחדל: עקיפת חסימת משתמש מצד ספק במעלה הזרם עלולה להיראות כהתחמקות ולהפיץ את הסימון ברחבי מערך החשבונות.                                           |
| `OPENCODE_TRANSIENT_FAILOVER_BACKOFF`           | boolean | `false`    |            | רוטציית OpenCode: לאחר שני כשלי upstream זמניים רצופים (5xx או 400 ריק), יש להשהות לפני החשבון הבא — 1.5 שניות, עם הכפלה בכל כשל נוסף, עד לתקרה של 6 שניות לכל השהיה ו-10 שניות לכל בקשה; ההשהיה אינה מתבצעת בעת ניתוק הלקוח; גוף התגובה שנכשלה משוחרר לפני ההמתנה. מושבת כברירת מחדל: המעבר בעת כשל נשאר מיידי.                                                                                                       |
| `OPENCODE_RATE_LIMITED_429_EARLY_STOP`          | boolean | `false`    |            | רוטציית OpenCode: יש לעצור את סבב החשבונות בשגיאת 429 הראשונה המסווגת כהגבלת קצב אמיתית (`Retry-After` שניתן לנתח, או גוף תגובה המציין מגבלת קצב/שימוש) ולהחזיר את שגיאת 429 מה-upstream ללא שינוי. בשגיאות 429 שאינן מסווגות ממשיכים ברוטציה. מושבת כברירת מחדל: המסלול החינמי מוגבל לפי כתובת IP יוצאת (#9611), ולכן כל שגיאת 429 גורמת לרוטציה, וסבב שמיצה את כל האפשרויות מחזיר את שגיאת 429 האחרונה מה-upstream.  |
| `MITM_DISABLE_TLS_VERIFY`                       | boolean | `false`    | ✓          | השבתת אימות אישורי TLS עבור פרוקסי MITM. **מסוכן.**                                                                                                                                                                                                                                                                                                                                                                    |
| `OMNIROUTE_ALLOW_PRIVATE_PROVIDER_URLS`         | boolean | `false`    |            | מתן אפשרות לכתובות URL של ספקים המצביעות לרשתות פרטיות/פנימיות.                                                                                                                                                                                                                                                                                                                                                        |
| `OMNIROUTE_ALLOW_LOCAL_PROVIDER_URLS`           | boolean | `true`     |            | מתן אפשרות להוסיף/לאמת ספקים בכתובות מקומיות/פרטיות (127.0.0.1, localhost, LAN). מופעל כברירת מחדל (העדפה למקומי); יש להשבית לצורך חסימה מחמירה של כתובות שאינן ציבוריות. מטא-נתונים של שירותי ענן נותרים חסומים.                                                                                                                                                                                                      |
| `ENABLE_CC_COMPATIBLE_PROVIDER`                 | boolean | `false`    | ✓          | הפעלת מצב ספק תואם Claude Code.                                                                                                                                                                                                                                                                                                                                                                                        |

### מדיניות (5)

| מפתח                            | סוג     | ברירת מחדל | תיאור                                                                                                                                                                      |
| ------------------------------- | ------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `TOOL_POLICY_MODE`              | enum    | `disabled` | מצב אכיפת מדיניות השימוש בכלים. ערכים: `disabled`, `warn`, `block`.                                                                                                        |
| `RATE_LIMIT_AUTO_ENABLE`        | boolean | `false`    | הפעלה אוטומטית של הגבלת קצב בהתבסס על דפוסי שימוש.                                                                                                                         |
| `DISABLE_CONTEXT_WINDOW_CHECKS` | boolean | `false`    | דילוג על הבדיקה המקומית של OmniRoute לחלון ההקשר / למספר אסימוני הקלט המרבי עבור בקשות ישירות למודל יחיד. מגבלות ה-upstream עדיין חלות.                                    |
| `CAPABILITY_FILTER_ENABLED`     | boolean | `false`    | דחיית בקשות לפני שליחתן כאשר למודל היעד חסרות היכולות הנדרשות (ראייה, כלים, פלט מובנה, חלון הקשר). מגן על בקשות ישירות לספק יחיד העוקפות את מסנן התאימות של שכבת השילובים. |
| `RADAR_ENABLED`                 | boolean | `false`    | הפעלת מודול OmniRoute Radar (מסכי פיד הקטלוג והסנכרון). מושבת כברירת מחדל; ההפעלה רק מאפשרת גישה לממשק המשתמש — סנכרון הנתונים נותר אפשרות נפרדת שיש להפעיל במפורש.        |

### זמן ריצה (32)

| מפתח                                        | סוג     | ברירת מחדל | הפעלה מחדש | תיאור                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| ------------------------------------------- | ------- | ---------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `UNIVERSAL_CONTEXT_HANDOFF_ENABLED`         | boolean | `true`     |            | יצירה והזרקה של סיכומי שיחה כאשר ניתוב משולב עובר בין מודלים. השביתו אפשרות זו כדי להתייחס למעברים בין מודלים באופן עצמאי ולמנוע בקשות העברה ברקע עבור כל השילובים הקיימים והעתידיים.                                                                                                                                                                                                                                                                                                                       |
| `RESPONSES_PASSTHROUGH_DROP_COMMENTARY`     | boolean | `true`     |            | הסרת פריטי פלט פנימיים משלב הפרשנות מזרמי העברה ישירה של Responses API לפני העברתם ללקוחות. השביתו אפשרות זו כדי לקבל פרשנות גולמית מהשירות שבמעלה הזרם.                                                                                                                                                                                                                                                                                                                                                    |
| `OMNIROUTE_MCP_ENFORCE_SCOPES`              | boolean | `true`     |            | אכיפת מגבלות היקף על הגישה לכלי MCP.                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `OMNIROUTE_MCP_COMPRESS_DESCRIPTIONS`       | boolean | `false`    |            | דחיסת תיאורי כלי MCP כדי לצמצם את השימוש בטוקנים.                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `OMNIROUTE_ENABLE_RUNTIME_BACKGROUND_TASKS` | boolean | `false`    |            | הפעלת עיבוד משימות רקע בזמן ריצה.                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `OMNIROUTE_DISABLE_BACKGROUND_SERVICES`     | boolean | `false`    | ✓          | השבתת כל שירותי הרקע (רענון מכסה, סנכרון וכו').                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| `OMNIROUTE_RTK_TRUST_PROJECT_FILTERS`       | boolean | `false`    |            | מתן אמון במסנני RTK ברמת הפרויקט ללא אימות.                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `OMNIROUTE_ENABLE_LIVE_WS`                  | boolean | `true`     | ✓          | הפעלת שרת WebSocket של לוח הבקרה בזמן אמת בעת הייבוא (פורט 20132 כברירת מחדל).                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `OMNIROUTE_CODEX_WS_ENABLED`                | boolean | `true`     |            | אפשר ל-Codex להשתמש בתעבורת Responses-over-WebSocket. כאשר האפשרות כבויה, Codex חוזר להשתמש ב-HTTP Responses.                                                                                                                                                                                                                                                                                                                                                                                               |
| `OMNIROUTE_CODEX_APP_SERVER_ENABLED`        | boolean | `true`     |            | אפשר ל-Codex להשתמש בתעבורת JSON-RPC דרך WebSocket של שרת היישום המקומי (codexTransport=app-server). כאשר האפשרות כבויה, חיבורים שהוגדרו לשימוש ב-app-server חוזרים להשתמש בתעבורות האחרות של Codex.                                                                                                                                                                                                                                                                                                        |
| `OMNIROUTE_EMERGENCY_FALLBACK`              | boolean | `true`     |            | נתב בקשות שתקציבן מוצה לספק/מודל החינמי לשעת חירום. (ראו [גיבוי חירום במקרה של מיצוי התקציב](#emergency-budget-fallback) להלן.)                                                                                                                                                                                                                                                                                                                                                                             |
| `STREAM_RECOVERY_ENABLED`                   | boolean | `false`    |            | אפשר ניסיון חוזר מוקדם ושקוף עבור זרמי SSE מקוטעים מהשירות במעלה הזרם, לפני שבתי תגובה כלשהם מגיעים ללקוח.                                                                                                                                                                                                                                                                                                                                                                                                  |
| `STREAM_RECOVERY_MIDSTREAM_ENABLED`         | boolean | `false`    |            | אפשר לשחזור הזרם לשלוח מחדש את הבקשה ולחבר את התגובה לאחר שבתי תגובה כבר הגיעו ללקוח.                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `STREAM_RECOVERY_TOOLCALL_ORDER_FIX`        | boolean | `false`    |            | הפוך המשך באמצע הזרם לבטוח עבור קריאות לכלים: לעולם אל תמשיך זרם שנקטע לאחר שנפלטה קריאה לכלי (בביצוע או שכבר הסתיימה עם finish_reason tool_calls), וסגור לאחר המשך ריק אחד במקום לנצל את מלוא התקציב. כבוי: התנהגות גרסת ההפצה.                                                                                                                                                                                                                                                                            |
| `STREAM_EARLY_EOF_SIBLING_FAILOVER_ENABLED` | boolean | `false`    |            | עבור פעם אחת לחיבור מקביל כאשר זרם SSE נסגר לפני שנפלטה מסגרת שימושית כלשהי וניסיון החזרה המוגבל באותו חיבור מוצה; אם אין חיבור מקביל שמיש, מוחזרת שגיאת 502 המקורית מסוג `STREAM_EARLY_EOF`. כבוי כברירת מחדל: EOF מוקדם נשאר סופי לאחר ניסיון החזרה באותו חיבור.                                                                                                                                                                                                                                          |
| `MODEL_CATALOG_INCLUDE_NAMES`               | boolean | `true`     |            | כלול שדות שם ידידותיים לתצוגה בתגובות `/v1/models`. השבת עבור לקוחות שמצפים למזהי מודלים בלבד.                                                                                                                                                                                                                                                                                                                                                                                                              |
| `MODELS_CATALOG_PREFIX_MODE`                | enum    | `dual`     |            | קובע כיצד מתווספות קידומות למזהי מודלים ב-/v1/models. האפשרות 'dual' (ברירת המחדל) מפיקה גם קידומות כינוי וגם קידומות מזהה ספק קנוניות, לצורך תאימות לאחור. האפשרות 'alias' מפיקה רק את קידומת הכינוי הקצרה (למשל ds-web/model, ולא deepseek-web/model). האפשרות 'canonical' מפיקה רק את קידומת מזהה הספק המלאה. ערכים: `dual`, `alias`, `canonical`.                                                                                                                                                       |
| `ARENA_ELO_SYNC_ENABLED`                    | boolean | `true`     |            | אפשר סנכרון ELO תקופתי של טבלת המובילים של Arena AI עבור דירוגי אינטליגנציה של מודלים.                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `EXPOSE_CC_DISCOVERY_ALIASES`               | boolean | `false`    |            | פרסום מזהי מראה מסוג `claude/<provider>/<model>` ב-`/v1/models`, כדי שגילוי המודלים בשער Claude Code יציג מודלים שאינם של Claude. הרמה הגלובלית של השער התלת-רמתי (משתנה הסביבה גובר על דריסת הערך בלוח הבקרה). ראו [הגדרת Claude Code](../guides/CLAUDE-CODE-CONFIGURATION.md#discovery-aliases--surface-non-claude-models-in-the-model-picker).                                                                                                                                                           |
| `NO_THINKING_ALIAS_ENABLED`                 | boolean | `true`     |            | מתג ראשי לכינויי השער no-think/<provider>/<model>. כאשר הוא מופעל (ברירת המחדל): /v1/models מפרסם וריאנט ללא חשיבה עבור כל מודל Claude מתאים שתומך בחשיבה, ומזהה no-think/ שנשלח בבקשה מפוענח בחזרה למודל האמיתי תוך דיכוי ההנמקה. כאשר הוא כבוי: לא מפורסמים וריאנטים, ומזהה no-think/ מטופל כמו כל מזהה מודל לא מוכר אחר. ההצטרפות/החרגה באמצעות ModelSpec.noThinkingAlias לכל מודל עדיין חלה כאשר אפשרות זו מופעלת.                                                                                      |
| `OMNIROUTE_DISABLE_THINKING_LEVEL_VARIANTS` | boolean | `false`    |            | השבתת היצירה של וריאנטים לרמות חשיבה (למשל -low, -medium, -high) בקטלוג /v1/models.                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `OMNIROUTE_CHAT_VIRTUAL_LANES`              | boolean | `false`    | ✓          | הפעלת נתיבי קבלה וירטואליים מסתגלים לכל דייר עבור שיגור לספק (#9654): פרץ תעבורה של דייר אחד לא יגרום עוד לשגיאות 503 אצל דייר אחר. משתנה הסביבה OMNIROUTE_CHAT_VIRTUAL_LANES גובר על דריסת ערך זו בלוח הבקרה; השינויים נכנסים לתוקף בעת הפעלת השרת מחדש.                                                                                                                                                                                                                                                   |
| `EXPOSE_FUNCTIONAL_GATEWAY_MIRRORS`         | boolean | `false`    |            | פרסום מזהי מראה מסוג <gateway-alias>/<model> ב-/v1/models עבור מודלים שלבעלים הקנוני שלהם אין אישור גישה פעיל, אך שער מעבר בעל אישור גישה פעיל מנתב אותם. אזהרה: כאשר אפשרות זו מופעלת גלובלית, היא מוסיפה רשומות לקטלוג עבור כל הלקוחות.                                                                                                                                                                                                                                                                   |
| `NEWAPI_AGGREGATOR_BALANCE`                 | boolean | `false`    |            | הפעלת זיהוי יתרה עבור צמתים תואמי אגרגטור מסוג New-API / One-API / Sub2API. כאשר אפשרות זו מופעלת, צמתים תואמים שדגל האגרגטור מוגדר אצלם ידווחו על היתרה שלהם בלוח הבקרה ובניתוב בדיקת המכסה המקדימה.                                                                                                                                                                                                                                                                                                       |
| `SERVER_OWNED_TOOL_LOOP_ENABLED`            | boolean | `false`    |            | המשך קריאות לכלים בבעלות השרת שאינן בהזרמה, עד שהמודל מחזיר תגובה שהלקוח יכול להשתמש בה.                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `SEARCH_STATS_HIDE_DELETED_CONNECTIONS`     | boolean | `false`    |            | סטטיסטיקות חיפוש וחיפושים אחרונים סופרים רק ספקים שעדיין יש להם חיבור פעיל (ספקים ללא מפתח, כגון duckduckgo-free, נספרים תמיד). כאשר האפשרות כבויה, נשמרת כל שורת חיפוש שנשמרה עם מזהה ספק.                                                                                                                                                                                                                                                                                                                 |
| `FREE_BADGE_REQUIRES_PROVIDER_FREE_TIER`    | boolean | `false`    |            | דפי ספקים בלוח הבקרה: הצגת תג החינם רק לפי אותות שהספק מכבד — ללא היוריסטיקת שם התצוגה, שדות חינם שאינם בוליאניים וסיומות :free אצל ספקים רשומים ללא מסלול חינמי מתועד. כאשר האפשרות כבויה, נשמר כלל התג ההיסטורי.                                                                                                                                                                                                                                                                                          |
| `RETRY_AFTER_PROVENANCE_ENABLED`            | boolean | `false`    |            | בתגובות אי-זמינות מאוגדות מסוג 429/503, השמטת `Retry-After` כאשר לא ידוע מועד קונקרטי עתידי לניסיון חוזר (במקום ערך מלאכותי של שנייה אחת), הוספת `error.retry_after_provenance` (`signal` \| `none`), ואפשרות לנתיבי ריקון משולבים לקרוא רמזים מילוליים לניסיון חוזר מגופי JSON ומגופי טקסט פשוט במעלה הזרם. השדה מופיע רק בתגובות שנבנו באמצעות `unavailableResponse()`; גופי 429/503 אחרים נותרים ללא שינוי.                                                                                              |
| `PROTECTED_PRIORITY_INFRA_502_ENABLED`      | boolean | `false`    |            | כאשר יעד בשילוב `priority`, המסומן כיעד חלופי רק במקרה של מיצוי מכסה, עוצר את השילוב מסיבה שניתן להוכיח שאינה קשורה למכסה (מפסק המעגל של הספק פתוח, דילוג עקב חיזוי השהיה), יש להשיב 502 במקום 503 שנראה כקשור למכסה. עצירות עקב נעילה, תקופת צינון, חוסר זמינות, מיצוי והגבלת מקביליות ממשיכות להחזיר 503.                                                                                                                                                                                                 |
| `MISTRAL_AMBIGUOUS_401_SOFT_LOCKOUT`        | boolean | `false`    |            | תגובת 401 בסיסית של Mistral (`{"detail":"Unauthorized"}`, ללא אות אימות מפורש) זהה עבור מפתח שבוטל ועבור מכסה שמוצתה. כאשר האפשרות מופעלת, החיבור מועבר לתקופת צינון במקום לסמן אותו כ-`expired`, לכל היותר 3 פעמים בשעה לכל חיבור; בפעם הבאה הוא מסומן כך, ולכן מפתח שבוטל עדיין מתכנס למצב זה. מושבת כברירת מחדל: כל תגובת 401 בסיסית של Mistral מסמנת את החיבור כפי שהיה בעבר.                                                                                                                           |
| `XAI_OAUTH_LIVE_MODEL_DISCOVERY`            | boolean | `false`    |            | אחזור קטלוג המודלים העדכני של xAI עבור חיבורי `xai-oauth` מ-`https://api.x.ai/v1/models` באמצעות אסימון הנושא של OAuth, במקום הרשימה הסטטית הקבועה. מושבת כברירת מחדל: `xai-oauth` ממשיך לספק את הרשימה הסטטית ללא שינוי. בכל שגיאת פתרון, הגילוי חוזר לרשימה הסטטית (לא אומת אם x.ai מקבל אסימון נושא של OAuth בנקודת קצה זו).                                                                                                                                                                             |
| `BATCH_AND_FILE_AUTO_CLEANUP_ENABLED`       | boolean | `false`    |            | מאפשר לסריקת הניקוי האוטומטית למחוק משימות Batch API סופיות (שהושלמו/נכשלו/בוטלו/פג תוקפן) שגילן עולה על `OMNIROUTE_BATCH_RETENTION_DAYS`, יחד עם נקודות הביקורת שלהן לכל שורה, ולנקות את תוכן ה-BLOB של קבצים שהועלו לאחר שחלף ערך ה-`expires_at` שלהם. מושבת כברירת מחדל: כל התקנה קיימת שומרת את הנתונים האלה בדיוק כפי שהיה בעבר, עד שמפעיל המערכת מצטרף במפורש. הנתיב `DELETE /api/v1/batches/delete-completed`, המופעל בידי מפעיל המערכת, אינו מושפע בכל מקרה — זהו חוזה API ציבורי נפרד ובלתי מותנה. |

### CLI (5)

| מפתח                                  | סוג     | ברירת מחדל | הפעלה מחדש | תיאור                                                                                                                                                                                                    |
| ------------------------------------- | ------- | ---------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `CLI_COMPAT_ALL`                      | boolean | `false`    | ✓          | הפעלת מצב תאימות עבור כל לקוחות ה-CLI.                                                                                                                                                                   |
| `MODEL_ALIAS_COMPAT_ENABLED`          | boolean | `false`    |            | הפעלת שכבת תאימות לכינויי מודלים.                                                                                                                                                                        |
| `PRICING_SYNC_ENABLED`                | boolean | `false`    |            | הפעלת סנכרון אוטומטי של נתוני תמחור (דורש גם את משתנה הסביבה `PRICING_SYNC_ENABLED`).                                                                                                                    |
| `OMNIROUTE_AUTO_SYNC_CODEX_PROFILES`  | boolean | `false`    |            | לאחר סנכרון מודלים של ספק, כתיבה אוטומטית (מחדש) של קובצי הפרופיל ~/.codex/*.config.toml מהקטלוג העדכני. לעולם אין שינוי של תצורת Codex הפעילה/ברירת המחדל. מושבת כברירת מחדל.                           |
| `OMNIROUTE_AUTO_SYNC_CLAUDE_PROFILES` | boolean | `false`    |            | לאחר סנכרון מודלים של ספק, כתיבה אוטומטית (מחדש) של פרופילי Claude Code ב-~/.claude/profiles/<name>/settings.json מהקטלוג העדכני. לעולם אין שינוי של תצורת Claude הפעילה/ברירת המחדל. מושבת כברירת מחדל. |

### תקינות (5)

| מפתח                                      | סוג     | ברירת מחדל | תיאור                                                                                                                                                                                                                                           |
| ----------------------------------------- | ------- | ---------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `OMNIROUTE_DISABLE_LOCAL_HEALTHCHECK`     | בוליאני | `false`    | השבתת נקודת הקצה של בדיקת התקינות של המופע המקומי.                                                                                                                                                                                              |
| `OMNIROUTE_DISABLE_TOKEN_HEALTHCHECK`     | בוליאני | `false`    | השבתת בדיקת התקינות של אימות האסימון.                                                                                                                                                                                                           |
| `SKILLS_SANDBOX_NETWORK_ENABLED`          | בוליאני | `false`    | הפעלת גישה לרשת בסביבת ארגז החול של המיומנויות.                                                                                                                                                                                                 |
| `PROXY_HEALTH_BLOCKED_RESETS_STREAK`      | בוליאני | `false`    | בסריקת תקינות ה־proxy, בדיקה שהיעד דחה (401/403/429) מאפסת את רצף הכשלים העוקבים של ה־proxy. האפשרות כבויה כברירת מחדל: דחייה נשארת ניטרלית (#10654). תגובת 5xx נשארת בלתי מכרעת בכל מקרה; דחייה לעולם אינה מסירה, משביתה או מפעילה מחדש proxy. |
| `DB_HEALTHCHECK_STARTUP_DEFERRED_ENABLED` | בוליאני | `false`    | הפעלת בדיקת השלמות/התקינות של מסד הנתונים בעת האתחול לאחר שהשרת מתחיל לקבל בקשות (באמצעות `setImmediate`), במקום לחסום את האתחול עד להשלמתה (#13717). האפשרות כבויה כברירת מחדל: האתחול נחסם בדיוק כפי שנחסם לפני PR זה.                        |

> [!NOTE]
> `INPUT_SANITIZER_BLOCK_THRESHOLD` והכינוי הישן שלו
> `INJECTION_GUARD_BLOCK_THRESHOLD` מכווננים את מצב `block` של
> `INJECTION_GUARD_MODE`, אך הם משתני סביבה רגילים שנקראים על ידי
> [`src/shared/utils/injectionSeverity.ts`](../../src/shared/utils/injectionSeverity.ts),
> ולא דגלי תכונה: אין להם דריסה במסד הנתונים ואין להם מתג בלוח הבקרה. ראו
> [`ENVIRONMENT.md`](./ENVIRONMENT.md#4-security--authentication).

> [!NOTE]
> העמודה `Restart` מסמנת דגלים עם `requiresRestart: true` — הערך
> נשמר מיידית, אך נכנס לתוקף רק לאחר טעינת התהליך מחדש. דגלי enum
> דוחים כל ערך שאינו בקבוצת הערכים המותרת שלהם (מאומת בצד השרת הן
> ב־`setFeatureFlagOverride()` והן במטפל `PUT` של REST).

---

## החלפת מצבי דגלים

### לוח הבקרה

נווטו אל **לוח הבקרה → הגדרות → דגלי תכונות**
(`/dashboard/settings/feature-flags`). הרשת
(`src/app/(dashboard)/dashboard/settings/components/FeatureFlagsGrid.tsx`)
תומכת באפשרויות הבאות:

- **חיפוש** לפי מפתח או תיאור, ו**סינון** לפי קטגוריה (וכן תצוגה סינתטית של
  **דורש הפעלה מחדש**).
- **מתג** לדגלים בוליאניים ו**רשימה נפתחת** לדגלי enum
  (`src/app/(dashboard)/dashboard/settings/components/FeatureFlagCard.tsx`).
- **תג מקור** לכל דגל — `DB`,‏ `ENV` או `DEF` — המציג מהיכן הגיע
  הערך האפקטיבי.
- כפתור **איפוס** (מוצג רק עבור דגלים שמקורם ב-`DB`) להסרת הדריסה,
  וכפתור **איפוס כל הדריסות** בתחתית.
- כרזת **הפעלת השרת מחדש** כאשר דגל `requiresRestart` משתנה.

### REST API

כל הפעולות מתבצעות דרך נתיב יחיד:
[`src/app/api/settings/feature-flags/route.ts`](../../src/app/api/settings/feature-flags/route.ts).
כל מתודה דורשת הפעלת לוח בקרה מאומתת (אחרת מוחזר `401`).

#### `GET /api/settings/feature-flags`

מחזיר כל דגל יחד עם הערך האפקטיבי שלו, המקור וסיכום.

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
    // ... כל 72 הדגלים
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

מגדיר או מסיר דריסה יחידה. גוף הבקשה: `{ key: string; value?: string }`.
השמטת `value` מסירה את הדריסה (ומשחזרת את ערך הסביבה / ברירת המחדל).

```bash
# הגדרת דריסת DB
curl -X PUT http://localhost:20128/api/settings/feature-flags \
  -H "Content-Type: application/json" \
  -d '{"key":"REQUIRE_API_KEY","value":"true"}'

# הסרת הדריסה (ללא "value")
curl -X PUT http://localhost:20128/api/settings/feature-flags \
  -H "Content-Type: application/json" \
  -d '{"key":"REQUIRE_API_KEY"}'
```

התגובה מחזירה את ה-`effectiveValue`/`source` החדשים, את ה-`previousValue`/
`previousSource` ואת `requiresRestart`. מפתחות לא מוכרים וערכי enum שמחוץ לטווח
נדחים עם `400`.

#### `DELETE /api/settings/feature-flags`

מנקה את **כל** דריסות ה-DB בבת אחת, ומשחזר כל דגל לערך הסביבה / ברירת המחדל
שלו. מחזיר `{ cleared: <count>, message: "..." }`.

> [!NOTE]
> דגלים עם `requiresRestart: true` נכנסים לתוקף רק לאחר טעינה מחדש של התהליך.
> תהליך ההפעלה מחדש של לוח הבקרה קורא אל `POST /api/restart` ולאחר מכן מבצע
> תשאול של `GET /api/health/ping` עד שהשרת חוזר לפעול.

---

## חלופת חירום לתקציב

`OMNIROUTE_EMERGENCY_FALLBACK` (קטגוריה `runtime`, ברירת מחדל `true`) שולט
בנתיב חלופת החירום החינמית שבקובץ
[`open-sse/services/emergencyFallback.ts`](../../open-sse/services/emergencyFallback.ts).
כאשר הוא מופעל, בקשות שממצות את תקציבן מנותבות לספק/מודל חלופי חינמי במקום
להיכשל לחלוטין. הגדירו אותו כ-`false` (או `0`) — באמצעות המתג בלוח הבקרה,
דריסת DB או משתנה הסביבה `OMNIROUTE_EMERGENCY_FALLBACK` — כדי להשבית את
ההתנהגות ולאפשר לבקשות שמיצו את תקציבן להיכשל. (הוצג כמתג בלוח הבקרה
ב-PRs #3741 / #3752.)

---

## ראו גם

- [הפניה למשתני סביבה](./ENVIRONMENT.md) — לרוב הדגלים יש משתנה סביבה
  בעל שם זהה המתועד שם (הדריסה במסד הנתונים מקבלת
  עדיפות עליו).
- [`src/shared/constants/featureFlagDefinitions.ts`](../../src/shared/constants/featureFlagDefinitions.ts)
  — מקור האמת עבור כל דגל.
- [`src/shared/utils/featureFlags.ts`](../../src/shared/utils/featureFlags.ts)
  — לוגיקת ההכרעה (`resolveFeatureFlag`, `isFeatureFlagEnabled`,
  `resolveAllFeatureFlags`).
- [`src/lib/db/featureFlags.ts`](../../src/lib/db/featureFlags.ts) — שמירת הדריסה
  במסד הנתונים במרחב השמות `feature_flags` של הטבלה `key_value`.
