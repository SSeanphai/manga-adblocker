# Manga Sites Ad Cleaner

Chrome/Edge extension แบบ Manifest V3 สำหรับลบบล็อกโฆษณาบน
`animeruka.com`, `seriedayz.com`, `dark-manga.com`, `go-manga.com` และ
`nano-manga.com`
โดยอัตโนมัติ

## วิธีติดตั้งฟรีบน iPhone/iPad

รองรับ Safari บน iOS/iPadOS 15.1 ขึ้นไปผ่านแอปโอเพนซอร์ส **Userscripts**

1. ติดตั้ง [Userscripts](https://apps.apple.com/app/userscripts/id1463298887) จาก App Store
2. เปิดแอป Userscripts หนึ่งครั้ง เพื่อสร้างโฟลเดอร์เก็บสคริปต์
3. ไปที่ **Settings > Apps > Safari > Extensions > Userscripts**
4. เปิดส่วนขยายและเลือก **Always Allow** สำหรับเว็บไซต์ทั้งหมด
5. เปิดลิงก์ [ติดตั้ง Manga Sites Ad Cleaner](https://raw.githubusercontent.com/SSeanphai/manga-adblocker/main/manga-adblocker.user.js) ด้วย Safari
6. แตะไอคอน Extensions ใน Safari > **Userscripts** > ยืนยันการติดตั้ง
7. Reload หน้าเว็บมังงะหนึ่งครั้ง

วิธีนี้ใช้ฟรี ไม่ต้องสมัครสมาชิก และทำงานเฉพาะ Safari โดยไฟล์
`manga-adblocker.user.js` จะตรวจเฉพาะ 5 โดเมนที่รองรับ

## วิธีติดตั้งใน Chrome

1. แตกไฟล์ ZIP ก่อน (ห้ามเลือกไฟล์ ZIP โดยตรง)
2. เปิด `chrome://extensions`
3. เปิด **Developer mode** มุมขวาบน
4. กด **Load unpacked**
5. เลือกโฟลเดอร์ `animeruka-ad-cleaner`
6. Reload หน้า AnimeRuka, SerieDayz, Dark Manga, Go Manga หรือ Nano Manga ที่เปิดอยู่หนึ่งครั้ง

## วิธีติดตั้งใน Microsoft Edge

1. แตกไฟล์ ZIP ก่อน
2. เปิด `edge://extensions`
3. เปิด **Developer mode**
4. กด **Load unpacked**
5. เลือกโฟลเดอร์ `animeruka-ad-cleaner`
6. Reload หน้า AnimeRuka, SerieDayz, Dark Manga, Go Manga หรือ Nano Manga ที่เปิดอยู่หนึ่งครั้ง

## ขอบเขตการทำงาน

- ทำงานเฉพาะโดเมน AnimeRuka, SerieDayz, Dark Manga, Go Manga และ Nano Manga
  ทั้งแบบมีและไม่มี `www.`
- ซ่อนโฆษณาตั้งแต่เริ่มโหลด เพื่อลดอาการภาพโฆษณากะพริบ
- ลบ element และ wrapper ของโฆษณาออกจาก DOM
- เฝ้าตรวจโฆษณาที่ถูก inject ภายหลังด้วย `MutationObserver`
- ไม่อ่านหรือส่งข้อมูลการท่องเว็บออกไปภายนอก

## Selector ที่ตรวจจากเว็บจริง

- AnimeRuka: `[id^="ad-group-"]` และ wrapper `.code-block`
- SerieDayz: `aside.ad`, `div.adcen`, `div.adhl`, `div.adl`, `div.adrg`
- Dark Manga: `.center_darkmangaza`, `.center_darkmanga`,
  `.center_darkmangasolo`, `#sticky-bottom`, `#sticky-bottom2`, `#sticky-bottom3`
- Go Manga: `.center_gomangaza`, `.center_gomanga`, `.center_gomangasolo`,
  `#sticky-bottom`, `#sticky-bottom2`, `#sticky-bottom3`
- Nano Manga: `#block-5`, `#sticky-ads-bottom`, `#sticky-ads-bottom2`,
  `#sticky-ads-bottom3`

SerieDayz ใช้ `.adlf` ซ้ำทั้งกับโฆษณาและเมนูหมวดหมู่ Extension จึงตั้งใจไม่ลบ
`.adlf` ทั้งก้อน เพื่อไม่ให้เนื้อหาและ navigation หายไปด้วย

Dark Manga ใช้ `.adds` กับข้อมูลตอนและคะแนนของมังงะจริง Extension จึงไม่ลบ
`.adds` และไม่แตะ `.entry-content` ซึ่งเป็นพื้นที่ภาพหน้ามังงะ

Go Manga ใช้ `.entry-content` สำหรับภาพหน้ามังงะ Extension จึงลบเฉพาะกลุ่ม
`.center_gomanga*` และโฆษณาลอย โดยไม่แตะภาพมังงะ

Nano Manga ใช้ `.reading-content` สำหรับภาพหน้ามังงะ Extension จึงลบเฉพาะ
widget โฆษณา `#block-5` และโฆษณาลอย โดยไม่แตะภาพมังงะหรือปุ่มเปลี่ยนตอน
