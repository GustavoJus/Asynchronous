const cache = {};
let currentPokemon = null;

document.getElementById("findBtn").addEventListener("click", fetchPokemon);
document.getElementById("addBtn").addEventListener("click", addToTeam);

async function fetchPokemon() {
  const input = document.getElementById("pokemonInput").value.trim().toLowerCase();

  if (!input) {
    alert("Enter a Pokemon name or ID.");
    return;
  }

  // Use cached version if available
  if (cache[input]) {
    displayPokemon(cache[input]);
    return;
  }

  try {
    const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${input}`);
    if (!response.ok) throw new Error("Not found");

    const data = await response.json();
    cache[input] = data;
    displayPokemon(data);

  } catch {
    alert("Pokemon not found!");
  }
}

function displayPokemon(data) {
  currentPokemon = data;

  // Hide default pokeball
  document.getElementById("defaultImage").style.display = "none";

  // Show pokemon image
  const img = document.getElementById("pokemonImage");
  img.src = data.sprites.front_default;
  img.style.display = "block";

  // Load cry
  const audio = document.getElementById("pokemonAudio");
  audio.src = data.cries.latest || "";

  // Load moves (limit to first 20)
  const moves = data.moves.slice(0, 20);

  for (let i = 1; i <= 4; i++) {
    const select = document.getElementById("move" + i);
    select.innerHTML = "";

    moves.forEach(m => {
      const option = document.createElement("option");
      option.value = m.move.name;
      option.textContent = m.move.name;
      select.appendChild(option);
    });
  }
}

function addToTeam() {
  if (!currentPokemon) {
    alert("Find a Pokemon first!");
    return;
  }

  const teamDiv = document.getElementById("team");

  const member = document.createElement("div");
  member.className = "team-member";

  const img = document.createElement("img");
  img.src = currentPokemon.sprites.front_default;

  const list = document.createElement("ul");

  for (let i = 1; i <= 4; i++) {
    const li = document.createElement("li");
    li.textContent = document.getElementById("move" + i).value;
    list.appendChild(li);
  }

  member.appendChild(img);
  member.appendChild(list);
  teamDiv.appendChild(member);
}