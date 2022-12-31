const firebase = require('firebase')
require("firebase/firestore")
const { initializeApp } = require('firebase/app')
require('dotenv').config({ path: './config/.env' })

const firebaseConfig = {
    apiKey: process.env.FIRESTORE_KEY,
    authDomain: process.env.AUTH_DOMAIN,
    databaseURL: process.env.DB_URL,
    projectId: process.env.PROJECT_ID,
    storageBucket: process.env.STORAGE_BUCKET
  }

// Initialize Firebase
const app = initializeApp(firebaseConfig)
const db = app.firestore()

const initUser = async (url)=>{
    let avaibleDB = db.collection('user').doc('data')

    if(avaibleDB){
      await avaibleDB.delete()
    }
    
    await db.collection("user").doc("data").set({
      urlInst: url
  })
}

const fillUser = async (data)=>{
  let doc = db.collection('user').doc('data')

  await doc.update({
    ...data
  })
}

module.exports = {
  initUser,
  fillUser
}