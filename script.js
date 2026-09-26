// 1. Select all sentences and boxes
const cards = document.querySelectorAll('.sentence-card');
const boxes = document.querySelectorAll('.drop-box');
const pool = document.getElementById('pool');

let draggedCard = null;

// 2. Add Drag Events to Cards
cards.forEach(card => {
    card.addEventListener('dragstart', () => {
        draggedCard = card; // Track the element being dragged
    });

    card.addEventListener('dragend', () => {
        draggedCard = null; // Clear tracking when dropped
    });
});

// 3. Add Drag Events to Target Boxes
boxes.forEach(box => {
    // Necessary to allow a drop event to happen
    box.addEventListener('dragover', (e) => {
        e.preventDefault();
    });

    box.addEventListener('dragenter', () => {
        box.classList.add('hovered');
    });

    box.addEventListener('dragleave', () => {
        box.classList.remove('hovered');
    });

    box.addEventListener('drop', () => {
        box.classList.remove('hovered');
        if (draggedCard) {
            // Append the dragged card into the target box element
            box.appendChild(draggedCard);
            checkAnswer(draggedCard, box.id);
        }
    });
});
document.getElementById('reset-btn').addEventListener('click', () => {
    cards.forEach(card => {
        pool.appendChild(card);
        card.style.borderColor = '';
        card.style.backgroundColor = '';
    });
});

// 4. Simple Verification System
function checkAnswer(card, targetBoxId) {
    const correctBox = card.getAttribute('data-correct');
    
    if (targetBoxId === correctBox) {
        card.style.borderColor = '#16a34a'; // Green boundary for correct
        card.style.backgroundColor = '#dcfce7';
    } else {
        card.style.borderColor = '#dc2626'; // Red boundary for incorrect
        card.style.backgroundColor = '#fee2e2';
    }
}
