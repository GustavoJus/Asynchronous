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

  // Hide pokeball
  document.getElementById("defaultImage").style.display = "none";

  // Show pokemon image
  const img = document.getElementById("pokemonImage");
  img.src = data.sprites.front_default || "";
  img.style.display = "block";

  // Load cry audio
  const audio = document.getElementById("pokemonAudio");
  audio.src = (data.cries && (data.cries.latest || data.cries.legacy))
    ? (data.cries.latest || data.cries.legacy)
    : "";

  // Load moves into dropdowns (limit to 20 to keep it manageable)
  const moves = (data.moves || []).slice(0, 20);

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

function ensureTeamTableExists() {
  const teamDiv = document.getElementById("team");
  let table = document.getElementById("teamTable");

  if (!table) {
    table = document.createElement("table");
    table.id = "teamTable";
    teamDiv.appendChild(table);
  }

  return table;
}

function addToTeam() {
  if (!currentPokemon) {
    alert("Find a Pokemon first!");
    return;
  }

  const table = ensureTeamTableExists();

  // Create a new row
  const row = document.createElement("tr");

  // Left cell: sprite
  const spriteCell = document.createElement("td");
  spriteCell.className = "team-sprite";

  const sprite = document.createElement("img");
  sprite.src = currentPokemon.sprites.front_default || "";
  sprite.alt = currentPokemon.name;

  spriteCell.appendChild(sprite);

  // Right cell: moves list
  const movesCell = document.createElement("td");
  movesCell.className = "team-moves";

  const ul = document.createElement("ul");

  for (let i = 1; i <= 4; i++) {
    const moveValue = document.getElementById("move" + i).value;
    const li = document.createElement("li");
    li.textContent = moveValue;
    ul.appendChild(li);
  }

  movesCell.appendChild(ul);

  // Add both cells to row
  row.appendChild(spriteCell);
  row.appendChild(movesCell);

  // Add row to table
  table.appendChild(row);
}
