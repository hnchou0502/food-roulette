# food-roulette — 「今天吃什麼」午晚餐輪盤（最後更新：2026-11-25）

## 🚫 紅線
- 本 repo 是 **public**（github.com/hnchou0502/food-roulette），push 到 main＝直接更新公開網址 → **每次 push 都要先問用戶**（不在紅線 #6 例外三的清單內）。2026-11-25 首次建立與推送＝用戶當回合指示「Put it on GitHub」。
- 部署到其他公開主機（Netlify…）同樣要先問。

## 專案簡介
- 單一 HTML 頁：1,000 道「一個人點了就是一餐」的午晚餐，轉盤抽一道；可篩菜系／飯麵、避開最近吃過的、一鍵 Google Maps 找附近店家。
- 純前端、無後端、無金鑰。「最近吃過」與篩選只存在各自瀏覽器的 localStorage。
- 2026-11-25 建立。兩個網址，同一份原始碼：
  - 公開版（給朋友，不用登入）：https://hnchou0502.github.io/food-roulette/ （GitHub Pages，從 main 的 `/docs` 發佈）
  - Claude 私人網頁：https://claude.ai/artifact/EExYukJFTguq29dgAQjpkM

## 目錄結構
- `index.html`：整個 App。菜單在 `<script type="text/plain" id="dishes">` 區塊，一行一道；`@大類|小類` 開新分類。
- `check.js`：驗證菜單筆數／重複／頁面腳本語法／docs 是否同步。
- `build.js`：把 `index.html` 包成完整網頁（補 doctype、charset、分享預覽用的 og 標籤）輸出到 `docs/index.html`。
- `docs/index.html`：GitHub Pages 用的產物，**不要手改**，改 `index.html` 再 build。

## 常用指令
```bash
node build.js   # 改完 index.html 先產生 GitHub 版
node check.js   # 必跑，要看到 PASS（含 docs 同步檢查）
```

## 驗證紀律
- 改菜單 → `node check.js` 必須 PASS（剛好 1000 道、零重複）。增刪要成對，總數維持 1000；要改總數就連同頁面上的「1,000」字樣一起改。
- 改程式／版面 → 瀏覽器實測：轉一次、指針指的那格＝結果卡；手機寬度（375px）看一次。
- 改完兩邊都要更新：Claude 網頁＝Artifact publish 同一個檔案路徑（別的對話要帶 `url`）；公開版＝build → commit → **問過用戶再 push**。

## 資料地雷（踩過的坑）
- 選菜原則：只收一人份就能吃飽的品項（便當、蓋飯、一碗麵、定食、套餐、個人鍋）。整桌分食的菜（獅子頭、東坡肉、宮保雞丁單點）要改成「XX便當／XX飯」才收。
- 飯／麵／其他是用關鍵字自動判斷（`kindOf`）。「麵包」要先剔除，否則法國麵包會被當成麵；乾炒牛河、星洲炒米、上海粗炒這類名字裡沒有「麵」，靠額外關鍵字補。
- 本機用 file:// 預覽時，檔案自帶的 viewport meta 不能拿掉，否則手機寬度會用 980px 排版、測不出真實手機版面。

- public repo 的 commit 會公開作者 email：本 repo 的 git config 已設 GitHub noreply 信箱，別改回 Gmail。

## 注意事項
- Claude 網頁的發佈外殼會自動加 `<!doctype html><head>`，所以檔案本身沒有這些標籤；若改放其他主機，要自己包上 doctype 與 charset。
