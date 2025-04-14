A projekt zökkenő mentes ellindításához ajánlatos teendők:
1. Git clone parancs után a projekt megnyitása egy kedvelt kódolási környezetben (Pl. Visual Studio Code)
2. A forntend-be egy npm istall parancsal telepíteni a szükséges kiegészítő file-okat amit vagy a kiválasztott kódolási környezet termináljában vagy az adott operációs rendszer termináljában lehet megtenni és esetleges npm audit fix-ek végrehajtása
3. A backend-be egy npm istall parancsal telepíteni a szükséges kiegészítő file-okat amit vagy a kiválasztott kódolási környezet termináljában vagy az adott operációs rendszer termináljában lehet megtenni és esetleges npm audit fix-ek végrehajtása
4. Az Admin-ba egy npm istall parancsal telepíteni a szükséges kiegészítő file-okat amit vagy a kiválasztott kódolási környezet termináljában vagy az adott operációs rendszer termináljában lehet megtenni és esetleges npm audit fix-ek végrehajtása
5. A parancsok végrehajtása után az admin, frontend, és a backend mappájában található .env.example fileok kikommentelése és átnevezése .env-re
6. Miután a telepítések megtörténtek az admin és a frontend-be egy npm run dev parancs kiadással megjelenik a kívánt oldal a backendben egy npm run server parancsal meg beindul a backend

Mi ezeket a lépéseket használtuk a projekt indításakor és a fejlesztésekor remélem hogy hasonló eredményeket érnek el a felhasználók amiket mi is.
