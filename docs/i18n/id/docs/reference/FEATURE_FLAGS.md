# Feature Flags (Bahasa Indonesia)

🌐 **Languages:** 🇺🇸 [English](../../../../reference/FEATURE_FLAGS.md) · 🇪🇹 [am](../../../am/docs/reference/FEATURE_FLAGS.md) · 🇸🇦 [ar](../../../ar/docs/reference/FEATURE_FLAGS.md) · 🇦🇿 [az](../../../az/docs/reference/FEATURE_FLAGS.md) · 🇧🇬 [bg](../../../bg/docs/reference/FEATURE_FLAGS.md) · 🇧🇩 [bn](../../../bn/docs/reference/FEATURE_FLAGS.md) · 🇨🇿 [cs](../../../cs/docs/reference/FEATURE_FLAGS.md) · 🇩🇰 [da](../../../da/docs/reference/FEATURE_FLAGS.md) · 🇩🇪 [de](../../../de/docs/reference/FEATURE_FLAGS.md) · 🇬🇷 [el](../../../el/docs/reference/FEATURE_FLAGS.md) · 🇪🇸 [es](../../../es/docs/reference/FEATURE_FLAGS.md) · 🇪🇪 [et](../../../et/docs/reference/FEATURE_FLAGS.md) · 🇮🇷 [fa](../../../fa/docs/reference/FEATURE_FLAGS.md) · 🇫🇮 [fi](../../../fi/docs/reference/FEATURE_FLAGS.md) · 🇫🇷 [fr](../../../fr/docs/reference/FEATURE_FLAGS.md) · 🇮🇪 [ga](../../../ga/docs/reference/FEATURE_FLAGS.md) · 🇮🇳 [gu](../../../gu/docs/reference/FEATURE_FLAGS.md) · 🇳🇬 [ha](../../../ha/docs/reference/FEATURE_FLAGS.md) · 🇮🇱 [he](../../../he/docs/reference/FEATURE_FLAGS.md) · 🇮🇳 [hi](../../../hi/docs/reference/FEATURE_FLAGS.md) · 🇭🇷 [hr](../../../hr/docs/reference/FEATURE_FLAGS.md) · 🇭🇺 [hu](../../../hu/docs/reference/FEATURE_FLAGS.md) · 🇦🇲 [hy](../../../hy/docs/reference/FEATURE_FLAGS.md) · 🇳🇬 [ig](../../../ig/docs/reference/FEATURE_FLAGS.md) · 🇮🇹 [it](../../../it/docs/reference/FEATURE_FLAGS.md) · 🇯🇵 [ja](../../../ja/docs/reference/FEATURE_FLAGS.md) · 🇬🇪 [ka](../../../ka/docs/reference/FEATURE_FLAGS.md) · 🇰🇭 [km](../../../km/docs/reference/FEATURE_FLAGS.md) · 🇮🇳 [kn](../../../kn/docs/reference/FEATURE_FLAGS.md) · 🇰🇷 [ko](../../../ko/docs/reference/FEATURE_FLAGS.md) · 🇱🇹 [lt](../../../lt/docs/reference/FEATURE_FLAGS.md) · 🇱🇻 [lv](../../../lv/docs/reference/FEATURE_FLAGS.md) · 🇮🇳 [ml](../../../ml/docs/reference/FEATURE_FLAGS.md) · 🇮🇳 [mr](../../../mr/docs/reference/FEATURE_FLAGS.md) · 🇲🇾 [ms](../../../ms/docs/reference/FEATURE_FLAGS.md) · 🇲🇹 [mt](../../../mt/docs/reference/FEATURE_FLAGS.md) · 🇲🇲 [my](../../../my/docs/reference/FEATURE_FLAGS.md) · 🇳🇵 [ne](../../../ne/docs/reference/FEATURE_FLAGS.md) · 🇳🇱 [nl](../../../nl/docs/reference/FEATURE_FLAGS.md) · 🇳🇴 [no](../../../no/docs/reference/FEATURE_FLAGS.md) · 🇮🇳 [or](../../../or/docs/reference/FEATURE_FLAGS.md) · 🇮🇳 [pa](../../../pa/docs/reference/FEATURE_FLAGS.md) · 🇵🇭 [phi](../../../phi/docs/reference/FEATURE_FLAGS.md) · 🇵🇱 [pl](../../../pl/docs/reference/FEATURE_FLAGS.md) · 🇵🇹 [pt](../../../pt/docs/reference/FEATURE_FLAGS.md) · 🇧🇷 [pt-BR](../../../pt-BR/docs/reference/FEATURE_FLAGS.md) · 🇷🇴 [ro](../../../ro/docs/reference/FEATURE_FLAGS.md) · 🇷🇺 [ru](../../../ru/docs/reference/FEATURE_FLAGS.md) · 🇱🇰 [si](../../../si/docs/reference/FEATURE_FLAGS.md) · 🇸🇰 [sk](../../../sk/docs/reference/FEATURE_FLAGS.md) · 🇸🇮 [sl](../../../sl/docs/reference/FEATURE_FLAGS.md) · 🇷🇸 [sr](../../../sr/docs/reference/FEATURE_FLAGS.md) · 🇸🇪 [sv](../../../sv/docs/reference/FEATURE_FLAGS.md) · 🇰🇪 [sw](../../../sw/docs/reference/FEATURE_FLAGS.md) · 🇮🇳 [ta](../../../ta/docs/reference/FEATURE_FLAGS.md) · 🇮🇳 [te](../../../te/docs/reference/FEATURE_FLAGS.md) · 🇹🇭 [th](../../../th/docs/reference/FEATURE_FLAGS.md) · 🇹🇷 [tr](../../../tr/docs/reference/FEATURE_FLAGS.md) · 🇺🇦 [uk-UA](../../../uk-UA/docs/reference/FEATURE_FLAGS.md) · 🇵🇰 [ur](../../../ur/docs/reference/FEATURE_FLAGS.md) · 🇺🇿 [uz](../../../uz/docs/reference/FEATURE_FLAGS.md) · 🇻🇳 [vi](../../../vi/docs/reference/FEATURE_FLAGS.md) · 🇳🇬 [yo](../../../yo/docs/reference/FEATURE_FLAGS.md) · 🇨🇳 [zh-CN](../../../zh-CN/docs/reference/FEATURE_FLAGS.md) · 🇹🇼 [zh-TW](../../../zh-TW/docs/reference/FEATURE_FLAGS.md)

