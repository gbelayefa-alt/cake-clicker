// When initializing the game
/* 
Authors: Harshini Lakshman and Amanda Gbe
Date: February 4th, 2026
Description: This is the JAVASCRIPT file for the incremental clicker game, based on Cookie Clicker, using our own theme
and reward systems.
*/

window.addEventListener("load", function (event) {
    let cakes = 0;
    let clickValue = 1;
    let upgrades = {
        click1: 0,
        click2: 0,
        click3: 0,
        autoClick: 0,
        autoClick2: 0,
    };
    let autoClickInterval = null;
    let autoClickSpeed = 1000;

    // Grabbing buttons from DOM
    const bigCake = document.getElementById("bigCake");
    const upClick1 = document.getElementById("upClick1");
    const upClick2 = document.getElementById("upClick2");
    const upClick3 = document.getElementById("upClick3");
    const autoClick = document.getElementById("autoClick");
    const autoClick2 = document.getElementById("autoClick2");

    // Scoreboard elements
    const cakeCountSpan = document.getElementById("cakeCount");
    const clickValSpan = document.getElementById("clickValue");
    const upgradesOwnedSpan = document.getElementById("upgradesOwned");
    const cakesPerSecondSpan = document.getElementById("cakesPerSecond");

    // Clicking bigCake
    bigCake.addEventListener('click', (event) => {
        cakes += clickValue;

        const rect = document.getElementById("clickArea").getBoundingClientRect()
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;

        showFloatingNumber(x, y, clickValue);

        updateScoreboard();
        updateButtons();
        checkRewards();
    });

    function updateScoreboard() {
        cakeCountSpan.textContent = cakes;
        clickValSpan.textContent = clickValue;
        upgradesOwnedSpan.textContent = upgrades.autoClick + upgrades.autoClick2 + upgrades.click1 + upgrades.click2 + upgrades.click3;

        // Cakes per second
        const totalCPS = upgrades.autoClick * clickValue * (1000 / autoClickSpeed);
        cakesPerSecondSpan.textContent = totalCPS.toFixed(2);
    }

    // When clicking upgrade buttons
    let upgradeCosts = {
        click1: 10,
        click2: 50,
        click3: 100,
        autoClick: 200,
        autoClick2: 300
    };

    upClick1.addEventListener('click', () => {
        if (cakes >= upgradeCosts.click1) {
            cakes -= upgradeCosts.click1;
            clickValue += 1;
            upgrades.click1 += 1;

            //Increase cost 
            upgradeCosts.click1 = Math.floor(upgradeCosts.click1 * 1.25);

            updateUpgradeText();
            updateScoreboard();
            updateButtons();
            checkRewards();
        }
    });

    upClick2.addEventListener('click', () => {
        if (cakes >= upgradeCosts.click2) {
            cakes -= upgradeCosts.click2;
            clickValue += 5;
            upgrades.click2 += 1;
            //Increase cost 
            upgradeCosts.click2 = Math.floor(upgradeCosts.click2 * 1.25);

            updateUpgradeText();
            updateScoreboard();
            updateButtons();
            checkRewards();
        }
    });

    upClick3.addEventListener('click', () => {
        if (cakes >= upgradeCosts.click3) {
            cakes -= upgradeCosts.click3;
            clickValue += 10;
            upgrades.click3 += 1;

            //Increase cost 
            upgradeCosts.click3 = Math.floor(upgradeCosts.click3 * 1.25);

            updateUpgradeText();
            updateScoreboard();
            updateButtons();
            checkRewards();
        }
    });
    function updateBakers() {
        const clickArea = document.getElementById("clickArea");
        const cakeBtn = document.getElementById("bigCake");
        //remove old bakers to draw new ones
        clickArea.querySelectorAll(".baker").forEach(b => b.remove());

        const n = upgrades.autoClick;
        if (n <= 0) return;
        const clickRect = clickArea.getBoundingClientRect();
        const cakeRect = cakeBtn.getBoundingClientRect();
        const centerX = (cakeRect.left + cakeRect.width / 2) - clickRect.left;
        const centerY = (cakeRect.top + cakeRect.height / 2) - clickRect.top;

        const radius = 140;
        for (let i = 0; i < n; i++) {
            const angle = (2 * Math.PI * i) / n;
            const x = centerX + radius * Math.cos(angle);
            const y = centerY + radius * Math.sin(angle);
            const baker = document.createElement("div");
            baker.classList.add("baker");

            baker.textContent = (i % 2 === 0) ? "👩🏾‍🍳" : "👩🏽‍🍳";
            baker.style.left = `${x}px`;
            baker.style.top = `${y}px`;

            clickArea.appendChild(baker);
        }
    }
    function bounceBakers() {
        document.querySelectorAll(".baker").forEach(baker => {
            baker.classList.remove("bounce");
            void baker.offsetWidth;
            baker.classList.add("bounce");
        });
    }

    autoClick.addEventListener('click', () => {
        if (cakes >= upgradeCosts.autoClick) {
            cakes -= upgradeCosts.autoClick;
            upgrades.autoClick += 1;

            //Increase cost 
            upgradeCosts.autoClick = Math.floor(upgradeCosts.autoClick * 1.25);

            updateUpgradeText();
            updateScoreboard();
            updateButtons();
            checkRewards();
            updateBakers();

            startAutoclick();
        }
    });

    autoClick2.addEventListener("click", () => {
        if (cakes >= upgradeCosts.autoClick2) {
            cakes -= upgradeCosts.autoClick2;
            upgrades.autoClick2 += 1;

            // increase cost
            upgradeCosts.autoClick2 = Math.floor(upgradeCosts.autoClick2 * 1.25);

            // speed upgrade
            autoClickSpeed = Math.max(200, 1000 - upgrades.autoClick2 * 100);

            startAutoclick();

            updateUpgradeText();
            updateScoreboard();
            updateButtons();
            checkRewards();
        }
    })

    // Autoclicker 2 interval
    function startAutoclick() {
        // clear old interval
        if (autoClickInterval !== null) {
            clearInterval(autoClickInterval);
        }

        // set new interval
        autoClickInterval = setInterval(() => {
            cakes += upgrades.autoClick * clickValue;
            updateScoreboard();
            updateButtons();
            bounceBakers();
        }, autoClickSpeed);
    }

    // Disable upgrades player can't use
    function updateButtons() {
        upClick1.disabled = cakes < upgradeCosts.click1;
        upClick2.disabled = cakes < upgradeCosts.click2;
        upClick3.disabled = cakes < upgradeCosts.click3;
        autoClick.disabled = cakes < upgradeCosts.autoClick;
        autoClick2.disabled = cakes < upgradeCosts.autoClick2 || upgrades.autoClick === 0;
    }

    // Reward System
    const rewards = [
        { id: "reward1", threshold: 1 },
        { id: "reward2", threshold: 100 },
        { id: "reward3", threshold: 1000 },
        { id: "reward4", threshold: 10000 },
        { id: "reward5", threshold: 100000 },
        { id: "reward6", threshold: 50, type: "upgrade" },
        { id: "reward7", threshold: 100, type: "upgrade" },
        { id: "reward8", threshold: 5, type: "baker" },
        { id: "reward9", threshold: 15, type: "baker" },
    ]

    function checkRewards() {
        const totalUpgrades = upgrades.click1 + upgrades.click2 + upgrades.click3 + upgrades.autoClick + upgrades.autoClick2;

        // Cake milesones
        rewards.forEach(reward => {
            const element = document.getElementById(reward.id);
            if (!element || element.classList.contains("unlocked")) {
                return;
            }

            if (reward.type === "upgrade" && totalUpgrades >= reward.threshold) {
                unlockReward(element);
            } else if (reward.type === "baker" && upgrades.autoClick >= reward.threshold) {
                unlockReward(element);
            } else if (!reward.type && cakes >= reward.threshold) {
                unlockReward(element);
            }
        });
    }

    // Helper function for checkRewards()
    function unlockReward(element) {
        element.classList.add("unlocked");
        element.style.opacity = 1;
        element.style.transform = "scale(1.2)";

        showTrophy(element.textContent);
        // Animation
        setTimeout(() => {
            element.style.transform = "scale(1)";
        }, 500);
    }

    // Reset Button
    const resetButton = document.getElementById("reset");

    resetButton.addEventListener('click', () => {
        // Reset game stats
        cakes = 0;
        clickValue = 1;
        upgrades = {
            click1: 0,
            click2: 0,
            click3: 0,
            autoClick: 0,
            autoClick2: 0,
        }

        // Reset costs
        upgradeCosts = {
            click1: 10,
            click2: 50,
            click3: 100,
            autoClick: 200,
            autoClick2: 300
        };

        // Reset scoreboard
        updateScoreboard();

        // Reset upgrade buttons
        updateButtons();

        //Reset bakers
        updateBakers();

        // Reset rewards
        rewards.forEach(reward => {
            const element = document.getElementById(reward.id);
            if (element) {
                element.classList.remove("unlocked");
                element.style.opacity = 0;
                element.style.transform = "scale(0.8)";
            }
        });

        // Reset timer
        if (autoClickInterval != null) {
            clearInterval(autoClickInterval);
            autoClickInterval = null;
        }
        if (upgrades.autoClick > 0) {
            startAutoclick();
        }

        autoClickSpeed = 1000;
        updateUpgradeText();
    });


    //Trophy pop up
    function showTrophy(message) {
        const popup = document.getElementById("trophyPopup");
        const text = document.getElementById("trophyText");
        text.textContent = message;
        popup.classList.add("show");

        //Hide after 3 seconds
        setTimeout(() => {
            popup.classList.remove("show");
        }, 3000);
    }

    function showFloatingNumber(x, y, value) {
        const number = document.createElement("div");
        number.classList.add("floatingNumber");
        number.textContent = `+${value}`;

        number.style.left = `${x}px`;
        number.style.top = `${y}px`;

        document.getElementById("clickArea").appendChild(number);

        setTimeout(() => {
            number.remove();
        }, 800);
    }

    function updateUpgradeText() {
        upClick1.textContent = `Increase Click Value (+1 click) Cost: ${upgradeCosts.click1} Cakes`;
        upClick2.textContent = `Increase Click Value (+5 click) Cost: ${upgradeCosts.click2} Cakes`;
        upClick3.textContent = `Increase Click Value (+10 click) Cost: ${upgradeCosts.click3} Cakes`;
        autoClick.textContent = `Hire Baker (auto click) Cost: ${upgradeCosts.autoClick} Cakes`;
        autoClick2.textContent = `Install Turbo Oven (${(1000 / autoClickSpeed).toFixed(2)} cakes/sec) Cost: ${upgradeCosts.autoClick2} Cakes`;
    }
    window.addEventListener("resize", updateBakers);

    updateScoreboard();
    updateButtons();
    if (upgrades.autoClick > 0) {
        startAutoclick();
    }

    // Help Popup
    const helpButton = document.getElementById("helpButton");
    const helpPopup = document.getElementById("helpPop");
    const closeHelp = document.getElementById("close");

    // Open popup
    helpButton.addEventListener("click", () => {
        helpPopup.style.display = "flex";
    });

    // Close popup
    closeHelp.addEventListener("click", () => {
        helpPopup.style.display = "none";
    });

    window.addEventListener("click", (e) => {
        if (e.target === helpPopup) {
            helpPopup.style.display = "none";
        }
    })

    //background music
    const bgMusic = document.getElementById("bgMusic");
    bgMusic.loop = true;
    bgMusic.volume = 0.25;

    let musicStarted = false;

    window.addEventListener("click", () => {
        if (!musicStarted) {
            bgMusic.play().catch(() => { });
            musicStarted = true;
        }
    }, { once: true });
});