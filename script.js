document.addEventListener('DOMContentLoaded', () => {
    // Data
    const positions = [
        {
            title: 'President',
            candidates: [
                { name: 'Alice Johnson', bio: 'Focused on student welfare.', img: 'https://via.placeholder.com/50' },
                { name: 'Bob Smith', bio: 'Advocate for tech upgrades.', img: 'https://via.placeholder.com/50' },
                { name: 'Charlie Brown', bio: 'Promotes extracurriculars.', img: 'https://via.placeholder.com/50' }
            ]
        },
        {
            title: 'Vice President',
            candidates: [
                { name: 'Diana Prince', bio: 'Leader in community service.', img: 'https://via.placeholder.com/50' },
                { name: 'Eve Adams', bio: 'Organizes events efficiently.', img: 'https://via.placeholder.com/50' },
                { name: 'Frank Miller', bio: 'Ensures transparent records.', img: 'https://via.placeholder.com/50' }
            ]
        },
        {
            title: 'Secretary',
            candidates: [
                { name: 'Grace Lee', bio: 'Manages budgets wisely.', img: 'https://via.placeholder.com/50' },
                { name: 'Henry Ford', bio: 'Focuses on fundraising.', img: 'https://via.placeholder.com/50' },
                { name: 'Ivy Green', bio: 'Supports environmental initiatives.', img: 'https://via.placeholder.com/50' }
            ]
        },
        {
            title: 'Treasurer',
            candidates: [
                { name: 'Jack White', bio: 'Expert in financial planning.', img: 'https://via.placeholder.com/50' },
                { name: 'Kate Black', bio: 'Prioritizes student resources.', img: 'https://via.placeholder.com/50' },
                { name: 'Leo Blue', bio: 'Innovates funding strategies.', img: 'https://via.placeholder.com/50' }
            ]
        }
    ];

    let votes = JSON.parse(localStorage.getItem('votes')) || {};
    let hasVoted = localStorage.getItem('hasVoted') === 'true';
    let selectedVotes = {};

    // Elements
    const tutorialScreen = document.getElementById('tutorial-screen');
    const loginScreen = document.getElementById('login-screen');
    const votingScreen = document.getElementById('voting-screen');
    const resultsScreen = document.getElementById('results-screen');
    const startVotingBtn = document.getElementById('start-voting');
    const loginForm = document.getElementById('login-form');
    const studentIdInput = document.getElementById('student-id');
    const positionsDiv = document.getElementById('positions');
    const submitVoteBtn = document.getElementById('submit-vote');
    const resultsDiv = document.getElementById('results');
    const logoutBtn = document.getElementById('logout-btn');
    const backToVoteBtn = document.getElementById('back-to-vote');
    const backToTutorialBtn = document.getElementById('back-to-tutorial');
    const toggleModeBtn = document.getElementById('toggle-mode');

    // Functions
    function showScreen(screen) {
        document.querySelectorAll('.screen').forEach(s => s.classList.remove('active'));
        screen.classList.add('active');
    }

    function renderPositions() {
        positionsDiv.innerHTML = '';
        positions.forEach((pos, posIndex) => {
            const posCard = document.createElement('div');
            posCard.className = 'position-card';
            posCard.innerHTML = `<h3>${pos.title}</h3>`;
            pos.candidates.forEach((cand, candIndex) => {
                const candDiv = document.createElement('div');
                candDiv.className = 'candidate';
                candDiv.innerHTML = `
                    <img src="${cand.img}" alt="${cand.name}">
                    <div>
                        <span>${cand.name}</span>
                        <p>${cand.bio}</p>
                    </div>
                `;
                candDiv.addEventListener('click', () => {
                    document.querySelectorAll(`.position-card:nth-child(${posIndex + 1}) .candidate`).forEach(c => c.classList.remove('selected'));
                    candDiv.classList.add('selected');
                    selectedVotes[pos.title] = cand.name;
                });
                posCard.appendChild(candDiv);
            });
            positionsDiv.appendChild(posCard);
        });
    }

    function submitVote() {
        if (Object.keys(selectedVotes).length !== positions.length) {
            alert('Please vote for all positions.');
            return;
        }
        Object.keys(selectedVotes).forEach(pos => {
            if (!votes[pos]) votes[pos] = {};
            votes[pos][selectedVotes[pos]] = (votes[pos][selectedVotes[pos]] || 0) + 1;
        });
        localStorage.setItem('votes', JSON.stringify(votes));
        localStorage.setItem('hasVoted', 'true');
        hasVoted = true;
        showResults();
    }

    function showResults() {
        resultsDiv.innerHTML = '';
        positions.forEach(pos => {
            const posVotes = votes[pos.title] || {};
            const total = Object.values(posVotes).reduce((a, b) => a + b, 0);
            resultsDiv.innerHTML += `<h3>${pos.title} (${total} votes)</h3>`;
            pos.candidates.forEach(cand => {
                const count = posVotes[cand.name] || 0;
                const percent = total > 0 ? (count / total * 100).toFixed(1) : 0;
                resultsDiv.innerHTML += `
                    <div class="result-item">
                        <span>${cand.name}: ${count} votes</span>
                        <div class="progress-bar"><div class="progress-fill" style="width: ${percent}%"></div></div>
                    </div>
                `;
            });
        });
        showScreen(resultsScreen);
    }

    // Event Listeners
    startVotingBtn.addEventListener('click', () => showScreen(loginScreen));
    loginForm.addEventListener('submit', (e) => {
        e.preventDefault();
        const id = studentIdInput.value.trim();
        if (id) {
            localStorage.setItem('studentId', id);
            showScreen(hasVoted ? resultsScreen : votingScreen);
            if (!hasVoted) renderPositions();
        }
    });
    submitVoteBtn.addEventListener('click', submitVote);
    logoutBtn.addEventListener('click', () => {
        localStorage.removeItem('studentId');
        showScreen(loginScreen);
    });
    backToVoteBtn.addEventListener('click', () => showScreen(votingScreen));
    backToTutorialBtn.addEventListener('click', () => showScreen(tutorialScreen));
    toggleModeBtn.addEventListener('click', () => document.body.classList.toggle('dark'));

    // Initial Load
    if (localStorage.getItem('studentId')) {
        showScreen(hasVoted ? resultsScreen : votingScreen);
        if (!hasVoted) renderPositions();
        if (hasVoted) showResults();
    }
});