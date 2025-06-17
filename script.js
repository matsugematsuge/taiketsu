let multipliersData = {}; // 全曜日の倍率データと単位情報を保持するオブジェクト
let unitFactors = {};     // 単位ごとの調整倍率を保持するオブジェクト

/**
 * 倍率データをJSONファイルから非同期で読み込む関数
 */
async function loadMultipliers() {
    try {
        const response = await fetch('multipliers.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        unitFactors = data.unit_factors; // 単位の調整倍率を保存
        delete data.unit_factors;          // multipliersDataからはunit_factorsを除外
        multipliersData = data;            // 残りのデータをmultipliersDataに保存

        console.log('倍率データを読み込みました:', multipliersData);
        console.log('単位調整倍率:', unitFactors);

        // 各曜日の入力フォームを動的に生成
        generateInputForms();

        // データを読み込んだ後に初期計算を実行し、最初のタブをアクティブにする
        const firstTabButton = document.querySelector('.tab-button.active');
        if (firstTabButton) {
            firstTabButton.click();
        } else {
            document.querySelector('.tab-button')?.click(); // activeがなければ最初のボタンをクリック
        }

    } catch (error) {
        console.error('倍率データの読み込み中にエラーが発生しました:', error);
        console.warn('デフォルトの倍率データを使用します。');
        // エラー発生時のフォールバックデータ
        unitFactors = {
            "none": 1.0,
            "K": 1000.0,
            "M": 1000000.0,
            "G": 1000000000.0,
            "minute": 1.0,
            "hour": 60.0,
            "day": 1440.0
        };
        multipliersData = {
            "monday": {
                "APを1消費する": { "multiplier": 375.0, "default_unit": "none" },
                "レーダークエストを1回クリアする": { "multiplier": 30000.0, "default_unit": "none" },
                "一度に英雄Expを660以上消費する": { "multiplier": 2.5, "default_unit": "M", "per_value": 660.0 },
                "ドローン戦闘データを1消費する": { "multiplier": 7.5, "default_unit": "K", "input_unit_type": "quantity" },
                "ドローンギアを1個消費する": { "multiplier": 6250.0, "default_unit": "none" },
                "食料を100採集する": { "multiplier": 50.0, "default_unit": "none" },
                "鋼材を100採集する": { "multiplier": 50.0, "default_unit": "none" },
                "金貨を100採集する": { "multiplier": 50.0, "default_unit": "none" },
                "チップ宝箱の開封でチップ材料(上級)を1点獲得": { "multiplier": 2812.5, "default_unit": "none" }
            },
            "tuesday": {
                "建造の残り時間を1分短縮する": { "multiplier": 150.0, "default_unit": "none", "input_unit_type": "time" },
                "施設建設で戦力を1獲得する": { "multiplier": 30.0, "default_unit": "none" },
                "UR貿易輸送車を1回発車する": { "multiplier": 300000.0, "default_unit": "none" },
                "UR極秘任務を1回遂行する": { "multiplier": 225000.0, "default_unit": "none" },
                "生存者募集を1回行う": { "multiplier": 4500.0, "default_unit": "none" }
            },
            "wednesday": {
                "科学研究の残り時間を1分短縮する": { "multiplier": 150.0, "default_unit": "none", "input_unit_type": "time" },
                "施設建設で戦力を1獲得する": { "multiplier": 30.0, "default_unit": "none" },
                "知恵の勲章を1枚消費する": { "multiplier": 750.0, "default_unit": "none" },
                "レーダークエストを1回クリアする":
