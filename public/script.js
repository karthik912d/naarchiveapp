fetch('/entries')
  .then(res => res.json())
  .then(data => {
    const list = document.getElementById('journalList');
    data.reverse().forEach(entry => {
      const div = document.createElement('div');
      div.innerHTML = `<h3>${entry.title}</h3><p>${entry.content}</p><hr>`;
      list.appendChild(div);
    });
  });
