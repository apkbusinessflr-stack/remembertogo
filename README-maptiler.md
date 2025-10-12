# MapTiler ρύθμιση (RememberToGo)

Ο στόχος είναι να εμφανίσουμε χάρτη στο `/map` με **MapLibre + MapTiler Flex**, με ασφαλείς περιορισμούς (HTTP referrers) και χαμηλό κόστος.

---

## 1) Δημιούργησε API key στο MapTiler
1. Μπες στο **MapTiler → Account → API Keys**.
2. **Create key** και ονόμασέ το π.χ. `remembertogo-web`.
3. Κράτα το key (μοιάζει με `pk_XXXXXXXX...`).

> Σημαντικό: Το key θα χρησιμοποιηθεί **στον browser** (public). Θα το προστατέψουμε με domain restrictions.

---

## 2) Περιορισμός με HTTP Referrers (ασφάλεια)
Στο ίδιο API key:
1. **Restrictions → HTTP referrers**.
2. Πρόσθεσε (ένα ανά γραμμή):
   - `remembertogo.com`
   - `www.remembertogo.com`
   - `*.vercel.app`   ← για Preview URLs
   - `localhost`      ← για τοπικό dev (αν ποτέ χρειαστεί)

> Έτσι, ακόμα κι αν κάποιος κλέψει το key, **δεν** θα φορτώνει χάρτες έξω από τα domains σου.

---

## 3) Spending cap / Budget
Για να μείνεις κάτω από ~€60/μήνα:
1. **Billing / Usage** στο MapTiler: όρισε **μηνιαίο όριο** π.χ. **$25–30**.
2. Ενεργοποίησε **email alerts** όταν πλησιάζεις τα όρια.

---

## 4) Πρόσθεσε το key στο Vercel (Environment Variables)
Vercel → Project → **Settings → Environment Variables**
- Όνομα: `NEXT_PUBLIC_MAPTILER_KEY`
- Τιμή: `pk_…` (χωρίς εισαγωγικά)
- Environments: **Preview** & **Production**
- **Save** και μετά **Redeploy**

> Μην βάλεις το πραγματικό key μέσα στο repo. Το `.env.example` απλώς δείχνει το όνομα της μεταβλητής.

---

## 5) Έλεγχος στο Preview
1. Κάνε push/PR → θα πάρεις **Vercel Preview URL** π.χ. `https://remembertogo-xxxx.vercel.app`.
2. Άνοιξε: `…/map`. Αν όλα είναι σωστά, θα δεις χάρτη (κέντρο Αθήνα).
3. Αν δεις κενή σελίδα:
   - Έλεγξε στο **Vercel → Environment Variables (Preview)** ότι υπάρχει `NEXT_PUBLIC_MAPTILER_KEY`.
   - Στο MapTiler, έλεγξε ότι έχεις `*.vercel.app` στα **HTTP referrers**.
   - Κάνε **Redeploy** το Preview.

---

## 6) Παραμετροποίηση χάρτη (προαιρετικά τώρα, αργότερα αν θες)
- Αρχικό κέντρο/zoom: στο component `Map.tsx`.
- Στυλ: άλλαξε το `styleUrl` (π.χ. `streets`, `outdoor`, `satellite`).
- Thumbnails/Static: για λίστες/προεπισκοπήσεις, μπορείς να χρησιμοποιήσεις **Static Maps API** (λιγότερο κόστος σε σελίδες χωρίς interactive ανάγκη).

---

## 7) Συχνά προβλήματα (Troubleshooting)
- **`401 Unauthorized / 403 Forbidden`**: λάθος ή ανύπαρκτο key, ή δεν επιτρέπεται από referrers.
- **Κενό πλαίσιο**: λείπει το CSS (`maplibre-gl/dist/maplibre-gl.css`) ή δεν πέρασε το `NEXT_PUBLIC_MAPTILER_KEY`.
- **Load αλλά χωρίς tiles**: έλεγξε domain restrictions—π.χ. αν το Preview είναι `https://remembertogo-git-branch-user.vercel.app`, πρέπει να καλύπτεται από `*.vercel.app`.

---

## 8) Αρχιτεκτονικές σημειώσεις
- Η βιβλιοθήκη είναι **MapLibre GL**· ο πάροχος tiles είναι ο **MapTiler**.
- Το key είναι **public** by design — η ασφάλεια βασίζεται σε **HTTP referrer restrictions**.
- Για κόστη, προτίμησε:
  - **Static-first σελίδες** (ISR) όπου γίνεται,
  - **Caching** στον client,
  - Όχι περιττά re-renders στο map component.

---

## 9) Checklist
- [ ] Δημιούργησα API key στο MapTiler (`pk_...`).
- [ ] Έβαλα **HTTP referrers**: `remembertogo.com`, `www.remembertogo.com`, `*.vercel.app`, `localhost`.
- [ ] Ρύθμισα **Spending cap/alerts** στο MapTiler.
- [ ] Πρόσθεσα στο Vercel (Preview + Production) το `NEXT_PUBLIC_MAPTILER_KEY`.
- [ ] Preview URL ανοίγει `/map` και βλέπω χάρτη.

Καλή αρχή! Αν κολλήσεις, στείλε το **Preview URL** ή screenshot από τα **Vercel logs** / **Console** και σε κατευθύνω αμέσως.
