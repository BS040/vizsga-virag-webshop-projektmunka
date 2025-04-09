import React from 'react'
import Title from '../components/Title'

const DataProtection = () => {
  return (
    <div>
    <div className='text-3xl text-center pt-8 border-t'>
        <Title text1={'ADATVÉDELMI '} text2={'TÁJÉKOZTATÓ'} />
      </div>

      <p className='my-2 text-lg mb-4 text-center text-gray-600'>
    Ez az adatvédelmi tájékoztató (a "Tájékoztató") ismerteti, hogyan gyűjtjük, tároljuk és kezeljük az Ön személyes adatait
    a [Vállalkozás neve] ([Vállalkozás címe], a továbbiakban "Mi", "Minket" vagy "Cég") által üzemeltetett weboldalon keresztül,
    valamint hogyan biztosítjuk az Ön jogait az adatkezelés során.
  </p>

  <h2 className='text-2xl font-semibold mt-6 text-gray-700'>1. A kezelt személyes adatok köre</h2>
  <p className='text-lg mb-4 text-gray-600 ml-6'>
    A következő személyes adatokat kezelhetjük a weboldal használata során:
  </p>
  <ul className='list-disc list-inside mb-6 text-gray-600 ml-6'>
    <li>Név</li>
    <li>E-mail cím</li>
    <li>Telefonszám</li>
    <li>Számlázási és szállítási cím</li>
    <li>IP cím</li>
    <li>Böngészési adatok (pl. IP cím, böngésző típusa, oldalmegtekintések, stb.)</li>
  </ul>

  <h2 className='text-2xl font-semibold mt-6 text-gray-700'>2. Az adatok gyűjtése és felhasználásának célja</h2>
  <p className='text-lg mb-4 text-gray-600 ml-6'>
    Személyes adatokat gyűjtünk a következő célokra:
  </p>
  <ul className='list-disc list-inside mb-6 text-gray-600 ml-6'>
    <li><b>Szolgáltatásnyújtás</b>: A weboldalon történő regisztráció, vásárlás, kapcsolatfelvétel és egyéb szolgáltatások biztosítása.</li>
    <li><b>Kommunikáció</b>: Kapcsolatba léphetünk Önnel a kéréseivel, kérdéseivel kapcsolatban, illetve marketing célokkal.</li>
    <li><b>Számlázás és teljesítés</b>: A vásárlások lebonyolítása, számlák kiállítása és a szállítási szolgáltatások teljesítése.</li>
    <li><b>Weboldal fejlesztése</b>: A weboldal működésének javítása és a felhasználói élmény optimalizálása.</li>
  </ul>

  <h2 className='text-2xl font-semibold mt-6 text-gray-700'>3. Az adatok tárolása és védelme</h2>
  <p className='text-lg mb-4 text-gray-600 ml-6'>
    Személyes adatait biztonságos módon tároljuk, és minden szükséges technikai és szervezeti intézkedést megteszünk a jogosulatlan hozzáférés és visszaélés megelőzése érdekében. 
    A személyes adatok tárolása csak addig történik, ameddig szükséges a fenti célok eléréséhez.
  </p>

  <h2 className='text-2xl font-semibold mt-6 text-gray-700'>4. Adattovábbítás és harmadik felek</h2>
  <p className='text-lg mb-4 text-gray-600 ml-6'>
    Az Ön személyes adatait nem osztjuk meg harmadik féllel, kivéve, ha ez szükséges a szolgáltatások biztosításához, jogszabályi kötelezettségek teljesítéséhez, vagy ha Ön ehhez hozzájárul.
  </p>
  <ul className='list-disc list-inside mb-6 text-gray-600 ml-6'>
    <li>Szállítók és futárcégek a termékek kézbesítésére</li>
    <li>Fizetési szolgáltatók a tranzakciók lebonyolítására</li>
    <li>Adatfeldolgozók, akik segítenek a weboldal működtetésében</li>
  </ul>

  <h2 className='text-2xl font-semibold mt-6 text-gray-700'>5. Az Ön jogai</h2>
  <p className='text-lg mb-4 text-gray-600 ml-6'>
    Ön bármikor kérheti a következőket:
  </p>
  <ul className='list-disc list-inside mb-6 text-gray-600 ml-6'>
    <li><b>Hozzáférés az adatokhoz</b>: Információt kérhet arról, hogy milyen személyes adatokat tárolunk róla.</li>
    <li><b>Helyesbítés</b>: Kérheti, hogy helyesbítsük a tévesen tárolt adatokat.</li>
    <li><b>Törlés</b>: Bármikor kérheti személyes adatainak törlését, kivéve, ha jogszabály kötelezi a megőrzést.</li>
    <li><b>Adatkezelés korlátozása</b>: Kérheti, hogy bizonyos adatokat ne kezeljünk, vagy csak korlátozottan.</li>
    <li><b>Adathordozhatóság</b>: Kérheti az adatai más szolgáltató számára történő átadását.</li>
    <li><b>Tiltakozás</b>: Bármikor kérheti, hogy ne kezeljük tovább az adatait.</li>
  </ul>

  <h2 className='text-2xl font-semibold mt-6 text-gray-700'>6. Cookie-k és egyéb nyomkövető technológiák</h2>
  <p className='text-lg mb-4 text-gray-600 ml-6'>
    Weboldalunkon cookie-kat használunk, hogy javítsuk a felhasználói élményt, és hogy nyomon kövessük a weboldal használatát. A cookie-k segítségével információkat gyűjtünk a böngészési szokásairól, de személyes adatokat nem tárolunk rajtuk.
  </p>

  <h2 className='text-2xl font-semibold mt-6 text-gray-700'>7. Adatkezelő és elérhetőségek</h2>
  <p className='text-lg mb-4 text-gray-600 ml-6'>
    A személyes adatok kezeléséért felelős adatkezelő:
  </p>
  <p className='text-lg mb-6 text-gray-600 ml-6'>
    [Vállalkozás neve]<br/>
    [Cím]<br/>
    [Email cím]<br/>
    [Telefonszám]
  </p>
  <p className='text-lg mb-6 text-gray-600 ml-6'>
    Ha bármilyen kérdése van adatkezeléssel kapcsolatban, vagy élni szeretne a jogai valamelyikével, kérjük, vegye fel velünk a kapcsolatot.
  </p>

  <h2 className='text-2xl font-semibold mt-6 text-gray-700'>8. Módosítások</h2>
  <p className='text-lg text-gray-600 ml-6'>
    Fenntartjuk a jogot, hogy ezen adatvédelmi tájékoztatót bármikor módosítsuk, hogy megfeleljünk az új jogszabályoknak vagy a szolgáltatásaink változásainak. Az esetleges változásokat ezen az oldalon tesszük közzé.
  </p>
    </div>
  )
}

export default DataProtection
