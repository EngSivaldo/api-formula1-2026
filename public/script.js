const API = "/api/v1/drivers"

let driversCache = []


async function loadDrivers(){

const response = await fetch(API)

driversCache = await response.json()

renderDrivers(driversCache)

}


function renderDrivers(drivers){

const table = document.getElementById("drivers")

table.innerHTML = ""

drivers.forEach(driver=>{

table.innerHTML += `

<tr>

<td>${driver.name}</td>

<td>${driver.team}</td>

<td>${driver.points}</td>

<td>

<button class="btn btn-primary btn-sm"
onclick="editDriver('${driver.id}')">

Editar

</button>

<button class="btn btn-danger btn-sm"
onclick="deleteDriver('${driver.id}')">

Delete

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

if(!name || !team || !points){

alert("Preencha todos os campos")

return

}

await fetch(API,{

method:"POST",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({name,team,points})

})

loadDrivers()

}



async function deleteDriver(id){

if(!confirm("Deseja deletar?")) return

await fetch(API+"/"+id,{

method:"DELETE"

})

loadDrivers()

}



async function editDriver(id){

const driver = driversCache.find(d=>d.id===id)

const name = prompt("Novo nome:",driver.name)

const team = prompt("Nova equipe:",driver.team)

const points = prompt("Novos pontos:",driver.points)

await fetch(API+"/"+id,{

method:"PUT",

headers:{
"Content-Type":"application/json"
},

body:JSON.stringify({name,team,points})

})

loadDrivers()

}



document.getElementById("search").addEventListener("input",(e)=>{

const text = e.target.value.toLowerCase()

const filtered = driversCache.filter(driver=>

driver.name.toLowerCase().includes(text) ||

driver.team.toLowerCase().includes(text)

)

renderDrivers(filtered)

})



function sortDrivers(){

driversCache.sort((a,b)=>b.points - a.points)

renderDrivers(driversCache)

}



loadDrivers()