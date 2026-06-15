// --- KONFİGÜRASYON (Arkadaşlarından gelecek verilerle buraları güncelleyeceksin) ---
const CONFIG = {
    lampOnDurationSeconds: 5, // Lamba hareket algıladıktan sonra kaç saniye açık kalacak?
    energyData: {
        classicSystem: 15000, // Klasik sistemin yıllık tahmini tüketimi (kWh)
        smartSystem: 4500     // Akıllı sistemin yıllık tahmini tüketimi (kWh)
    },
    batteryData: [
        { time: '06:00', level: 20 },
        { time: '10:00', level: 60 },
        { time: '14:00', level: 100 },
        { time: '18:00', level: 85 },
        { time: '22:00', level: 50 },
        { time: '02:00', level: 20 }
    ]
};
// -----------------------------------------------------------------------------------

// 1. İÇ MEKAN AYDINLATMA SİMÜLASYONU (PIR Döngüsü)
const btnMotion = document.getElementById('btnMotion');
const lampIndicator = document.getElementById('lampIndicator');
const timerText = document.getElementById('timerText');
let timer;

btnMotion.addEventListener('click', () => {
    // Işığı aç
    lampIndicator.className = 'lamp-status lamp-on';
    lampIndicator.innerText = 'Lamba Açık!';
    btnMotion.disabled = true; // Geri sayım bitene kadar butonu pasif yap
    
    let secondsLeft = CONFIG.lampOnDurationSeconds;
    timerText.innerText = `Lamba ${secondsLeft} saniye sonra kapanacak...`;

    // Geri sayım döngüsü
    clearInterval(timer);
    timer = setInterval(() => {
        secondsLeft--;
        timerText.innerText = `Lamba ${secondsLeft} saniye sonra kapanacak...`;
        
        if (secondsLeft <= 0) {
            clearInterval(timer);
            lampIndicator.className = 'lamp-status lamp-off';
            lampIndicator.innerText = 'Lamba Kapalı';
            timerText.innerText = 'Beklemede...';
            btnMotion.disabled = false;
        }
    }, 1000);
});

// 2. SOLAR BATARYA GRAFİĞİ
const ctxBattery = document.getElementById('batteryChart').getContext('2d');
new Chart(ctxBattery, {
    type: 'line',
    data: {
        labels: CONFIG.batteryData.map(d => d.time),
        datasets: [{
            label: 'Batarya Doluluk Oranı (%)',
            data: CONFIG.batteryData.map(d => d.level),
            borderColor: '#28a745',
            backgroundColor: 'rgba(40, 167, 69, 0.2)',
            borderWidth: 2,
            fill: true,
            tension: 0.4
        }]
    },
    options: {
        scales: { y: { beginAtZero: true, max: 100 } }
    }
});

// 3. ENERJİ TÜKETİMİ KARŞILAŞTIRMA GRAFİĞİ
const ctxEnergy = document.getElementById('energyChart').getContext('2d');
new Chart(ctxEnergy, {
    type: 'bar',
    data: {
        labels: ['Mevcut Klasik Sistem', 'Önerilen Akıllı Sistem'],
        datasets: [{
            label: 'Yıllık Tüketim (kWh)',
            data: [CONFIG.energyData.classicSystem, CONFIG.energyData.smartSystem],
            backgroundColor: ['#dc3545', '#28a745'], // Kırmızı (kötü), Yeşil (iyi)
            borderWidth: 1
        }]
    },
    options: {
        scales: { y: { beginAtZero: true } },
        plugins: {
            legend: { display: false } // Bar grafiğinde lejanta gerek yok
        }
    }
});