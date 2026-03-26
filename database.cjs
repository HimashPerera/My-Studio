const knex = require('knex')({
  client: 'sqlite3',
  connection: {
    filename: "./inventory.sqlite" // දත්ත සුරැකෙන file එකේ නම
  },
  useNullAsDefault: true
});

// Table එකක් නොමැති නම් අලුතින් සෑදීම
knex.schema.hasTable('items').then((exists) => {
  if (!exists) {
    return knex.schema.createTable('items', (table) => {
      table.increments('id').primary();
      table.string('name');
      table.decimal('cost_price');
      table.decimal('sell_price');
      table.integer('stock');
      table.timestamps(true, true);
    });
  }
});

module.exports = knex;