function showCardPopup() {
    // Array of sorting algorithms
    const algorithms = [
        "Bubble Sort",
        "Merge Sort",
        "Quick Sort",
        "Insertion Sort",
        "Selection Sort",
        "Heap Sort",
    ];

    // Create a modal wrapper
    const modal = document.createElement("div");
    modal.style.position = "fixed";
    modal.style.top = "0";
    modal.style.left = "0";
    modal.style.width = "100vw";
    modal.style.height = "100vh";
    modal.style.backgroundColor = "rgba(0, 0, 0, 0.8)";
    modal.style.display = "flex";
    modal.style.justifyContent = "center";
    modal.style.alignItems = "center";
    modal.style.zIndex = "9999";

    // Create the card content dynamically using map
    const cardContent = `
        <div class="card">
            <h2>Select Any Two Algorithms</h2>
            <div class="checkbox-container">
                ${algorithms
                    .map(
                        (algo) => `
                        <label>
                            <input type="checkbox" value="${algo}">
                            <span class="custom-checkbox"></span>
                            ${algo}
                        </label>
                    `
                    )
                    .join("")}
            </div>
            <button id="saveButton" style="margin-top: 20px; padding: 10px 20px; border: none; border-radius: 4px; background-color: #ffcc00; color: #121212; font-size: 16px; cursor: pointer;">
                Save
            </button>
        </div>
    `;

    // Add the card HTML to the modal
    modal.innerHTML = cardContent;

    // Append modal to the document body
    document.body.appendChild(modal);

    // Style the card
    const style = document.createElement("style");
    style.textContent = `
        .card {
            background: #1e1e1e;
            border-radius: 12px;
            box-shadow: 0 8px 16px rgba(0, 0, 0, 0.4);
            width: 350px;
            padding: 25px;
            border: 1px solid #444444;
            text-align: center;
        }

        .card h2 {
            margin-bottom: 20px;
            font-size: 20px;
            color: #ffcc00;
        }

        .checkbox-container {
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 15px;
            margin-bottom: 20px;
        }

        .checkbox-container label {
            position: relative;
            display: flex;
            align-items: center;
            padding-left: 35px;
            cursor: pointer;
            font-size: 16px;
            transition: color 0.3s;
        }

        .checkbox-container label:hover {
            color: #ffcc00;
        }

        .checkbox-container input[type="checkbox"] {
            position: absolute;
            opacity: 0;
            cursor: pointer;
        }

        .checkbox-container .custom-checkbox {
            position: absolute;
            top: 0;
            left: 0;
            height: 20px;
            width: 20px;
            background-color: #2c2c2c;
            border: 2px solid #555;
            border-radius: 4px;
            transition: all 0.3s;
        }

        .checkbox-container input[type="checkbox"]:checked ~ .custom-checkbox {
            background-color: #ffcc00;
            border-color: #ffcc00;
        }

        .checkbox-container input[type="checkbox"]:checked ~ .custom-checkbox:after {
            content: '';
            position: absolute;
            left: 5px;
            top: 0;
            width: 5px;
            height: 12px;
            border: solid #121212;
            border-width: 0 2px 2px 0;
            transform: rotate(45deg);
        }

        .checkbox-container input[type="checkbox"]:focus ~ .custom-checkbox {
            outline: 2px solid #ffcc00;
        }

        .save-button {
            background-color: #ffcc00;
            border: none;
            padding: 10px 20px;
            font-size: 16px;
            border-radius: 5px;
            cursor: pointer;
            color: #121212;
            font-weight: bold;
        }

        .save-button:hover {
            background-color: #e6b800;
        }
        .fade-out {
            animation: fadeOut 0.5s ease-out forwards;
        }

        @keyframes fadeOut {
            from {
                opacity: 1;
            }
            to {
                opacity: 0;
                transform: translateY(-70%);
            }
        }

    `;
    document.head.appendChild(style);

    // Restrict the number of selected checkboxes to 2
    const checkboxes = modal.querySelectorAll('input[type="checkbox"]');
    checkboxes.forEach((checkbox) => {
        checkbox.addEventListener("change", () => {
            const checkedBoxes = modal.querySelectorAll(
                'input[type="checkbox"]:checked'
            );
            if (checkedBoxes.length > 2) {
                alert("You can only select up to 2 algorithms.");
                checkbox.checked = false;
            }
        });
    });

    // Save button functionality
    const saveButton = modal.querySelector("#saveButton");
    saveButton.addEventListener("click", () => {
        const checkedBoxes = Array.from(
            modal.querySelectorAll('input[type="checkbox"]:checked')
        );
        const selectedAlgorithms = checkedBoxes.map((checkbox) => checkbox.value);

        if (selectedAlgorithms.length === 2) {
            localStorage.setItem("selectedAlgorithms", JSON.stringify(selectedAlgorithms));
            console.log(`Saved: ${selectedAlgorithms.join(", ")}`);
            // Add an animation class to the modal
            const card = document.querySelector('.card');
            card.classList.add('fade-out');

            setTimeout(() => {
                document.body.removeChild(modal);
            }, 300); // Match this duration to the CSS animation timing

        } else {
            alert("Please select exactly 2 algorithms before saving.");
        }
    });

    // Close the modal when clicking outside the card
    modal.addEventListener("click", (event) => {
        if (event.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

export { showCardPopup };