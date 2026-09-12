# 加入另一個 AI 嘅收音介面作品

呢個網站收錄已經生成嘅 visualization，讓大家比較介面。網站本身唔會呼叫模型。透過 GitHub pull request 提交作品，同時保留現有作品及來源紀錄。

## 1. 記錄生成條件

在 `src/catalog.json` 的 `runs` 加入一筆獨立紀錄，包括：

- `id`：唯一識別碼。
- `provider`、`tool`：模型廠商及實際製作工具，唔好混為一談。
- `model`、`model_family`、`effort`：實際記錄嘅設定。缺少證據就填 `null`，唔好推測。
- `created_at`、`recorded_at`：生成日期（不詳填 `null`）及收錄日期，使用 YYYY-MM-DD。
- `prompt`：原始用戶 prompt；不詳填 `null`。不要公開憑證、私人資料或非用戶提供的系統指令。
- `prompt_context`：參考作品、後續修改要求、工具及其他會影響結果嘅上下文。
- `provenance`：上述資料來源，以及邊啲資料未能核實。
- `archive`：保存完整原作嘅倉庫內 HTML 路徑，例如 `archives/example-original.html`。
- `reference`：參考作品連結，冇就填 `null`。

一次生成多款設計可以共用同一筆 run。不同 prompt、重試或 effort 應該分開記錄。唔好將不同條件嘅結果稱為公平模型排名。

## 2. 加入設計

在 `concepts` 新增 `id`、`run_id`、`name`、`tagline`、`description` 及 `source_file`。ID 使用小寫英文字、數字及連字號。將獨立 HTML 放於 `src/submissions/`，例如 `src/submissions/example.html`。

建置程式會複製新 run 嘅 `source_file` 為 `previews/<id>.html`，並自動加入廠商、模型及 effort 篩選。既有兩個 run 使用專用適配器，以保留原作。

預覽在只有 `allow-scripts` 嘅 sandbox iframe 運行。請將 CSS、JS 及必要資源內嵌，禁止網絡請求及真實錄音；新增作品要先審查程式碼。

## 3. 共用控制通訊

預覽準備好後向父頁發送：

```js
parent.postMessage({type: 'pill-ready', id: 'example-design'}, '*');
```

監聽來自 `parent` 嘅 `message`，只接受 `type === 'pill-state'`。資料包括：

- `state`: appear / listening / transcribing / transforming / searching / done / failed
- `scenario`: dictate / rewrite / search
- `theme`: light / dark
- `level`: 0 至 1 的模擬音量
- `motion`、`active`: 是否啟用動態及是否可見
- `revision`: 每次控制操作遞增，讓相同狀態也可以重新開始

檢查來源、欄位類型及允許值，再更新介面。當 `motion` 或 `active` 為 false 時暫停動畫。不要將訊息當作 HTML 或執行程式碼。

可選：內容高度改變時發送 `{type:'pill-size', id:'example-design', height:400}`。父頁接受 350 至 800px，避免結果卡被截斷。

## 4. 驗證及發佈

執行 README 的建置及測試，再檢查七種狀態、兩種外觀、手機尺寸、並排比較及原始連結。提交來源、生成檔及資料紀錄，保留 `main` 上其他人新加入嘅內容。合併至 `main` 後，GitHub Pages 會發佈原有網址。
