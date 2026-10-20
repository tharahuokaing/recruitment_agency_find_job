// Database of Available Vacancies
const jobListings = [
    {
        id: 'job-101',
        titleEn: 'Customer Service Representative (Female)',
        titleKm: 'បុគ្គលិកផ្នែកបម្រើសេវាកម្មអតិថិជន (នារី)',
        category: 'Customer Service',
        company: 'Huokaing Thara Recruitment',
        location: 'Phnom Penh',
        locationKm: 'ភ្នំពេញ',
        type: 'Full-time',
        typeKm: 'ពេញម៉ោង',
        minSalary: 350,
        salaryText: '$350 - $600',
        dateKm: 'ទើបតែបញ្ចូល',
        dateEn: 'Just now'
    },
    {
        id: 'job-102',
        titleEn: 'Model / Actress (Female, Age 18–35)',
        titleKm: 'តារាម៉ូឌែល / តារាសម្តែង (នារី, អាយុ ១៨–៣៥ ឆ្នាំ)',
        category: 'Entertainment',
        company: 'Huokaing Thara Recruitment',
        location: 'Phnom Penh',
        locationKm: 'ភ្នំពេញ',
        type: 'Contract',
        typeKm: 'កិច្ចសន្យា',
        minSalary: 800,
        salaryText: '$800 - $2,500',
        dateKm: 'ទើបតែបញ្ចូល',
        dateEn: 'Just now'
    },
    {
        id: 'job-103',
        titleEn: 'Khmer Language Teacher (Female, Age 18–35)',
        titleKm: 'គ្រូបង្រៀនភាសាខ្មែរ (នារី, អាយុ ១៨–៣៥ ឆ្នាំ)',
        category: 'Education',
        company: 'Huokaing Thara Recruitment',
        location: 'Phnom Penh',
        locationKm: 'ភ្នំពេញ',
        type: 'Full-time',
        typeKm: 'ពេញម៉ោង',
        minSalary: 400,
        salaryText: '$400 - $800',
        dateKm: 'ទើបតែបញ្ចូល',
        dateEn: 'Just now'
    },
    {
        id: 'job-104',
        titleEn: 'Senior IT Support Specialist',
        titleKm: 'អ្នកជំនាញជាន់ខ្ពស់ផ្នែកគាំទ្រ IT',
        category: 'IT',
        company: 'Huokaing Thara Client',
        location: 'Siem Reap',
        locationKm: 'សៀមរាប',
        type: 'Full-time',
        typeKm: 'ពេញម៉ោង',
        minSalary: 900,
        salaryText: '$900 - $1,500',
        dateKm: '២ ថ្ងៃមុន',
        dateEn: '2 days ago'
    }
];

// App State
let currentLang = 'km';
let savedJobIds = [];
let activeTab = 'all'; // 'all' or 'saved'

// DOM Elements
const langToggleBtn = document.getElementById('lang-toggle');
const langText = document.getElementById('lang-text');
const keywordInput = document.getElementById('keyword-input');
const locationSelect = document.getElementById('location-select');
const categorySelect = document.getElementById('category-select');
const searchBtn = document.getElementById('search-btn');
const salaryRange = document.getElementById('salary-range');
const salaryVal = document.getElementById('salary-val');
const resetFiltersBtn = document.getElementById('reset-filters');
const cardsContainer = document.getElementById('job-cards-container');
const resultsCountText = document.getElementById('results-count-text');
const savedCountElem = document.getElementById('saved-count');
const showAllBtn = document.getElementById('show-all-btn');
const showSavedBtn = document.getElementById('show-saved-btn');

// Modal Elements
const modal = document.getElementById('job-modal');
const closeModalBtn = document.getElementById('close-modal-btn');
const modalApplyForm = document.getElementById('modal-apply-form');
const quickCvForm = document.getElementById('quick-cv-form');

// Language Switcher Event
langToggleBtn.addEventListener('click', () => {
    currentLang = currentLang === 'km' ? 'en' : 'km';
    langText.textContent = currentLang === 'km' ? 'English' : 'ភាសាខ្មែរ';
    
    updateStaticTranslations();
    renderJobListings();
});

function updateStaticTranslations() {
    document.querySelectorAll('[data-km]').forEach(elem => {
        const text = elem.getAttribute(`data-${currentLang}`);
        if (text) elem.innerHTML = text;
    });

    document.querySelectorAll('[data-km-placeholder]').forEach(elem => {
        const placeholder = elem.getAttribute(`data-${currentLang}-placeholder`);
        if (placeholder) elem.placeholder = placeholder;
    });
}

