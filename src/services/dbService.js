const DB_NAME = 'zyra_chat_db';
const DB_VERSION = 1;
const STORE_NAME = 'chat_history';

const openDB = () => {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onerror = () => reject(request.error);
    
    request.onsuccess = () => resolve(request.result);
    
    request.onupgradeneeded = (event) => {
      const db = event.target.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { 
          keyPath: 'id',
          autoIncrement: true 
        });
      }
    };
  });
};

export const saveChat = async (messages) => {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);

    const chat = {
      messages,
      timestamp: new Date().toISOString(),
    };

    await store.add(chat);
    return true;
  } catch (error) {
    console.error('Error saving chat:', error);
    return false;
  }
};

export const loadChats = async () => {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    
    return new Promise((resolve, reject) => {
      const request = store.getAll();
      
      request.onsuccess = () => {
        resolve(request.result.sort((a, b) => 
          new Date(b.timestamp) - new Date(a.timestamp)
        ));
      };
      
      request.onerror = () => reject(request.error);
    });
  } catch (error) {
    console.error('Error loading chats:', error);
    return [];
  }
};

export const deleteChat = async (id) => {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    
    await store.delete(id);
    return true;
  } catch (error) {
    console.error('Error deleting chat:', error);
    return false;
  }
};

export const clearAllChats = async () => {
  try {
    const db = await openDB();
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    
    await store.clear();
    return true;
  } catch (error) {
    console.error('Error clearing chats:', error);
    return false;
  }
}; 