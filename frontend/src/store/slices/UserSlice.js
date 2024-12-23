import { createSlice } from '@reduxjs/toolkit'


const initialState = {
  userData:{
    userId: "",
    username: "",
    email: "",
    gallery: {
      images: [],
    },
    storage: {
      totalStorage: 10000,
      UsedStorage: 0,
      FreeStorage: 10000,
    },
    usage: {
      bandwidthTotalUsage: 0,
      bandwidthDailyUsage: 0,
      dailyLimit: 25000,
    },
  }
}

export const UserSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setUserData:(state,action)=>{
      state.userData=action.payload.data
    },
    setImagesData: (state, action) => {
      const { gallery} = action.payload.data;
    
      state.userData.gallery = {
        ...state.userData.gallery,
        images: [...gallery.images]
      };
    
      state.userData.storage = {
        ...state.userData.storage,
        UsedStorage: 10000 - gallery.freeStorage,
        FreeStorage: gallery.freeStorage,
      };
    
      state.userData.usage = {
        ...state.userData.usage,
        bandwidthDailyUsage: 25000 - gallery.freeBandwidth,
      };
    }
  },
     
    
})

export const { setUserData,setImagesData } = UserSlice.actions

export default UserSlice.reducer