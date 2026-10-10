# NTAM 官網接手及維護紀錄

接手日期：2026-10-09（香港時間）。維護協作：Codex／ChatGPT，按用戶後續指示更新。

## 1. 已核實的來源與版本

| 項目 | 接手時狀態 |
| --- | --- |
| 官網 | https://www.ntam.com.hk/ |
| 繁中入口 | https://www.ntam.com.hk/tc/index.html |
| 原始碼 | https://github.com/FYCHANAI/ntam-website |
| 生產分支 | `main` |
| 接手基準 commit | `9f22a31da60c80e5db7949e4c01d5cdb41ef31c4` |
| 該 commit 時間 | 2026-10-01 00:58:21 HKT（2026-09-30 16:58:21 UTC） |
| 備份分支 | `backup/pre-codex-handover-20261009`，指向接手基準 |
| 網站託管 | GitHub Pages；`CNAME` 為 `www.ntam.com.hk` |
| 成功部署 | [Pages run 36748073959](https://github.com/FYCHANAI/ntam-website/actions/runs/36748073959)，對應上述 commit |
| 連線權限 | GitHub 回傳 pull、push、maintain、admin 權限；備份分支建立成功 |

已讀取全部 25 個 HTML、共用 CSS／JavaScript、頁面內嵌樣式及腳本、CNAME 和兩份占位 README；並取得完整 106 檔案的儲存庫工作副本。重複樣式／腳本按內容比對，三語差異逐項閱讀。

這是主公司網站。此基準內沒有 MU、NVDA、ORCL、MCD 等研究報告頁，也沒有 HR、Gift 或 Claim 系統。媒體頁連結的 `FYCHANAI/ntam-wrise-interview` 屬另一個專案；本次未聲稱已接手該專案的程式碼。

## 2. 原始碼地圖

| 位置 | 用途與修改注意 |
| --- | --- |
| `index.html`、`tc/index.html`、`sc/index.html` | 首頁、公司簡介、六項優勢、YouTube 介紹、六張媒體卡片、聯絡表單 |
| 三語 `about.html` | 願景／使命、角色流程、Elite EAM；頁內 CSS 和三分頁切換腳本 |
| 三語 `team.html` | 高級管理層、合夥人、投資團隊；卡片及隱藏簡歷內容，共用彈窗顯示 |
| 三語 `products.html` | 九項產品卡片 |
| 三語 `services.html` | 投資諮詢、全權委託投資組合管理、EAM；頁內 CSS／SVG |
| 三語 `office.html` | 新加坡、杜拜及 DIFC 辦事處，外連相關網站 |
| 三語 `media-coverage.html` | 八項媒體／新聞卡片；四項 `details` 展開內容、PDF 下載和 MP4 影片 |
| 三語 `news.html` | 舊頁導向同語言 `media-coverage.html`；meta refresh、canonical、noindex |
| `privacy-policy.html` | 共用英文免責／私隱頁；中文頁目前均連到此頁 |
| `assets/css/style.css` | 全站色彩、字體、導航、卡片、手機版、彈窗及免責聲明樣式 |
| `assets/js/main.js` | 手機選單、團隊簡歷彈窗、表單、免責聲明、頁尾年份 |
| `assets/images/` | 圖片及團隊照片；另有兩張圖片重複放在 `assets/` 根目錄 |
| `assets/*.pdf`、`assets/*.mp4` | 九份新聞稿 PDF（每事件三語）及兩段自託管影片 |
| `tc/README.md`、`sc/README.md` | 接手時只有占位內容，沒有可用的維護指引 |

基準數量：25 HTML、1 CSS、1 JS、65 圖片、9 PDF、2 MP4、2 README、1 CNAME，共 106 個檔案。HTML／CSS／JS 合共 6,735 行。

語言映射：根目錄 `en`、`tc/` 為 `zh-Hant`、`sc/` 為 `zh-Hans`。七類主要頁面均有三語及 `x-default` 的 hreflang。私隱頁只有英文版。

沒有 React／Next.js／WordPress、套件鎖定檔、應用程式建置流程、資料庫或後端原始碼。頁首、頁尾、語言連結及多處內容由各 HTML 自行保存；修改共用資料時要涵蓋所有適用頁面。

## 3. 視覺及互動基準

- 品牌主色 `#034459`，輔色 `#035772`，淺底色 `#f6f9f5`，字體 Montserrat。
- 一般內容寬度 980px；團隊頁使用更寬的流動容器；頁首滿寬。
- 導航在 1500px 以下改為漢堡選單；另外有 1600／1441、1440、900、860、768、760、600、560px 等共用或頁內規則。
- About 分頁以 `.is-active` 切換。Team 以 `.full-bio-content` 提供受維護者控制的靜態 HTML，複製到簡歷彈窗。
- 免責聲明在 `sessionStorage.ntamDisclaimerAccepted` 不等於 `yes` 時顯示；只代表同一頁籤工作階段的前端確認，並非帳戶或投資者資格驗證。
- 頁尾年份由瀏覽器當前年份更新。

## 4. 外部服務與接手界線

| 服務 | 原始碼可核實的用途 | 本次核實界線 |
| --- | --- | --- |
| GitHub Pages | 主站發佈與 HTTPS 內容 | 已核對部署紀錄及線上程式檔案 |
| Web3Forms | `POST https://api.web3forms.com/submit`；表單有 access key、subject、from_name、botcheck | 已閱讀程式；沒有發送真實查詢，未核實服務後台、收件人或收件結果 |
| Wix CDN | 每個完整頁面的公司 Logo | 已識別依賴；沒有修改 Wix 帳戶或設定 |
| Google Fonts | CSS 引入 Montserrat | 已識別依賴；未保證所有地區載入情況 |
| YouTube privacy-enhanced embed | 首頁影片 `Fpzgq3I6BVk` | 已識別 iframe；未保證各地播放情況 |
| 新加坡／杜拜／WRISE 等外站 | 公司／訪問相關連結 | 只盤點主站連結，未審查外站原始碼 |
| DNS／網域帳戶 | `CNAME` 證實此站網域 | 本次未登入或更改網域管理後台，沒有驗證帳戶控制權 |

不要從前端註解推定 Web3Forms 真實收件人已驗證。表單使用者提交資料會傳往上述外部服務；驗收測試應先攔截並模擬回應。

## 5. 本次完成的檢查

| 檢查 | 結果 |
| --- | --- |
| 27 個線上程式檔案（25 HTML、CSS、JS） | 全部 HTTP 200；內容與 GitHub 基準逐位元組一致 |
| HTML 中 645 處站內 href／src／poster 引用 | 對應本地檔案全部存在 |
| HTML 中頁內錨點及重複 id | 未發現缺失錨點或重複 id |
| HTML 內嵌 CSS 的本地 url 引用 | 對應檔案存在；共用 CSS 引用的 skyline 圖亦存在 |
| `main.js` 及三個 About 頁內腳本 | Node 語法檢查通過 |
| 三語的五組頁內 CSS | 正規化 `../assets/` 路徑後相同 |
| 三語 About 頁內腳本 | 相同 |

這是程式碼接手檢查。未進行所有裝置的瀏覽器互動驗收、真實郵件送達測試、第三方服務後台審查、PDF 內容核證或影片逐段檢視；資產取得及連結存在不代表這些檢查已完成。

## 6. 已知事項及後續修正清單

以下為接手時觀察及目前處理狀態；2026-10-09 第一輪修正的驗證記錄見第 10 節。

| 優先 | 項目 | 證據／影響與處理方向 |
| --- | --- | --- |
| 優先 | 團隊彈窗 aria 狀態（已修正） | 三語 `team.html` 初始 `aria-hidden="true"`，`main.js` 開啟時未更新。畫面顯示與輔助技術狀態不一致。同步狀態並驗證焦點 |
| 優先 | 手機導航語意及焦點（已修正） | 按鈕的 `aria-expanded` 一直為 false；隱藏選單僅移出螢幕。應同步狀態、檢查鍵盤焦點及關閉操作 |
| 優先 | 免責聲明鍵盤焦點（已修正） | 有初始 focus，但沒有焦點圈限或背景 inert；應驗證鍵盤能否移到背景，改善對話框行為 |
| 優先 | 中文表單的提示語言（已修正） | 驗證、提交中、成功、失敗等訊息在共用 JS 全部寫死英文。應依頁面 lang 提供對應三語 |
| 優先 | 聯絡表單欄位標籤（已修正） | 名稱等欄位主要靠 placeholder，欠缺明確 label／accessible name；補上並驗證 |
| 次要 | 手機選單位置（已修正） | CSS 固定 `top:128px`，小尺寸 Logo／頁首高度已有變更；可能有空隙或遮擋。需要實際版面驗證後修正 |
| 次要 | CSS 變數拼字（已修正） | `.modal-title` 使用未定義 `var(--text-muted)`；現有 token 為 `--color-text-muted` |
| 次要 | 免責及私隱語言 | 彈出聲明及私隱頁僅英文；翻譯應依公司確認的正式文字，保留法律語意 |
| 次要 | 外部 Logo 依賴 | Logo 仍載自 Wix CDN；可在保留同一核准圖像下評估自託管 |
| 次要 | About 分頁鍵盤操作 | 現有腳本只有 click，未實作方向鍵／roving tabindex；增加操作前先定義預期行為 |
| 後續 | 搜尋／分享 metadata | 主要頁面沒有 h1、canonical、Open Graph；基準沒有 sitemap.xml／robots.txt。按需要補齊，保留現有 hreflang 和 redirect 設定 |
| 後續 | 重複維護與內容核對 | 三語內容／頁首頁尾多處複製，個別英文頁保留中文專訪。先確定內容意圖，再統一；避免大幅重建 |

未發現站內資源路徑缺失，不代表沒有互動或內容問題。此文件不作法律或監管合規結論。

## 7. 日後更新流程

1. 讀取最新 `main`、近期變更、這份紀錄及本次用戶要求，記下變更前 commit；保留獨立工作分支。
2. 按原始碼地圖修改相應頁面。公司新聞通常需要同步三語 `media-coverage.html`，並按需求同步三語首頁卡片及素材。
3. 人員更新同步照片、姓名、職銜、簡歷及三語；不得僅依同名英文人物或記憶推定身份。
4. 核對相關語言、資源路徑、語法及受影響的桌面／手機功能。表單以模擬提交驗證。
5. 按當次已取得的授權提交及發佈；推送工作分支不等於上線。發佈後核對對應 Pages run 及線上內容。
6. 紀錄日期、commit、修改內容、測試結果及可回復版本。

## 8. 回復方式

本次完整程式及素材基準由遠端備份分支保留，並非 DNS、Web3Forms 或其他服務帳戶設定的備份。

- 接手基準：[commit 9f22a31](https://github.com/FYCHANAI/ntam-website/commit/9f22a31da60c80e5db7949e4c01d5cdb41ef31c4)。
- 備份：[backup/pre-codex-handover-20261009](https://github.com/FYCHANAI/ntam-website/tree/backup/pre-codex-handover-20261009)。
- 如某次上線需撤回，優先 revert 該次修改，建立新 commit，保留其後其他人的修改及完整歷史。
- 如需還原個別檔案，從明確指定的基準取回該檔案，再檢查差異、提交及驗證重新部署。
- 全站回復屬較大範圍，先列清會被覆蓋的後續改動；不要直接強制重設 `main`。

## 9. 接手紀錄

| 日期 | 工作 | 線上變更 |
| --- | --- | --- |
| 2026-10-09 | 全站程式閱讀、檔案盤點、線上原始碼比對、靜態連結／語法檢查、建立備份分支及維護文件 | 無；正式頁面、CSS、JS、資產及生產分支保持基準版本 |

## 10. 2026-10-09 第一輪維護

變更前生產 commit：`9f22a31da60c80e5db7949e4c01d5cdb41ef31c4`。本輪原始碼修改在 `codex/site-maintenance-20261009`，其 commit／合併 commit 為本節所屬 Git 歷史；部署完成以對應 Pages workflow 與線上內容核對為準。

### 修改範圍

- `assets/js/main.js`：表單提示跟隨 en／zh-Hant／zh-Hans；防止重複發送，HTTP 錯誤不再顯示成功，失敗時保留輸入並恢復按鈕。手機導航同步展開狀態、隱藏時不可聚焦，支援 Escape，依實際頁首位置調整。簡歷彈窗及免責聲明隔離背景、圈限鍵盤焦點並在關閉後恢復；同步簡歷彈窗 aria 狀態。
- `assets/css/style.css`：補上視覺隱藏的欄位標籤樣式；手機選單高度配合頁首及動態視窗，允許捲動；修正未定義的文字顏色變數及阻礙初始焦點的 visibility 動畫。
- 三語 `index.html`：補上姓名、電子郵件、電話及訊息的 label。
- 沿用原有表單服務／收件設定、公司文字、URL、素材及免責聲明原文。

### 驗證

- Node 語法檢查及 `git diff --check` 通過。
- 25 個 HTML 的 645 處站內引用、頁內錨點及重複 id 檢查通過。
- Chromium：三語首頁、團隊頁及其餘五類主頁載入無 JavaScript 例外。測試尺寸 390×844、844×390、1440×900、1920×1080。
- 三語必填／電郵驗證、提交中／重複提交、成功、HTTP 500、網絡失敗均以攔截請求模擬通過；確認失敗後資料保留、按鈕恢復。沒有真實發送查詢，未核實郵件送達。
- 驗證手機導航位置、展開狀態、Escape／連結關閉；簡歷彈窗背景隔離、Tab／Escape／背景點擊關閉及焦點返回；免責聲明焦點圈限、同頁籤同意記憶和背景復原。
- 免責聲明原文與基準程式逐字比對一致。第三方影片及服務後台不在本輪驗證範圍。

回復點仍為第 8 節備份分支。撤回本輪時以新 revert commit 保留後續修改及歷史。

## 11. 2026-10-10 Forbes ceremony photo correction

- User-authorized scope: replace the two supplied ceremony photos in the 11 September 2026 English, Traditional Chinese and Simplified Chinese press releases, and update the corresponding media-page and homepage images before publishing.
- Baseline / rollback point: `c698cd19662e677378a8428ee010b582a8b22519`, preserved at `backup/pre-forbes-photo-correction-20261010`. Use a restoration commit for rollback; preserve later unrelated changes.
- All three PDFs retain their original text, font positions, links, branding, other photos and one-page layout. The two replacement JPEG streams are byte-identical to the supplied files and proportionally contained within the original photo areas. Poppler-rendered pixels outside those two photo areas are identical to the baseline.
- All six corresponding HTML pages use versioned image paths. The homepage tile uses `object-fit: contain`; the media preview displays the full square group photo, and the award photos use a responsive two-column / mobile single-column layout. The other award photo is preserved from the original press release. All nine links to the three PDFs use `?v=20261010-photo-correction`.
- Pre-release checks: all three PDF pages rendered and visually inspected; PDF text / geometry / source-JPEG integrity checked; visible HTML body text and captions preserved; 204 affected-page local references and anchors resolve; three-language media styles match; JavaScript syntax and whitespace diff checks pass.
- Local browser rendering was blocked by the execution environment. Exact production commit, Pages workflow and live response / browser verification must be recorded in the release result after deployment.
