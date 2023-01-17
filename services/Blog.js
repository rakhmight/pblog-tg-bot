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

const initUser = async (data)=>{
  await db.collection('user')
  await db.collection("user").doc("data").set({
    ...data
  })

  return
}

const fillUser = async (data)=>{
  let doc = db.collection('user').doc('data')

  await doc.update({
    ...data
  })
}

const updateInst = async (data)=>{
  let doc = db.collection('user').doc('data')

  await doc.update({
    ...data
  })
}

const getUserNick = async () =>{
  let result
  await db.collection('user').doc('data')
  .get()
  .then((doc) => {
       result = doc.data()
  })
  .catch((error) => {
      console.log("Error getting documents: ", error)
  })
  
  return result.nick
}

module.exports = {
  initUser,
  fillUser,
  updateInst,
  getUserNick
}