const petsSection = document.getElementById("petsContainer");
const logActivity = document.getElementById("logActivity");
const createPet = document.getElementById("createPet");
const randomName = document.getElementById("randomName");

let pets = [];

class Pet {
    constructor(name, animalType) {
        this.name = name;
        this.animalType = animalType;
        this.energy = 50;
        this.fullness = 50;
        this.happiness = 50;

        this.element = document.createElement("div");
        this.element.className = "pet";
        
        petsSection.appendChild(this.element);
        this.showPet();
        this.startTimer();
    }

    getImage() {
        if (this.animalType === "dog") return "images/dog.png";
        if (this.animalType === "cat") return "images/cat.png";
        if (this.animalType === "rabbit") return "images/rabbit.png";
        if (this.animalType === "hamster") return "images/hamster.png";
    }

    showPet() {
        this.element.innerHTML = `
            <h3>${this.name} (${this.animalType})</h3>
            <img src="${this.getImage()}" class="pet-img">
            <p>Energy: ${this.energy}</p>
            <p>Fullness: ${this.fullness}</p>
            <p>Happiness: ${this.happiness}</p>
            <button class="nap">Nap</button>
            <button class="play">Play</button>
            <button class="eat">Eat</button>
        `;

        this.element.querySelector(".nap").onclick = () => this.nap();
        this.element.querySelector(".play").onclick = () => this.play();
        this.element.querySelector(".eat").onclick = () => this.eat();
    }

showEmojis(emoji, amount) {
    for (let i = 0; i < amount; i++) {
        setTimeout(() => {
            const span = document.createElement("span");
            span.className = "emoji";
            span.textContent = emoji;
            span.style.left = Math.random() * 100 + "px";

            this.element.appendChild(span);

            setTimeout(() => {
                span.remove();
            }, 2000);

        }, i * 1000); 
    }
}

nap() {
    this.energy += 40;
    this.happiness -= 10;
    this.fullness -= 10;

    this.writeLog(`You took a nap with ${this.name}`);

    this.showEmojis("💤", 3);

    this.updatePet();
}


play() {
    this.happiness += 30;
    this.fullness -= 10;
    this.energy -= 10;

    this.writeLog(`You played with ${this.name}`);
    
    this.updatePet(); 

    const img = this.element.querySelector(".pet-img");
    img.classList.add("playing");

    this.showEmojis("🎾", 3);

    setTimeout(() => {
        const petPic = this.element.querySelector(".pet-img");
        if (petPic) petPic.classList.remove("playing");
    }, 2000);
}


eat() {
    this.fullness += 30;
    this.happiness += 5;
    this.energy -= 15;

    this.writeLog(`You fed ${this.name}`);

    this.showEmojis("🍎", 3);

    this.updatePet();
}


    updatePet() {
        if (this.energy > 100) this.energy = 100;
        if (this.fullness > 100) this.fullness = 100;
        if (this.happiness > 100) this.happiness = 100;

        if (this.energy <= 0 || this.fullness <= 0 || this.happiness <= 0) {
            this.energy = Math.max(0, this.energy);
            this.fullness = Math.max(0, this.fullness);
            this.happiness = Math.max(0, this.happiness);
            this.runAway();
            return;
        }

        this.showPet();
    }

    writeLog(text) {
        logActivity.value += text + "\n";
        logActivity.scrollTop = logActivity.scrollHeight;
    }

    runAway() {
        this.writeLog(`${this.name} ran away due to neglect 💔`);
        this.element.remove();
        clearInterval(this.timer);
        pets = pets.filter(p => p !== this);
    }

    startTimer() {
        this.timer = setInterval(() => {
            this.energy -= 10;
            this.fullness -= 10;
            this.happiness -= 10;
            this.updatePet();
        }, 10000);
    }
    
}

async function getRandomName() {
    try {
        const response = await fetch("https://randomuser.me/api");
        const data = await response.json();
        return data.results[0].name.first;
    } catch {
        alert("Kunde inte hämta namn från API");
        return "";
    }
}

randomName.onclick = async () => {
    const name = await getRandomName();
    document.getElementById("name").value = name;
};

createPet.onclick = () => {
    if (pets.length >= 4) {
        alert("Du kan max ha 4 husdjur!");
        return;
    }

    const nameInput = document.getElementById("name");
    const animalType = document.getElementById("animalType").value;

    if (nameInput.value.trim() === "") {
        alert("Skriv ett namn eller slumpa ett");
        return;
    }

    const pet = new Pet(nameInput.value, animalType);
    pets.push(pet);
    nameInput.value = "";
};