// host/index.jsx

/**
 * 核心功能：在時間軸創建綜藝文字
 * @param {String} textContent - 使用者輸入的文字
 * @param {String} mogrtName - 要使用的模板檔名
 */
function createVarietyClip(textContent, mogrtName) {
    var seq = app.project.activeSequence;
    
    // 1. 安全檢查：確保使用者有點開時間軸
    if (!seq) {
        alert("錯誤：請先在 Premiere Pro 選中一個時間軸（Sequence）");
        return;
    }

    // 2. 定位模板路徑
    // 這段代碼會自動獲取你外掛安裝資料夾的路徑
    var scriptFile = new File($.fileName);
    var pluginFolder = scriptFile.parent.parent;
    var mogrtPath = pluginFolder.fsName + "\\assets\\" + mogrtName;

    var targetMogrt = new File(mogrtPath);
    if (!targetMogrt.exists) {
        alert("找不到模板檔案：\n" + mogrtPath);
        return;
    }

    // 3. 取得目前播放頭（指針）的位置
    var targetTime = seq.getPlayerPosition();
    
    // 4. 匯入 MOGRT
    // 參數說明：路徑, 時間點, 影片軌道(1代表第2軌), 音訊軌道(0)
    var newClip = seq.importMGT(targetMogrt.fsName, targetTime.ticks, 1, 0);

    // 5. 自動修改文字內容 (商用外掛最核心的自動化)
    if (newClip) {
        var mgtComponent = newClip.getMGTComponent();
        if (mgtComponent) {
            // 遍歷 MOGRT 的所有屬性，尋找名為 "Text_Content" 的欄位
            var params = mgtComponent.properties;
            var found = false;
            
            for (var i = 0; i < params.numProperties; i++) {
                // 注意：這裡的 "Text_Content" 必須與你在 AE 基本圖形面板設定的名稱一致
                if (params[i].displayName == "Text_Content") {
                    params[i].setValue(textContent);
                    found = true;
                    break;
                }
            }
            
            if (!found) {
                // 如果沒找到，可能是 AE 模板裡的參數名稱設錯了
                // 這裡可以用一個 alert 提醒開發中的你
                // alert("提示：已插入模板，但找不到名為 'Text_Content' 的文字參數。");
            }
        }
    }
}
