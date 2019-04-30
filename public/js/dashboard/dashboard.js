var form = document.getElementById('addForm');
var itemList = document.getElementById('items');
var filter = document.getElementById('filter');

form.addEventListener('submit', addItem);

itemList.addEventListener('click', removeItem);

filter.addEventListener('keyup', filterItems);


function addItem(e) {
    e.preventDefault();

 
    var newItem = document.getElementById('item').value;

  
    var li = document.createElement('li');
   
    li.className = 'list-group-item';
    
    li.appendChild(document.createTextNode(newItem));

   
    var deleteBtn = document.createElement('button');

   
    deleteBtn.className = 'delete';

   
    deleteBtn.appendChild(document.createTextNode('X'));

   
    li.appendChild(deleteBtn);


    itemList.appendChild(li);
}


function removeItem(e) {
    if (e.target.classList.contains('delete')) {
        if (confirm('Na pewno chcesz usunąć?')) {
            var li = e.target.parentElement;
            itemList.removeChild(li);
        }
    }
}


function filterItems(e) {
   
    var text = e.target.value.toLowerCase();
   
    var items = itemList.getElementsByTagName('li');

    Array.from(items).forEach(function (item) {
        var itemName = item.firstChild.textContent;
        if (itemName.toLowerCase().indexOf(text) != -1) {
            item.style.display = 'block';
        } else {
            item.style.display = 'none';
        }
    });
}