document.addEventListener('DOMContentLoaded', function() {
    // Removed the initial call to loadAvailableSlots

    // Event listener for the reservation button
    document.getElementById('make-reservation').addEventListener('click', function() {
        const guestCount = document.getElementById('guestCount').value;
        const selectedDate = document.getElementById('reservationDate').value;
        const selectedSlot = document.querySelector('input[name="slot"]:checked').value;
        
        const selectedName = document.querySelector('#reservationName').value;

        makeReservation(selectedDate, selectedSlot, guestCount,selectedName );
    });

    // Event listener for the cancel reservation button
    const cancelBtn = document.querySelectorAll('.cancel-reservation');
    if (cancelBtn.length>0) {
        cancelBtn.forEach(function  (btn){
            // console.log(btn);
            btn.addEventListener('click', function(event) {
                const reservationId = event.target.getAttribute('data-id');
                cancelReservation(reservationId);
            });
        });

    }

    // Event listener for date selection
    document.getElementById('reservationDate').addEventListener('change', function() {
        loadAvailableSlots(this.value);
    });
});

// Dynamically load available time slots based on the selected date
function loadAvailableSlots(selectedDate) {
    fetch(`/api/reservations/available-slots?date=${selectedDate}`)
        .then(response => response.json())
        .then(slots => {
            const slotsContainer = document.getElementById('time-slots');
            slotsContainer.innerHTML = ''; // Clear previous slots
            slots.forEach(slot => {
                const slotElement = document.createElement('div');
                slotElement.className = 'time-slot';
                slotElement.innerHTML = `
                    <label class="${slot.isFull ? 'full' : ''}">
                        <input type="radio" name="slot" value="${slot.time}" ${slot.isFull ? 'disabled' : ''}>
                        ${slot.time} - ${slot.isFull ? 'Full' : 'Available'}
                    </label>
                `;
                slotsContainer.appendChild(slotElement);
            });
        })
        .catch(error => {
            console.error('Error fetching available slots:', error);
        });
}

// Function to make a reservation
function makeReservation(reservationDate, slotTime, guestCount, full_name) {
    fetch('/api/reservations/make', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ reservationDate, slotTime, guestCount, full_name })
    })
    .then(response => {
        if (response.ok) {
            return response.json();
        }
        throw new Error('Network response was not ok.');
    })
    .then(data => {
        // Handle success, possibly clear the form, and show a success message
        console.log(data, "reservation data!!!");
        alert('Reservation made successfully');
        document.location.reload();
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });
}

// Function to cancel a reservation
function cancelReservation(reservationId) {
    fetch(`/api/reservations/cancel/${reservationId}`, { method: 'DELETE' })
    .then(response => {
        if (response.ok) {
            // Update the page to reflect the reservation cancellation
            alert('Reservation cancelled successfully');
            document.location.reload();
        } else {
            throw new Error('Network response was not ok.');
        }
    })
    .catch(error => {
        console.error('There has been a problem with your fetch operation:', error);
    });
}
