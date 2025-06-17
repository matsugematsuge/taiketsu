// 各項目の倍率を定義
const multipliers = {
    'A': 2500,
    'B': 1000,
    'C': 1000
};

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

    // タブが切り替わった際に、そのタブの合計を再計算する (初期表示やデータが残っている場合のため)
    calculateTotal(tabName);
}

/**
 * 指定された曜日の合計を計算し、表示を更新する関数
 * @param {string} day - 計算対象の曜日 (例: 'monday')
 */
function calculateTotal(day) {
    // 各入力フィールドから値を取得。入力がない場合は0として扱う
    const inputA = parseFloat(document.getElementById(`inputA_${day}`).value) || 0;
    const inputB = parseFloat(document.getElementById(`inputB_${day}`).value) || 0;
    const inputC = parseFloat(document.getElementById(`inputC_${day}`).value) || 0;

    // 倍率を適用して合計を計算
    const total = (inputA * multipliers.A) + (inputB * multipliers.B) + (inputC * multipliers.C);

    // 計算結果を表示要素にセット
    document.getElementById(`total_${day}`).textContent = total.toLocaleString(); // カンマ区切りで表示
    
    // 入力値をlocalStorageに保存 (ブラウザを閉じてもデータを保持するため)
    localStorage.setItem(`inputA_${day}`, inputA);
    localStorage.setItem(`inputB_${day}`, inputB);
    localStorage.setItem(`inputC_${day}`, inputC);
}

/**
 * ページロード時に実行される初期化処理
 */
document.addEventListener('DOMContentLoaded', () => {
    // 全てのタブコンテンツの入力値をlocalStorageから読み込み、表示と計算を更新する
    const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'];
    days.forEach(day => {
        const storedA = localStorage.getItem(`inputA_${day}`);
        const storedB = localStorage.getItem(`inputB_${day}`);
        const storedC = localStorage.getItem(`inputC_${day}`);

        if (storedA !== null) {
            document.getElementById(`inputA_${day}`).value = storedA;
        }
        if (storedB !== null) {
            document.getElementById(`inputB_${day}`).value = storedB;
        }
        if (storedC !== null) {
            document.getElementById(`inputC_${day}`).value = storedC;
        }
        // 各曜日の初期計算を実行
        calculateTotal(day);
    });

    // ページロード時に最初のタブ（月曜日）をアクティブにする
    // `click()` イベントを発生させることで、openTab関数が実行され、月曜日タブが表示される
    document.querySelector('.tab-button.active').click();
});