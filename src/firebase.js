import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const app = initializeApp({
  databaseURL: 'https://monitoreoambiental-9daa2-default-rtdb.firebaseio.com/',
});

export const db = getDatabase(app);
