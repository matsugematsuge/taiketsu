// �e���ڂ̔{�����`
const multipliers = {
    'A': 2500,
    'B': 1000,
    'C': 1000
};

/**
 * �j���^�u��؂�ւ���֐�
 * @param {Event} evt - �N���b�N�C�x���g
 * @param {string} tabName - �\������^�u��ID (��: 'monday')
 */
function openTab(evt, tabName) {
    let i, tabcontent, tablinks;

    // �S�Ẵ^�u�R���e���c���\���ɂ���
    tabcontent = document.getElementsByClassName("tab-content");
    for (i = 0; i < tabcontent.length; i++) {
        tabcontent[i].classList.remove("active");
    }

    // �S�Ẵ^�u�{�^������ 'active' �N���X���폜����
    tablinks = document.getElementsByClassName("tab-button");
    for (i = 0; i < tablinks.length; i++) {
        tablinks[i].classList.remove("active");
    }

    // �w�肳�ꂽ�^�u�R���e���c��\�����A�Ή�����^�u�{�^�����A�N�e�B�u�ɂ���
    document.getElementById(tabName).classList.add("active");
    evt.currentTarget.classList.add("active");

    // �^�u���؂�ւ�����ۂɁA���̃^�u�̍��v���Čv�Z���� (�����\����f�[�^���c���Ă���ꍇ�̂���)
    calculateTotal(tabName);
}

/**
 * �w�肳�ꂽ�j���̍��v���v�Z���A�\�����X�V����֐�
 * @param {string} day - �v�Z�Ώۂ̗j�� (��: 'monday')
 */
function calculateTotal(day) {
    // �e���̓t�B�[���h����l���擾�B���͂��Ȃ��ꍇ��0�Ƃ��Ĉ���
    const inputA = parseFloat(document.getElementById(`inputA_${day}`).value) || 0;
    const inputB = parseFloat(document.getElementById(`inputB_${day}`).value) || 0;
    const inputC = parseFloat(document.getElementById(`inputC_${day}`).value) || 0;

    // �{����K�p���č��v���v�Z
    const total = (inputA * multipliers.A) + (inputB * multipliers.B) + (inputC * multipliers.C);

    // �v�Z���ʂ�\���v�f�ɃZ�b�g
    document.getElementById(`total_${day}`).textContent = total.toLocaleString(); // �J���}��؂�ŕ\��
    
    // ���͒l��localStorage�ɕۑ� (�u���E�U����Ă��f�[�^��ێ����邽��)
    localStorage.setItem(`inputA_${day}`, inputA);
    localStorage.setItem(`inputB_${day}`, inputB);
    localStorage.setItem(`inputC_${day}`, inputC);
}

/**
 * �y�[�W���[�h���Ɏ��s����鏉��������
 */
document.addEventListener('DOMContentLoaded', () => {
    // �S�Ẵ^�u�R���e���c�̓��͒l��localStorage����ǂݍ��݁A�\���ƌv�Z���X�V����
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
        // �e�j���̏����v�Z�����s
        calculateTotal(day);
    });

    // �y�[�W���[�h���ɍŏ��̃^�u�i���j���j���A�N�e�B�u�ɂ���
    // `click()` �C�x���g�𔭐������邱�ƂŁAopenTab�֐������s����A���j���^�u���\�������
    document.querySelector('.tab-button.active').click();
});