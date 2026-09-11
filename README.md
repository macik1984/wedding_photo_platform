# Paparazzi

Fotky a videá od hostí priamo do Google Drive organizátora. Ktokoľvek sa
prihlási Googlom, založí si akciu, nastaví si vzhľad aj úlohy foto misie
a rozdá hosťom QR kód. Hostia sa nikam neprihlasujú.

- `/` - úvodná stránka a prihlásenie
- `/admin` - zoznam akcií organizátora
- `/admin/<id>` - nastavenia jednej akcie
- `/<slug>` - odosielanie pre hostí
- `/<slug>/gallery` - živá galéria
- `/<slug>/slideshow` - premietanie na projektor
- `/api/health` - diagnostika nasadenia

## Ako to funguje

**Každý organizátor má vlastný Drive.** Pri prihlásení aplikácia dostane
rozsah `drive.file` na jeho účet a token si uloží zašifrovaný (AES-256-GCM).
Pri založení akcie vytvorí v jeho Drive nový priečinok. Rozsah `drive.file`
vidí výhradne to, čo aplikácia sama vytvorila, takže k ostatnému obsahu Drive
sa nedostane ani omylom.

**Súbory neprechádzajú cez server.** `/api/e/<slug>/upload-slot` vytvorí na
Drive resumable upload session a vráti telefónu adresu, na ktorú pošle bajty
priamo Googlu. Vercel funkcia teda nedrží telo súboru a neplatí pre ňu limit
4,5 MB, takže prejdú aj veľké videá.

Keď priamy prenos neprejde (CORS, prísna sieť), súbor ide po 3 MB kusoch cez
`/api/e/<slug>/upload-chunk`. Pred tým sa aplikácia Googlu opýta, koľko už
z toho súboru má, aby sa nič nenahralo dvakrát.

**Žiadna evidencia fotiek.** Autor a čas sú v názve súboru
(`2026-09-18_2143__Zofia-Novakova__IMG_1234.jpg`), takže databáza drží len
používateľov a nastavenia akcií.

## Čo si organizátor nastavuje

Mená a dátum, riadok nad menami, nadpis, podnadpis a poďakovanie. Farebnú tému
(päť hotových vrátane tmavej) a k tomu vlastnú hlavnú farbu. Písmo zo štyroch
dvojíc. Botanické ozdoby zapnúť alebo vypnúť. Celý zoznam úloh foto misie
vrátane poradia. A prepínače: galéria, premietanie, prijímanie videí,
vyžadovanie mena.

Jazyk ovládacích prvkov sa berie z prehliadača hosťa (slovenčina pre `sk`
a `cs`, inak angličtina). Texty od organizátora sa neprekladajú, idú tak,
ako ich napísal.

---

## Nastavenie od nuly

### 1. Databáza

Vo Verceli otvor projekt → **Storage** → **Create Database** → **Neon**.
Premenná `DATABASE_URL` sa doplní sama. Tabuľky si aplikácia založí pri prvom
dotaze, žiadny migračný krok nie je potrebný.

### 2. Google Cloud

1. [console.cloud.google.com](https://console.cloud.google.com/) → nový projekt.
2. **APIs & Services → Library** → **Google Drive API** → **Enable**.
3. **Google Auth Platform → Branding**: názov, support e-mail, Application
   home page `<APP_URL>`, Privacy policy `<APP_URL>/privacy`, Terms
   `<APP_URL>/terms`.
4. **Audience** → External → **Publish app** → **In production**.
5. **Clients → Create client** → **Web application** → Authorized redirect URI:

```
<APP_URL>/api/auth/google/callback
```

> Publikovanie do produkcie nie je voliteľné. V stave *Testing* Google ruší
> refresh tokeny po 7 dňoch a organizátorom by prestalo fungovať nahrávanie.
> Rozsah `drive.file` nie je citlivý, takže publikovanie neprechádza
> overovaním a je okamžité.

> Kým aplikácia nie je overená Googlom, uvidia organizátori pri prihlásení
> obrazovku „Google hasn't verified this app". Prejde sa cez **Advanced → Go
> to ...**. Zároveň platí limit 100 organizátorov na projekt; hostí sa
> netýka, tí nič neautorizujú.

### 3. Premenné vo Verceli

| Názov | Poznámka |
|---|---|
| `APP_URL` | verejná adresa bez lomítka na konci |
| `GOOGLE_CLIENT_ID` | z kroku 2 |
| `GOOGLE_CLIENT_SECRET` | z kroku 2 |
| `DATABASE_URL` | doplní Neon integrácia |
| `APP_SECRET` | `npm run secret`, 32 bajtov v base64 |
| `NEXT_PUBLIC_CONTACT_EMAIL` | nepovinné |

Zaškrtni ich pre **Production**. Po zmene je nutný **Redeploy**, Vercel ich
číta pri builde.

> `APP_SECRET` podpisuje prihlasovacie cookies a šifruje tokeny k Drive.
> Keď ho zmeníš, všetci sa odhlásia a uložené tokeny sa už nedajú prečítať;
> organizátori sa budú musieť prihlásiť znova.

### 4. Lokálny vývoj

```bash
npm install
cp .env.example .env.local   # APP_URL=http://localhost:3000
npm run secret               # vloz do APP_SECRET
npm run dev
```

Do OAuth klienta pridaj aj `http://localhost:3000/api/auth/google/callback`.

---

## Poznámky

- Súbory sa počítajú do kapacity Google účtu organizátora. Fotky sú po 3 až
  5 MB, videá aj 100 MB za minútu záznamu.
- Dva prenosy idú naraz. Wake Lock drží obrazovku zapnutú, inak by uspatý
  prehliadač prenos zastavil. Na pozadí to nefunguje a webová stránka na to
  ani nemá prostriedky.
- Pri zlyhaní sa každý súbor skúsi ešte raz a tlačidlo sa zmení na „Skúsiť
  znova"; už odoslané súbory sa neposielajú druhýkrát.
- Galéria je prístupná každému, kto pozná adresu. Samotný priečinok na Drive
  zostáva súkromný, súbory idú cez `/api/e/<slug>/photo/<id>`, ktorý overuje,
  že súbor naozaj patrí do priečinka danej akcie.
- Zmazanie akcie ruší len adresu a nastavenia. Priečinok a fotky na Drive
  zostávajú nedotknuté zámerne.

## Riešenie problémov

Najprv `/api/health`. Povie, ktorá premenná chýba, či má `APP_SECRET` správnu
dĺžku a či sa dá pripojiť k databáze. Hodnoty premenných nevypisuje.

| Príznak | Príčina |
|---|---|
| `Google nevrátil refresh token` | prihlásenie bez `prompt=consent`, skúsiť znova |
| `redirect_uri_mismatch` | v OAuth klientovi nesedí `<APP_URL>/api/auth/google/callback` |
| `slot 500: server_error` | chýba premenná, pozri `/api/health` |
| `drive_init_failed` | organizátor odobral aplikácii prístup ku Drive |
| `invalid_grant` po týždni | aplikácia zostala v stave *Testing* |
| 404 na adrese akcie | slug neexistuje alebo bola akcia zmazaná |
