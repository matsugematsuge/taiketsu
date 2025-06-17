let multipliersData = {}; // 全曜日の倍率データを保持するオブジェクト

/**
 * 倍率データをJSONファイルから非同期で読み込む関数
 */
async function loadMultipliers() {
    try {
        const response = await fetch('multipliers.json'); // multipliers.jsonを読み込み
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        multipliersData = await response.json(); // JSONとしてパースしてmultipliersData変数に格納
        console.log('倍率データを読み込みました:', multipliersData);

        // 各曜日の入力フォームを動的に生成
        generateInputForms();

        // データを読み込んだ後に初期計算を実行し、最初のタブをアクティブにする
        const firstTabButton = document.querySelector('.tab-button.active');
        if (firstTabButton) {
            firstTabButton.click(); // openTab関数がcalculateTotalを呼び出す
        } else {
            // アクティブなタブボタンがない場合、最初のタブボタンをクリック
            document.querySelector('.tab-button')?.click();
        }

    } catch (error) {
        console.error('倍率データの読み込み中にエラーが発生しました:', error);
        // エラーが発生した場合のフォールバック（A～Iのデフォルト値など）
        console.warn('デフォルトの倍率データを使用します。');
        multipliersData = {
            "monday":    { "A": 2500, "B": 1000, "C": 1000, "D": 500, "E": 200, "F": 100, "G": 50, "H": 25, "I": 10 },
            "tuesday":   { "A": 2500, "B": 1000, "C": 1000, "D": 500, "E": 200, "F": 100, "G": 50, "H": 25, "I": 10 },
            "wednesday": { "A": 2500, "B": 1000, "C": 1000, "D": 500, "E": 200, "F": 100, "G": 50, "H": 25, "I": 10 },
            "thursday":  { "A": 2500, "B": 1000, "C": 1000, "D": 500, "E": 200, "F": 100, "G": 50, "H": 25, "I": 10 },
            "friday":    { "A": 2500, "B": 1000, "C": 1000, "D": 500, "E": 200, "F": 100, "G": 50, "H": 25, "I": 10 },
            "saturday":  { "A": 2500, "B": 1000, "C": 1000, "D": 500, "E": 200, "F": 100, "G": 50, "H": 25, "I": 10 }
        };
        generateInputForms(); // フォールバックデータでフォームを生成
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
        if (!inputContainer) return; // コンテナが見つからなければスキップ

        // 既存の内容をクリア
        inputContainer.innerHTML = '';

        const dayMultipliers = multipliersData[day];
        if (!dayMultipliers) return; // その曜日のデータがなければスキップ

        // JSONに定義されているキー（A, B, C...）の順番でフォームを生成
        for (const itemKey in dayMultipliers) {
            const multiplierValue = dayMultipliers[itemKey];

            const inputGroup = document.createElement('div');
            inputGroup.classList.add('input-group');

            inputGroup.innerHTML = `
                <label for="input${itemKey}_${day}">${itemKey}:</label>
                <input type="number" id="input${itemKey}_${day}" value="" placeholder="数字を入力">
                <span class="multiplier-display">(倍率: <span id="multiplier${itemKey}_${day}">${multiplierValue.toLocaleString()}</span>)</span>
            `;
            inputContainer.appendChild(inputGroup);
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

    // 全てのタブコンテンツを非表示にする
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].classList.remove("active");
    }

    // 全てのタブボタンから 'active' クラスを削除する
    tablinks = document.getElementsByClassName("tab-button");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
    }

    // 指定されたタブコンテンツを表示し、対応するタブボタンをアクティブにする
    document.getElementById(tabName).classList.add("active");
    evt.currentTarget.classList.add("active");

    // タブが切り替わった際に、localStorageからデータを復元し、そのタブの合計を再計算する
    restoreInputsAndCalculateTotal(tabName);
}

/**
 * 指定された曜日の入力値をlocalStorageから復元し、合計を計算し、表示を更新する関数
 * @param {string} day - 処理対象の曜日 (例: 'monday')
 */
function restoreInputsAndCalculateTotal(day) {
    const dayMultipliers = multipliersData[day];
    if (!dayMultipliers) return;

    // localStorageから入力値を復元
    for (const itemKey in dayMultipliers) {
        const storedValue = localStorage.getItem(`input${itemKey}_${day}`);
        const inputElement = document.getElementById(`input${itemKey}_${day}`);
        if (inputElement && storedValue !== null) {
            inputElement.value = storedValue;
        }
    }
    // 復元された値で合計を計算
    calculateTotal(day);
}


/**
 * 指定された曜日の合計を計算し、表示を更新する関数
 * multipliersData内のその曜日の項目と倍率をループして計算します。
 * @param {string} day - 計算対象の曜日 (例: 'monday')
 */
function calculateTotal(day) {
    let total = 0;
    const dayMultipliers = multipliersData[day]; // その曜日の倍率データを取得

    if (!dayMultipliers) {
        document.getElementById(`total_${day}`).textContent = '0';
        return;
    }

    // その曜日の各項目（A, B, C...）をループして計算
    for (const itemKey in dayMultipliers) {
        const multiplierValue = dayMultipliers[itemKey];
        const inputElement = document.getElementById(`input${itemKey}_${day}`);

        if (inputElement) { // 要素が存在すれば
            const inputValue = parseFloat(inputElement.value) || 0;
            total += (inputValue * multiplierValue); // その項目の倍率を使用
            // 入力値をlocalStorageに保存
            localStorage.setItem(`input${itemKey}_${day}`, inputValue);
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
