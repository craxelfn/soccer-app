import { clubMap } from "./script.js";
const classmentdiv = document.querySelector('.afficher-class');

function displayClubStandings(clubMap) {
  if (!clubMap || clubMap.size === 0) {
    console.log("No data in clubMap");
    return;
  }

  console.log("clubMap contains data:", clubMap);

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

console.log("clubMap before calling displayClubStandings:", clubMap);
displayClubStandings(clubMap);
