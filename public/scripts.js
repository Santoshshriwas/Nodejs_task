app.get('/users', (req, res) => {
  const query = 'SELECT * FROM user'; // Replace with your actual query
  connection.query(query, (err, results) => {
      if (err) {
          console.error('Error fetching users:', err);
          return res.status(500).send('Database error');
      }
      res.render('home', { 
          title: 'User List',
          header: 'Users',
          users: results 
      });
  });
});

app.get('/tasks', (req, res) => {
  const query = 'SELECT * FROM tasks'; // Replace with your actual query
  connection.query(query, (err, results) => {
      if (err) {
          console.error('Error fetching tasks:', err);
          return res.status(500).send('Database error');
      }
      res.render('tasks', { 
          title: 'Task List',
          header: 'Tasks',
          tasks: results 
      });
  });
});
// Example script
document.addEventListener('DOMContentLoaded', () => {
  console.log('Page loaded');
});