---

> Toggle runtime yang mengubah perilaku OmniRoute **tanpa deployment ulang**.
> Setiap flag yang tercantum di sini didefinisikan dalam
> [`src/shared/constants/featureFlagDefinitions.ts`](../../src/shared/constants/featureFlagDefinitions.ts)
> — satu-satunya sumber kebenaran. Dasbor dan REST API sama-sama membaca dari
> file tersebut, sehingga tabel di bawah dibuat agar sesuai dengannya secara 1:1.

---

## Apa Itu Feature Flag

Feature flag adalah toggle bernama (boolean atau enum) yang nilainya dapat diubah
saat runtime dan disimpan secara persisten dalam database, tanpa memerlukan deployment
ulang proses. Setiap flag dijelaskan oleh `FeatureFlagDefinition` dengan `key`, `label`,
`description`, `category`, `defaultValue`, `type`, dan petunjuk `requiresRestart`.

### Urutan Resolusi

**Nilai efektif** suatu flag ditentukan oleh
[`resolveFeatureFlag()`](../../src/shared/utils/featureFlags.ts) dengan urutan
prioritas berikut (yang tertinggi berlaku):

1. **Override DB** — nilai yang disimpan dalam tabel `key_value` di bawah namespace
   `feature_flags` (ditetapkan melalui dasbor atau REST API).
2. **Variabel lingkungan** — `process.env[<KEY>]`, jika ditetapkan dan tidak kosong.
3. **Default definisi** — `defaultValue` dari `featureFlagDefinitions.ts`.

Flag boolean dianggap **diaktifkan** ketika nilai efektifnya adalah `"true"`,
`"1"`, atau `"yes"` (lihat `isFeatureFlagEnabled()`).

> [!NOTE]
> Sebagian besar flag juga memiliki variabel lingkungan yang sesuai dengan **nama yang sama**
> dan didokumentasikan dalam [`ENVIRONMENT.md`](./ENVIRONMENT.md). Override DB untuk flag
> lebih diprioritaskan daripada variabel lingkungan tersebut. Flag dengan
> `requiresRestart: true` langsung disimpan secara persisten, tetapi hanya dibaca ulang saat
> proses dimulai — mengubahnya akan menampilkan banner **"Mulai Ulang Server"** di dasbor.

---

## Katalog Flag

72 flag dalam 6 kategori. **Default** adalah nilai default definisi — nilai yang
digunakan ketika override DB maupun variabel lingkungan tidak tersedia.

### Keamanan (10)

| Kunci                                   | Tipe    | Default  | Deskripsi                                                                                                                                                                                                                                                                            |
| --------------------------------------- | ------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `REQUIRE_API_KEY`                       | boolean | `false`  | Wajibkan API key untuk semua permintaan masuk.                                                                                                                                                                                                                                       |
| `INPUT_SANITIZER_ENABLED`               | boolean | `true`   | Aktifkan sanitasi input untuk semua permintaan.                                                                                                                                                                                                                                      |
| `INJECTION_GUARD_MODE`                  | enum    | `off`    | Mode perlindungan terhadap prompt injection. Nilai: `off`, `warn`, `block`, `redact`.                                                                                                                                                                                                |
| `PII_REDACTION_ENABLED`                 | boolean | `false`  | Redaksi PII dari permintaan (tidak bergantung pada `INPUT_SANITIZER_MODE`).                                                                                                                                                                                                          |
| `PII_RESPONSE_SANITIZATION`             | boolean | `false`  | Sanitasi PII dari respons penyedia.                                                                                                                                                                                                                                                  |
| `PII_RESPONSE_SANITIZATION_MODE`        | enum    | `redact` | Mode untuk sanitasi PII pada respons. Nilai: `redact`, `warn`, `block`, `off`.                                                                                                                                                                                                       |
| `OUTBOUND_SSRF_GUARD_ENABLED`           | boolean | `true`   | Blokir permintaan keluar ke rentang IP privat/internal.                                                                                                                                                                                                                              |
| `ALLOW_API_KEY_REVEAL`                  | boolean | `false`  | Izinkan pengguna dasbor yang terautentikasi untuk menampilkan API key yang tersimpan, bukan hanya melihat nilai yang disamarkan.                                                                                                                                                     |
| `AUTH_LOG_INCLUDE_ACCOUNT_ID`           | boolean | `false`  | Sertakan prefiks akun dalam baris log AUTH (misalnya, "Menggunakan akun <provider>: abc12345..."). Dinonaktifkan secara default agar pengenal akun disamarkan dari log proses bersama/multi-tenant. Tidak bergantung pada Mode Debug; mengubah Mode Debug tidak akan menampilkannya. |
| `OMNIROUTE_OIDC_DISABLE_PASSWORD_LOGIN` | boolean | `false`  | Saat OIDC diaktifkan, nonaktifkan login dengan kata sandi sehingga pengguna hanya dapat melakukan autentikasi melalui Single Sign-On OIDC. Saat dinonaktifkan (default), login dengan kata sandi dan OIDC sama-sama tersedia.                                                        |

