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
        delete data.unit_factors;         // multipliersDataからはunit_factorsを除外
        multipliersData = data;           // 残りのデータをmultipliersDataに保存

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
        // エラー発生時のフォールバックデータ (Kを追加)
        unitFactors = {
            "none": 1.0,
            "K": 1000.0,
            "M": 1000000.0,
            "G": 100000000.0
        };
        multipliersData = {
            "monday": {
                "APを1消費する": { "multiplier": 375.0, "default_unit": "none" },
                "レーダークエストを1回クリアする": { "multiplier": 30000.0, "default_unit": "none" },
                "一度に英雄Expを660以上消費する": { "multiplier": 2.5, "default_unit": "M" },
                "ドローン戦闘データを1消費する": { "multiplier": 7.5, "default_unit": "K" },
                "ドローンギアを1個消費する": { "multiplier": 6250.0, "default_unit": "none" },
                "食料を100採集する": { "multiplier": 50.0, "default_unit": "none" },
                "鋼材を100採集する": { "multiplier": 50.0, "default_unit": "none" },
                "金貨を100採集する": { "multiplier": 50.0, "default_unit": "none" },
                "チップ宝箱の開封でチップ材料(上級)を1点獲得": { "multiplier": 2812.5, "default_unit": "none" }
            },
            "tuesday": {
                "建造の残り時間を1分短縮する": { "multiplier": 150.0, "default_unit": "none" },
                "施設建設で戦力を1獲得する": { "multiplier": 30.0, "default_unit": "none" },
                "UR貿易輸送車を1回発車する": { "multiplier": 300000.0, "default_unit": "none" },
                "UR極秘任務を1回遂行する": { "multiplier": 225000.0, "default_unit": "none" },
                "生存者募集を1回行う": { "multiplier": 4500.0, "default_unit": "none" }
            },
            "wednesday": {
                "科学研究の残り時間を1分短縮する": { "multiplier": 150.0, "default_unit": "none" },
                "科学研究で戦力を1獲得する": { "multiplier": 30.0, "default_unit": "none" },
                "知恵の勲章を1枚消費する": { "multiplier": 750.0, "default_unit": "none" },
                "レーダークエストを1回クリアする": { "multiplier": 30000.0, "default_unit": "none" },
                "Lv.1ドローン宝箱を開ける": { "multiplier": 2750.0, "default_unit": "none" },
                "Lv.2ドローン宝箱を開ける": { "multiplier": 8250.0, "default_unit": "none" },
                "Lv.3ドローン宝箱を開ける": { "multiplier": 25000.0, "default_unit": "none" },
                "Lv.4ドローン宝箱を開ける": { "multiplier": 75000.0, "default_unit": "none" },
                "Lv.5ドローン宝箱を開ける": { "multiplier": 225000.0, "default_unit": "none" },
                "Lv.6ドローン宝箱を開ける": { "multiplier": 675000.0, "default_unit": "none" },
                "Lv.7ドローン宝箱を開ける": { "multiplier": 2025000.0, "default_unit": "none" }
            },
            "thursday": {
                "英雄を1回募集する": { "multiplier": 4500.0, "default_unit": "none" },
                "一度に英雄Expを660以上消費する": { "multiplier": 2.5, "default_unit": "M" },
                "UR英雄かけらを1枚消費する": { "multiplier": 25000.0, "default_unit": "none" },
                "SSR英雄かけらを1枚消費する": { "multiplier": 8750.0, "default_unit": "none" },
                "SR英雄かけらを1枚消費する": { "multiplier": 2500.0, "default_unit": "none" },
                "スキルメダルを1枚消費する": { "multiplier": 30.0, "default_unit": "none" },
                "専用武装のかけらを1枚消費する": { "multiplier": 25000.0, "default_unit": "none" }
            },
            "friday": {
                "レーダークエストを1回クリアする": { "multiplier": 30000.0, "default_unit": "none" },
                "建造の残り時間を1分短縮する": { "multiplier": 150.0, "default_unit": "none" },
                "施設建設で戦力を1獲得する": { "multiplier": 30.0, "default_unit": "none" },
                "科学研究の残り時間を1分短縮する": { "multiplier": 150.0, "default_unit": "none" },
                "科学研究で戦力を1獲得する": { "multiplier": 30.0, "default_unit": "none" },
                "訓練の残り時間を1分短縮する": { "multiplier": 150.0, "default_unit": "none" },
                "LV.1兵士を1人訓練する": { "multiplier": 60.0, "default_unit": "none" },
                "LV.2兵士を1人訓練する": { "multiplier": 90.0, "default_unit": "none" },
                "LV.3兵士を1人訓練する": { "multiplier": 120.0, "default_unit": "none" },
                "LV.4兵士を1人訓練する": { "multiplier": 150.0, "default_unit": "none" },
                "LV.5兵士を1人訓練する": { "multiplier": 180.0, "default_unit": "none" },
                "LV.6兵士を1人訓練する": { "multiplier": 210.0, "default_unit": "none" },
                "LV.7兵士を1人訓練する": { "multiplier": 240.0, "default_unit": "none" },
                "LV.8兵士を1人訓練する": { "multiplier": 270.0, "default_unit": "none" },
                "LV.9兵士を1人訓練する": { "multiplier": 300.0, "default_unit": "none" },
                "LV.10兵士を1人訓練する": { "multiplier": 330.0, "default_unit": "none" },
                "ドミネーターのかけらを1枚消費する": { "multiplier": 25000.0, "default_unit": "none" },
                "ドミネーターの訓練ノートを100個消費する": { "multiplier": 1562.5, "default_unit": "none" },
                "ドミネーターの訓練証明書を1枚消費する": { "multiplier": 3750.0, "default_unit": "none" },
                "ドミネーターの連携の証を1枚消費する": { "multiplier": 75000.0, "default_unit": "none" },
                "ドミネーターのスキルメダルを1枚消費する": { "multiplier": 12.5, "default_unit": "none" }
            },
            "saturday": {
                "UR貿易輸送車を1回発車する": { "multiplier": 300000.0, "default_unit": "none" },
                "UR極秘任務を1回遂行する": { "multiplier": 225000.0, "default_unit": "none" },
                "建造の残り時間を1分短縮する": { "multiplier": 150.0, "default_unit": "none" },
                "科学研究の残り時間を1分短縮する": { "multiplier": 150.0, "default_unit": "none" },
                "訓練の残り時間を1分短縮する": { "multiplier": 150.0, "default_unit": "none" },
                "治療の残り時間を1分短縮する": { "multiplier": 150.0, "default_unit": "none" },
                "相手連盟のLv.1兵士を1体撃破する": { "multiplier": 30.0, "default_unit": "none" },
                "相手連盟のLv.2兵士を1体撃破": { "multiplier": 45.0, "default_unit": "none" },
                "相手連盟のLv.3兵士を1体撃破する": { "multiplier": 60.0, "default_unit": "none" },
                "相手連盟のLv.4兵士を1体撃破する": { "multiplier": 75.0, "default_unit": "none" },
                "相手連盟のLv.5兵士を1体撃破する": { "multiplier": 90.0, "default_unit": "none" },
                "相手連盟のLv.6兵士を1体撃破する": { "multiplier": 105.0, "default_unit": "none" },
                "相手連盟のLv.7兵士を1体撃破する": { "multiplier": 120.0, "default_unit": "none" },
                "相手連盟のLv.8兵士を1体撃破する": { "multiplier": 135.0, "default_unit": "none" },
                "相手連盟のLv.9兵士を1体撃破する": { "multiplier": 150.0, "default_unit": "none" },
                "相手連盟のLv.10兵士を1体撃破する": { "multiplier": 165.0, "default_unit": "none" },
                "Lv.1兵士を1体撃破する": { "multiplier": 6.0, "default_unit": "none" },
                "Lv.2兵士を1体撃破する": { "multiplier": 9.0, "default_unit": "none" },
                "Lv.3兵士を1体撃破する": { "multiplier": 12.0, "default_unit": "none" },
                "Lv.4兵士を1体撃破する": { "multiplier": 15.0, "default_unit": "none" },
                "Lv.5兵士を1体撃破する": { "multiplier": 18.0, "default_unit": "none" },
                "Lv.6兵士を1体撃破する": { "multiplier": 21.0, "default_unit": "none" },
                "v.7兵士を1体撃破する": { "multiplier": 24.0, "default_unit": "none" },
                "Lv.8兵士を1体撃破する": { "multiplier": 27.0, "default_unit": "none" },
                "Lv.9兵士を1体撃破する": { "multiplier": 30.0, "default_unit": "none" },
                "Lv.10兵士を1体撃破する": { "multiplier": 33.0, "default_unit": "none" },
                "Lv.1兵士を1体撃破される": { "multiplier": 5.0, "default_unit": "none" },
                "Lv.2兵士を1体撃破される": { "multiplier": 7.5, "default_unit": "none" },
                "Lv.3兵士を1体撃破される": { "multiplier": 10.0, "default_unit": "none" },
                "Lv.4兵士を1体撃破される": { "multiplier": 12.5, "default_unit": "none" },
                "Lv.5兵士を1体撃破される": { "multiplier": 15.0, "default_unit": "none" },
                "Lv.6兵士を1体撃破される": { "multiplier": 17.5, "default_unit": "none" },
                "v.7兵士を1体撃破される": { "multiplier": 20.0, "default_unit": "none" },
                "Lv.8兵士を1体撃破される": { "multiplier": 22.5, "default_unit": "none" },
                "Lv.9兵士を1体撃破される": { "multiplier": 25.0, "default_unit": "none" },
                "Lv.10兵士を1体撃破される": { "multiplier": 27.5, "default_unit": "none" }
            }
        };
        generateInputForms();
        const firstTabButton = document.querySelector('.tab-button.active');
        if (firstTabButton) {
            firstTabButton.click();
        } else {
            document.querySelector('.tab-button')?.click();
        }
    }
}

/**
 * multipliersDataを元に、各曜日の入力フォームを動的に生成する関数
 */
function generateInputForms() {
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    days.forEach(day => {
        const inputContainer = document.getElementById(`inputContainer_${day}`);
        if (!inputContainer) return;

        inputContainer.innerHTML = ''; // 既存の内容をクリア

        const dayItems = multipliersData[day]; // その曜日の項目データ
        if (!dayItems) return;

        for (const itemKey in dayItems) {
            const itemData = dayItems[itemKey];
            const multiplierValue = itemData.multiplier.toFixed(1); // 小数点以下1桁表示にフォーマット
            const defaultUnit = itemData.default_unit || "none";

            const inputGroup = document.createElement('div');
            inputGroup.classList.add('input-group');

            let unitSelectHtml = '';
            if (defaultUnit !== 'none') {
                let unitSelectOptions = '';
                for (const unit in unitFactors) {
                    if (unit !== 'none') {
                        unitSelectOptions += `<option value="<span class="math-inline">\{unit\}"\></span>{unit.toUpperCase()}</option>`;
                    }
                }
                unitSelectHtml = `
                    <select id="unitSelect_${itemKey}_${day}" class="unit-select">