// Filter Engine & Render
function renderJobListings() {
    const keyword = keywordInput.value.toLowerCase().trim();
    const location = locationSelect.value;
    const category = categorySelect.value;
    const minSalary = parseInt(salaryRange.value, 10);

    // Selected Types Checkboxes
    const checkedTypes = Array.from(document.querySelectorAll('.type-filter:checked')).map(cb => cb.value);

    const filtered = jobListings.filter(job => {
        if (activeTab === 'saved' && !savedJobIds.includes(job.id)) return false;

        const title = (currentLang === 'km' ? job.titleKm : job.titleEn).toLowerCase();
        const matchesKeyword = title.includes(keyword) || job.category.toLowerCase().includes(keyword);
        const matchesLocation = location === 'all' || job.location === location;
        const matchesCategory = category === 'all' || job.category === category;
        const matchesSalary = job.minSalary >= minSalary;
        const matchesType = checkedTypes.length === 0 || checkedTypes.includes(job.type);

        return matchesKeyword && matchesLocation && matchesCategory && matchesSalary && matchesType;
    });

    // Update Counter
    resultsCountText.textContent = `${filtered.length} ${currentLang === 'km' ? 'ឱកាសការងារត្រូវបានរកឃើញ' : 'positions found'}`;
    savedCountElem.textContent = savedJobIds.length;

    cardsContainer.innerHTML = '';

    if (filtered.length === 0) {
        cardsContainer.innerHTML = `
            <div style="text-align:center; padding: 3rem; color: #9ca3af;">
                ${currentLang === 'km' ? 'ពុំមានការងារដែលត្រូវនឹងលក្ខខណ្ឌស្វែងរកឡើយ' : 'No jobs found matching your criteria.'}
            </div>
        `;
        return;
    }

    filtered.forEach(job => {
        const card = document.createElement('div');
        card.className = 'job-card';

        const isSaved = savedJobIds.includes(job.id);
        const title = currentLang === 'km' ? job.titleKm : job.titleEn;
        const loc = currentLang === 'km' ? job.locationKm : job.location;
        const type = currentLang === 'km' ? job.typeKm : job.type;
        const applyBtnText = currentLang === 'km' ? 'ដាក់ពាក្យ' : 'Apply';

        card.innerHTML = `
            <div class="card-left">
                <h3 class="card-title">${title}</h3>
                <div class="card-company">${job.company} • 📍 ${loc}</div>
                <div class="card-tags">
                    <span class="tag">💼 ${job.category}</span>
                    <span class="tag">🕒 ${type}</span>
                </div>
            </div>
            <div class="card-right">
                <span class="salary-display">${job.salaryText}</span>
                <div class="action-row">
                    <button class="bookmark-btn ${isSaved ? 'saved' : ''}" onclick="toggleBookmark('${job.id}')">
                        ${isSaved ? '❤️' : '🤍'}
                    </button>
                    <button class="btn btn-gold btn-sm" onclick="openApplyModal('${job.id}')">${applyBtnText}</button>
                </div>
            </div>
        `;

        cardsContainer.appendChild(card);
    });
}

// Bookmark Logic
window.toggleBookmark = function(jobId) {
    if (savedJobIds.includes(jobId)) {
        savedJobIds = savedJobIds.filter(id => id !== jobId);
    } else {
        savedJobIds.push(jobId);
    }
    renderJobListings();
};

// Event Listeners for Controls
searchBtn.addEventListener('click', renderJobListings);
salaryRange.addEventListener('input', (e) => {
    salaryVal.textContent = `$${e.target.value}`;
    renderJobListings();
});

document.querySelectorAll('.type-filter').forEach(cb => cb.addEventListener('change', renderJobListings));

resetFiltersBtn.addEventListener('click', () => {
    keywordInput.value = '';
    locationSelect.value = 'all';
    categorySelect.value = 'all';
    salaryRange.value = 200;
    salaryVal.textContent = '$200';
    document.querySelectorAll('.type-filter').forEach(cb => cb.checked = true);
    renderJobListings();
});

// View Tabs (All vs Saved)
showAllBtn.addEventListener('click', () => {
    activeTab = 'all';
    showAllBtn.classList.add('active');
    showSavedBtn.classList.remove('active');
    renderJobListings();
});

showSavedBtn.addEventListener('click', () => {
    activeTab = 'saved';
    showSavedBtn.classList.add('active');
    showAllBtn.classList.remove('active');
    renderJobListings();
});

// Modal Logic
window.openApplyModal = function(jobId) {
    const job = jobListings.find(j => j.id === jobId);
    if (!job) return;

    document.getElementById('m-job-title').textContent = currentLang === 'km' ? job.titleKm : job.titleEn;
    document.getElementById('m-job-meta').textContent = `${job.company} (${job.salaryText})`;
    modal.style.display = 'flex';
};

closeModalBtn.addEventListener('click', () => { modal.style.display = 'none'; });
window.addEventListener('click', (e) => { if (e.target === modal) modal.style.display = 'none'; });

modalApplyForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert(currentLang === 'km' ? 'ពាក្យសុំរបស់អ្នកត្រូវបានផ្ញើដោយជោគជ័យ!' : 'Your application has been submitted successfully!');
    modal.style.display = 'none';
    modalApplyForm.reset();
});

quickCvForm.addEventListener('submit', (e) => {
    e.preventDefault();
    alert(currentLang === 'km' ? 'ប្រវត្តិរូប (CV) របស់អ្នកត្រូវបានទួលដោយជោគជ័យ!' : 'Your CV has been registered successfully!');
    quickCvForm.reset();
});

// Initial Setup
renderJobListings();
