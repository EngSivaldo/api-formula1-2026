const API = "/api/v1/drivers"
const RANKING_API = "/api/v1/drivers/ranking"

let driversCache = []
let currentEditId = null


async function loadDrivers(){

const response = await fetch(RANKING_API)

driversCache = await response.json()

renderDrivers(driversCache)

}


function medal(position){

if(position===1) return "🥇"
if(position===2) return "🥈"
if(position===3) return "🥉"

return position

}


function renderDrivers(drivers){

const table = document.getElementById("drivers")

table.innerHTML=""

drivers.forEach(driver=>{

table.innerHTML += `

<tr>

<td class="medal">${medal(driver.position)}</td>

<td>${driver.name}</td>

<td>${driver.team}</td>

<td>${driver.points}</td>

<td>

<div class="progress">
<div class="progress-bar bg-danger"
style="width:${driver.points/10}%">
</div>
</div>

</td>

<td>

<button class="btn btn-primary btn-sm me-2"
onclick="openEdit('${driver.id}')">
✏️ Editar
</button>

<button class="btn btn-danger btn-sm"
onclick="openDelete('${driver.id}')">
🗑️ Deletar
</button>

</td>

</tr>

`

})

}


async function createDriver(){

const name = document.getElementById("name").value
const team = document.getElementById("team").value
const points = document.getElementById("points").value

await fetch(API,{
method:"POST",
headers:{"Content-Type":"application/json"},
body:JSON.stringify({name,team,points})
})

loadDrivers()

document.getElementById("name").value=""
document.getElementById("team").value=""
document.getElementById("points").value=""

}


function openEdit(id){

const driver = driversCache.find(d=>d.id===id)

currentEditId=id

document.getElementById("editName").value=driver.name
document.getElementById("editTeam").value=driver.team
document.getElementById("editPoints").value=driver.points

const modal = new bootstrap.Modal(document.getElementById("editModal"))
modal.show()

}


async function updateDriver(){

const name = document.getElementById("editName").value
const team = document.getElementById("editTeam").value
const points = document.getElementById("editPoints").value

await fetch(API+"/"+currentEditId,{

method:"PUT",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({name,team,points})

})

loadDrivers()

bootstrap.Modal.getInstance(document.getElementById("editModal")).hide()

}

let currentDeleteId = null;

function openDelete(id){

const driver = driversCache.find(d=>d.id===id);

currentDeleteId = id;

document.getElementById("deleteName").innerText = driver.name;
document.getElementById("deleteTeam").innerText = driver.team;
document.getElementById("deletePoints").innerText = driver.points;

const modal = new bootstrap.Modal(document.getElementById("deleteModal"));
modal.show();

}

async function confirmDelete(){

await fetch(API + "/" + currentDeleteId,{
method:"DELETE"
})

bootstrap.Modal.getInstance(
document.getElementById("deleteModal")
).hide();

loadDrivers();

}



document.getElementById("search").addEventListener("input",(e)=>{

const text=e.target.value.toLowerCase()

const filtered=driversCache.filter(driver=>

driver.name.toLowerCase().includes(text) ||

driver.team.toLowerCase().includes(text)

)

renderDrivers(filtered)

})


loadDrivers()