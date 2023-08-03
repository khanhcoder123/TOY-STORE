function confirmDelete(event) {
    const confirmation = confirm('Are you sure you want to delete this product?');
    if (!confirmation) {
        event.preventDefault();
    }
}
