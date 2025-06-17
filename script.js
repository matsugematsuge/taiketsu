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
            "none": 1,
            "K": 1000,
            "M": 1000000,
            "G": 100000000
        };
        multipliersData = {
            "monday":    { "A": { "multiplier": 2500, "default_unit": "none" }, "B": { "multiplier": 1000, "default_unit": "K" }, "C": { "multiplier": 1000, "default_unit": "none" }, "D": { "multiplier": 500, "default_unit": "M" }, "E": { "multiplier": 200, "default_unit": "none" }, "F": { "multiplier": 100, "default_unit": "none" }, "G": { "multiplier": 50, "default_unit": "none" }, "H": { "multiplier": 25, "default_unit": "none" }, "I": { "multiplier": 10, "default_unit": "none" } },
            "tuesday":   { "A": { "multiplier": 2500, "default_unit": "none" }, "B": { "multiplier": 1000, "default_unit": "K" }, "C": { "multiplier": 1000, "default_unit": "none" }, "D": { "multiplier": 500, "default_unit": "M" }, "E": { "multiplier": 200, "default_unit": "none" }, "F": { "multiplier": 100, "default_unit": "none" }, "G": { "multiplier": 50, "default_unit": "none" }, "H": { "multiplier": 25, "default_unit": "none" }, "I": { "multiplier": 10, "default_unit": "none" } },
            "wednesday": { "A": { "multiplier": 2500, "default_unit": "none" }, "B": { "multiplier": 1000, "default_unit": "K" }, "C": { "multiplier": 1000, "default_unit": "none" }, "D": { "multiplier": 500, "default_unit": "M" }, "E": { "multiplier": 200, "default_unit": "none" }, "F": { "multiplier": 100, "default_unit": "none" }, "G": { "multiplier": 50, "default_unit": "none" }, "H": { "multiplier": 25, "default_unit": "none" }, "I": { "multiplier": 10, "default_unit": "none" } },
            "thursday":  { "A": { "multiplier": 2500, "default_unit": "none" }, "B": { "multiplier": 1000, "default_unit": "K" }, "C": { "multiplier": 1000, "default_unit": "none" }, "D": { "multiplier": 500, "default_unit": "M" }, "E": { "multiplier": 200, "default_unit": "none" }, "F": { "multiplier": 100, "default_unit": "none" }, "G": { "multiplier": 50, "default_unit": "none" }, "H": { "multiplier": 25, "default_unit": "none" }, "I": { "multiplier": 10, "default_unit": "none" } },
            "friday":    { "A": { "multiplier": 2500, "default_unit": "none" }, "B": { "multiplier": 1000, "default_unit": "K" }, "C": { "multiplier": 1000, "default_unit": "none" }, "D": { "multiplier": 500, "default_unit": "M" }, "E": { "multiplier": 200, "default_unit": "none" }, "F": { "multiplier": 100, "default_unit": "none" }, "G": { "multiplier": 50, "default_unit": "none" }, "H": { "multiplier": 25, "default_unit": "none" }, "I": { "multiplier": 10, "default_unit": "none" } },
            "saturday":  { "A": { "multiplier": 2500, "default_unit": "none" }, "B": { "multiplier": 1000, "default_unit": "K" }, "C": { "multiplier": 1000, "default_unit": "none" }, "D": { "multiplier": 500, "default_unit": "M" }, "E": { "multiplier": 200, "default_unit": "none" }, "F": { "multiplier": 100, "default_unit": "none" }, "G": { "multiplier": 50, "default_unit": "none" }, "H": { "multiplier": 25, "default_unit": "none" }, "I": { "multiplier": 10, "default_unit": "none" } }
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

        const dayItems = multipliersData[day]; // その曜日の項目データ (例: {A: {...}, B: {...}})
        if (!dayItems) return;

        // JSONに定義されているキー（A, B, C...）の順番でフォームを生成
        for (const itemKey in dayItems) {
            const itemData = dayItems[itemKey]; // 例: { multiplier: 2500, default_unit: "none" }
            const multiplierValue = itemData.multiplier;
            const defaultUnit = itemData.default_unit || "none"; // default_unitがない場合は"none"

            const inputGroup = document.createElement('div');
            inputGroup.classList.add('input-group');

            // 単位選択ドロップダウンのHTMLを生成 (default_unitが"none"の場合は生成しない)
            let unitSelectHtml = '';
            if (defaultUnit !== 'none') {
                let unitSelectOptions = '';
                // unitFactorsのキー（K, M, Gなど）をループしてオプションを作成
                // "none"はプルダウンで表示しないため除外
                for (const unit in unitFactors) {
                    if (unit !== 'none') {
                        unitSelectOptions += `<option value="${unit}">${unit.toUpperCase()}</option>`;
                    }
                }
                unitSelectHtml = `
                    <select id="unitSelect_${itemKey}_${day}" class="unit-select">
                        ${unitSelectOptions}
                    </select>
                `;
            }

            inputGroup.innerHTML = `
                <label for="input${itemKey}_${day}">${itemKey}:</label>
                <input type="number" id="input${itemKey}_${day}" value="" placeholder="数字を入力">
                ${unitSelectHtml}
                <span class="multiplier-display">(倍率: <span id="multiplier${itemKey}_${day}">${multiplierValue.toLocaleString()}</span>)</span>
            `;
            inputContainer.appendChild(inputGroup);

            // ドロップダウンのデフォルト値とイベントリスナーを設定 (プルダウンが存在する場合のみ)
            if (defaultUnit !== 'none') {
                const unitSelect = document.getElementById(`unitSelect_${itemKey}_${day}`);
                if (unitSelect) {
                    // localStorageに保存された単位、またはJSONで指定されたデフォルト単位をセット
                    const storedUnit = localStorage.getItem(`unit_${itemKey}_${day}`);
                    unitSelect.value = storedUnit !== null ? storedUnit : defaultUnit;

                    // ドロップダウンが変更されたら、そのタブの合計を再計算
                    unitSelect.addEventListener('change', () => {
                        calculateTotal(day);
                        // 単位選択状態をlocalStorageに保存
                        localStorage.setItem(`unit_${itemKey}_${day}`, unitSelect.value);
                    });
                }
            } else {
                // "none"の場合は、localStorageに"none"を保存しておく
                // これがないと、一旦"none"で表示された後、別の単位に設定した場合に次回開いた時に"none"に戻ってしまう可能性がある
                localStorage.setItem(`unit_${itemKey}_${day}`, 'none');
            }
        }
    });
}

