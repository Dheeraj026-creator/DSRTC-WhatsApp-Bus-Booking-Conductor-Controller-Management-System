async function startPayment(totalBill, busNumber, destination, passengers) {
    const res = await fetch('/create-order', { method: 'POST' });
    const order = await res.json();
  
    const options = {
      key: "rzp_test_XXXXXX", // your Razorpay test key
      amount: order.amount,
      currency: "INR",
      name: "DSRTC Ticket",
      description: `Bus: ${busNumber}, ${destination}`,
      order_id: order.id,
      handler: async function (response) {
        // Payment success → tell backend
        await fetch('/payment-success', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            paymentId: response.razorpay_payment_id,
            orderId: response.razorpay_order_id,
            destination,
            busNumber,
            passengers,
            totalBill
          })
        });
      },
      theme: { color: "#3399cc" },
    };
  
    const rzp = new Razorpay(options);
    rzp.open();
  }
  