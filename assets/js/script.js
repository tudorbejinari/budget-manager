// ======================
// VARIABLES
// ======================

// 1st: pull initial budgetItems/lastID from localStorage to set initial variables
let budgetItems = JSON.parse(localStorage.getItem('budgetItems')) || [];
let lastID = parseInt(localStorage.getItem('lastId')) || 0;

// ======================
// FUNCTIONS
// ======================

// 4th: function to update localStorage with latest budgetItems and latest lastID

const updateStorage = () => {
  localStorage.setItem('budgetItems', JSON.stringify(budgetItems));
  localStorage.setItem('lastId', lastID);
};

// 5th: function to render budgetItems on table; each item should be rendered in this format:
// <tr data-id="2"><td>Oct 14, 2019 5:08 PM</td><td>November Rent</td><td>Rent/Mortgage</td><td>1300</td><td>Fill out lease renewal form!</td><td class="delete"><span>x</span></td></tr>
// also, update total amount spent on page (based on selected category):

const renderItems = items => {
  if (!items) items = budgetItems;
  const tbody = $('#budgetItems tbody');
  tbody.empty();
  for (const { id, date, name, category, amount, notes } of items) {
    const row = `<tr data-id=${id}><td>${date}</td><td>${name}</td><td>${category}</td><td>$${parseFloat(
      amount
    ).toFixed(
      2
    )}</td><td>${notes}</td><td class="delete"><span>x</span></td></tr>`;
    tbody.append(row);
  }
  const total = items.reduce(
    (accumulator, item) => accumulator + parseFloat(item.amount),
    0
  );
  $('#total').text(`$${total}`);
};

renderItems();
// ======================
// MAIN PROCESS
// ======================

// 2nd: wire up click event on 'Enter New Budget Item' button to toggle display of form

$('#toggleFormButton, #hideForm').on('click', function() {
  const addItemForm = $('#addItemForm');

  addItemForm.toggle('slow', () => {
    $('#toggleFormButton').text(
      addItemForm.is(':visible') ? 'Hide Form ' : 'Enter New Buget Item'
    );
  });
});

// 3rd: wire up click event on 'Add Budget Item' button, gather user input and add  to budgetItems array
// (each item's object should include: id / date / name / category / amount / notes)... then clear the form
// fields and trigger localStorage update/budgetItems rerender functions, once created

$('#addItem').on('click', function(event) {
  event.preventDefault();
  const newItem = {
    id: ++lastID,
    date: moment().format('lll'),
    name: $('#name')
      .val()
      .trim(),
    category: $('#category').val(),
    amount: $('#amount').val(),
    notes: $('#notes')
      .val()
      .trim()
    //increment and store the updated value in one step
  };
  if (!newItem.name || !newItem.category || !newItem.amount) {
    return alert(
      'you must specify name , category, and amount for each budget item!'
    );
  }
  budgetItems.push(newItem);
  updateStorage();
  renderItems();
  //update locaStorage
  //rerender our budget items
  $('#addItemForm form')[0].reset();
  $("#categoryFilter").val("")
});

// 6th: wire up change event on the category select menu, show filtered budgetItems based on selection
$('#categoryFilter').on('change', function() {
  const category = $(this).val();

  if (category) {
    const filteredItems = budgetItems.filter(
      item => category === item.category
    );
    renderItems(filteredItems);
  } else {
    renderItems();
  }
});

// 7th: wire up click event on the delete button of a given row; on click delete that budgetItem
$('#budgetItems').on('click', '.delete span', function() {
  const id = parseInt($(this)
    .parents('tr')
    .data('id'));
  const remainingItems = budgetItems.filter(item => item.id !== id);
  budgetItems = remainingItems;
  updateStorage();
  renderItems();
  $("#categoryFilter").val("")
});
