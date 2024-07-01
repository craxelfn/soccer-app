export let clubMap = new Map();

document.addEventListener('DOMContentLoaded', function() {
    const customSelect = document.querySelector('.custom-select-wrapper');
    const customSelectTrigger = customSelect.querySelector('.custom-select-trigger');
    const customOptions = customSelect.querySelector('.custom-options');

    customSelectTrigger.addEventListener('click', function() {
      customOptions.classList.toggle('open');
    });

    customOptions.addEventListener('click', function(e) {
      const selectedOption = e.target.closest('.custom-option');
      if (!selectedOption) return;

      const value = selectedOption.getAttribute('data-value');
      customSelectTrigger.innerHTML = selectedOption.innerHTML;

      const previouslySelected = customOptions.querySelector('.selected');
      if (previouslySelected) {
        previouslySelected.classList.remove('selected');
      }
      selectedOption.classList.add('selected');
      customOptions.classList.remove('open');
    });

    document.addEventListener('click', function(e) {
      if (!customSelect.contains(e.target)) {
        customOptions.classList.remove('open');
      }
    });

    init(); // Call the initialization function
});

const maindiv = document.querySelector('.main'); 
let matchMap = new Map();

async function getAllData() {
  try {
    // Fetch club data
    const clubResponse = await fetch('./package/en.1.clubs.json');
    const clubData = await clubResponse.json();
    clubData.clubs.forEach(club => {
      clubMap.set(club.name, 0);
    });

    // Fetch match data
    const matchResponse = await fetch('./package/en.1.json');
    const matchData = await matchResponse.json();
    matchData.matches.forEach(match => {
      const matchDate = match.date;
      if (!matchMap.has(matchDate)) {
        matchMap.set(matchDate, []);
      }
      matchMap.get(matchDate).push(match);
    });

  } catch (error) {
    console.error('Error fetching the JSON data:', error);
  }
}

async function init() {
  await getAllData(); // Ensure data fetching is complete

  matchMap.forEach((matches, date) => {
    let matchesHtml = `
      <div class="sheild pb-5 mb-5">
        <div class="date">
          <h1 class="text-white-50">${date}</h1>
          <h4 class="text-white-50">${matches.length} matches</h4>
        </div>
         <div class="league ">
            <div class="league-logo">
                <img src="images/pl.png">
                <p class="league-name text-white"> premier league </p>
            </div>
    `;

    matches.forEach(match => {
      const homeTeam = match.team1.replace(/\s+/g, '');
      const awayTeam = match.team2.replace(/\s+/g, '');
      if (match.score == null) {
        matchesHtml += `
          <div class="match">
            <div class="team" id="home-team"><img src="images/${homeTeam}.png" alt="Home Team"></div>
            <div class="score"><p class="text-white-50">08:00</p></div>
            <div class="team" id="out-home-team"><img src="images/${awayTeam}.png" alt="Away Team"></div>
          </div>
        `;
      } else { // score exists
        let score = match.score.ft;
        if (score[0] > score[1]) {
          clubMap.set(match.team1, (clubMap.get(match.team1) || 0) + 3);
        } else if (score[0] < score[1]) {
          clubMap.set(match.team2, (clubMap.get(match.team2) || 0) + 3);
        } else { 
          clubMap.set(match.team1, (clubMap.get(match.team1) || 0) + 1);
          clubMap.set(match.team2, (clubMap.get(match.team2) || 0) + 1);
        }
        matchesHtml += `
          <div class="match">
            <div class="team" id="home-team"><img src="images/${homeTeam}.png" alt="Home Team"></div>
            <div class="score"><p class="text-white-50">${score[0]}-${score[1]}</p></div>
            <div class="team" id="out-home-team"><img src="images/${awayTeam}.png" alt="Away Team"></div>
          </div>
        `;
      }
    });

    matchesHtml += `</div>
    </div>`;
    maindiv.innerHTML += matchesHtml;
  });

  console.log(clubMap);
  // Call displayClubStandings after data is populated
  displayClubStandings(clubMap);
}

function displayClubStandings(clubMap) {
  if (!clubMap || clubMap.size === 0) {
    console.log("No data in clubMap");
    return;
  }

  console.log("clubMap contains data:", clubMap);

  let classmentdiv = document.querySelector('.afficher-class');
  let clubArray = Array.from(clubMap.entries()).sort((a, b) => b[1] - a[1]);

  classmentdiv.innerHTML = '';

  clubArray.forEach((clubEntry, index) => {
    let club = clubEntry[0];
    let points = clubEntry[1];
    let image = club.replace(/\s+/g, '');

    classmentdiv.innerHTML += `
      <tr>
        <td>${index + 1}</td>
        <td scope="row"><img src="images/${image}.png" alt="${club} logo"></td>
        <td>${club}</td>
        <td>${points}</td>
      </tr>`;
  });
}
