let list = document.querySelectorAll('.list .item');

// Event listener for adding items to cart (using event delegation)
document.querySelector('.list').addEventListener('click', function(event) {
    if (event.target.classList.contains('add')) {
        let item = event.target.closest('.item');
        let currentStock = parseInt(item.getAttribute('data-stock'));

        // Check if stock is available
        if (currentStock > 0) {
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
        } else {
            alert('This item is out of stock!');
        }
    }
});

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

document.querySelector('.cart').addEventListener('click', function(event) {
    if (event.target.classList.contains('remove')) {
        let item = event.target.closest('.item');
        item.remove();

        // Update receipt
        updateReceipt();
    }
});


document.getElementById('checkoutButton').addEventListener('click', function() {
    // Update the stock and clear cart
    let listCart = document.querySelectorAll('.cart .item');
    let stockError = false;

    listCart.forEach(item => {
        let key = parseInt(item.getAttribute('data-key'));
        let count = parseInt(item.querySelector('.count').value);

        // Decrease stock for the checked out items
        let itemToUpdate = document.querySelector(`.list .item[data-key="${key}"]`);
        let currentStock = parseInt(itemToUpdate.getAttribute('data-stock'));
        let newStock = currentStock - count;

        // Check for negative stock
        if (newStock < 0) {
            stockError = true;
        } else {
            // Update data-stock attribute
            itemToUpdate.setAttribute('data-stock', newStock);

            // Update UI stock display
            itemToUpdate.querySelector('.stock').textContent = `Stock: ${newStock}`;
        }
    });

    if (stockError) {
        alert('Not enough stock for one or more items!');
    } else {
        // Clear cart and update receipt
        document.querySelector('.listCart').innerHTML = ''; // Clear cart
        updateReceipt(); // Update receipt
    }
});

// Event listener for discount type change
document.getElementById('discountType').addEventListener('change', updateReceipt);

// Event listener for updating stock
document.querySelector('.list').addEventListener('click', function(event) {
    if (event.target.classList.contains('update-stock')) {
        let item = event.target.closest('.item');
        let stockElement = item.querySelector('.stock'); // Get the stock display element
        let currentStock = parseInt(item.getAttribute('data-stock')); // Get current stock as integer

        // Prompt user for new stock value
        let newStockValue = prompt(`Enter new stock for ${item.querySelector('.title').textContent}:`, currentStock);

        if (newStockValue !== null && !isNaN(newStockValue)) {
            let newStock = parseInt(newStockValue);
            item.setAttribute('data-stock', newStock);
            stockElement.textContent = `Stock: ${newStock}`;
        } else {
            alert("Invalid stock value entered.");
        }
    }
});

// Event listener for discount type change
document.getElementById('discountType').addEventListener('change', updateReceipt);
function updateReceipt() {
    let receiptItems = document.getElementById('receiptItems');
    let receiptTotal = document.getElementById('receiptTotal');
    let receiptDiscount = document.getElementById('receiptDiscount');
    let receiptFinalTotal = document.getElementById('receiptFinalTotal');
    let listCart = document.querySelectorAll('.cart .item');
    let total = 0;

    receiptItems.innerHTML = ''; // Clear previous receipt items

    // Calculate discount based on selected discount type
    let discountType = document.getElementById('discountType').value;
    let discountPercent = 0;
    if (discountType === 'senior') {
        discountPercent = 0.20; // 20% discount
    } else if (discountType === 'pwd') {
        discountPercent = 0.30; // 30% discount
    } else if (discountType === 'student') {
        discountPercent = 0.10; // 10% discount
    }

    listCart.forEach(item => {
        let title = item.querySelector('.title').textContent;
        let priceText = item.querySelector('.price').textContent;
        let count = parseInt(item.querySelector('.count').value);

        // Extract the price value from the formatted string "PXXX"
        let price = parseFloat(priceText.substring(1)); // Remove the 'P' and parse as float
        let discountedPrice = price - (price * discountPercent); // Apply discount
        let itemTotal = discountedPrice * count;

        // Check if price is a valid number
        if (!isNaN(price)) {
            total += itemTotal;
            receiptItems.innerHTML += `<div class="receipt-item">${title}: P${itemTotal.toFixed(2)}</div>`;
        } else {
            console.error(`Invalid price for item: ${title}`, priceText);
        }
    });

    let discount = total * discountPercent;
    let finalTotal = total;

    receiptTotal.textContent = `Total before discount: P${(total / (1 - discountPercent)).toFixed(2)}`;
    receiptDiscount.textContent = `Discount: -P${discount.toFixed(2)}`;
    receiptFinalTotal.textContent = `Final Total: P${finalTotal.toFixed(2)}`;
}

    // Calculate discount based on selected discount type
    let discountType = document.getElementById('discountType').value;
    let discount = 0;
    if (discountType === 'senior') {
        discount = total * 0.20; // 20% discount
    } else if (discountType === 'pwd') {
        discount = total * 0.30; // 30% discount
    } else if (discountType === 'student') {
        discount = total * 0.10; // 10% discount
    }

    let finalTotal = total - discount;

    receiptTotal.textContent = `Total: P${total.toFixed(2)}`;
    receiptDiscount.textContent = `Discount: -P${discount.toFixed(2)}`;
    receiptFinalTotal.textContent = `Final Total: P${finalTotal.toFixed(2)}`;


// Initialize stock display on page load
list.forEach(item => {
    let stock = parseInt(item.getAttribute('data-stock'));
    item.querySelector('.stock').textContent = `Stock: ${stock}`;
});

// Event listener for updating stock
document.getElementById('checkoutButton').addEventListener('click', function() {
    // Loop through items in the cart
    let listCart = document.querySelectorAll('.cart .item');
    listCart.forEach(item => {
        let stockElement = item.querySelector('.stock'); // Get the stock display element
        let currentStock = parseInt(item.getAttribute('data-stock')); // Get current stock as integer

        // Decrease the stock count
        currentStock--;

        // Update data-stock attribute
        item.setAttribute('data-stock', currentStock);

        // Update stock display in UI
        stockElement.textContent = `Stock: ${currentStock}`;

        // Alert if stock reaches 0
        if (currentStock === 0) {
            alert(`${item.querySelector('.title').textContent} is out of stock!`);
            item.querySelector('.add').disabled = true; // Disable 'Add to Cart' button if needed
        }
    });

    // Clear cart after checkout
    document.querySelector('.listCart').innerHTML = '';

    // Update receipt
    updateReceipt();
});
