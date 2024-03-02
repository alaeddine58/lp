$("#formInfo").submit(function (event) {
  // Show loading icon and disable the button
  $("#save_guest_order").prop("disabled", true);
  $("#span_loading").show();

  // Prevent the default form submission
  event.preventDefault();

  // Get the updated data from the form
  var fullname = $('#formInfo input[name="fullname"]').val();
  var phone = $('#formInfo input[name="phone"]').val();
  var adresse = $('#formInfo input[name="adresse"]').val();
  var variant = $('#formInfo select[name="tier_variante"]').val();
  var product_color = $('#formInfo select[name="product_color"]').val();
  var price = $('#formInfo input[name="price_tiers"]').val();
  var product_size = $('#formInfo select[name="product_size"]').val();

  // Create URL-encoded form data
  var formData = new URLSearchParams();
  formData.append('name', 'bag');
  formData.append('date', new Date().toString());
  formData.append('customer_name', fullname);
  formData.append('phone', phone);
  formData.append('city', '-');
  formData.append('address', adresse);
  formData.append('quantity', variant);
  formData.append('price', price);
  formData.append('product_notice', '');
  formData.append('notice', product_color);
  formData.append('status', 'pending');
  formData.append('fees_shipping', '');
  formData.append('size', product_size);

  // Configure fetch request
  fetch("https://script.google.com/macros/s/AKfycbzZeI7ZmglXRU_fdKdCZL0hHKrzMyMem3nvfQtVAx1neAN4kpBmGinpWM7Mwot_LINgXA/exec", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: formData
  })
    .then(function (response) {
      // Handle response
      if (response.ok) {
        // Handle successful response
        console.log("Order added to SheetDB successfully");
        // Redirect or perform other actions
      } else {
        // Handle error response
        console.log("Failed to add order to SheetDB");
      }
    })
    .catch(function (error) {
      // Handle fetch error
      console.log("Error:", error);
    })
    .finally(function() {
      // Re-enable the button and hide loading icon
      $("#save_guest_order").prop("disabled", false);
      $("#span_loading").hide();
    });
});