### Jaringan (15)

| Kunci                                           | Tipe    | Bawaan  | Mulai Ulang | Deskripsi                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| ----------------------------------------------- | ------- | ------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `ENABLE_TLS_FINGERPRINT`                        | boolean | `false` | ✓           | Aktifkan mode penyamaran sidik jari TLS.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                          |
| `AUDIO_REMOTE_PROVIDER_NODES`                   | boolean | `false` |             | Izinkan rute /v1/audio/* menggunakan node penyedia yang kompatibel dengan OpenAI dan dihosting di luar localhost. Nonaktif secara bawaan — merutekan audio ke host jarak jauh mengubah identitas egress dan harus menjadi keputusan operator yang eksplisit. Node loopback selalu diizinkan dan tidak terpengaruh.                                                                                                                                                                                                                                |
| `PROXY_AUTO_SELECT_ENABLED`                     | boolean | `false` |             | Jika tidak ada proxy yang ditetapkan ke suatu koneksi, pilih otomatis proxy pertama yang berfungsi dari registri. Nonaktif secara bawaan (jika tidak, proxy apa pun dalam registri akan menjadi fallback global — #3332).                                                                                                                                                                                                                                                                                                                         |
| `OMNIROUTE_CONTROL_PLANE_PROXY_DIRECT_FALLBACK` | boolean | `false` |             | Izinkan alur validasi OAuth dan penyedia melewati proxy yang disematkan dan terhubung secara langsung ketika pemeriksaan awal keterjangkauan proxy gagal. Nonaktif secara bawaan karena tindakan ini dapat mengubah IP egress.                                                                                                                                                                                                                                                                                                                    |
| `NETWORK_ROTATION_SHARED_EGRESS_GUARD`          | boolean | `true`  |             | Saat terjadi pengecualian jaringan (waktu habis, koneksi ditolak/direset) pada eksekutor rotasi multiakun, jika akun yang gagal tidak memiliki proxy khusus, terapkan cooldown singkat dan lewati akun lain yang tidak memiliki proxy selama sisa permintaan, alih-alih mencoba ulang setiap akun. Aktif secara bawaan (aman: tidak ada perubahan IP egress, hanya mengurangi risiko latensi/cooldown pada akun dengan egress bersama). Nonaktifkan untuk memulihkan propagasi langsung pada kegagalan pertama akun tanpa proxy.                  |
| `PROXY_SKIP_RECENTLY_FAILED`                    | boolean | `false` |             | Pool proxy dan rotasi per akun opencode berhenti menyediakan kembali proxy yang baru saja gagal (probe TCP ditolak, atau respons 429 diterima melaluinya) selama periode per proses yang berlipat ganda pada setiap kegagalan berulang, hingga batas maksimum. Tidak ada status proxy yang ditulis; ketika setiap kandidat disisihkan, pilihannya tidak berubah. Nonaktif secara bawaan.                                                                                                                                                          |
| `PROXY_POOL_EGRESS_OBSERVATION`                 | boolean | `false` |             | Tampilkan, di bawah pool proxy pada dasbor, jumlah IP egress yang teramati melayani anggotanya selama 24 jam terakhir dan jumlah koneksi yang menggunakannya. Hanya-baca, dihitung dari log proxy, dan tidak pernah digunakan untuk perutean. Nonaktif secara bawaan.                                                                                                                                                                                                                                                                             |
| `OPENCODE_RESPONSES_STALL_ROTATION`             | boolean | `false` |             | Untuk eksekutor OpenCode, pantau byte body pertama dari balasan Responses yang dialirkan (jendela: `RESPONSES_FIRST_BYTE_TIMEOUT_MS`, bawaan `15000`). Aliran Responses 2xx yang tetap tidak mengirim data setelah melewati jendela dianggap macet: akun diberi cooldown dan permintaan dirotasikan satu kali ke akun berikutnya; kemacetan kedua langsung menghasilkan kegagalan. Nonaktif secara bawaan: aliran yang macet tetap menggunakan waktu tunggu saat ini hingga batas waktu kesiapan aliran.                                          |
| `OPENCODE_USER_BLOCKED_ROTATION`                | boolean | `false` |             | Eksekutor OpenCode: saat menerima 403/451 yang membawa penolakan `user_blocked` (bukan karena lokasi geografis dan bukan penolakan sidik jari Cloudflare), beri cooldown pada akun yang ditolak dan rotasikan ke akun berikutnya paling banyak satu kali per permintaan; penolakan kedua dikembalikan apa adanya, tanpa tanda berhasil. Nonaktif secara bawaan: merutekan permintaan untuk menghindari pemblokiran pengguna oleh upstream dapat terlihat seperti pengelakan dan menyebarkan penandaan ke seluruh armada.                          |
| `OPENCODE_TRANSIENT_FAILOVER_BACKOFF`           | boolean | `false` |             | Rotasi OpenCode: setelah dua kegagalan upstream sementara berturut-turut (5xx atau respons 400 kosong), jeda sebelum akun berikutnya — mulai dari 1,5 detik dan berlipat ganda pada setiap kegagalan berikutnya, dengan batas 6 detik per jeda dan 10 detik per permintaan, dilewati jika klien terputus; isi respons yang gagal dibebaskan sebelum menunggu. Nonaktif secara default: failover tetap berlangsung seketika.                                                                                                                       |
| `OPENCODE_RATE_LIMITED_429_EARLY_STOP`          | boolean | `false` |             | Rotasi OpenCode: hentikan gelombang akun pada respons 429 pertama yang diklasifikasikan sebagai batas laju sebenarnya (`Retry-After` yang dapat diurai, atau isi respons yang menyebutkan batas laju/penggunaan), lalu kembalikan respons 429 upstream tersebut tanpa perubahan. Respons 429 yang tidak terklasifikasi tetap memicu rotasi. Nonaktif secara default: tingkat gratis dibatasi per IP keluar (#9611), sehingga setiap respons 429 memicu rotasi dan gelombang yang kehabisan akun akan mengembalikan respons 429 upstream terakhir. |
| `MITM_DISABLE_TLS_VERIFY`                       | boolean | `false` | ✓           | Nonaktifkan verifikasi sertifikat TLS untuk proksi MITM. **Berbahaya.**                                                                                                                                                                                                                                                                                                                                                                                                                                                                           |
| `OMNIROUTE_ALLOW_PRIVATE_PROVIDER_URLS`         | boolean | `false` |             | Izinkan URL penyedia yang mengarah ke jaringan privat/internal.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `OMNIROUTE_ALLOW_LOCAL_PROVIDER_URLS`           | boolean | `true`  |             | Izinkan penambahan/validasi penyedia pada alamat lokal/privat (127.0.0.1, localhost, LAN). Aktif secara default (mengutamakan lokal); nonaktifkan untuk pemblokiran ketat khusus publik. Metadata cloud tetap diblokir.                                                                                                                                                                                                                                                                                                                           |
| `ENABLE_CC_COMPATIBLE_PROVIDER`                 | boolean | `false` | ✓           | Aktifkan mode penyedia yang kompatibel dengan Claude Code.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |

### Kebijakan (5)

| Kunci                           | Tipe    | Default    | Deskripsi                                                                                                                                                                                                                                                |
| ------------------------------- | ------- | ---------- | -------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `TOOL_POLICY_MODE`              | enum    | `disabled` | Mode penegakan kebijakan penggunaan alat. Nilai: `disabled`, `warn`, `block`.                                                                                                                                                                            |
| `RATE_LIMIT_AUTO_ENABLE`        | boolean | `false`    | Aktifkan pembatasan laju secara otomatis berdasarkan pola penggunaan.                                                                                                                                                                                    |
| `DISABLE_CONTEXT_WINDOW_CHECKS` | boolean | `false`    | Lewati pemeriksaan lokal OmniRoute atas jendela konteks/token masukan maksimum untuk permintaan langsung model tunggal. Batas upstream tetap berlaku.                                                                                                    |
| `CAPABILITY_FILTER_ENABLED`     | boolean | `false`    | Tolak permintaan sebelum diteruskan ketika model target tidak memiliki kemampuan yang diperlukan (visi, alat, keluaran terstruktur, jendela konteks). Melindungi permintaan langsung ke satu penyedia yang melewati filter kompatibilitas lapisan kombo. |
| `RADAR_ENABLED`                 | boolean | `false`    | Aktifkan modul OmniRoute Radar (layar umpan katalog dan sinkronisasi). Nonaktif secara default; pengaktifan hanya membuka akses ke UI — sinkronisasi data tetap memerlukan persetujuan terpisah.                                                         |

### Runtime (32)

| Kunci                                       | Tipe    | Bawaan  | Mulai Ulang | Deskripsi                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                             |
| ------------------------------------------- | ------- | ------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `UNIVERSAL_CONTEXT_HANDOFF_ENABLED`         | boolean | `true`  |             | Buat dan sisipkan ringkasan percakapan saat perutean combo beralih model. Nonaktifkan untuk menangani peralihan model secara terpisah dan mencegah permintaan serah terima latar belakang untuk semua combo yang ada dan yang akan datang.                                                                                                                                                                                                                                                                                                                                                                                            |
| `RESPONSES_PASSTHROUGH_DROP_COMMENTARY`     | boolean | `true`  |             | Hapus item output fase komentar internal dari aliran passthrough Responses API sebelum meneruskannya ke klien. Nonaktifkan untuk menerima komentar upstream mentah.                                                                                                                                                                                                                                                                                                                                                                                                                                                                   |
| `OMNIROUTE_MCP_ENFORCE_SCOPES`              | boolean | `true`  |             | Terapkan pembatasan cakupan pada akses alat MCP.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `OMNIROUTE_MCP_COMPRESS_DESCRIPTIONS`       | boolean | `false` |             | Kompres deskripsi alat MCP untuk mengurangi penggunaan token.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                         |
| `OMNIROUTE_ENABLE_RUNTIME_BACKGROUND_TASKS` | boolean | `false` |             | Aktifkan pemrosesan tugas latar belakang saat runtime.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `OMNIROUTE_DISABLE_BACKGROUND_SERVICES`     | boolean | `false` | ✓           | Nonaktifkan semua layanan latar belakang (penyegaran kuota, sinkronisasi, dll.).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                      |
| `OMNIROUTE_RTK_TRUST_PROJECT_FILTERS`       | boolean | `false` |             | Percayai filter RTK tingkat proyek tanpa validasi.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                    |
| `OMNIROUTE_ENABLE_LIVE_WS`                  | boolean | `true`  | ✓           | Mulai server WebSocket dasbor real-time saat impor (port 20132 secara bawaan).                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `OMNIROUTE_CODEX_WS_ENABLED`                | boolean | `true`  |             | Izinkan Codex menggunakan transport Responses-over-WebSocket. Jika dinonaktifkan, Codex akan beralih ke HTTP Responses.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `OMNIROUTE_CODEX_APP_SERVER_ENABLED`        | boolean | `true`  |             | Izinkan Codex menggunakan transport JSON-RPC WebSocket app-server lokal (codexTransport=app-server). Jika dinonaktifkan, koneksi yang memilih app-server akan beralih ke transport Codex lainnya.                                                                                                                                                                                                                                                                                                                                                                                                                                     |
| `OMNIROUTE_EMERGENCY_FALLBACK`              | boolean | `true`  |             | Alihkan permintaan yang kehabisan anggaran ke penyedia/model cadangan gratis darurat. (Lihat [Cadangan Anggaran Darurat](#emergency-budget-fallback) di bawah.)                                                                                                                                                                                                                                                                                                                                                                                                                                                                       |
| `STREAM_RECOVERY_ENABLED`                   | boolean | `false` |             | Aktifkan percobaan ulang awal secara transparan untuk stream SSE upstream yang terpotong sebelum byte respons apa pun mencapai klien.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                 |
| `STREAM_RECOVERY_MIDSTREAM_ENABLED`         | boolean | `false` |             | Izinkan pemulihan stream untuk meminta ulang dan menyambung respons setelah byte telah mencapai klien.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                |
| `STREAM_RECOVERY_TOOLCALL_ORDER_FIX`        | boolean | `false` |             | Jadikan kelanjutan di tengah stream aman untuk pemanggilan alat: jangan pernah melanjutkan stream yang terputus setelah pemanggilan alat dikeluarkan (sedang berlangsung atau telah selesai dengan finish_reason tool_calls), dan tutup setelah satu kelanjutan kosong alih-alih menghabiskan seluruh anggaran. Dinonaktifkan: perilaku rilis.                                                                                                                                                                                                                                                                                        |
| `STREAM_EARLY_EOF_SIBLING_FAILOVER_ENABLED` | boolean | `false` |             | Lakukan failover satu kali ke koneksi saudara ketika stream SSE ditutup sebelum menghasilkan frame yang berguna dan percobaan ulang terbatas pada koneksi yang sama telah habis; jika tidak ada koneksi saudara yang dapat digunakan, respons 502 `STREAM_EARLY_EOF` asli akan dikembalikan. Dinonaktifkan secara default: EOF awal tetap bersifat terminal setelah percobaan ulang pada koneksi yang sama.                                                                                                                                                                                                                           |
| `MODEL_CATALOG_INCLUDE_NAMES`               | boolean | `true`  |             | Sertakan bidang nama yang ramah tampilan dalam respons `/v1/models`. Nonaktifkan untuk klien yang hanya mengharapkan ID model.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        |
| `MODELS_CATALOG_PREFIX_MODE`                | enum    | `dual`  |             | Mengontrol cara ID model diberi prefiks dalam /v1/models. 'dual' (default) menghasilkan prefiks alias dan ID penyedia kanonis untuk kompatibilitas mundur. 'alias' hanya menghasilkan prefiks alias pendek (misalnya ds-web/model, bukan deepseek-web/model). 'canonical' hanya menghasilkan prefiks ID penyedia lengkap. Nilai: `dual`, `alias`, `canonical`.                                                                                                                                                                                                                                                                        |
| `ARENA_ELO_SYNC_ENABLED`                    | boolean | `true`  |             | Aktifkan sinkronisasi ELO papan peringkat Arena AI secara berkala untuk pemeringkatan kecerdasan model.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                               |
| `EXPOSE_CC_DISCOVERY_ALIASES`               | boolean | `false` |             | Iklankan id cermin `claude/<provider>/<model>` di `/v1/models` agar penemuan model gateway Claude Code mencantumkan model non-Claude. Tingkat global dari gerbang tiga tingkat (env mengesampingkan pengaturan dashboard). Lihat [konfigurasi Claude Code](../guides/CLAUDE-CODE-CONFIGURATION.md#discovery-aliases--surface-non-claude-models-in-the-model-picker).                                                                                                                                                                                                                                                                  |
| `NO_THINKING_ALIAS_ENABLED`                 | boolean | `true`  |             | Sakelar utama untuk alias gateway no-think/<provider>/<model>. Aktif (bawaan): /v1/models mengiklankan varian tanpa penalaran untuk setiap model Claude berkemampuan penalaran yang memenuhi syarat, dan id no-think/ yang dikirim dalam permintaan dipetakan kembali ke model sebenarnya dengan penalaran dinonaktifkan. Nonaktif: tidak ada varian yang diiklankan dan id no-think/ diperlakukan seperti id model tak dikenal lainnya. Pilihan ikut serta/tidak ikut serta per model melalui ModelSpec.noThinkingAlias tetap berlaku saat fitur ini aktif.                                                                          |
| `OMNIROUTE_DISABLE_THINKING_LEVEL_VARIANTS` | boolean | `false` |             | Nonaktifkan pembuatan varian tingkat penalaran (misalnya -low, -medium, -high) dalam katalog /v1/models.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                              |
| `OMNIROUTE_CHAT_VIRTUAL_LANES`              | boolean | `false` | ✓           | Aktifkan jalur penerimaan virtual adaptif per penyewa untuk pengiriman ke penyedia (#9654): lonjakan satu penyewa tidak lagi menyebabkan 503 bagi penyewa lain. Variabel env OMNIROUTE_CHAT_VIRTUAL_LANES mengesampingkan pengaturan dashboard ini; perubahan berlaku setelah server dimulai ulang.                                                                                                                                                                                                                                                                                                                                   |
| `EXPOSE_FUNCTIONAL_GATEWAY_MIRRORS`         | boolean | `false` |             | Iklankan id cermin <gateway-alias>/<model> di /v1/models untuk model yang pemilik kanonisnya tidak memiliki kredensial aktif, tetapi dirutekan oleh gateway passthrough dengan kredensial aktif. Peringatan: menambahkan entri katalog untuk semua klien jika diaktifkan secara global.                                                                                                                                                                                                                                                                                                                                               |
| `NEWAPI_AGGREGATOR_BALANCE`                 | boolean | `false` |             | Aktifkan deteksi saldo untuk node yang kompatibel dengan agregator New-API / One-API / Sub2API. Jika diaktifkan, node kompatibel dengan penanda agregator yang ditetapkan akan melaporkan saldonya di dashboard dan dalam perutean pemeriksaan awal kuota.                                                                                                                                                                                                                                                                                                                                                                            |
| `SERVER_OWNED_TOOL_LOOP_ENABLED`            | boolean | `false` |             | Lanjutkan pemanggilan alat milik server non-streaming hingga model mengembalikan respons yang dapat digunakan klien.                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                  |
| `SEARCH_STATS_HIDE_DELETED_CONNECTIONS`     | boolean | `false` |             | Statistik pencarian dan pencarian terbaru hanya menghitung penyedia yang masih memiliki koneksi aktif (penyedia tanpa kunci seperti duckduckgo-free selalu dihitung). Jika nonaktif, setiap baris pencarian yang dipertahankan dan memiliki id penyedia tetap disertakan.                                                                                                                                                                                                                                                                                                                                                             |
| `FREE_BADGE_REQUIRES_PROVIDER_FREE_TIER`    | boolean | `false` |             | Halaman penyedia di dashboard: tampilkan lencana Gratis hanya berdasarkan sinyal yang didukung oleh penyedia — mengabaikan heuristik nama tampilan, kolom gratis non-boolean, dan sufiks :free pada penyedia terdaftar yang tidak memiliki tingkat gratis terdokumentasi. Jika nonaktif, aturan historis lencana tetap digunakan.                                                                                                                                                                                                                                                                                                     |
| `RETRY_AFTER_PROVENANCE_ENABLED`            | boolean | `false` |             | Pada respons tidak tersedia 429/503 yang diagregasi, hilangkan `Retry-After` jika waktu percobaan ulang konkret di masa mendatang tidak diketahui (alih-alih nilai sintetis 1 dtk), tambahkan `error.retry_after_provenance` (`signal` \| `none`), dan izinkan jalur pengurasan kombo membaca petunjuk percobaan ulang dalam prosa dari isi upstream JSON dan teks biasa. Kolom ini hanya muncul pada respons yang dibuat oleh `unavailableResponse()`; isi 429/503 lainnya tidak berubah.                                                                                                                                            |
| `PROTECTED_PRIORITY_INFRA_502_ENABLED`      | boolean | `false` |             | Ketika target kombo `priority` yang ditandai hanya-fallback-saat-kuota-habis menghentikan kombo karena penyebab yang terbukti bukan kuota (pemutus sirkuit penyedia terbuka, pelompatan latensi prediktif), berikan respons 502 alih-alih 503 yang tampak seperti masalah kuota. Penghentian akibat penguncian, periode pendinginan, ketidaktersediaan, kehabisan, dan batas konkurensi tetap memberikan respons 503.                                                                                                                                                                                                                 |
| `MISTRAL_AMBIGUOUS_401_SOFT_LOCKOUT`        | boolean | `false` |             | Respons Mistral 401 tanpa keterangan tambahan (`{"detail":"Unauthorized"}`, tanpa sinyal autentikasi eksplisit) identik untuk kunci yang dicabut dan kuota yang habis. Jika diaktifkan, koneksi akan memasuki periode pendinginan alih-alih ditandai sebagai `expired`, maksimal 3 kali per jam per koneksi; kejadian berikutnya akan menandainya demikian, sehingga kunci yang dicabut pada akhirnya tetap teridentifikasi. Dinonaktifkan secara default: setiap respons Mistral 401 tanpa keterangan tambahan akan menandai koneksi seperti sebelumnya.                                                                             |
| `XAI_OAUTH_LIVE_MODEL_DISCOVERY`            | boolean | `false` |             | Ambil katalog model xAI langsung untuk koneksi `xai-oauth` dari `https://api.x.ai/v1/models` menggunakan token bearer OAuth, alih-alih seed statis yang dibekukan. Dinonaktifkan secara default: `xai-oauth` tetap menyajikan seed statis tanpa perubahan. Jika terjadi kesalahan resolusi apa pun, penemuan akan kembali menggunakan seed (belum diverifikasi apakah x.ai menerima bearer OAuth pada endpoint ini).                                                                                                                                                                                                                  |
| `BATCH_AND_FILE_AUTO_CLEANUP_ENABLED`       | boolean | `false` |             | Izinkan pembersihan otomatis menghapus pekerjaan Batch API berstatus terminal (selesai/gagal/dibatalkan/kedaluwarsa) yang lebih lama dari `OMNIROUTE_BATCH_RETENTION_DAYS`, beserta checkpoint per barisnya, dan menghapus konten BLOB dari file unggahan yang telah melewati `expires_at` masing-masing. Dinonaktifkan secara default: setiap instalasi yang ada tetap menyimpan data ini persis seperti sebelumnya hingga operator mengaktifkannya. Rute `DELETE /api/v1/batches/delete-completed` yang dipicu operator tidak terpengaruh dalam kondisi apa pun — rute tersebut merupakan kontrak API publik terpisah tanpa syarat. |

### CLI (5)

| Kunci                                 | Tipe    | Default | Mulai Ulang | Deskripsi                                                                                                                                                                                                                                  |
| ------------------------------------- | ------- | ------- | ----------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `CLI_COMPAT_ALL`                      | boolean | `false` | ✓           | Aktifkan mode kompatibilitas untuk semua klien CLI.                                                                                                                                                                                        |
| `MODEL_ALIAS_COMPAT_ENABLED`          | boolean | `false` |             | Aktifkan lapisan kompatibilitas alias model.                                                                                                                                                                                               |
| `PRICING_SYNC_ENABLED`                | boolean | `false` |             | Aktifkan sinkronisasi data harga otomatis (juga memerlukan variabel lingkungan `PRICING_SYNC_ENABLED`).                                                                                                                                    |
| `OMNIROUTE_AUTO_SYNC_CODEX_PROFILES`  | boolean | `false` |             | Setelah sinkronisasi model penyedia, secara otomatis tulis (ulang) file profil ~/.codex/*.config.toml dari katalog langsung. Tidak pernah mengubah konfigurasi Codex aktif/default. Dinonaktifkan secara default.                          |
| `OMNIROUTE_AUTO_SYNC_CLAUDE_PROFILES` | boolean | `false` |             | Setelah sinkronisasi model penyedia, secara otomatis tulis (ulang) profil Claude Code ~/.claude/profiles/<name>/settings.json dari katalog langsung. Tidak pernah mengubah konfigurasi Claude aktif/default. Dinonaktifkan secara default. |

### Kesehatan (5)

| Kunci                                     | Tipe    | Default | Deskripsi                                                                                                                                                                                                                                                                                                                          |
| ----------------------------------------- | ------- | ------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `OMNIROUTE_DISABLE_LOCAL_HEALTHCHECK`     | boolean | `false` | Menonaktifkan endpoint pemeriksaan kesehatan instans lokal.                                                                                                                                                                                                                                                                        |
| `OMNIROUTE_DISABLE_TOKEN_HEALTHCHECK`     | boolean | `false` | Menonaktifkan pemeriksaan kesehatan validasi token.                                                                                                                                                                                                                                                                                |
| `SKILLS_SANDBOX_NETWORK_ENABLED`          | boolean | `false` | Mengaktifkan akses jaringan di lingkungan sandbox skills.                                                                                                                                                                                                                                                                          |
| `PROXY_HEALTH_BLOCKED_RESETS_STREAK`      | boolean | `false` | Dalam penyisiran kesehatan proxy, probe yang ditolak oleh target (401/403/429) mereset rentetan kegagalan berturut-turut proxy. Nonaktif secara default: penolakan tetap netral (#10654). Respons 5xx tetap tidak konklusif dalam kedua kondisi; penolakan tidak pernah menghapus, menonaktifkan, atau mengaktifkan kembali proxy. |
| `DB_HEALTHCHECK_STARTUP_DEFERRED_ENABLED` | boolean | `false` | Menjalankan pemeriksaan integritas/kesehatan DB saat startup setelah server mulai menerima permintaan (melalui `setImmediate`), alih-alih memblokir startup hingga pemeriksaan selesai (#13717). Nonaktif secara default: startup diblokir sama persis seperti sebelum PR ini.                                                     |

> [!NOTE]
> `INPUT_SANITIZER_BLOCK_THRESHOLD` dan alias lamanya,
> `INJECTION_GUARD_BLOCK_THRESHOLD`, mengatur mode `block` dari
> `INJECTION_GUARD_MODE`, tetapi keduanya merupakan variabel lingkungan biasa yang dibaca oleh
> [`src/shared/utils/injectionSeverity.ts`](../../src/shared/utils/injectionSeverity.ts),
> bukan feature flag: keduanya tidak memiliki override DB maupun toggle dasbor. Lihat
> [`ENVIRONMENT.md`](./ENVIRONMENT.md#4-security--authentication).

> [!NOTE]
> Kolom `Restart` menandai flag dengan `requiresRestart: true` — nilainya
> langsung disimpan, tetapi baru berlaku setelah proses dimuat ulang. Flag enum
> menolak setiap nilai di luar himpunan yang diizinkan (divalidasi di sisi server dalam
> `setFeatureFlagOverride()` maupun handler REST `PUT`).

---

## Mengaktifkan/Menonaktifkan Flag

### Dasbor

Buka **Dasbor → Pengaturan → Feature Flags**
(`/dashboard/settings/feature-flags`). Grid
(`src/app/(dashboard)/dashboard/settings/components/FeatureFlagsGrid.tsx`)
mendukung:

- **Pencarian** berdasarkan kunci atau deskripsi, dan **pemfilteran** berdasarkan kategori (serta tampilan sintetis
  **Memerlukan Mulai Ulang**).
- **Toggle** untuk flag boolean dan **dropdown** untuk flag enum
  (`src/app/(dashboard)/dashboard/settings/components/FeatureFlagCard.tsx`).
- **Badge sumber** untuk setiap flag — `DB`, `ENV`, atau `DEF` — yang menunjukkan asal
  nilai efektif.
- Tombol **Reset** (hanya ditampilkan untuk flag yang bersumber dari `DB`) untuk menghapus override,
  dan tombol **Reset Semua Override** di bagian bawah.
- Banner **Mulai Ulang Server** ketika flag `requiresRestart` diubah.

### REST API

Semua operasi dilakukan melalui satu route:
[`src/app/api/settings/feature-flags/route.ts`](../../src/app/api/settings/feature-flags/route.ts).
Setiap metode memerlukan sesi dasbor yang terautentikasi (`401` jika tidak).

#### `GET /api/settings/feature-flags`

Mengembalikan setiap flag beserta nilai efektif, sumber, dan ringkasannya.

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
    // ... seluruh 72 flag
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

Menetapkan atau menghapus satu override. Body: `{ key: string; value?: string }`.
Menghilangkan `value` akan menghapus override (memulihkan env / nilai default).

```bash
# Tetapkan override DB
curl -X PUT http://localhost:20128/api/settings/feature-flags \
  -H "Content-Type: application/json" \
  -d '{"key":"REQUIRE_API_KEY","value":"true"}'

# Hapus override (tanpa "value")
curl -X PUT http://localhost:20128/api/settings/feature-flags \
  -H "Content-Type: application/json" \
  -d '{"key":"REQUIRE_API_KEY"}'
```

Respons mengembalikan `effectiveValue`/`source` yang baru, `previousValue`/
`previousSource`, dan `requiresRestart`. Kunci yang tidak dikenal dan nilai enum
di luar rentang akan ditolak dengan `400`.

#### `DELETE /api/settings/feature-flags`

Menghapus **semua** override DB sekaligus, sehingga setiap flag kembali ke nilai env / default.
Mengembalikan `{ cleared: <count>, message: "..." }`.

> [!NOTE]
> Flag dengan `requiresRestart: true` hanya berlaku setelah proses dimuat ulang.
> Alur mulai ulang dasbor memanggil `POST /api/restart`, lalu melakukan polling terhadap
> `GET /api/health/ping` hingga server kembali aktif.

---

## Fallback Anggaran Darurat

`OMNIROUTE_EMERGENCY_FALLBACK` (kategori `runtime`, default `true`) mengontrol
jalur fallback gratis darurat di
[`open-sse/services/emergencyFallback.ts`](../../open-sse/services/emergencyFallback.ts).
Ketika diaktifkan, permintaan yang menghabiskan anggarannya akan diarahkan ke
penyedia/model fallback gratis alih-alih langsung gagal. Atur ke `false` (atau `0`) — melalui
toggle dasbor, override DB, atau variabel lingkungan `OMNIROUTE_EMERGENCY_FALLBACK`
— untuk menonaktifkan perilaku tersebut dan membiarkan permintaan yang kehabisan anggaran
gagal. (Ditampilkan sebagai toggle dasbor dalam PR #3741 / #3752.)

---

## Lihat Juga

- [Referensi Variabel Lingkungan](./ENVIRONMENT.md) — sebagian besar flag memiliki
  variabel lingkungan dengan nama yang sama yang didokumentasikan di sana (penggantian DB
  lebih diprioritaskan).
- [`src/shared/constants/featureFlagDefinitions.ts`](../../src/shared/constants/featureFlagDefinitions.ts)
  — sumber acuan untuk setiap flag.
- [`src/shared/utils/featureFlags.ts`](../../src/shared/utils/featureFlags.ts)
  — logika resolusi (`resolveFeatureFlag`, `isFeatureFlagEnabled`,
  `resolveAllFeatureFlags`).
- [`src/lib/db/featureFlags.ts`](../../src/lib/db/featureFlags.ts) — persistensi penggantian
  DB dalam namespace `feature_flags` pada tabel `key_value`.
