const firstNames = [
  'John', 'Jane', 'Michael', 'Emily', 'David', 'Sarah', 'Robert', 'Lisa', 'William', 'Jennifer',
  'James', 'Mary', 'Richard', 'Patricia', 'Thomas', 'Linda', 'Charles', 'Barbara', 'Christopher', 'Elizabeth',
  'Daniel', 'Susan', 'Matthew', 'Jessica', 'Anthony', 'Karen', 'Mark', 'Nancy', 'Donald', 'Betty',
  'Steven', 'Helen', 'Paul', 'Sandra', 'Andrew', 'Donna', 'Joshua', 'Carol', 'Kenneth', 'Ruth',
  'Kevin', 'Sharon', 'Brian', 'Michelle', 'George', 'Laura', 'Edward', 'Sarah', 'Ronald', 'Kimberly'
];

const lastNames = [
  'Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Garcia', 'Miller', 'Davis', 'Rodriguez', 'Martinez',
  'Hernandez', 'Lopez', 'Gonzalez', 'Wilson', 'Anderson', 'Thomas', 'Taylor', 'Moore', 'Jackson', 'Martin',
  'Lee', 'Perez', 'Thompson', 'White', 'Harris', 'Sanchez', 'Clark', 'Ramirez', 'Lewis', 'Robinson',
  'Walker', 'Young', 'Allen', 'King', 'Wright', 'Scott', 'Torres', 'Nguyen', 'Hill', 'Flores',
  'Green', 'Adams', 'Nelson', 'Baker', 'Hall', 'Rivera', 'Campbell', 'Mitchell', 'Carter', 'Roberts'
];

const addedByNames = [
  'Kartikey Mishra', 'Rajesh Kumar', 'Priya Sharma', 'Amit Patel', 'Neha Gupta',
  'Vikram Singh', 'Anjali Verma', 'Rahul Joshi', 'Pooja Reddy', 'Sanjay Mehta'
];

function generateCustomer(id) {
  const firstName = firstNames[id % firstNames.length];
  const lastName = lastNames[Math.floor(id / firstNames.length) % lastNames.length];
  const name = `${firstName} ${lastName}`;

  const phone = `+91${String(7600000000 + (id % 1000000000)).padStart(10, '0')}`;

  const emailPrefix = name.toLowerCase().replace(' ', '.');
  const domain = ['gmail.com', 'yahoo.com', 'outlook.com', 'company.com'][id % 4];
  const email = `${emailPrefix}${id}@${domain}`;

  const score = Math.floor(Math.random() * 100);

  const lastMessageAt = new Date(2024, 6, 12, 12, 45);

  const addedBy = addedByNames[id % addedByNames.length];

  const avatarColor = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#FFA07A', '#98D8C8', '#F7B731', '#5F27CD', '#00D2D3'][id % 8];

  return {
    id,
    name,
    phone,
    email,
    score,
    lastMessageAt,
    addedBy,
    avatarColor,
    searchText: `${name} ${phone} ${email}`.toLowerCase()
  };
}

export function generateCustomers(count) {
  const customers = [];
  for (let i = 0; i < count; i++) {
    customers.push(generateCustomer(i + 1));
  }
  return customers;
}

export function searchCustomers(customers, searchTerm) {
  if (!searchTerm) return customers;
  const term = searchTerm.toLowerCase();
  return customers.filter(customer => customer.searchText.includes(term));
}

export function sortCustomers(customers, sortKey, sortDirection) {
  const sorted = [...customers];
  sorted.sort((a, b) => {
    let aVal = a[sortKey];
    let bVal = b[sortKey];

    if (sortKey === 'lastMessageAt') {
      aVal = new Date(aVal).getTime();
      bVal = new Date(bVal).getTime();
    }

    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase();
      bVal = bVal.toLowerCase();
    }

    if (aVal < bVal) return sortDirection === 'asc' ? -1 : 1;
    if (aVal > bVal) return sortDirection === 'asc' ? 1 : -1;
    return 0;
  });

  return sorted;
}
