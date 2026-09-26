// 1. Select all sentences and boxes
const cards = document.querySelectorAll('.sentence-card');
const boxes = document.querySelectorAll('.drop-box');
const pool = document.getElementById('pool');

let draggedCard = null;
let touchDrag = null;

// 2. Add Drag Events to Cards
cards.forEach(card => {
    card.addEventListener('dragstart', () => {
        draggedCard = card; // Track the element being dragged
    });

    card.addEventListener('dragend', () => {
        draggedCard = null; // Clear tracking when dropped
    });

    card.addEventListener('pointerdown', (event) => {
        if (event.pointerType !== 'touch' || touchDrag) return;

        const rect = card.getBoundingClientRect();
        const placeholder = card.cloneNode(false);
        placeholder.removeAttribute('id');
        placeholder.setAttribute('aria-hidden', 'true');
        placeholder.draggable = false;
        placeholder.style.visibility = 'hidden';
        placeholder.style.pointerEvents = 'none';
        card.before(placeholder);

        touchDrag = {
            card,
            placeholder,
            offsetX: event.clientX - rect.left,
            offsetY: event.clientY - rect.top
        };

        card.classList.add('touch-dragging');
        card.style.position = 'fixed';
        card.style.left = `${rect.left}px`;
        card.style.top = `${rect.top}px`;
        card.style.width = `${rect.width}px`;
        card.style.zIndex = '10';
        card.style.pointerEvents = 'none';
    });
});

document.addEventListener('pointermove', (event) => {
    if (!touchDrag) return;

    const { card, offsetX, offsetY } = touchDrag;
    card.style.left = `${event.clientX - offsetX}px`;
    card.style.top = `${event.clientY - offsetY}px`;

    boxes.forEach(box => box.classList.remove('hovered'));
    const targetBox = document.elementFromPoint(event.clientX, event.clientY)?.closest('.drop-box');
    targetBox?.classList.add('hovered');
});

function finishTouchDrag(event) {
    if (!touchDrag) return;

    const { card, placeholder } = touchDrag;
    const targetBox = document.elementFromPoint(event.clientX, event.clientY)?.closest('.drop-box');
    boxes.forEach(box => box.classList.remove('hovered'));

    card.classList.remove('touch-dragging');
    card.style.position = '';
    card.style.left = '';
    card.style.top = '';
    card.style.width = '';
    card.style.zIndex = '';
    card.style.pointerEvents = '';

    if (targetBox) {
        targetBox.appendChild(card);
        placeholder.remove();
        checkAnswer(card, targetBox.id);
    } else {
        placeholder.replaceWith(card);
    }

    touchDrag = null;
}

document.addEventListener('pointerup', finishTouchDrag);
document.addEventListener('pointercancel', finishTouchDrag);

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
