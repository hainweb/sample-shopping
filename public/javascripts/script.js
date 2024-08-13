  
   function addToCart(proId) {
    $.ajax({
        url: '/add-to-cart/' + proId,
        method: 'get',
        success: (response) => {
            if (response.status) {
                let count = $('#cartCount').html();
                count = parseInt(count) + 1;
                $('#cartCount').html(count);
            } else {
                console.error('Failed to add to cart: ', response);
            }
        },

        error: (xhr, status, error) => {
            console.error('AJAX request failed: ', status, error);
        }
    });
}
