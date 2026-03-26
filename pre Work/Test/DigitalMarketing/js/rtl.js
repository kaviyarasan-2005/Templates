
function initRTLToggle() {
    const rtlToggle = document.querySelector('.rtl-toggle');
    const html = document.documentElement;

    const currentDir = localStorage.getItem('direction') || 'ltr';
    html.setAttribute('dir', currentDir);
    
    if (rtlToggle) {
        rtlToggle.textContent = currentDir === 'rtl' ? 'LTR' : 'RTL';
        
        rtlToggle.addEventListener('click', () => {
            const dir = html.getAttribute('dir');
            const newDir = dir === 'rtl' ? 'ltr' : 'rtl';
            
            html.setAttribute('dir', newDir);
            localStorage.setItem('direction', newDir);
            rtlToggle.textContent = newDir === 'rtl' ? 'LTR' : 'RTL';
         
        });
    }
}

document.addEventListener('DOMContentLoaded', initRTLToggle);

if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initRTLToggle };
}