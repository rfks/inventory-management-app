'use client'

import { useState, useEffect } from "react"
import { Box, Stack, Typography, Button, Modal, TextField } from "@mui/material"
import { firestore} from "@/firebase"
import {
  collection,
  doc,
  getDocs,
  query,
  setDoc,
  deleteDoc,
  getDoc,
} from "firebase/firestore"

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: 'white',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
  display: 'flex',
  flexDirection: 'column',
  gap: 3,
}

export default function Home() {
  const [inventory, setInventory] = useState([])
  const [open, setOpen] = useState(false)
  const [itemName, setItemName] = useState('')
  const [search, setSearch] = useState('')
  const [openEdit, setOpenEdit] = useState(false)
  const [prevItem,setPrevItem] = useState('')
  const [count,setCount] = useState(0)

  const updateInventory = async () => {
    const snapshot = query(collection(firestore, 'inventory'))
    const docs = await getDocs(snapshot)
    const inventoryList = []
    docs.forEach((doc) => {
      inventoryList.push({ name: doc.id, ...doc.data()})
    })
    setInventory(inventoryList)
  }

  useEffect(() => {
    updateInventory()
  }, [])

  const addItem = async (item,count) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      await setDoc(docRef, {quantity: quantity + count })
    } else {
      await setDoc(docRef, { quantity: count })
    }
    await updateInventory()
  }

  const removeItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
      const { quantity } = docSnap.data()
      if (quantity === 1) {
        await deleteDoc(docRef)
      } else {
        await setDoc(docRef, { quantity: quantity - 1 })
      }
    }
    await updateInventory()
  }

  const removeAllItem = async (item) => {
    const docRef = doc(collection(firestore, 'inventory'), item)
    const docSnap = await getDoc(docRef)
    if (docSnap.exists()) {
        await deleteDoc(docRef)
      }
    await updateInventory()
  }

  const updateItem = (item,count) => {
    setItemName(item)
    setPrevItem(item)
    setCount(count)
    handleOpenEdit()
  }

  const saveItem = () => {
    if (prevItem != itemName){
      addItem(itemName,count)
      removeAllItem(prevItem)
    }
  }

  const filteredInventory = inventory.filter((item) => item.name.toLowerCase().includes(search.toLowerCase()))

  const handleOpen = () => setOpen(true)
  const handleClose = () => setOpen(false)
  const handleOpenEdit = () => setOpenEdit(true)
  const handleCloseEdit = () => setOpenEdit(false)

  return (
    <Box
      width="100vw"
      height="100vh"
      display={'flex'}
      justifyContent={'center'}
      flexDirection={'column'}
      alignItems={'center'}
      gap={2}
    >
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Add Item
          </Typography>
          <Stack width="100%" direction={'row'} spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="outlined"
              onClick={() => {
                addItem(itemName,1)
                setItemName('')
                handleClose()
              }}
            >
              Add
            </Button>
          </Stack>
        </Box>
      </Modal>
       {/* ***********************Modal for edit**************************** */}
      <Modal
        open={openEdit}
        onClose={handleCloseEdit}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Edit Item
          </Typography>
          <Stack width="100%" direction={'row'} spacing={2}>
            <TextField
              id="outlined-basic"
              label="Item"
              variant="outlined"
              fullWidth
              value={itemName}
              onChange={(e) => setItemName(e.target.value)}
            />
            <Button
              variant="outlined"
              onClick={() => {
                saveItem(itemName)
                setItemName('')
                handleCloseEdit()
              }}
            >
              Save
            </Button>
          </Stack>
        </Box>
      </Modal>
      <Stack alignContent={'center'}  direction={'row'} spacing={2}>
        <Button variant="contained" onClick={handleOpen}>
          Add New
        </Button>
        <TextField
          placeholder="Search..."
          value={search}
          fullWidth
          onChange={(e) => setSearch(e.target.value)}
        />
      </Stack>
      <Box border={'1px solid #333'}>
        <Box
          width="800px"
          height="100px"
          bgcolor={'#ADD8E6'}
          display={'flex'}
          justifyContent={'center'}
          alignItems={'center'}
        >
          <Typography variant={'h2'} color={'#333'} textAlign={'center'}>
            Inventory
          </Typography>
        </Box>
        <Stack width="800px" height="300px" spacing={1} overflow={'auto'}>
          {filteredInventory.map(({name, quantity}) => (
            <Box
              key={name}
              width="100%"
              minHeight="80px"
              display={'flex'}
              justifyContent={'space-between'}
              alignItems={'center'}
              bgcolor={'#f0f0f0'}
              paddingX={1}
            >
                <Typography onClick={() => updateItem(name,quantity)} variant={'h3'} color={'#333'} textAlign={'center'} justifyContent={'center'}>
                  {name}
                </Typography>

              <Stack direction='row' spacing={2} alignItems={'center'}>

                <Button variant="contained" color="error" onClick={() => removeItem(name)}>
                  <Typography variant={'h3'}>-</Typography>
                </Button>
                <Typography variant={'h3'} color={'#333'} textAlign={'center'} justifyContent={'center'}>
                  {quantity}
                </Typography>
                <Button variant="contained" color="success" onClick={() => addItem(name,1)}>
                  <Typography variant={'h3'}>+</Typography>
                </Button>
              </Stack>
            </Box>
          ))}
        </Stack>
      </Box>
    </Box>
  )
}