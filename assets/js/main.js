const menuButton = document.querySelector('.menu-button');
const navigation = document.querySelector('.site-nav');

if (menuButton && navigation) {
  menuButton.addEventListener('click', () => {
    const isOpen = menuButton.getAttribute('aria-expanded') === 'true';
    menuButton.setAttribute('aria-expanded', String(!isOpen));
    navigation.classList.toggle('is-open', !isOpen);
  });
}

const newDiaryEntry = document.querySelector('#new-diary-entry');
const newPhotoRecord = document.querySelector('#new-photo-record');

if (newDiaryEntry || newPhotoRecord) {
  const today = new Date().toISOString().slice(0, 10);
  const githubNewFileUrl = (folder, filename, value) => {
    const base = `https://github.com/Jiang6082/Jiang6082.github.io/new/main/${folder}`;
    return `${base}?filename=${encodeURIComponent(filename)}&value=${encodeURIComponent(value)}`;
  };

  if (newDiaryEntry) {
    const diaryTemplate = `---
title: Entry title
description: A short summary of this entry.
---

Write your entry here using Markdown.
`;
    newDiaryEntry.href = githubNewFileUrl('_posts', `${today}-entry-title.md`, diaryTemplate);
  }

  if (newPhotoRecord) {
    const photoTemplate = `---
title: Photo title
date_taken: ${today}
image: /assets/images/photos/your-image.jpg
alt: A short visual description of the photograph
camera:
lens:
focal_length:
aperture:
shutter_speed:
iso:
---

Add any notes or story behind the photograph here.
`;
    newPhotoRecord.href = githubNewFileUrl('_photos', 'photo-title.md', photoTemplate);
  }
}
