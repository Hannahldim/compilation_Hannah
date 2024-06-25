let list = document.querySelectorAll('.list .item');

// Event listener for adding items to cart (using event delegation)
document.querySelector('.list').addEventListener('click', function(event) {
    if (event.target.classList.contains('add')) {
        let item = event.target.closest('.item');
        let itemNew = item.cloneNode(true);
        let checkIsset = false;

        // Check if item already exists in cart
        let listCart = document.querySelectorAll('.cart .item');
        listCart.forEach(cart => {
            if (cart.getAttribute('data-key') == itemNew.getAttribute('data-key')) {
                checkIsset = true;
                cart.classList.add('danger');
                setTimeout(() => cart.classList.remove('danger'), 1000);
            }
        });

        // Add item to cart if it doesn't exist
        if (!checkIsset) {
            document.querySelector('.listCart').appendChild(itemNew);
        }

        // Toggle visibility of add/remove buttons
        itemNew.querySelector('.add').style.display = 'none';
        itemNew.querySelector('.remove').style.display = 'inline-block';

        // Update receipt
        updateReceipt();
    }
});

document.querySelector('.cart').addEventListener('click', function(event) {
    if (event.target.classList.contains('remove')) {
        let item = event.target.closest('.item');
        item.remove();

        // Update receipt
        updateReceipt();
    }
});

document.getElementById('checkoutButton').addEventListener('click', function() {
    if (confirm('Are you sure you want to proceed to checkout?')) {
        // Clear cart and update receipt
        document.querySelector('.listCart').innerHTML = ''; // Clear cart
        updateReceipt(); // Update receipt

        // Show alert after checkout
        alert('Thank you for your purchase!');
    }
});

function updateReceipt() {
    let receiptItems = document.getElementById('receiptItems');
    let receiptTotal = document.getElementById('receiptTotal');
    let listCart = document.querySelectorAll('.cart .item');
    let total = 0;

    receiptItems.innerHTML = ''; // Clear previous receipt items

    listCart.forEach(item => {
        let title = item.querySelector('.title').textContent;
        let priceText = item.querySelector('.price').textContent;
        let count = parseInt(item.querySelector('.count').value);

        // Extract the price value from the formatted string "PXXX"
        let price = parseFloat(priceText.substring(1)); // Remove the 'P' and parse as float
        let itemTotal = price * count;

        // Check if price is a valid number
        if (!isNaN(price)) {
            total += itemTotal;
            receiptItems.innerHTML += `<div class="receipt-item">${title}: P${itemTotal.toFixed(2)}</div>`;
        } else {
            console.error(`Invalid price for item: ${title}`, priceText);
        }
    });

    receiptTotal.textContent = `Total: P${total.toFixed(2)}`;
}

// Initialize UI elements on page load
list.forEach(item => {
    let price = parseFloat(item.querySelector('.price').textContent.substring(1));
    item.querySelector('.price').textContent = `P${price.toFixed(2)}`;
});