/**
 * 曜日タブを切り替える関数
 * @param {Event} evt - クリックイベント
 * @param {string} tabName - 表示するタブのID (例: 'monday')
 */
function openTab(evt, tabName) {
    let i, tabcontent, tablinks;

    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].classList.remove("active");
    }

    tablinks = document.getElementsByClassName("tab-button");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
    }

    document.getElementById(tabName).classList.add("active");
    evt.currentTarget.classList.add("active");

    // タブが切り替わった際に、localStorageからデータを復元し、そのタブの合計を再計算する
    restoreInputsAndCalculateTotal(tabName);
}

/**
 * 指定された曜日の入力値と単位選択をlocalStorageから復元し、合計を計算し、表示を更新する関数
 * @param {string} day - 処理対象の曜日 (例: 'monday')
 */
function restoreInputsAndCalculateTotal(day) {
    const dayItems = multipliersData[day];
    if (!dayItems) return;

    for (const itemKey in dayItems) {
        const itemData = dayItems[itemKey];
        const defaultUnit = itemData.default_unit || "none";

        // 入力値の復元
        const storedValue = localStorage.getItem(`input${itemKey}_${day}`);
        const inputElement = document.getElementById(`input${itemKey}_${day}`);
        if (inputElement && storedValue !== null) {
            inputElement.value = storedValue;
        }

        // 単位選択状態の復元 (プルダウンが存在する場合のみ)
        if (defaultUnit !== 'none') {
            const storedUnit = localStorage.getItem(`unit_${itemKey}_${day}`);
            const unitSelect = document.getElementById(`unitSelect_${itemKey}_${day}`);
            if (unitSelect && storedUnit !== null) {
                unitSelect.value = storedUnit;
            }
        }
    }
    // 復元された値で合計を計算
    calculateTotal(day);
}

/**
 * 指定された曜日の合計を計算し、表示を更新する関数
 * @param {string} day - 計算対象の曜日 (例: 'monday')
 */
function calculateTotal(day) {
    let total = 0;
    const dayItems = multipliersData[day]; // その曜日の項目データ

    if (!dayItems) {
        document.getElementById(`total_${day}`).textContent = '0';
        return;
    }

    // その曜日の各項目（A, B, C...）をループして計算
    for (const itemKey in dayItems) {
        const itemData = dayItems[itemKey]; // { multiplier: X, default_unit: Y }
        const baseMultiplier = itemData.multiplier; // 項目ごとの基本倍率
        const defaultUnit = itemData.default_unit || "none";

        const inputElement = document.getElementById(`input${itemKey}_${day}`);
        // 単位セレクタはdefaultUnitが'none'でない場合のみ存在するため、条件分岐
        const unitSelect = (defaultUnit !== 'none') ? document.getElementById(`unitSelect_${itemKey}_${day}`) : null;

        if (inputElement) { // 入力要素が存在すれば
            const inputValue = parseFloat(inputElement.value) || 0;
            let currentUnit = defaultUnit; // デフォルト単位を初期値とする

            if (unitSelect) { // プルダウンが存在すれば、その選択値を使用
                currentUnit = unitSelect.value;
            } else {
                // プルダウンが存在しない（defaultUnitが'none'の場合）は、localStorageから読み込むか'none'を適用
                // ただし、localStorageには既に'none'が設定されているはずなので、ここでは特に処理は不要
                // safety: currentUnit = localStorage.getItem(`unit_${itemKey}_${day}`) || defaultUnit;
            }
            
            const unitFactor = unitFactors[currentUnit] || 1; // 選択された単位の調整倍率、なければ1

            // (入力値 × 単位の調整倍率) × 項目の基本倍率
            total += (inputValue * unitFactor) * baseMultiplier;

            // 入力値は常に保存
            localStorage.setItem(`input${itemKey}_${day}`, inputValue);
            // 単位選択状態は、プルダウンが存在しない場合も'none'として保存
            localStorage.setItem(`unit_${itemKey}_${day}`, currentUnit);
        }
    }

    // 計算結果を表示要素にセット
    document.getElementById(`total_${day}`).textContent = total.toLocaleString(); // カンマ区切りで表示
}

/**
 * ページロード時に実行される初期化処理
 */
document.addEventListener('DOMContentLoaded', async () => {
    // まず倍率データをJSONファイルから読み込む
    await loadMultipliers();
    // loadMultipliers内で generateInputForms と最初のタブのアクティブ化、初期計算も行われます
});
